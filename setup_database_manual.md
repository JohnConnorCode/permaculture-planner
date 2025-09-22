# Supabase Database Setup Instructions

Since we don't have the database password for automated setup, please follow these manual steps to set up your database:

## Step 1: Execute the Schema Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/mrbiutqridfiqbttsgfg
2. Click on "SQL Editor" in the left sidebar
3. Copy the entire contents of `/Users/johnconnor/Documents/GitHub/Permaculture-plan/permaculture-planner/supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema

## Step 2: Execute the Seed Data

1. Still in the SQL Editor
2. Copy the entire contents of `/Users/johnconnor/Documents/GitHub/Permaculture-plan/permaculture-planner/supabase/seeds/crops.sql`
3. Paste it into a new query in the SQL Editor
4. Click "Run" to execute the seeds

## Step 3: Enable Email Authentication

1. Go to "Authentication" → "Settings" in the dashboard
2. Ensure "Enable email confirmations" is turned ON
3. Set "Site URL" to your app's URL (e.g., http://localhost:3000 for development)
4. Configure any additional redirect URLs if needed

## Step 4: Verify Setup

After completing the above steps, run the verification script:

```bash
node verify_database_setup.js
```

## What the Schema Creates

The migration will create:
- Custom PostgreSQL types (enums) for various fields
- 13 main tables: profiles, sites, plans, beds, crops, plantings, tasks, materials_estimates, journal_entries, harvests, weather_cache
- Row Level Security (RLS) policies for all tables
- Proper indexes for performance
- Triggers for automatic timestamp updates
- A function to automatically create profiles when users sign up

## What the Seeds Create

The seeds will populate the crops table with 35+ common vegetables and their growing information including:
- Plant families
- Days to maturity
- Spacing requirements
- Companion planting information
- Growing notes

## Connection Details

Your project details:
- URL: https://mrbiutqridfiqbttsgfg.supabase.co
- Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYml1dHFyaWRmaXFidHRzZ2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MjI0NTgsImV4cCI6MjA3NDA5ODQ1OH0.5VWAP0OKaVdA4SEgzrkXCJF1XtNAh3OLccTP1kWxb7c
- Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYml1dHFyaWRmaXFidHRzZ2ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODUyMjQ1OCwiZXhwIjoyMDc0MDk4NDU4fQ.ujRWu0xKRoJcTsFPhJAFlaKe9tXfXWPOsDfA7RxDOR0