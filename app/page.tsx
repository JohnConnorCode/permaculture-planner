import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerClientReadOnly } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, Grid3x3, Droplets, Calendar, BarChart3, Bot } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createServerClientReadOnly()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-garden-green">
            Permaculture Planning Made Simple
          </h1>
          <p className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
            Design your perfect raised-bed garden for any surface - soil, gravel, concrete, or rooftops.
            Get AI-powered layouts, material lists, planting schedules, and expert guidance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/wizard">
              <Button size="lg" className="bg-garden-green hover:bg-green-700">
                <Leaf className="mr-2 h-5 w-5" />
                Start Planning
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Grow</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Grid3x3 className="h-8 w-8 text-garden-green mb-2" />
                <CardTitle>Smart Layout Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Optimized bed placement based on your space, sun exposure, and accessibility needs.
                  North-south orientation for even lighting, proper path widths, and trellis placement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-garden-green mb-2" />
                <CardTitle>Materials Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get exact quantities for soil, compost, lumber, and irrigation supplies.
                  Shopping lists optimized for your local stores with cost estimates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-garden-green mb-2" />
                <CardTitle>Crop Rotation Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Science-based rotation schedules preventing disease and maximizing yields.
                  Succession planting for continuous harvests through the seasons.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Droplets className="h-8 w-8 text-garden-green mb-2" />
                <CardTitle>Water-Smart Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Drip irrigation layouts and wicking bed designs for water efficiency.
                  Sub-irrigation options for hard surfaces and water-scarce areas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Leaf className="h-8 w-8 text-garden-green mb-2" />
                <CardTitle>IPM & Companion Planting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Row cover recommendations, beneficial insect habitats, and companion planting guides.
                  Reduce pesticide needs by 50-90% with integrated pest management.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Bot className="h-8 w-8 text-garden-green mb-2" />
                <CardTitle>AI Garden Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get expert advice based on extension service research.
                  Ask questions, get shopping lists, and troubleshoot problems.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For Any Space</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 mb-4">
                <h3 className="font-bold text-lg mb-2">Urban Balcony</h3>
                <p className="text-sm text-gray-600">
                  100-200 sq ft on concrete<br/>
                  2-3 wicking beds<br/>
                  Herbs & salad greens<br/>
                  Drip irrigation ready
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 mb-4">
                <h3 className="font-bold text-lg mb-2">Suburban Yard</h3>
                <p className="text-sm text-gray-600">
                  400-800 sq ft on soil<br/>
                  4-6 raised beds<br/>
                  Full vegetable garden<br/>
                  Rotation planning included
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 mb-4">
                <h3 className="font-bold text-lg mb-2">Quarter Acre</h3>
                <p className="text-sm text-gray-600">
                  Zone-based design<br/>
                  Beds + future orchard<br/>
                  Rain capture sizing<br/>
                  Complete food system
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start Growing Today</h2>
          <p className="text-lg text-gray-600 mb-8">
            Answer a few questions and get your complete permaculture plan in under 5 minutes.
          </p>
          <Link href="/wizard">
            <Button size="lg" className="bg-garden-green hover:bg-green-700">
              <Leaf className="mr-2 h-5 w-5" />
              Create Your Garden Plan
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}