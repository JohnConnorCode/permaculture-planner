-- Permaculture Planner v1.1 Database Schema
-- PostgreSQL 14+ with RLS

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create custom types
CREATE TYPE surface_type AS ENUM ('soil', 'hard');
CREATE TYPE water_source AS ENUM ('spigot', 'none', 'rain');
CREATE TYPE plan_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE bed_shape AS ENUM ('rect', 'square', 'circular', 'L-shaped');
CREATE TYPE bed_orientation AS ENUM ('NS', 'EW');
CREATE TYPE season AS ENUM ('spring', 'summer', 'fall', 'winter');
CREATE TYPE plant_family AS ENUM (
  'Solanaceae', 'Brassicaceae', 'Cucurbitaceae', 'Fabaceae',
  'Allium', 'Apiaceae', 'Asteraceae', 'Amaranthaceae', 
  'Poaceae', 'Lamiaceae', 'Rosaceae', 'Other'
);
CREATE TYPE sowing_method AS ENUM ('direct', 'transplant', 'both');
CREATE TYPE irrigation_method AS ENUM ('drip', 'SIP', 'hand', 'sprinkler');
CREATE TYPE task_category AS ENUM ('build', 'plant', 'water', 'cover', 'harvest', 'maint', 'pest');
CREATE TYPE sun_requirement AS ENUM ('full', 'partial', 'shade');
CREATE TYPE water_needs AS ENUM ('low', 'medium', 'high');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Sites table
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lat NUMERIC(10, 7),
  lng NUMERIC(10, 7),
  address TEXT,
  country_code VARCHAR(2),
  usda_zone VARCHAR(5),
  last_frost DATE,
  first_frost DATE,
  surface_type surface_type NOT NULL,
  slope_pct NUMERIC(5, 2) DEFAULT 0 CHECK (slope_pct >= 0 AND slope_pct <= 100),
  shade_notes TEXT,
  water_source water_source NOT NULL,
  constraints_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT valid_coords CHECK (
    (lat IS NULL AND lng IS NULL) OR 
    (lat BETWEEN -90 AND 90 AND lng BETWEEN -180 AND 180)
  ),
  CONSTRAINT valid_frost_dates CHECK (
    (last_frost IS NULL AND first_frost IS NULL) OR
    (last_frost < first_frost)
  )
);

-- Plans table with versioning
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  parent_plan_id UUID REFERENCES public.plans(id),
  name TEXT NOT NULL,
  version INTEGER DEFAULT 1 CHECK (version > 0),
  status plan_status DEFAULT 'draft',
  generation_seed INTEGER,
  quality_score INTEGER CHECK (quality_score BETWEEN 0 AND 100),
  quality_breakdown JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  CONSTRAINT unique_active_version UNIQUE (site_id, status) WHERE status = 'active'
);

-- Beds table
CREATE TABLE public.beds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  shape bed_shape DEFAULT 'rect',
  length_ft NUMERIC(5, 2) NOT NULL CHECK (length_ft > 0 AND length_ft <= 100),
  width_ft NUMERIC(5, 2) NOT NULL CHECK (width_ft > 0 AND width_ft <= 10),
  height_in INTEGER DEFAULT 12 CHECK (height_in > 0 AND height_in <= 48),
  orientation bed_orientation DEFAULT 'NS',
  surface surface_type DEFAULT 'soil',
  wicking BOOLEAN DEFAULT FALSE,
  trellis BOOLEAN DEFAULT FALSE,
  path_clearance_in INTEGER DEFAULT 24 CHECK (path_clearance_in >= 12 AND path_clearance_in <= 60),
  x_position NUMERIC(6, 2),
  y_position NUMERIC(6, 2),
  rotation_degrees NUMERIC(5, 2) DEFAULT 0,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dimensions CHECK (
    (shape = 'rect' AND width_ft <= 4) OR 
    (shape = 'square' AND length_ft = width_ft AND width_ft <= 4)
  )
);

-- Plantings table with enhanced tracking
CREATE TABLE public.plantings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bed_id UUID NOT NULL REFERENCES public.beds(id) ON DELETE CASCADE,
  season season NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2100),
  crop_id TEXT NOT NULL,
  variety TEXT,
  spacing_in INTEGER NOT NULL CHECK (spacing_in > 0 AND spacing_in <= 48),
  quantity INTEGER,
  family plant_family NOT NULL,
  days_to_maturity INTEGER CHECK (days_to_maturity > 0 AND days_to_maturity <= 365),
  sowing_method sowing_method DEFAULT 'direct',
  sowing_date DATE,
  transplant_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  yield_lbs NUMERIC(6, 2),
  notes TEXT,
  succession_plantings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (
    (sowing_date IS NULL OR transplant_date IS NULL OR sowing_date < transplant_date) AND
    (transplant_date IS NULL OR expected_harvest_date IS NULL OR transplant_date < expected_harvest_date)
  ),
  CONSTRAINT unique_bed_season_year UNIQUE (bed_id, season, year)
);

-- Materials estimates with detailed breakdown
CREATE TABLE public.materials_estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  soil_cuft NUMERIC(10, 2) NOT NULL CHECK (soil_cuft >= 0),
  compost_cuft NUMERIC(10, 2) NOT NULL CHECK (compost_cuft >= 0),
  mulch_cuft NUMERIC(10, 2) NOT NULL CHECK (mulch_cuft >= 0),
  cardboard_sqft NUMERIC(10, 2) DEFAULT 0,
  lumber_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  hardware_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  irrigation_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  row_cover_sqft NUMERIC(10, 2) DEFAULT 0,
  cost_estimate_low_cents INTEGER,
  cost_estimate_high_cents INTEGER,
  supplier_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_cost CHECK (
    (cost_estimate_low_cents IS NULL AND cost_estimate_high_cents IS NULL) OR
    (cost_estimate_low_cents >= 0 AND cost_estimate_high_cents >= cost_estimate_low_cents)
  )
);

-- Irrigation zones with scheduling
CREATE TABLE public.irrigation_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  method irrigation_method NOT NULL,
  beds UUID[] NOT NULL,
  runtime_min_per_session INTEGER CHECK (runtime_min_per_session > 0 AND runtime_min_per_session <= 120),
  sessions_per_week INTEGER CHECK (sessions_per_week > 0 AND sessions_per_week <= 14),
  start_time TIME,
  days_of_week INTEGER[],
  gph_per_emitter NUMERIC(3, 1) DEFAULT 0.5,
  emitter_count INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks with recurrence support
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES public.tasks(id),
  title TEXT NOT NULL,
  description TEXT,
  due_on DATE NOT NULL,
  category task_category NOT NULL,
  priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  estimated_minutes INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES public.users(id),
  recurrence_rule TEXT,
  next_due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- History/audit log
CREATE TABLE public.history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  change_json JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crop reference table
CREATE TABLE public.crops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  family plant_family NOT NULL,
  sun sun_requirement NOT NULL,
  water_needs water_needs NOT NULL,
  spacing_in INTEGER NOT NULL,
  row_spacing_in INTEGER,
  days_to_maturity_min INTEGER NOT NULL,
  days_to_maturity_max INTEGER NOT NULL,
  height_in_min INTEGER,
  height_in_max INTEGER,
  seasons season[],
  usda_zones_min VARCHAR(3),
  usda_zones_max VARCHAR(3),
  row_cover_suitable BOOLEAN DEFAULT FALSE,
  needs_pollination BOOLEAN DEFAULT FALSE,
  needs_trellis BOOLEAN DEFAULT FALSE,
  companion_plants TEXT[],
  antagonistic_plants TEXT[],
  nutrient_needs JSONB,
  pest_susceptibility TEXT[],
  disease_susceptibility TEXT[],
  harvest_window_days INTEGER,
  storage_days INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI conversation cache
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,
  response TEXT NOT NULL,
  sources JSONB,
  model_version TEXT,
  tokens_used INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- Create indexes for performance
CREATE INDEX idx_sites_user_id ON public.sites(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_sites_location ON public.sites USING GIST (ll_to_earth(lat, lng));
CREATE INDEX idx_plans_site_id ON public.plans(site_id);
CREATE INDEX idx_plans_status ON public.plans(status) WHERE status = 'active';
CREATE INDEX idx_beds_plan_id ON public.beds(plan_id);
CREATE INDEX idx_plantings_bed_id ON public.plantings(bed_id);
CREATE INDEX idx_plantings_season_year ON public.plantings(season, year);
CREATE INDEX idx_tasks_plan_id_due ON public.tasks(plan_id, due_on) WHERE completed = FALSE;
CREATE INDEX idx_history_entity ON public.history(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_ai_cache ON public.ai_conversations(prompt_hash, created_at DESC);

-- Create generated columns
ALTER TABLE public.beds ADD COLUMN area_sqft NUMERIC(8, 2) 
  GENERATED ALWAYS AS (length_ft * width_ft) STORED;

ALTER TABLE public.beds ADD COLUMN volume_cuft NUMERIC(8, 2) 
  GENERATED ALWAYS AS (length_ft * width_ft * height_in / 12.0) STORED;

-- Create update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_beds_updated_at BEFORE UPDATE ON public.beds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plantings_updated_at BEFORE UPDATE ON public.plantings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- History tracking trigger
CREATE OR REPLACE FUNCTION track_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.history (user_id, entity_type, entity_id, action, change_json)
  VALUES (
    current_setting('app.current_user_id', true)::UUID,
    TG_TABLE_NAME,
    CASE TG_OP
      WHEN 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    TG_OP,
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply history triggers to key tables
CREATE TRIGGER track_plans_history AFTER INSERT OR UPDATE OR DELETE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION track_history();
CREATE TRIGGER track_beds_history AFTER INSERT OR UPDATE OR DELETE ON public.beds
  FOR EACH ROW EXECUTE FUNCTION track_history();
CREATE TRIGGER track_plantings_history AFTER INSERT OR UPDATE OR DELETE ON public.plantings
  FOR EACH ROW EXECUTE FUNCTION track_history();