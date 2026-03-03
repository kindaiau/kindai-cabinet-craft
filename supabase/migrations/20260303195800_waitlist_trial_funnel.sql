-- Trial + waitlist funnel foundation

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'waitlisted'
    CHECK (account_status IN ('waitlisted', 'demo_active', 'trial_active', 'expired')),
  ADD COLUMN IF NOT EXISTS demo_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_started_at timestamptz;

-- Prevent users from self-escalating account status
CREATE OR REPLACE FUNCTION public.prevent_profile_status_self_update()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() = OLD.user_id THEN
    IF NEW.account_status IS DISTINCT FROM OLD.account_status
      OR NEW.demo_started_at IS DISTINCT FROM OLD.demo_started_at
      OR NEW.trial_started_at IS DISTINCT FROM OLD.trial_started_at THEN
      RAISE EXCEPTION 'account status fields are managed by admin workflows';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS prevent_profile_status_self_update ON public.profiles;
CREATE TRIGGER prevent_profile_status_self_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_status_self_update();

CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  business_name text NOT NULL,
  contact_name text NOT NULL,
  phone text,
  trade_type text NOT NULL DEFAULT 'Cabinet Maker',
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'video_sent', 'trial_sent', 'converted', 'rejected')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert waitlist" ON public.waitlist;
CREATE POLICY "Public can insert waitlist" ON public.waitlist
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "No public select waitlist" ON public.waitlist;
CREATE POLICY "No public select waitlist" ON public.waitlist
  FOR SELECT
  USING (false);

DROP TRIGGER IF EXISTS update_waitlist_updated_at ON public.waitlist;
CREATE TRIGGER update_waitlist_updated_at
BEFORE UPDATE ON public.waitlist
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- New users default into waitlisted state
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, account_status) VALUES (NEW.id, 'waitlisted');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
