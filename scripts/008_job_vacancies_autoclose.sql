-- 1. Add vacancies column to jobs table
ALTER TABLE public.jobs 
ADD COLUMN vacancies INTEGER DEFAULT 1;

-- 2. Update applications status constraint to include 'hired'
ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_status_check;

ALTER TABLE public.applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('applied', 'viewed', 'shortlisted', 'rejected', 'hired'));

-- 3. Function to automatically close job when vacancies are filled
CREATE OR REPLACE FUNCTION public.auto_close_job_on_hired() 
RETURNS TRIGGER AS $$
DECLARE
    v_vacancies INTEGER;
    v_hired_count INTEGER;
BEGIN
    -- Only proceed if status is being changed to 'hired'
    IF (TG_OP = 'UPDATE' AND NEW.status = 'hired' AND (OLD.status IS NULL OR OLD.status != 'hired')) OR (TG_OP = 'INSERT' AND NEW.status = 'hired') THEN
        
        -- Get total vacancies for the job
        SELECT vacancies INTO v_vacancies FROM public.jobs WHERE id = NEW.job_id;
        
        -- Count current hired applications for this job
        SELECT COUNT(*) INTO v_hired_count FROM public.applications 
        WHERE job_id = NEW.job_id AND status = 'hired';
        
        -- If hired count reaches or exceeds vacancies, close the job
        IF v_hired_count >= v_vacancies THEN
            UPDATE public.jobs SET status = 'closed' WHERE id = NEW.job_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger for the auto-close function
DROP TRIGGER IF EXISTS tr_auto_close_job_on_hired ON public.applications;
CREATE TRIGGER tr_auto_close_job_on_hired
AFTER INSERT OR UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.auto_close_job_on_hired();
