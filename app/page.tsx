import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerClientReadOnly } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Leaf, Grid3x3, Droplets, Calendar, BarChart3, Bot,
  ArrowRight, Sparkles, TreePine, Flower2, Sprout,
  CheckCircle, TrendingUp, Users, Globe
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createServerClientReadOnly()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden py-24 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-green-200 opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-green-300 opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-green-100 opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-green-700" />
              <span className="text-sm font-medium text-green-700">AI-Powered Garden Planning</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              Grow Your Perfect
              <br />
              Permaculture Garden
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-3xl mx-auto">
              Transform any space into a thriving garden ecosystem. Our AI designs custom raised-bed layouts
              for soil, concrete, rooftops—anywhere you dream of growing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/wizard">
                <Button size="lg" className="gradient-green text-white font-semibold px-8 py-6 text-lg hover-lift group">
                  <Leaf className="mr-2 h-5 w-5" />
                  Start Planning Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg hover-glow border-green-300">
                  <TreePine className="mr-2 h-5 w-5" />
                  View Demo Garden
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <span>Join 5,000+ gardeners</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                <span>Works in any climate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with animations */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Everything You Need to
              <span className="text-green-600"> Grow & Thrive</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From planning to harvest, we've got you covered with smart tools and expert guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-lift border-green-100 group animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="p-3 bg-green-100 rounded-xl w-fit group-hover:bg-green-200 transition-colors">
                  <Grid3x3 className="h-8 w-8 text-green-700" />
                </div>
                <CardTitle className="text-xl mt-4">Smart Layout Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI optimizes bed placement for maximum yield. Considers sun exposure,
                  accessibility, and companion planting relationships automatically.
                </CardDescription>
                <div className="mt-4 flex items-center text-green-600 font-medium">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  30% more yield vs manual planning
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-green-100 group animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="p-3 bg-green-100 rounded-xl w-fit group-hover:bg-green-200 transition-colors">
                  <BarChart3 className="h-8 w-8 text-green-700" />
                </div>
                <CardTitle className="text-xl mt-4">Materials Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get precise quantities for soil, lumber, and irrigation.
                  Optimized shopping lists save you time and money.
                </CardDescription>
                <div className="mt-4 flex items-center text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Zero waste guarantee
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-green-100 group animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="p-3 bg-green-100 rounded-xl w-fit group-hover:bg-green-200 transition-colors">
                  <Calendar className="h-8 w-8 text-green-700" />
                </div>
                <CardTitle className="text-xl mt-4">Crop Rotation Planner</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  3-year rotation schedules prevent disease and maintain soil health.
                  Succession planting for continuous harvests.
                </CardDescription>
                <div className="mt-4 flex items-center text-green-600 font-medium">
                  <Flower2 className="h-4 w-4 mr-2" />
                  4-season growing plans
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-green-100 group animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="p-3 bg-green-100 rounded-xl w-fit group-hover:bg-green-200 transition-colors">
                  <Droplets className="h-8 w-8 text-green-700" />
                </div>
                <CardTitle className="text-xl mt-4">Water-Smart Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Drip irrigation layouts and wicking beds cut water use by 70%.
                  Perfect for drought-prone areas and water restrictions.
                </CardDescription>
                <div className="mt-4 flex items-center text-green-600 font-medium">
                  <Sprout className="h-4 w-4 mr-2" />
                  70% less water usage
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-green-100 group animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <div className="p-3 bg-green-100 rounded-xl w-fit group-hover:bg-green-200 transition-colors">
                  <Leaf className="h-8 w-8 text-green-700" />
                </div>
                <CardTitle className="text-xl mt-4">Natural Pest Control</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Companion planting and beneficial insect habitats.
                  Reduce pesticide needs by 90% with integrated management.
                </CardDescription>
                <div className="mt-4 flex items-center text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  100% organic methods
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-green-100 group animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <div className="p-3 bg-green-100 rounded-xl w-fit group-hover:bg-green-200 transition-colors">
                  <Bot className="h-8 w-8 text-green-700" />
                </div>
                <CardTitle className="text-xl mt-4">AI Garden Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get instant answers based on extension service research.
                  Troubleshoot problems and optimize your garden year-round.
                </CardDescription>
                <div className="mt-4 flex items-center text-green-600 font-medium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  24/7 expert guidance
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases with better visuals */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Perfect For <span className="text-green-600">Any Space</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you have a tiny balcony or acres of land, we'll design the perfect garden for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 hover-lift animate-slide-in-left">
              <div className="text-center">
                <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                  <svg className="h-12 w-12 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-bold text-2xl mb-4 text-gray-900">Urban Balcony</h3>
                <ul className="space-y-2 text-gray-700 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    100-200 sq ft on concrete
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    2-3 wicking beds included
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    Herbs & salad greens focus
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    Drip irrigation ready
                  </li>
                </ul>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                  <svg className="h-12 w-12 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="font-bold text-2xl mb-4 text-gray-900">Suburban Yard</h3>
                <ul className="space-y-2 text-gray-700 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    400-800 sq ft on soil
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    4-6 raised beds layout
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    Full vegetable variety
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    3-year rotation plan
                  </li>
                </ul>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 hover-lift animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                  <svg className="h-12 w-12 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-2xl mb-4 text-gray-900">Quarter Acre+</h3>
                <ul className="space-y-2 text-gray-700 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    Zone-based design system
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    Beds + orchard planning
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    Rainwater capture sizing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    Complete food system
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials or Stats */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-bold text-green-600 mb-2">5,000+</div>
              <div className="text-gray-600">Happy Gardeners</div>
            </div>
            <div className="animate-bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-bold text-green-600 mb-2">30%</div>
              <div className="text-gray-600">More Yield</div>
            </div>
            <div className="animate-bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-5xl font-bold text-green-600 mb-2">70%</div>
              <div className="text-gray-600">Less Water</div>
            </div>
            <div className="animate-bounce-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-5xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Organic</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with gradient */}
      <section className="gradient-green py-24 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Garden Journey Today
          </h2>
          <p className="text-xl mb-8 text-green-50">
            Join thousands of gardeners growing their own food sustainably.
            Get your personalized plan in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/wizard">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 px-8 py-6 text-lg hover-lift">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Free Garden Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700 px-8 py-6 text-lg">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}