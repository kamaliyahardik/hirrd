-- Drop the existing policy
DROP POLICY IF EXISTS "Users can send messages if application is shortlisted" ON public.messages;

-- Create the updated policy including 'hired' status
CREATE POLICY "Users can send messages if application is shortlisted or hired" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = application_id
      AND status IN ('shortlisted', 'hired')
      AND (
        (applicant_id = sender_id AND job_id IN (SELECT id FROM public.jobs WHERE recruiter_id = receiver_id))
        OR
        (applicant_id = receiver_id AND job_id IN (SELECT id FROM public.jobs WHERE recruiter_id = sender_id))
      )
    )
  );
