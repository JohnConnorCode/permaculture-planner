-- Row Level Security Policies for Permaculture Planner v1.1
-- Enforce multi-tenant data isolation

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plantings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user ID
CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS UUID AS $$
  SELECT auth.uid()::UUID
$$ LANGUAGE sql SECURITY DEFINER;

-- Users policies
CREATE POLICY users_select ON public.users
  FOR SELECT USING (id = auth.user_id());

CREATE POLICY users_insert ON public.users
  FOR INSERT WITH CHECK (id = auth.user_id());

CREATE POLICY users_update ON public.users
  FOR UPDATE USING (id = auth.user_id())
  WITH CHECK (id = auth.user_id());

-- Sites policies
CREATE POLICY sites_select ON public.sites
  FOR SELECT USING (user_id = auth.user_id());

CREATE POLICY sites_insert ON public.sites
  FOR INSERT WITH CHECK (user_id = auth.user_id());

CREATE POLICY sites_update ON public.sites
  FOR UPDATE USING (user_id = auth.user_id())
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY sites_delete ON public.sites
  FOR DELETE USING (user_id = auth.user_id());

-- Plans policies with site ownership check
CREATE POLICY plans_select ON public.plans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sites 
      WHERE sites.id = plans.site_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY plans_insert ON public.plans
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sites 
      WHERE sites.id = site_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY plans_update ON public.plans
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.sites 
      WHERE sites.id = plans.site_id 
      AND sites.user_id = auth.user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sites 
      WHERE sites.id = site_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY plans_delete ON public.plans
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.sites 
      WHERE sites.id = plans.site_id 
      AND sites.user_id = auth.user_id()
    )
  );

-- Beds policies with plan ownership check
CREATE POLICY beds_select ON public.beds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = beds.plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY beds_insert ON public.beds
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY beds_update ON public.beds
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = beds.plan_id 
      AND sites.user_id = auth.user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY beds_delete ON public.beds
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = beds.plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

-- Plantings policies with bed ownership check
CREATE POLICY plantings_select ON public.plantings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.beds
      JOIN public.plans ON plans.id = beds.plan_id
      JOIN public.sites ON sites.id = plans.site_id
      WHERE beds.id = plantings.bed_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY plantings_insert ON public.plantings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.beds
      JOIN public.plans ON plans.id = beds.plan_id
      JOIN public.sites ON sites.id = plans.site_id
      WHERE beds.id = bed_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY plantings_update ON public.plantings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.beds
      JOIN public.plans ON plans.id = beds.plan_id
      JOIN public.sites ON sites.id = plans.site_id
      WHERE beds.id = plantings.bed_id 
      AND sites.user_id = auth.user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.beds
      JOIN public.plans ON plans.id = beds.plan_id
      JOIN public.sites ON sites.id = plans.site_id
      WHERE beds.id = bed_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY plantings_delete ON public.plantings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.beds
      JOIN public.plans ON plans.id = beds.plan_id
      JOIN public.sites ON sites.id = plans.site_id
      WHERE beds.id = plantings.bed_id 
      AND sites.user_id = auth.user_id()
    )
  );

-- Materials estimates policies
CREATE POLICY materials_select ON public.materials_estimates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = materials_estimates.plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY materials_insert ON public.materials_estimates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY materials_update ON public.materials_estimates
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = materials_estimates.plan_id 
      AND sites.user_id = auth.user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY materials_delete ON public.materials_estimates
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = materials_estimates.plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

-- Irrigation zones policies
CREATE POLICY irrigation_select ON public.irrigation_zones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = irrigation_zones.plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY irrigation_insert ON public.irrigation_zones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY irrigation_update ON public.irrigation_zones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = irrigation_zones.plan_id 
      AND sites.user_id = auth.user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY irrigation_delete ON public.irrigation_zones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = irrigation_zones.plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

-- Tasks policies
CREATE POLICY tasks_select ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = tasks.plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY tasks_insert ON public.tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY tasks_update ON public.tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = tasks.plan_id 
      AND sites.user_id = auth.user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

CREATE POLICY tasks_delete ON public.tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.plans 
      JOIN public.sites ON sites.id = plans.site_id
      WHERE plans.id = tasks.plan_id 
      AND sites.user_id = auth.user_id()
    )
  );

-- History policies (users can only see their own history)
CREATE POLICY history_select ON public.history
  FOR SELECT USING (user_id = auth.user_id());

CREATE POLICY history_insert ON public.history
  FOR INSERT WITH CHECK (user_id = auth.user_id());

-- AI conversations policies
CREATE POLICY ai_select ON public.ai_conversations
  FOR SELECT USING (user_id = auth.user_id());

CREATE POLICY ai_insert ON public.ai_conversations
  FOR INSERT WITH CHECK (user_id = auth.user_id());

-- Crops table is public read-only
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
CREATE POLICY crops_select ON public.crops
  FOR SELECT USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create service role bypass (for admin operations)
CREATE POLICY bypass_rls_policy ON public.users
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY bypass_rls_policy ON public.sites
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY bypass_rls_policy ON public.plans
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to check if user owns a plan
CREATE OR REPLACE FUNCTION public.user_owns_plan(plan_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.plans 
    JOIN public.sites ON sites.id = plans.site_id
    WHERE plans.id = $1 
    AND sites.user_id = auth.user_id()
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to check if user owns a bed
CREATE OR REPLACE FUNCTION public.user_owns_bed(bed_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.beds
    JOIN public.plans ON plans.id = beds.plan_id
    JOIN public.sites ON sites.id = plans.site_id
    WHERE beds.id = $1 
    AND sites.user_id = auth.user_id()
  )
$$ LANGUAGE sql SECURITY DEFINER;