ALTER TABLE public.profiles
  ADD COLUMN trial_started_at timestamptz,
  ADD COLUMN account_status text NOT NULL DEFAULT 'trial';