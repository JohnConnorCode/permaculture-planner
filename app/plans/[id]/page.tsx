import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Grid3x3, Package, Leaf, Droplets, Calendar, AlertCircle } from 'lucide-react'

export default async function PlanPage({ params }: { params: { id: string } }) {
  // For demo purposes, showing static content
  // In production, fetch from Supabase using the plan ID
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-garden-green mb-2">
            Your Garden Plan
          </h1>
          <p className="text-gray-600">
            Plan ID: {params.id}
          </p>
        </div>

        {/* Success Alert */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Plan Generated Successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Your customized permaculture plan has been created. Review the tabs below for your complete garden design.
                </p>
              </div>
            </div>
          </div>
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
                  Optimized bed placement for your space
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Demo beds */}
                    <div className="bg-green-200 border-2 border-green-600 rounded p-4">
                      <div className="font-semibold">Bed 1</div>
                      <div className="text-sm">4' x 8' raised bed</div>
                      <div className="text-xs text-gray-600">North-South orientation</div>
                    </div>
                    <div className="bg-green-200 border-2 border-green-600 rounded p-4">
                      <div className="font-semibold">Bed 2</div>
                      <div className="text-sm">4' x 8' raised bed</div>
                      <div className="text-xs text-gray-600">With trellis</div>
                    </div>
                    <div className="bg-green-200 border-2 border-green-600 rounded p-4">
                      <div className="font-semibold">Bed 3</div>
                      <div className="text-sm">3' x 6' raised bed</div>
                      <div className="text-xs text-gray-600">Accessibility design</div>
                    </div>
                    <div className="bg-blue-100 border-2 border-blue-400 rounded p-4">
                      <div className="font-semibold">Bed 4</div>
                      <div className="text-sm">3' x 6' wicking bed</div>
                      <div className="text-xs text-gray-600">Sub-irrigated</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Total bed area:</span> 88 sq ft
                  </div>
                  <div>
                    <span className="font-semibold">Path area:</span> 32 sq ft
                  </div>
                  <div>
                    <span className="font-semibold">Efficiency:</span> 73%
                  </div>
                  <div>
                    <span className="font-semibold">Number of beds:</span> 4
                  </div>
                </div>
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
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Soil & Amendments</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• 3 cubic yards raised bed soil mix</li>
                      <li>• 1 cubic yard compost</li>
                      <li>• 2 cubic yards wood mulch</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Lumber & Hardware</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• 12 - 2x10x8' cedar boards</li>
                      <li>• 8 - 2x10x12' cedar boards</li>
                      <li>• 16 corner brackets</li>
                      <li>• 96 exterior screws (2.5")</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Irrigation</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• 100 ft - 1/4" drip line</li>
                      <li>• 32 - 0.5 GPH emitters</li>
                      <li>• 20 ft - 1/2" main line</li>
                      <li>• 1 - Two-zone hose timer</li>
                    </ul>
                  </div>
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <div className="font-semibold">Estimated Cost</div>
                    <div className="text-2xl font-bold text-garden-green">$850 - $1,275</div>
                  </div>
                </div>
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
                  Crop rotation for maximum yields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Spring Planting</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Bed 1:</span> Lettuce, Spinach (Asteraceae)
                      </div>
                      <div>
                        <span className="font-medium">Bed 2:</span> Peas on trellis (Fabaceae)
                      </div>
                      <div>
                        <span className="font-medium">Bed 3:</span> Broccoli, Kale (Brassicaceae)
                      </div>
                      <div>
                        <span className="font-medium">Bed 4:</span> Carrots, Parsley (Apiaceae)
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Summer Transition</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Bed 1:</span> Tomatoes, Basil (Solanaceae)
                      </div>
                      <div>
                        <span className="font-medium">Bed 2:</span> Pole beans on trellis (Fabaceae)
                      </div>
                      <div>
                        <span className="font-medium">Bed 3:</span> Summer squash (Cucurbitaceae)
                      </div>
                      <div>
                        <span className="font-medium">Bed 4:</span> Swiss chard (Amaranthaceae)
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-sm">
                    <p className="font-semibold text-blue-900">Rotation Note:</p>
                    <p className="text-blue-700">Families are rotated to prevent disease buildup and optimize soil nutrition.</p>
                  </div>
                </div>
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
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Zone Configuration</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <span className="font-medium">Zone 1:</span> Beds 1-2 (standard drip)
                        <br />Runtime: 30 min, 3x per week in summer
                      </li>
                      <li>
                        <span className="font-medium">Zone 2:</span> Bed 3 (standard drip)
                        <br />Runtime: 30 min, 3x per week in summer
                      </li>
                      <li>
                        <span className="font-medium">Bed 4:</span> Wicking bed (manual fill)
                        <br />Fill weekly in summer, bi-weekly in spring/fall
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 rounded text-sm">
                    <p className="font-semibold text-green-900">Water Savings:</p>
                    <p className="text-green-700">Drip irrigation uses 50% less water than sprinklers. Wicking beds reduce water use by up to 80%.</p>
                  </div>
                </div>
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Purchase lumber and hardware</div>
                      <div className="text-sm text-gray-600">Build phase</div>
                    </div>
                    <div className="text-sm text-gray-500">In 3 days</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Assemble raised beds</div>
                      <div className="text-sm text-gray-600">Build phase</div>
                    </div>
                    <div className="text-sm text-gray-500">In 7 days</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Fill beds with soil mix</div>
                      <div className="text-sm text-gray-600">Build phase</div>
                    </div>
                    <div className="text-sm text-gray-500">In 10 days</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Install drip irrigation</div>
                      <div className="text-sm text-gray-600">Build phase</div>
                    </div>
                    <div className="text-sm text-gray-500">In 2 weeks</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Plant first crops</div>
                      <div className="text-sm text-gray-600">Planting phase</div>
                    </div>
                    <div className="text-sm text-gray-500">In 3 weeks</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button className="bg-garden-green hover:bg-green-700">
            Download PDF
          </Button>
          <Button variant="outline">
            Edit Plan
          </Button>
          <Button variant="outline">
            Share Plan
          </Button>
        </div>
      </div>
    </div>
  )
}