# Admin Dashboard Guide

## Overview

The admin dashboard provides comprehensive analytics and user management capabilities for monitoring the Permaculture Planner platform.

## Features

### 1. Analytics Dashboard (`/admin`)

The main admin dashboard displays:

- **User Statistics**
  - Total users registered
  - New users in the last 7 days
  - New users in the last 30 days

- **Content Statistics**
  - Total sites created
  - Total plans created
  - Total beds designed
  - Total plantings recorded
  - Total tasks created
  - Total journal entries written
  - Total harvests logged

- **User Growth Chart**
  - Visual representation of user signups over the last 30 days

- **Recent Activity Feed**
  - Real-time feed of user signups, site creations, and plan creations
  - Shows the 50 most recent activities

### 2. User Management (`/admin/users`)

The user management page provides:

- **User List**
  - Complete list of all registered users
  - Email addresses and names
  - Admin role badges
  - Signup dates

- **User Statistics** (per user)
  - Number of sites created
  - Number of plans created
  - Number of beds designed
  - Number of plantings recorded
  - Number of journal entries written

- **Search & Filter**
  - Search users by email or name
  - Paginated results (20 users per page)

## Setup

### 1. Run Database Migration

First, apply the admin roles migration:

\`\`\`bash
# If using Supabase CLI
supabase db push

# Or manually run the migration file
# Run: permaculture-planner/supabase/migrations/002_admin_roles.sql
\`\`\`

This migration:
- Adds `is_admin` column to profiles table
- Creates admin helper functions
- Sets up admin policies for full data access
- Creates analytics views for the dashboard

### 2. Make Your First Admin User

Use the provided script to promote a user to admin:

\`\`\`bash
cd permaculture-planner
node scripts/make-admin.js your-email@example.com
\`\`\`

**Requirements:**
- User must already be registered in the system
- You need the `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local` file

### 3. Access the Admin Dashboard

Once promoted to admin, navigate to:
- Dashboard: `http://localhost:3000/admin`
- User Management: `http://localhost:3000/admin/users`

## Security

### Route Protection

The admin routes are protected by:

1. **Authentication Check**: Users must be logged in
2. **Admin Role Check**: Users must have `is_admin = true` in their profile
3. **Middleware Protection**: The Next.js middleware (`middleware.ts`) enforces these checks

### API Endpoints

Admin API endpoints are protected similarly:
- `/api/admin/analytics` - Returns platform-wide analytics
- `/api/admin/users` - Returns paginated user list with stats

All endpoints return:
- `401 Unauthorized` if not logged in
- `403 Forbidden` if not an admin

### Row Level Security (RLS)

Admin users bypass normal RLS policies and can:
- View all user profiles
- View all sites, plans, beds, plantings
- View all tasks, journal entries, and harvests

**Note**: Admins have read-only access via the dashboard. They cannot modify user data through the UI.

## Analytics Data

### Database Views

The system uses PostgreSQL views for efficient analytics:

- `admin_user_stats` - Aggregated user counts
- `admin_content_stats` - Aggregated content counts
- `admin_recent_activity` - Combined activity feed

These views are optimized for read performance and updated in real-time.

## Making Additional Admins

To promote more users to admin:

\`\`\`bash
node scripts/make-admin.js new-admin@example.com
\`\`\`

Or manually via SQL:

\`\`\`sql
UPDATE public.profiles
SET is_admin = true
WHERE email = 'admin@example.com';
\`\`\`

## Removing Admin Access

To remove admin privileges:

\`\`\`sql
UPDATE public.profiles
SET is_admin = false
WHERE email = 'user@example.com';
\`\`\`

## Monitoring

The admin dashboard automatically refreshes data when:
- Page loads
- User clicks "Refresh Data" button
- User navigates between pages

For real-time monitoring, consider:
- Setting up browser auto-refresh
- Implementing WebSocket connections for live updates
- Adding notification badges for new activity

## Future Enhancements

Potential improvements for the admin dashboard:

- [ ] User detail pages with complete activity history
- [ ] Ability to export analytics data (CSV, JSON)
- [ ] Advanced filtering and sorting options
- [ ] Email user functionality
- [ ] Suspend/delete user accounts
- [ ] Bulk operations on users
- [ ] Custom date range selection for analytics
- [ ] More detailed charts and visualizations
- [ ] System health monitoring
- [ ] Performance metrics and API usage stats

## Troubleshooting

### Cannot Access Admin Dashboard

1. Verify you're logged in
2. Check your user has `is_admin = true`:
   \`\`\`sql
   SELECT email, is_admin FROM public.profiles WHERE email = 'your-email@example.com';
   \`\`\`

### Migration Errors

If the migration fails:
1. Check Supabase connection
2. Verify you have proper permissions
3. Look for conflicts with existing policies

### Analytics Not Loading

1. Check browser console for errors
2. Verify API endpoints return data
3. Check Supabase RLS policies are correctly applied
4. Ensure views were created successfully

## Support

For issues or questions about the admin dashboard:
1. Check this guide first
2. Review the code in `/app/admin/` and `/app/api/admin/`
3. Check database migration in `/supabase/migrations/002_admin_roles.sql`