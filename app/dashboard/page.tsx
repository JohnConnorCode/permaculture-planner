'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Plus, Download, Share2, Trash2, Edit, Eye, Clock,
  Leaf, Trees, Droplets, Sun, Calendar, TrendingUp,
  Settings, LogOut, User, Grid3x3, BarChart, Map,
  Star, Heart, MessageCircle, Users, Award
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type Plan = Database['public']['Tables']['plans']['Row']
type Site = Database['public']['Tables']['sites']['Row']
type Bed = Database['public']['Tables']['beds']['Row']
type MaterialsEstimate = Database['public']['Tables']['materials_estimates']['Row']

interface PlanWithStats extends Plan {
  site: Site
  beds: Bed[]
  materials_estimates: MaterialsEstimate | null
  stats: {
    plants: number
    varieties: number
    area: number
    beds: number
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<Database['public']['Tables']['users']['Row'] | null>(null)
  const [plans, setPlans] = useState<PlanWithStats[]>([])
  const [activeTab, setActiveTab] = useState('designs')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserData() {
      try {
        const supabase = createClient()

        // Get current user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError || !authUser) {
          router.push('/auth/login')
          return
        }

        // Get or create user profile
        const { data: userProfile, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (userError && userError.code === 'PGRST116') {
          // User doesn't exist, create profile
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email!,
              name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User'
            } as any)
            .select()
            .single()

          if (createError) {
            setError('Failed to create user profile')
            setLoading(false)
            return
          }
          setUser(newUser)
        } else if (userError) {
          setError('Failed to load user data')
          setLoading(false)
          return
        } else {
          setUser(userProfile)
        }

        // First fetch user's sites
        const { data: sitesData, error: sitesError } = await supabase
          .from('sites')
          .select('id')
          .eq('user_id', authUser.id)

        if (sitesError) {
          console.error('Error fetching sites:', sitesError)
          setError('Failed to load sites')
          setLoading(false)
          return
        }

        const siteIds = (sitesData as any[])?.map(s => s.id) || []

        // Fetch user's plans with related data
        const { data: plansData, error: plansError } = await supabase
          .from('plans')
          .select(`
            *,
            site:sites(*),
            beds(*),
            materials_estimates(*)
          `)
          .in('site_id', siteIds)
          .order('created_at', { ascending: false })

        if (plansError) {
          console.error('Error fetching plans:', plansError)
          setError('Failed to load plans')
        } else {
          // Calculate stats for each plan
          const plansWithStats: PlanWithStats[] = (plansData || []).map((plan: any) => {
            const beds = plan.beds || []
            const totalArea = beds.reduce((sum: number, bed: Bed) =>
              sum + (bed.length_ft * bed.width_ft), 0
            )

            return {
              ...plan,
              stats: {
                plants: Math.floor(totalArea * 2), // Rough estimate: 2 plants per sq ft
                varieties: Math.min(beds.length * 3, 20), // 3 varieties per bed, max 20
                area: totalArea,
                beds: beds.length
              }
            }
          })
          setPlans(plansWithStats)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const deletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting plan:', error)
        setError('Failed to delete plan')
        return
      }

      // Remove from local state
      setPlans(plans.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting plan:', error)
      setError('Failed to delete plan')
    }
  }

  const exportPlan = (plan: PlanWithStats) => {
    const exportData = {
      plan,
      exportedAt: new Date().toISOString()
    }
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${plan.name.replace(/\s+/g, '-')}-${Date.now()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Calculate user stats
  const userStats = {
    totalDesigns: plans.length,
    totalPlants: plans.reduce((sum, p) => sum + p.stats.plants, 0),
    totalArea: plans.reduce((sum, p) => sum + p.stats.area, 0),
    avgYield: Math.floor(plans.reduce((sum, p) => sum + p.stats.area, 0) * 0.5), // 0.5 kg per sq ft estimate
    level: Math.min(Math.floor(plans.length / 3) + 1, 10),
    points: plans.length * 100 + plans.reduce((sum, p) => sum + p.stats.plants * 2, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="font-bold text-xl">Permaculture Planner</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* User Profile Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Designer'}!
              </h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <Badge className="bg-green-100 text-green-700">
                  <Award className="h-3 w-3 mr-1" />
                  Level {userStats.level} Permaculture Designer
                </Badge>
                <Badge variant="outline">
                  {userStats.points.toLocaleString()} points
                </Badge>
                <Badge variant="outline">
                  {userStats.totalDesigns} gardens
                </Badge>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/demo">
                <Plus className="h-4 w-4 mr-2" />
                New Design
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="opacity-0 animate-scale-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Designs</p>
                  <p className="text-2xl font-bold">{userStats.totalDesigns}</p>
                </div>
                <Grid3x3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-0 animate-scale-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Plants Growing</p>
                  <p className="text-2xl font-bold">{userStats.totalPlants}</p>
                </div>
                <Trees className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-0 animate-scale-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Area</p>
                  <p className="text-2xl font-bold">{userStats.totalArea} ft²</p>
                </div>
                <Map className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-0 animate-scale-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Est. Yield</p>
                  <p className="text-2xl font-bold">{userStats.avgYield} kg</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="designs">My Designs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="designs" className="mt-6">
            {plans.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Trees className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No designs yet</h3>
                  <p className="text-gray-600 mb-6">Start creating your first permaculture system</p>
                  <Button className="bg-green-600 hover:bg-green-700" asChild>
                    <Link href="/demo">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Design
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                  <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow opacity-0 animate-scale-in" style={{ animationDelay: `${0.7 + index * 0.1}s`, animationFillMode: 'forwards' }}>
                    <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Trees className="h-16 w-16 text-green-600/30" />
                      </div>
                      <Badge className="absolute top-3 right-3">
                        {plan.stats.beds} beds
                      </Badge>
                      <Badge className="absolute top-3 left-3" variant={plan.status === 'active' ? 'default' : 'secondary'}>
                        {plan.status}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(plan.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span>{plan.stats.plants} plants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trees className="h-4 w-4 text-green-600" />
                          <span>{plan.stats.varieties} varieties</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <Map className="h-4 w-4 text-green-600" />
                          <span>{plan.stats.area} sq ft</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full flex-1" asChild>
                        <Link href={`/plans/${plan.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => exportPlan(plan)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Plus className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Created new permaculture design</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Earned "First Garden" achievement</p>
                    <p className="text-sm text-gray-600">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Reached Level 2</p>
                    <p className="text-sm text-gray-600">3 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Leaf, title: 'First Steps', desc: 'Create your first design', earned: plans.length > 0, progress: plans.length > 0 ? 100 : 0 },
                { icon: Trees, title: 'System Designer', desc: 'Create 5 complete systems', earned: plans.length >= 5, progress: Math.min((plans.length / 5) * 100, 100) },
                { icon: Users, title: 'Community Member', desc: 'Share a permaculture design', earned: false, progress: 0 },
                { icon: Award, title: 'Master Planner', desc: 'Plant 100+ plants', earned: userStats.totalPlants >= 100, progress: Math.min((userStats.totalPlants / 100) * 100, 100) },
              ].map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <Card key={index} className={`${achievement.earned ? 'bg-green-50 border-green-200' : ''} opacity-0 animate-scale-in`} style={{ animationDelay: `${0.7 + index * 0.1}s`, animationFillMode: 'forwards' }}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          achievement.earned ? 'bg-green-600' : 'bg-gray-200'
                        }`}>
                          <Icon className={`h-6 w-6 ${achievement.earned ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.desc}</p>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}