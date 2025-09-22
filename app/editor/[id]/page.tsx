import { createServerClientReadOnly } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VisualEditor from '../visual-editor'

export default async function EditorPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClientReadOnly()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch plan with all related data
  const { data: plan, error } = await (supabase as any)
    .from('plans')
    .select(`
      *,
      sites(*),
      beds(*),
      materials_estimates(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !plan) {
    redirect('/dashboard')
  }

  // Check ownership
  if (plan.sites.user_id !== user.id) {
    redirect('/dashboard')
  }

  return <VisualEditor plan={plan} />
}