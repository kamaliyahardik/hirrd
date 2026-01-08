
-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.messages enable row level security;

-- RLS Policies for messages table
create policy "Users can view their own messages" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages if application is shortlisted" on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.applications
      where id = application_id
      and status = 'shortlisted'
      and (
        (applicant_id = sender_id and job_id in (select id from public.jobs where recruiter_id = receiver_id))
        or
        (applicant_id = receiver_id and job_id in (select id from public.jobs where recruiter_id = sender_id))
      )
    )
  );

create policy "Users can update their own messages (mark as read)" on public.messages
  for update using (auth.uid() = receiver_id);

-- Create bucket for resumes if not exists
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

-- Storage policies for resumes
create policy "Resume files are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'resumes' );

create policy "Users can upload their own resume"
  on storage.objects for insert
  with check ( bucket_id = 'resumes' and auth.uid() = owner );

create policy "Users can update their own resume"
  on storage.objects for update
  with check ( bucket_id = 'resumes' and auth.uid() = owner );

create policy "Users can delete their own resume"
  on storage.objects for delete
  using ( bucket_id = 'resumes' and auth.uid() = owner );
