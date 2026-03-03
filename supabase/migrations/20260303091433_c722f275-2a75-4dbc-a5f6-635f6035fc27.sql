-- Drop existing profile update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new policy that prevents modifying account_status and trial_started_at
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND account_status = (SELECT p.account_status FROM public.profiles p WHERE p.user_id = auth.uid())
  AND (
    trial_started_at IS NOT DISTINCT FROM (SELECT p.trial_started_at FROM public.profiles p WHERE p.user_id = auth.uid())
  )
);
