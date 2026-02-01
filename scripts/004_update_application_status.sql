-- Drop the existing check constraint
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;

-- Add the new check constraint including 'hired'
ALTER TABLE public.applications ADD CONSTRAINT applications_status_check 
  CHECK (status IN ('applied', 'viewed', 'shortlisted', 'rejected', 'hired'));
