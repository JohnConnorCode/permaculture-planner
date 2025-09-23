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

interface GardenDesign {
  id: string
  name: string
  beds: any[]
  timestamp: number
  thumbnail?: string
  stats: {
    plants: number
    varieties: number
    area: number
    beds: number
  }
}

interface UserData {
  email: string
  name: string
  id: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [designs, setDesigns] = useState<GardenDesign[]>([])
  const [activeTab, setActiveTab] = useState('designs')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load saved designs
    const savedDesigns = localStorage.getItem('gardenDesigns')
    if (savedDesigns) {
      const designs = JSON.parse(savedDesigns)
      // Add mock stats if not present
      const designsWithStats = designs.map((design: any) => ({
        ...design,
        id: design.id || Math.random().toString(36).substr(2, 9),
        stats: design.stats || {
          plants: Math.floor(Math.random() * 50) + 10,
          varieties: Math.floor(Math.random() * 15) + 5,
          area: Math.floor(Math.random() * 500) + 100,
          beds: Math.floor(Math.random() * 8) + 2
        }
      }))
      setDesigns(designsWithStats)
    }

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  const deleteDesign = (id: string) => {
    if (confirm('Are you sure you want to delete this garden design?')) {
      const updatedDesigns = designs.filter(d => d.id !== id)
      setDesigns(updatedDesigns)
      localStorage.setItem('gardenDesigns', JSON.stringify(updatedDesigns))
    }
  }

  const exportDesign = (design: GardenDesign) => {
    const dataStr = JSON.stringify(design, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${design.name.replace(/\s+/g, '-')}-${Date.now()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Calculate user stats
  const userStats = {
    totalDesigns: designs.length,
    totalPlants: designs.reduce((sum, d) => sum + d.stats.plants, 0),
    totalArea: designs.reduce((sum, d) => sum + d.stats.area, 0),
    avgYield: Math.floor(Math.random() * 200) + 100,
    level: Math.min(Math.floor(designs.length / 3) + 1, 10),
    points: designs.length * 100 + designs.reduce((sum, d) => sum + d.stats.plants * 2, 0)
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
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
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
            <Link href="/demo">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                New Design
              </Button>
            </Link>
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
            {designs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Trees className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No designs yet</h3>
                  <p className="text-gray-600 mb-6">Start creating your first permaculture system</p>
                  <Link href="/demo">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Design
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map((design, index) => (
                  <Card key={design.id} className="overflow-hidden hover:shadow-lg transition-shadow opacity-0 animate-scale-in" style={{ animationDelay: `${0.7 + index * 0.1}s`, animationFillMode: 'forwards' }}>
                    <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Trees className="h-16 w-16 text-green-600/30" />
                      </div>
                      <Badge className="absolute top-3 right-3">
                        {design.stats.beds} beds
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{design.name}</CardTitle>
                      <CardDescription>
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(design.timestamp).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span>{design.stats.plants} plants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trees className="h-4 w-4 text-green-600" />
                          <span>{design.stats.varieties} varieties</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <Map className="h-4 w-4 text-green-600" />
                          <span>{design.stats.area} sq ft</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Link href="/demo" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => exportDesign(design)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDesign(design.id)}
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
                { icon: Leaf, title: 'First Steps', desc: 'Create your first design', earned: true, progress: 100 },
                { icon: Trees, title: 'System Designer', desc: 'Create 5 complete systems', earned: false, progress: (designs.length / 5) * 100 },
                { icon: Users, title: 'Community Member', desc: 'Share a permaculture design', earned: false, progress: 0 },
                { icon: Award, title: 'Master Planner', desc: 'Plant 100+ plants', earned: false, progress: Math.min((userStats.totalPlants / 100) * 100, 100) },
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