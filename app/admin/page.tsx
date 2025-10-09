'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/metric-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Users, UserPlus, MapPin, FileText, Grid, Sprout,
  CheckSquare, BookOpen, Package
} from 'lucide-react'

interface UserStats {
  total_users: number
  users_last_7_days: number
  users_last_30_days: number
}

interface ContentStats {
  total_sites: number
  total_plans: number
  total_beds: number
  total_plantings: number
  total_tasks: number
  total_journal_entries: number
  total_harvests: number
}

interface Activity {
  activity_type: string
  user_id: string
  email: string
  timestamp: string
  entity_id: string | null
}

interface UserGrowth {
  date: string
  count: number
}

interface AnalyticsData {
  userStats: UserStats
  contentStats: ContentStats
  recentActivity: Activity[]
  userGrowth: UserGrowth[]
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/analytics')

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required')
        }
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-red-50 border-red-200">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchAnalytics} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  if (!analytics) return null

  const activityTypeLabels: Record<string, string> = {
    user_signup: 'User Signup',
    site_created: 'Site Created',
    plan_created: 'Plan Created',
  }

  const activityTypeColors: Record<string, string> = {
    user_signup: 'bg-blue-100 text-blue-800',
    site_created: 'bg-green-100 text-green-800',
    plan_created: 'bg-purple-100 text-purple-800',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor user activity and platform analytics</p>
      </div>

      {/* User Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Total Users"
            value={analytics.userStats.total_users}
            icon={Users}
            trend="stable"
          />
          <MetricCard
            label="New Users (7 days)"
            value={analytics.userStats.users_last_7_days}
            icon={UserPlus}
            trend="up"
          />
          <MetricCard
            label="New Users (30 days)"
            value={analytics.userStats.users_last_30_days}
            icon={UserPlus}
            trend="up"
          />
        </div>
      </div>

      {/* Content Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Content Created</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <MetricCard
            label="Sites"
            value={analytics.contentStats.total_sites}
            icon={MapPin}
            trend="stable"
          />
          <MetricCard
            label="Plans"
            value={analytics.contentStats.total_plans}
            icon={FileText}
            trend="stable"
          />
          <MetricCard
            label="Beds"
            value={analytics.contentStats.total_beds}
            icon={Grid}
            trend="stable"
          />
          <MetricCard
            label="Plantings"
            value={analytics.contentStats.total_plantings}
            icon={Sprout}
            trend="stable"
          />
          <MetricCard
            label="Tasks"
            value={analytics.contentStats.total_tasks}
            icon={CheckSquare}
            trend="stable"
          />
          <MetricCard
            label="Journal Entries"
            value={analytics.contentStats.total_journal_entries}
            icon={BookOpen}
            trend="stable"
          />
          <MetricCard
            label="Harvests"
            value={analytics.contentStats.total_harvests}
            icon={Package}
            trend="stable"
          />
        </div>
      </div>

      {/* User Growth Chart */}
      {analytics.userGrowth && analytics.userGrowth.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Growth (Last 30 Days)</h2>
          <Card className="p-6">
            <div className="space-y-2">
              {analytics.userGrowth.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{day.date}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 bg-green-500 rounded"
                      style={{ width: `${day.count * 20}px`, minWidth: '20px' }}
                    />
                    <span className="text-sm font-medium">{day.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              View All Users
            </Button>
          </Link>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.recentActivity.slice(0, 20).map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={activityTypeColors[activity.activity_type] || 'bg-gray-100 text-gray-800'}>
                        {activityTypeLabels[activity.activity_type] || activity.activity_type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link href="/admin/users">
            <Button>View All Users</Button>
          </Link>
          <Button variant="outline" onClick={fetchAnalytics}>
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  )
}