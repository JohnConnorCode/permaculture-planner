import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Grid3x3, Package, Leaf, Droplets, Calendar, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { createServerClientReadOnly } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

type PlanWithDetails = Database['public']['Tables']['plans']['Row'] & {
  site: Database['public']['Tables']['sites']['Row']
  beds: Database['public']['Tables']['beds']['Row'][]
  materials_estimates: Database['public']['Tables']['materials_estimates']['Row'] | null
  irrigation_zones: Database['public']['Tables']['irrigation_zones']['Row'][]
  tasks: Database['public']['Tables']['tasks']['Row'][]
  plantings: (Database['public']['Tables']['plantings']['Row'] & {
    bed: Database['public']['Tables']['beds']['Row']
  })[]
}

export default async function PlanPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClientReadOnly()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login?redirectTo=' + encodeURIComponent(`/plans/${params.id}`))
  }

  // Fetch plan with all related data
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select(`
      *,
      site:sites(*),
      beds(*),
      materials_estimates(*),
      irrigation_zones(*),
      tasks(*),
      plantings(*, bed:beds(*))
    `)
    .eq('id', params.id)
    .single()

  if (planError || !plan) {
    console.error('Error fetching plan:', planError)
    notFound()
  }

  const planWithDetails = plan as PlanWithDetails

  // Verify user has access to this plan
  if (planWithDetails.site.user_id !== user.id) {
    notFound()
  }
  
  // Calculate stats
  const totalArea = planWithDetails.beds.reduce((sum, bed) =>
    sum + (bed.length_ft * bed.width_ft), 0
  )

  const stats = {
    totalBeds: planWithDetails.beds.length,
    totalArea,
    totalPlants: Math.floor(totalArea * 2), // Estimate 2 plants per sq ft
    completedTasks: planWithDetails.tasks.filter(t => t.completed).length,
    totalTasks: planWithDetails.tasks.length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Badge variant={planWithDetails.status === 'active' ? 'default' : 'secondary'}>
              {planWithDetails.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            {planWithDetails.name}
          </h1>
          <p className="text-gray-600">
            Site: {planWithDetails.site.name} • Created: {new Date(planWithDetails.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.totalBeds}</div>
              <p className="text-sm text-gray-600">Garden Beds</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{Math.round(stats.totalArea)}</div>
              <p className="text-sm text-gray-600">Total Area (sq ft)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.totalPlants}</div>
              <p className="text-sm text-gray-600">Est. Plants</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.completedTasks}/{stats.totalTasks}</div>
              <p className="text-sm text-gray-600">Tasks Complete</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="layout" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="planting">Planting</TabsTrigger>
            <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Grid3x3 className="h-5 w-5 mr-2" />
                  Garden Layout
                </CardTitle>
                <CardDescription>
                  Your garden bed configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {planWithDetails.beds.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Grid3x3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No beds configured yet</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-100 rounded-lg p-8 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {planWithDetails.beds.map((bed, index) => (
                          <div
                            key={bed.id}
                            className={`rounded p-4 border-2 ${
                              bed.wicking
                                ? 'bg-blue-100 border-blue-400'
                                : 'bg-green-200 border-green-600'
                            }`}
                          >
                            <div className="font-semibold">{bed.name}</div>
                            <div className="text-sm">
                              {bed.length_ft}' x {bed.width_ft}'
                              {bed.shape === 'rect' ? ' raised bed' : ` ${bed.shape} bed`}
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>{bed.orientation === 'NS' ? 'North-South' : 'East-West'} orientation</div>
                              {bed.trellis && <div>With trellis</div>}
                              {bed.wicking && <div>Sub-irrigated wicking bed</div>}
                              {bed.height_in && <div>{bed.height_in}" height</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Total bed area:</span> {Math.round(stats.totalArea)} sq ft
                      </div>
                      <div>
                        <span className="font-semibold">Number of beds:</span> {stats.totalBeds}
                      </div>
                      <div>
                        <span className="font-semibold">Wicking beds:</span> {planWithDetails.beds.filter(b => b.wicking).length}
                      </div>
                      <div>
                        <span className="font-semibold">With trellis:</span> {planWithDetails.beds.filter(b => b.trellis).length}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Materials List
                </CardTitle>
                <CardDescription>
                  Everything you need to build your garden
                </CardDescription>
              </CardHeader>
              <CardContent>
                {planWithDetails.materials_estimates ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Soil & Amendments</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• {planWithDetails.materials_estimates.soil_cuft} cubic ft raised bed soil mix</li>
                        <li>• {planWithDetails.materials_estimates.compost_cuft} cubic ft compost</li>
                        <li>• {planWithDetails.materials_estimates.mulch_cuft} cubic ft wood mulch</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Lumber & Hardware</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• {planWithDetails.materials_estimates.lumber_boardfeet} board feet lumber</li>
                        <li>• {planWithDetails.materials_estimates.screws_count} exterior screws</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Irrigation</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• {planWithDetails.materials_estimates.drip_line_ft} ft drip line</li>
                        <li>• {planWithDetails.materials_estimates.emitters_count} emitters</li>
                      </ul>
                    </div>
                    {planWithDetails.materials_estimates.row_cover_sqft > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Row Cover</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• {planWithDetails.materials_estimates.row_cover_sqft} sq ft row cover fabric</li>
                        </ul>
                      </div>
                    )}
                    {planWithDetails.materials_estimates.cost_estimate_cents && (
                      <div className="mt-4 p-4 bg-gray-100 rounded">
                        <div className="font-semibold">Estimated Cost</div>
                        <div className="text-2xl font-bold text-green-600">
                          ${(planWithDetails.materials_estimates.cost_estimate_cents / 100).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Materials estimate not available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2" />
                  Planting Plan
                </CardTitle>
                <CardDescription>
                  Your crop rotation schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                {planWithDetails.plantings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Leaf className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No plantings scheduled yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {['spring', 'summer', 'fall', 'winter'].map((season) => {
                      const seasonPlantings = planWithDetails.plantings.filter(p => p.season === season)
                      if (seasonPlantings.length === 0) return null

                      return (
                        <div key={season}>
                          <h4 className="font-semibold mb-2 capitalize">{season} Planting</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {seasonPlantings.map((planting) => (
                              <div key={planting.id} className="p-3 bg-gray-50 rounded">
                                <div className="font-medium">{planting.bed.name}:</div>
                                <div className="text-gray-700">
                                  {planting.variety || planting.crop_id || 'Unknown crop'}
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {planting.family}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {planting.spacing_in}" spacing • {planting.sowing_method}
                                  {planting.target_days_to_maturity && ` • ${planting.target_days_to_maturity} days to maturity`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                    <div className="p-3 bg-blue-50 rounded text-sm">
                      <p className="font-semibold text-blue-900">Rotation Note:</p>
                      <p className="text-blue-700">Families are rotated to prevent disease buildup and optimize soil nutrition.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="irrigation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="h-5 w-5 mr-2" />
                  Irrigation Plan
                </CardTitle>
                <CardDescription>
                  Water-efficient design
                </CardDescription>
              </CardHeader>
              <CardContent>
                {planWithDetails.irrigation_zones.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Droplets className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No irrigation zones configured yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Zone Configuration</h4>
                      <div className="space-y-3">
                        {planWithDetails.irrigation_zones.map((zone, index) => (
                          <div key={zone.id} className="p-3 bg-gray-50 rounded">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Zone {index + 1}:</span>
                              <Badge variant="outline" className="capitalize">
                                {zone.method}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Runtime: {zone.runtime_min_per_week} minutes per week
                            </div>
                            {zone.notes && (
                              <div className="text-sm text-gray-500 mt-1">
                                {zone.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Show wicking beds separately */}
                    {planWithDetails.beds.some(b => b.wicking) && (
                      <div>
                        <h4 className="font-semibold mb-2">Self-Watering Beds</h4>
                        <div className="space-y-2">
                          {planWithDetails.beds.filter(b => b.wicking).map(bed => (
                            <div key={bed.id} className="p-3 bg-blue-50 rounded text-sm">
                              <span className="font-medium">{bed.name}:</span> Wicking bed (manual fill)
                              <br />
                              <span className="text-gray-600">Fill weekly in summer, bi-weekly in spring/fall</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-green-50 rounded text-sm">
                      <p className="font-semibold text-green-900">Water Savings:</p>
                      <p className="text-green-700">
                        Drip irrigation uses 50% less water than sprinklers.
                        {planWithDetails.beds.some(b => b.wicking) && " Wicking beds reduce water use by up to 80%."}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Task Schedule
                </CardTitle>
                <CardDescription>
                  Your garden to-do list
                </CardDescription>
              </CardHeader>
              <CardContent>
                {planWithDetails.tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks scheduled yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {planWithDetails.tasks
                      .sort((a, b) => new Date(a.due_on).getTime() - new Date(b.due_on).getTime())
                      .map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between p-3 rounded ${
                            task.completed
                              ? 'bg-green-50 border border-green-200'
                              : new Date(task.due_on) < new Date()
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex-1">
                            <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="capitalize text-xs">
                                {task.category}
                              </Badge>
                              <div className="text-sm text-gray-600">
                                Due: {new Date(task.due_on).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {task.completed ? (
                              <Badge variant="default" className="bg-green-600">
                                Completed
                              </Badge>
                            ) : new Date(task.due_on) < new Date() ? (
                              <Badge variant="destructive">
                                Overdue
                              </Badge>
                            ) : (
                              <div className="text-sm text-gray-500">
                                {Math.ceil((new Date(task.due_on).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button className="bg-green-600 hover:bg-green-700">
            Download PDF
          </Button>
          <Button variant="outline">
            Edit Plan
          </Button>
          <Button variant="outline">
            Share Plan
          </Button>
          <Button variant="outline" onClick={() => {
            const exportData = {
              plan: planWithDetails,
              exportedAt: new Date().toISOString()
            }
            const dataStr = JSON.stringify(exportData, null, 2)
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
            const exportFileDefaultName = `${planWithDetails.name.replace(/\s+/g, '-')}-${Date.now()}.json`

            const linkElement = document.createElement('a')
            linkElement.setAttribute('href', dataUri)
            linkElement.setAttribute('download', exportFileDefaultName)
            linkElement.click()
          }}>
            Export JSON
          </Button>
        </div>
      </div>
    </div>
  )
}