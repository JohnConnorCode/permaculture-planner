-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE surface_type AS ENUM ('soil', 'hard', 'rooftop', 'concrete');
CREATE TYPE plan_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE task_category AS ENUM ('build', 'plant', 'maintain', 'harvest', 'water', 'fertilize');
CREATE TYPE water_source AS ENUM ('spigot', 'rain', 'none', 'drip');
CREATE TYPE season AS ENUM ('spring', 'summer', 'fall', 'winter');
CREATE TYPE sowing_method AS ENUM ('direct', 'transplant', 'succession');
CREATE TYPE plant_family AS ENUM (
  'Solanaceae', 'Brassicaceae', 'Cucurbitaceae', 'Fabaceae',
  'Allium', 'Apiaceae', 'Asteraceae', 'Amaranthaceae', 'Poaceae', 'Other'
);
CREATE TYPE bed_shape AS ENUM ('rect', 'circular', 'keyhole', 'spiral');
CREATE TYPE orientation AS ENUM ('NS', 'EW');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sites table
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  country_code VARCHAR(2),
  usda_zone VARCHAR(3),
  last_frost DATE,
  first_frost DATE,
  surface_type surface_type NOT NULL DEFAULT 'soil',
  slope_pct DECIMAL(5, 2),
  shade_notes TEXT,
  water_source water_source DEFAULT 'spigot',
  constraints_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  version INT DEFAULT 1,
  status plan_status DEFAULT 'draft',
  scene_json JSONB, -- For visual editor state
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beds table
CREATE TABLE public.beds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  shape bed_shape DEFAULT 'rect',
  length_ft DECIMAL(5, 2) NOT NULL CHECK (length_ft > 0 AND length_ft <= 100),
  width_ft DECIMAL(5, 2) NOT NULL CHECK (width_ft > 0 AND width_ft <= 100),
  height_in DECIMAL(4, 1) DEFAULT 12 CHECK (height_in >= 6 AND height_in <= 48),
  orientation orientation DEFAULT 'NS',
  surface surface_type DEFAULT 'soil',
  wicking BOOLEAN DEFAULT FALSE,
  trellis BOOLEAN DEFAULT FALSE,
  path_clearance_in DECIMAL(4, 1) DEFAULT 18,
  notes TEXT,
  order_index INT DEFAULT 0,
  position_json JSONB, -- For visual editor coordinates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crops table
CREATE TABLE public.crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  family plant_family NOT NULL,
  days_to_maturity_min INT,
  days_to_maturity_max INT,
  spacing_in DECIMAL(4, 1) NOT NULL,
  depth_in DECIMAL(3, 2),
  water_needs TEXT,
  sun_needs TEXT,
  companions TEXT[],
  antagonists TEXT[],
  frost_hardy BOOLEAN DEFAULT FALSE,
  heat_tolerant BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plantings table
CREATE TABLE public.plantings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bed_id UUID NOT NULL REFERENCES public.beds(id) ON DELETE CASCADE,
  season season NOT NULL,
  year INT NOT NULL,
  crop_id UUID REFERENCES public.crops(id),
  variety TEXT,
  spacing_in DECIMAL(4, 1) NOT NULL,
  family plant_family NOT NULL,
  target_days_to_maturity INT,
  sowing_method sowing_method DEFAULT 'direct',
  sow_date DATE,
  transplant_date DATE,
  harvest_start DATE,
  harvest_end DATE,
  successions_json JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category task_category NOT NULL,
  due_on DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  recurring_pattern TEXT, -- 'daily', 'weekly', 'monthly'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materials estimates table
CREATE TABLE public.materials_estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  soil_cuft DECIMAL(8, 2),
  compost_cuft DECIMAL(8, 2),
  mulch_cuft DECIMAL(8, 2),
  lumber_boardfeet DECIMAL(8, 2),
  screws_count INT,
  drip_line_ft DECIMAL(8, 2),
  emitters_count INT,
  row_cover_sqft DECIMAL(8, 2),
  cost_estimate_cents INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal entries table
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[],
  weather JSONB,
  images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Harvests table
CREATE TABLE public.harvests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planting_id UUID NOT NULL REFERENCES public.plantings(id) ON DELETE CASCADE,
  harvested_on DATE NOT NULL,
  quantity DECIMAL(8, 2),
  unit TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weather data cache
CREATE TABLE public.weather_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  date DATE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lat, lng, date)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beds_updated_at BEFORE UPDATE ON public.beds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plantings_updated_at BEFORE UPDATE ON public.plantings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_estimates_updated_at BEFORE UPDATE ON public.materials_estimates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_sites_user_id ON public.sites(user_id);
CREATE INDEX idx_plans_site_id ON public.plans(site_id);
CREATE INDEX idx_plans_status ON public.plans(status);
CREATE INDEX idx_beds_plan_id ON public.beds(plan_id);
CREATE INDEX idx_plantings_bed_id ON public.plantings(bed_id);
CREATE INDEX idx_plantings_season_year ON public.plantings(season, year);
CREATE INDEX idx_tasks_plan_id ON public.tasks(plan_id);
CREATE INDEX idx_tasks_due_on ON public.tasks(due_on);
CREATE INDEX idx_tasks_completed ON public.tasks(completed);
CREATE INDEX idx_journal_entries_plan_id ON public.journal_entries(plan_id);
CREATE INDEX idx_harvests_planting_id ON public.harvests(planting_id);
CREATE INDEX idx_weather_cache_coords ON public.weather_cache(lat, lng, date);

-- Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plantings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Sites policies
CREATE POLICY "Users can view own sites" ON public.sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sites" ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites" ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

-- Plans policies
CREATE POLICY "Users can view own plans" ON public.plans
  FOR SELECT USING (
    site_id IN (SELECT id FROM public.sites WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create plans for own sites" ON public.plans
  FOR INSERT WITH CHECK (
    site_id IN (SELECT id FROM public.sites WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own plans" ON public.plans
  FOR UPDATE USING (
    site_id IN (SELECT id FROM public.sites WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own plans" ON public.plans
  FOR DELETE USING (
    site_id IN (SELECT id FROM public.sites WHERE user_id = auth.uid())
  );

-- Beds policies (inherit from plans)
CREATE POLICY "Users can view beds in own plans" ON public.beds
  FOR SELECT USING (
    plan_id IN (
      SELECT p.id FROM public.plans p
      JOIN public.sites s ON p.site_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage beds in own plans" ON public.beds
  FOR ALL USING (
    plan_id IN (
      SELECT p.id FROM public.plans p
      JOIN public.sites s ON p.site_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

-- Crops policies (public read, admin write)
CREATE POLICY "Everyone can view crops" ON public.crops
  FOR SELECT USING (true);

-- Similar policies for other tables...
CREATE POLICY "Users can manage own plantings" ON public.plantings
  FOR ALL USING (
    bed_id IN (
      SELECT b.id FROM public.beds b
      JOIN public.plans p ON b.plan_id = p.id
      JOIN public.sites s ON p.site_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own tasks" ON public.tasks
  FOR ALL USING (
    plan_id IN (
      SELECT p.id FROM public.plans p
      JOIN public.sites s ON p.site_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own journal entries" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own journal entries" ON public.journal_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own harvests" ON public.harvests
  FOR ALL USING (
    planting_id IN (
      SELECT pl.id FROM public.plantings pl
      JOIN public.beds b ON pl.bed_id = b.id
      JOIN public.plans p ON b.plan_id = p.id
      JOIN public.sites s ON p.site_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

-- Create profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();