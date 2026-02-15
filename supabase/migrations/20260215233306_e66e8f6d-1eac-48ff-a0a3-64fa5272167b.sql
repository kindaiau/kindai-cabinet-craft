
-- Add labour rate defaults to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS labour_method text NOT NULL DEFAULT 'hourly',
  ADD COLUMN IF NOT EXISTS fab_hourly_rate numeric NOT NULL DEFAULT 65,
  ADD COLUMN IF NOT EXISTS install_hourly_rate numeric NOT NULL DEFAULT 75,
  ADD COLUMN IF NOT EXISTS fab_per_lm numeric NOT NULL DEFAULT 350,
  ADD COLUMN IF NOT EXISTS install_per_lm numeric NOT NULL DEFAULT 180,
  ADD COLUMN IF NOT EXISTS fab_per_unit jsonb NOT NULL DEFAULT '{"base":130,"wall":100,"tall":200,"drawer_bank":180}'::jsonb,
  ADD COLUMN IF NOT EXISTS install_per_unit jsonb NOT NULL DEFAULT '{"base":65,"wall":50,"tall":100,"drawer_bank":90}'::jsonb,
  ADD COLUMN IF NOT EXISTS fab_hours_per_unit jsonb NOT NULL DEFAULT '{"base":2,"wall":1.5,"tall":3.5,"drawer_bank":3}'::jsonb,
  ADD COLUMN IF NOT EXISTS install_hours_per_unit jsonb NOT NULL DEFAULT '{"base":0.75,"wall":0.5,"tall":1.25,"drawer_bank":1}'::jsonb;
