import { createServerClientReadOnly } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createServerClientReadOnly()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user's plans
  const { data: plans } = await (supabase as any)
    .from('plans')
    .select(`
      *,
      sites!inner(*),
      beds(count),
      tasks(count)
    `)
    .eq('sites.user_id', user.id)
    .order('created_at', { ascending: false })

  return <DashboardClient user={user} plans={plans || []} />
}