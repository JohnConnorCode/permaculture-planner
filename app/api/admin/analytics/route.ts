import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
      },
    }
  )

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
  }

  try {
    // Fetch user stats
    const { data: userStats, error: userStatsError } = await supabase
      .from('admin_user_stats')
      .select('*')
      .single()

    if (userStatsError) throw userStatsError

    // Fetch content stats
    const { data: contentStats, error: contentStatsError } = await supabase
      .from('admin_content_stats')
      .select('*')
      .single()

    if (contentStatsError) throw contentStatsError

    // Fetch recent activity (last 50 items)
    const { data: recentActivity, error: activityError } = await supabase
      .from('admin_recent_activity')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50)

    if (activityError) throw activityError

    // Fetch top users by content creation (optional - will gracefully fail if RPC doesn't exist)
    const { data: topUsers, error: topUsersError } = await supabase.rpc(
      'get_top_users_by_content',
      {},
      { count: 'exact' }
    )

    // Fetch user growth data for the last 30 days
    const { data: userGrowth, error: growthError } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true })

    if (growthError) throw growthError

    // Process growth data into daily counts
    const growthByDay = userGrowth.reduce((acc: Record<string, number>, user) => {
      const date = new Date(user.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    const growthData = Object.entries(growthByDay).map(([date, count]) => ({
      date,
      count,
    }))

    return NextResponse.json({
      userStats,
      contentStats,
      recentActivity,
      topUsers: topUsersError ? [] : topUsers,
      userGrowth: growthData,
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}