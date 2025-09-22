# Supabase Database Setup Guide

This guide provides multiple methods to set up your Supabase database for the Permaculture Planner application.

## Current Status
- **Project URL**: https://mrbiutqridfiqbttsgfg.supabase.co
- **Current Tables**: 0/11 (database needs setup)
- **SQL File**: `combined_database_setup.sql` (550+ lines)

## Database Schema Overview

The setup will create:
- **11 Tables**: profiles, sites, plans, beds, crops, plantings, tasks, materials_estimates, journal_entries, harvests, weather_cache
- **9 Custom Types**: surface_type, plan_status, task_category, water_source, season, sowing_method, plant_family, bed_shape, orientation
- **Row Level Security**: Policies for user data protection
- **Seed Data**: 35+ crop varieties with companion planting information
- **Triggers & Functions**: Automated timestamp updates and user profile creation

## Available Setup Methods

### Method 1: Manual (Recommended - Always Works) ✅

**Steps:**
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/mrbiutqridfiqbttsgfg/sql)
2. Copy the entire contents of `combined_database_setup.sql`
3. Paste into the SQL editor
4. Click "Run"
5. Verify with: `npm run db:verify`

**Pros:** Always works, no additional setup
**Cons:** Manual copy/paste required

### Method 2: Supabase CLI with Migrations 🚀

**Prerequisites:**
```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref mrbiutqridfiqbttsgfg
```

**Usage:**
```bash
npm run db:setup:cli
```

**What it does:**
- Creates a migration file from your SQL
- Pushes migration to remote database
- Handles authentication via CLI login

### Method 3: Direct PostgreSQL Connection 🔗

**Prerequisites:**
```bash
# Install PostgreSQL client
npm install pg

# Get database password from Supabase Dashboard > Settings > Database
export SUPABASE_DB_PASSWORD=your_password_here
```

**Usage:**
```bash
npm run db:setup:password
```

**What it does:**
- Connects directly to PostgreSQL
- Executes SQL file as single transaction
- Provides detailed feedback

### Method 4: Management API with Personal Access Token 🔑

**Prerequisites:**
1. Go to [Supabase Account Tokens](https://supabase.com/dashboard/account/tokens)
2. Create a new token with "All" permissions
3. Set environment variable:
```bash
export SUPABASE_ACCESS_TOKEN=your_token_here
```

**Usage:**
```bash
npm run db:setup:pat
```

**What it does:**
- Uses Supabase Management API
- Executes SQL via REST endpoints
- Works programmatically

## Quick Start Commands

```bash
# Install dependencies
npm install

# Verify current state (should show 0/11 tables)
npm run db:verify

# Choose your setup method:
npm run db:setup          # General script with instructions
npm run db:setup:cli       # CLI method
npm run db:setup:password  # Direct connection method
npm run db:setup:pat       # Management API method

# Verify setup completed
npm run db:verify
```

## Expected Results After Setup

After successful setup, `npm run db:verify` should show:
```
Tables: 11/11 ✅
Crops Data: ✅
RLS Policies: ✅ (verified)
Auth Settings: ⚠️ (manual verification needed)

🎉 Database setup is COMPLETE and ready for use!
```

## Troubleshooting

### "Could not find the table" Errors
- Database hasn't been set up yet
- Try manual method via SQL editor
- Check Supabase project permissions

### Authentication Errors
- **CLI**: Run `supabase login` first
- **Password**: Get password from Supabase Dashboard > Settings > Database
- **PAT**: Generate token at https://supabase.com/dashboard/account/tokens

### Permission Errors
- Verify you have owner/admin access to the Supabase project
- Check that service role key is correct
- Ensure PAT has proper permissions

### Network Errors
- Check internet connection
- Verify project reference is correct
- Try different setup method

## File Descriptions

| File | Purpose |
|------|---------|
| `combined_database_setup.sql` | Complete database schema and seed data |
| `setup_database.js` | Main setup script with instructions |
| `setup_with_cli.js` | Supabase CLI migration approach |
| `setup_with_password.js` | Direct PostgreSQL connection |
| `setup_with_pat.js` | Management API approach |
| `verify_database_setup.js` | Verification and testing script |

## Security Notes

⚠️ **Important**: Keep your credentials secure!

- **Service Role Key**: Already in codebase for this specific project
- **Database Password**: Store in environment variables, never commit
- **Personal Access Token**: Store securely, rotate regularly
- **Project Access**: Only share with team members who need access

## Post-Setup Next Steps

1. **Verify Setup**: `npm run db:verify`
2. **Start Development**: `npm run dev`
3. **Test Authentication**: Sign up/sign in via your app
4. **Create Test Data**: Add a site, plan, and beds
5. **Check RLS**: Ensure users can only see their own data

## Support

If you encounter issues:

1. **Check Logs**: Look for specific error messages
2. **Try Alternative Method**: Each method has different prerequisites
3. **Manual Fallback**: The SQL editor method always works
4. **Verify Permissions**: Ensure you have proper access to the project

## Development Workflow

After setup, your typical development workflow:

```bash
# Start development server
npm run dev

# Make schema changes (create migration)
supabase migration new your_change_name

# Apply migrations
supabase db push

# Verify everything works
npm run db:verify
```

---

**Project**: Permaculture Planner
**Database**: Supabase PostgreSQL
**Schema Version**: Initial (2025-09-22)
**Tables**: 11 core tables with full RLS protection