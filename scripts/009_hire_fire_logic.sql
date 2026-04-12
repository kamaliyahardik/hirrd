-- 1. Update applications status constraint to include 'fired'
ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_status_check;

ALTER TABLE public.applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('applied', 'viewed', 'shortlisted', 'rejected', 'hired', 'fired'));

-- 2. Optional: Trigger to prevent changing status away from 'hired' to anything other than 'fired'
CREATE OR REPLACE FUNCTION public.check_hired_status_transition() 
RETURNS TRIGGER AS $$
BEGIN
    -- If old status was 'hired', only allow transition to 'fired'
    IF OLD.status = 'hired' AND NEW.status != 'fired' AND NEW.status != 'hired' THEN
        RAISE EXCEPTION 'Cannot change status from Hired to anything other than Fired';
    END IF;
    
    -- If old status was 'fired', don't allow any changes (optional, but logical)
    IF OLD.status = 'fired' AND NEW.status != 'fired' THEN
        RAISE EXCEPTION 'User has already been fired and cannot be rehired through the same application';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger for status transition check
DROP TRIGGER IF EXISTS tr_check_hired_status_transition ON public.applications;
CREATE TRIGGER tr_check_hired_status_transition
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.check_hired_status_transition();
