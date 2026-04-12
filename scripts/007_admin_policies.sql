-- Admin-specific policies for Hirrd Admin Panel

-- 1. Users table policies for Admin
create policy "Admins can view all users" on public.users 
  for select using (auth.jwt() ->> 'role' = 'admin' or exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can update any user" on public.users 
  for update using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can delete any user" on public.users 
  for delete using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 2. Jobs table policies for Admin
create policy "Admins can view all jobs" on public.jobs 
  for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can update any job" on public.jobs 
  for update using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can delete any job" on public.jobs 
  for delete using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 3. Applications table policies for Admin
create policy "Admins can view all applications" on public.applications 
  for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can delete any application" on public.applications 
  for delete using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 4. Storage Bucket Policies for Admin (assuming buckets named 'resumes' and 'logos')
-- These usually need to be run in the storage schema or via Supabase Dashboard, 
-- but here is the logic for SQL:

-- Allow admins to manage all objects in 'resumes' bucket
create policy "Admins can manage resumes" on storage.objects 
  for all using (bucket_id = 'resumes' and exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Allow admins to manage all objects in 'logos' bucket
create policy "Admins can manage logos" on storage.objects 
  for all using (bucket_id = 'logos' and exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 5. Helper function to check if user is admin (optional but useful)
create or replace function public.is_admin() 
returns boolean as $$
begin
  return exists (
    select 1 from public.users 
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;
