
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "No public select waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Allow anon insert waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "allow_public_insert_waitlist" ON public.waitlist;

CREATE POLICY "allow_public_insert_waitlist"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "deny_public_select_waitlist"
ON public.waitlist
FOR SELECT
TO anon, authenticated
USING (false);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON TABLE public.waitlist TO anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON TABLE public.waitlist FROM anon, authenticated;
