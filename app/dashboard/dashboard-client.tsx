'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Leaf,
  Plus,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface DashboardClientProps {
  user: User
  plans: any[]
}

export default function DashboardClient({ user, plans }: DashboardClientProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return

    const { error } = await (supabase as any)
      .from('plans')
      .delete()
      .eq('id', planId)

    if (!error) {
      router.refresh()
    }
  }

  const getPlanStatusBadge = (status: string) => {
    const badges = {
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      archived: { color: 'bg-gray-100 text-gray-800', icon: null }
    }

    const badge = badges[status as keyof typeof badges] || badges.draft
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {Icon && <Icon className="mr-1 h-3 w-3" />}
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold">Permaculture Planner</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                disabled={loading}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{plans.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {plans.filter(p => p.status === 'active').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {plans.reduce((acc, p) => acc + (p.beds?.[0]?.count || 0), 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {plans.reduce((acc, p) => acc + (p.tasks?.[0]?.count || 0), 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Garden Plans</h2>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/wizard">
              <Plus className="mr-2 h-4 w-4" />
              New Plan
            </Link>
          </Button>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Leaf className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No plans yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                Start planning your permaculture garden by creating your first plan.
              </p>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/wizard">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Plan
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {plan.sites?.name || 'Unknown Location'}
                      </CardDescription>
                    </div>
                    {getPlanStatusBadge(plan.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Beds</span>
                      <span className="font-medium">{plan.beds?.[0]?.count || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tasks</span>
                      <span className="font-medium">{plan.tasks?.[0]?.count || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created</span>
                      <span className="font-medium">
                        {new Date(plan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full flex-1" asChild>
                      <Link href={`/plans/${plan.id}`}>
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full flex-1" asChild>
                      <Link href={`/editor/${plan.id}`}>
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/tasks')}>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                Tasks & Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View and manage all your garden tasks in one place
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/crops')}>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Leaf className="mr-2 h-5 w-5 text-green-600" />
                Crop Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Browse and learn about different crops for your garden
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/journal')}>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Edit className="mr-2 h-5 w-5 text-green-600" />
                Garden Journal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track your garden's progress and log observations
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}