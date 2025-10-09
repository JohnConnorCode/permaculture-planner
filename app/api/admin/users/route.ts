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
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
  }

  try {
    // Get pagination params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Fetch all users with their content counts
    const { data: users, error: usersError, count } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        created_at,
        updated_at,
        is_admin
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (usersError) throw usersError

    // For each user, get their content counts
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Count sites
        const { count: sitesCount } = await supabase
          .from('sites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        // Count plans
        const { count: plansCount } = await supabase
          .from('plans')
          .select('*, sites!inner(*)', { count: 'exact', head: true })
          .eq('sites.user_id', user.id)

        // Count beds
        const { count: bedsCount } = await supabase
          .from('beds')
          .select('*, plans!inner(*, sites!inner(*))', { count: 'exact', head: true })
          .eq('plans.sites.user_id', user.id)

        // Count plantings
        const { count: plantingsCount } = await supabase
          .from('plantings')
          .select('*, beds!inner(*, plans!inner(*, sites!inner(*)))', { count: 'exact', head: true })
          .eq('beds.plans.sites.user_id', user.id)

        // Count journal entries
        const { count: journalCount } = await supabase
          .from('journal_entries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        return {
          ...user,
          stats: {
            sites: sitesCount || 0,
            plans: plansCount || 0,
            beds: bedsCount || 0,
            plantings: plantingsCount || 0,
            journalEntries: journalCount || 0,
          },
        }
      })
    )

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}