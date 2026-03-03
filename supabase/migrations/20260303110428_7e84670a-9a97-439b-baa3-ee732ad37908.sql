REVOKE ALL ON TABLE public.waitlist FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON TABLE public.waitlist TO anon, authenticated;