-- Add admin role to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = TRUE;

-- Admin helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant admins full access to all tables
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all sites" ON public.sites
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all plans" ON public.plans
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all beds" ON public.beds
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all plantings" ON public.plantings
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all tasks" ON public.tasks
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all journal entries" ON public.journal_entries
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all harvests" ON public.harvests
  FOR SELECT USING (public.is_admin());

-- Create analytics views for admin dashboard
CREATE OR REPLACE VIEW public.admin_user_stats AS
SELECT
  COUNT(DISTINCT p.id) as total_users,
  COUNT(DISTINCT CASE WHEN p.created_at > NOW() - INTERVAL '7 days' THEN p.id END) as users_last_7_days,
  COUNT(DISTINCT CASE WHEN p.created_at > NOW() - INTERVAL '30 days' THEN p.id END) as users_last_30_days
FROM public.profiles p;

CREATE OR REPLACE VIEW public.admin_content_stats AS
SELECT
  COUNT(DISTINCT s.id) as total_sites,
  COUNT(DISTINCT pl.id) as total_plans,
  COUNT(DISTINCT b.id) as total_beds,
  COUNT(DISTINCT p.id) as total_plantings,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT j.id) as total_journal_entries,
  COUNT(DISTINCT h.id) as total_harvests
FROM public.sites s
LEFT JOIN public.plans pl ON s.id = pl.site_id
LEFT JOIN public.beds b ON pl.id = b.plan_id
LEFT JOIN public.plantings p ON b.id = p.bed_id
LEFT JOIN public.tasks t ON pl.id = t.plan_id
LEFT JOIN public.journal_entries j ON pl.id = j.plan_id
LEFT JOIN public.harvests h ON p.id = h.planting_id;

CREATE OR REPLACE VIEW public.admin_recent_activity AS
SELECT
  'user_signup' as activity_type,
  p.id as user_id,
  p.email,
  p.created_at as timestamp,
  NULL as entity_id
FROM public.profiles p
UNION ALL
SELECT
  'site_created' as activity_type,
  s.user_id,
  pr.email,
  s.created_at as timestamp,
  s.id as entity_id
FROM public.sites s
JOIN public.profiles pr ON s.user_id = pr.id
UNION ALL
SELECT
  'plan_created' as activity_type,
  si.user_id,
  pr.email,
  pl.created_at as timestamp,
  pl.id as entity_id
FROM public.plans pl
JOIN public.sites si ON pl.site_id = si.id
JOIN public.profiles pr ON si.user_id = pr.id
ORDER BY timestamp DESC;

-- Grant select on views to authenticated users with admin check
ALTER VIEW public.admin_user_stats OWNER TO postgres;
ALTER VIEW public.admin_content_stats OWNER TO postgres;
ALTER VIEW public.admin_recent_activity OWNER TO postgres;

-- Only admins can access these views (enforced in API layer)
GRANT SELECT ON public.admin_user_stats TO authenticated;
GRANT SELECT ON public.admin_content_stats TO authenticated;
GRANT SELECT ON public.admin_recent_activity TO authenticated;