-- Create users table (references auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('job_seeker', 'recruiter', 'admin')) default 'job_seeker',
  full_name text,
  avatar_url text,
  bio text,
  location text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create profiles table for job seekers
create table if not exists public.profiles (
  id uuid primary key references public.users(id) on delete cascade,
  skills text[] default '{}',
  experience_years integer default 0,
  education text,
  resume_url text,
  headline text,
  is_open_to_work boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create companies table for recruiters
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text,
  logo_url text,
  website text,
  industry text,
  size text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create jobs table
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  recruiter_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  location text not null,
  job_type text not null check (job_type in ('Full-time', 'Part-time', 'Contract', 'Internship')),
  salary_min integer,
  salary_max integer,
  currency text default 'INR',
  skills_required text[] default '{}',
  status text not null check (status in ('open', 'closed', 'draft')) default 'draft',
  featured boolean default false,
  views_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  expires_at timestamp with time zone
);

-- Create applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  applicant_id uuid not null references public.users(id) on delete cascade,
  status text not null check (status in ('applied', 'viewed', 'shortlisted', 'rejected')) default 'applied',
  resume_url text,
  cover_letter text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(job_id, applicant_id)
);

-- Create saved_jobs table (bookmarks)
create table if not exists public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, job_id)
);

-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('application_status', 'new_job', 'message', 'recruiter_message')),
  title text not null,
  message text not null,
  related_id uuid,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.notifications enable row level security;

-- RLS Policies for users table
create policy "Users can view all users" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- RLS Policies for profiles table
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- RLS Policies for companies table
create policy "Companies are viewable by everyone" on public.companies for select using (true);
create policy "Recruiters can insert own company" on public.companies for insert with check (auth.uid() = recruiter_id);
create policy "Recruiters can update own company" on public.companies for update using (auth.uid() = recruiter_id);
create policy "Recruiters can delete own company" on public.companies for delete using (auth.uid() = recruiter_id);

-- RLS Policies for jobs table
create policy "Open jobs are viewable by everyone" on public.jobs for select using (status = 'open' or auth.uid() = recruiter_id);
create policy "Recruiters can insert jobs" on public.jobs for insert with check (auth.uid() = recruiter_id);
create policy "Recruiters can update own jobs" on public.jobs for update using (auth.uid() = recruiter_id);
create policy "Recruiters can delete own jobs" on public.jobs for delete using (auth.uid() = recruiter_id);

-- RLS Policies for applications table
create policy "Users can view own applications" on public.applications for select using (auth.uid() = applicant_id or auth.uid() in (select recruiter_id from public.jobs where jobs.id = applications.job_id));
create policy "Job seekers can apply to jobs" on public.applications for insert with check (auth.uid() = applicant_id);
create policy "Users can update own application status" on public.applications for update using (auth.uid() = applicant_id or auth.uid() in (select recruiter_id from public.jobs where jobs.id = applications.job_id));

-- RLS Policies for saved_jobs table
create policy "Users can view own saved jobs" on public.saved_jobs for select using (auth.uid() = user_id);
create policy "Users can save jobs" on public.saved_jobs for insert with check (auth.uid() = user_id);
create policy "Users can delete own saved jobs" on public.saved_jobs for delete using (auth.uid() = user_id);

-- RLS Policies for notifications table
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
