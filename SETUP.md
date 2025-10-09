# Permaculture Planner - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account ([sign up here](https://supabase.com))
- Git

## Environment Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd permaculture-planner
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change in production
```

### 4. Get Your Supabase Keys

#### Step 1: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created (~2 minutes)

#### Step 2: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following keys:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → Use as `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **IMPORTANT**: The service role key bypasses Row Level Security. Keep it secret and never expose it in client-side code!

### 5. Set Up Database

The application uses the following Supabase tables. Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sites table
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lat DECIMAL,
  lng DECIMAL,
  country_code TEXT,
  usda_zone TEXT,
  last_frost DATE,
  first_frost DATE,
  surface_type TEXT,
  slope_pct INTEGER,
  shade_notes TEXT,
  water_source TEXT,
  constraints_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beds table
CREATE TABLE IF NOT EXISTS public.beds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  shape TEXT,
  length_ft DECIMAL,
  width_ft DECIMAL,
  height_in INTEGER,
  orientation TEXT,
  surface TEXT,
  wicking BOOLEAN,
  trellis BOOLEAN,
  path_clearance_in INTEGER,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materials estimates table
CREATE TABLE IF NOT EXISTS public.materials_estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
  soil_cuft DECIMAL,
  compost_cuft DECIMAL,
  mulch_cuft DECIMAL,
  lumber_boardfeet DECIMAL,
  screws_count INTEGER,
  drip_line_ft DECIMAL,
  emitters_count INTEGER,
  row_cover_sqft DECIMAL,
  cost_estimate_cents INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials_estimates ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Sites policies
CREATE POLICY "Users can read own sites" ON public.sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sites" ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites" ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

-- Plans policies (through sites)
CREATE POLICY "Users can read own plans" ON public.plans
  FOR SELECT USING (
    site_id IN (SELECT id FROM public.sites WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create plans" ON public.plans
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

-- Similar policies for beds and materials_estimates...
```

### 6. Configure OAuth Providers (Optional)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
6. In Supabase Dashboard → **Authentication** → **Providers** → Enable Google
7. Add your Google Client ID and Client Secret

#### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. In Supabase Dashboard → **Authentication** → **Providers** → Enable GitHub
5. Add your GitHub Client ID and Client Secret

## Running the Application

### Development Mode

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Environment Validation

The application automatically validates required environment variables on startup. If any are missing, you'll see an error message in the console with details.

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional but recommended:
- `SUPABASE_SERVICE_ROLE_KEY` (required for admin features)
- `NEXT_PUBLIC_APP_URL` (required for production)

## Security Checklist

- [ ] Service role key is set and kept secret
- [ ] Row Level Security is enabled on all tables
- [ ] OAuth providers are configured with correct redirect URIs
- [ ] Environment variables are not committed to git
- [ ] `.env.local` is in `.gitignore`
- [ ] CORS is configured correctly for production domain

## Troubleshooting

### "SUPABASE_SERVICE_ROLE_KEY is set to placeholder value"

This warning appears when using the default placeholder. Get the real key from:
**Supabase Dashboard → Settings → API → service_role key**

### Authentication errors

1. Check that your Supabase URL and keys are correct
2. Verify that email templates are enabled in Supabase
3. Check browser console for detailed error messages

### Database errors

1. Ensure all tables are created
2. Verify Row Level Security policies are in place
3. Check that user ID matches auth.uid() in policies

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Deployment Guide](./DEPLOYMENT.md) (coming soon)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase logs in the dashboard
3. Check browser console for errors
4. Open an issue on GitHub
