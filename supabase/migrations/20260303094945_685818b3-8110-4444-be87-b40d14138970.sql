
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert waitlist" ON public.waitlist;
CREATE POLICY "Public can insert waitlist"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "No public select waitlist" ON public.waitlist;
CREATE POLICY "No public select waitlist"
ON public.waitlist
FOR SELECT
TO anon, authenticated
USING (false);

GRANT INSERT ON public.waitlist TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
