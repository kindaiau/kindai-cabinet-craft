
-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create cabinets table
CREATE TABLE public.cabinets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'base',
  width_mm INTEGER NOT NULL DEFAULT 600,
  height_mm INTEGER NOT NULL DEFAULT 720,
  depth_mm INTEGER NOT NULL DEFAULT 560,
  door_count INTEGER NOT NULL DEFAULT 1,
  drawer_count INTEGER NOT NULL DEFAULT 0,
  shelf_count INTEGER NOT NULL DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cabinets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cabinets" ON public.cabinets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cabinets" ON public.cabinets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cabinets" ON public.cabinets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cabinets" ON public.cabinets FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_cabinets_updated_at BEFORE UPDATE ON public.cabinets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Link plans to projects (optional FK)
ALTER TABLE public.plans ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;
