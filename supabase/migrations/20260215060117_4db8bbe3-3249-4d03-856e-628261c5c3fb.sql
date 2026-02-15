
-- Create storage bucket for plan uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('plans', 'plans', false);

-- Storage policies for plans bucket
CREATE POLICY "Users can upload their own plans"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'plans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own plans"
ON storage.objects FOR SELECT
USING (bucket_id = 'plans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own plans"
ON storage.objects FOR DELETE
USING (bucket_id = 'plans' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create plans table to track uploads and analysis results
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'image/png',
  file_size INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'uploaded',
  analysis JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans" ON public.plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plans" ON public.plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON public.plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON public.plans FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
