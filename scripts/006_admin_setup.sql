-- Admin setup and policies
-- Ensure admin role exists (it does in public.users, but good to have)

-- Function to check if a user is an admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Admin-only Storage Bucket
-- Create the bucket
insert into storage.buckets (id, name, public) 
values ('admin-assets', 'admin-assets', false)
on conflict (id) do nothing;

-- Bucket Policies
create policy "Admin can do everything with admin-assets"
on storage.objects for all
using (
  bucket_id = 'admin-assets' and public.is_admin()
)
with check (
  bucket_id = 'admin-assets' and public.is_admin()
);

-- RLS Policies for Admin to manage all tables
-- We add 'OR public.is_admin()' to existing policies or create new ones.

-- Users table admin access
create policy "Admins can manage all users"
on public.users for all
using (public.is_admin());

-- Profiles table admin access
create policy "Admins can manage all profiles"
on public.profiles for all
using (public.is_admin());

-- Companies table admin access
create policy "Admins can manage all companies"
on public.companies for all
using (public.is_admin());

-- Jobs table admin access
create policy "Admins can manage all jobs"
on public.jobs for all
using (public.is_admin());

-- Applications table admin access
create policy "Admins can manage all applications"
on public.applications for all
using (public.is_admin());

-- Notifications table admin access
create policy "Admins can manage all notifications"
on public.notifications for all
using (public.is_admin());

-- Example of how to set a user as admin:
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';
