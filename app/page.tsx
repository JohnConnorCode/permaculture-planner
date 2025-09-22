'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Leaf, Grid3x3, Droplets, Calendar, BarChart3, Bot,
  ArrowRight, Sparkles, TreePine, Flower2, Sprout,
  CheckCircle, TrendingUp, Globe, Zap, Shield,
  Sun, Cloud, Wind, Home, Building, Trees
} from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section with Sequential Animations */}
      <section className="gradient-hero relative overflow-hidden py-24 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-green-200 opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-green-300 opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-green-100 opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge with fade-in */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-green-700" />
              <span className="text-sm font-medium text-green-700">AI-Powered Garden Planning</span>
            </div>
          </div>

          {/* Title with sequential fade-in */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 opacity-0 animate-fade-in"
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              Design Your Perfect
            </span>
            <br />
            <span className="opacity-0 animate-fade-in inline-block"
                  style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Permaculture Garden
            </span>
          </h1>

          {/* Description with fade-in */}
          <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-3xl mx-auto opacity-0 animate-fade-in"
             style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            Transform any space into a thriving food garden. Our smart AI creates custom
            raised-bed layouts optimized for your space, climate, and growing goals.
          </p>

          {/* CTA Buttons with staggered animation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="opacity-0 animate-slide-in-left"
                 style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
              <Link href="/wizard">
                <Button size="lg" className="gradient-green text-white font-semibold px-8 py-6 text-lg hover-lift group w-full sm:w-auto">
                  <Leaf className="mr-2 h-5 w-5" />
                  Start Your Garden Plan
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="opacity-0 animate-slide-in-right"
                 style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg hover-glow border-green-300 w-full sm:w-auto">
                  <TreePine className="mr-2 h-5 w-5" />
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>

          {/* Benefits with sequential fade-in */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2 opacity-0 animate-fade-in"
                 style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}>
              <Zap className="h-5 w-5 text-green-600" />
              <span>Generate plans in seconds</span>
            </div>
            <div className="flex items-center gap-2 opacity-0 animate-fade-in"
                 style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
              <Shield className="h-5 w-5 text-green-600" />
              <span>Science-based recommendations</span>
            </div>
            <div className="flex items-center gap-2 opacity-0 animate-fade-in"
                 style={{ animationDelay: '1.7s', animationFillMode: 'forwards' }}>
              <Globe className="h-5 w-5 text-green-600" />
              <span>Localized for your climate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Sequential Animations */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 opacity-0 animate-fade-in"
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Smart Tools for
              <span className="text-green-600"> Growing Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto opacity-0 animate-fade-in"
               style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              Everything you need to plan, plant, and maintain a thriving permaculture garden
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Grid3x3,
                title: "Intelligent Layout Design",
                description: "AI optimizes bed placement for sun exposure, accessibility, and companion planting relationships.",
                benefit: "Maximize your growing space",
                delay: "0.1s"
              },
              {
                icon: BarChart3,
                title: "Precise Materials Planning",
                description: "Calculate exact quantities for soil, lumber, and irrigation. Get optimized shopping lists.",
                benefit: "Save time and money",
                delay: "0.2s"
              },
              {
                icon: Calendar,
                title: "Smart Crop Rotation",
                description: "Automated 3-year rotation schedules that prevent disease and maintain soil health.",
                benefit: "Year-round harvests",
                delay: "0.3s"
              },
              {
                icon: Droplets,
                title: "Water-Efficient Design",
                description: "Drip irrigation layouts and wicking bed designs that reduce water use dramatically.",
                benefit: "Drought-resistant gardens",
                delay: "0.4s"
              },
              {
                icon: Leaf,
                title: "Organic Pest Management",
                description: "Companion planting guides and natural pest control strategies that really work.",
                benefit: "Chemical-free growing",
                delay: "0.5s"
              },
              {
                icon: Bot,
                title: "Garden Assistant AI",
                description: "Get instant answers to your gardening questions based on agricultural research.",
                benefit: "Expert guidance 24/7",
                delay: "0.6s"
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover-lift border-green-100 group opacity-0 animate-scale-in"
                style={{ animationDelay: feature.delay, animationFillMode: 'forwards' }}
              >
                <CardHeader>
                  <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl w-fit group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-green-700" />
                  </div>
                  <CardTitle className="text-xl mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-3">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center text-green-600 font-medium text-sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {feature.benefit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect For Section with Icons */}
      <section className="py-20 px-4 bg-gradient-to-b from-white via-green-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 opacity-0 animate-fade-in"
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Works Anywhere You Want to
              <span className="text-green-600"> Grow</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto opacity-0 animate-fade-in"
               style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              From tiny balconies to backyard homesteads, we adapt to your space
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building,
                title: "Urban Spaces",
                subtitle: "Balconies & Rooftops",
                items: [
                  "Container garden layouts",
                  "Vertical growing systems",
                  "Wicking bed designs",
                  "Microgreen setups"
                ],
                delay: "0.5s"
              },
              {
                icon: Home,
                title: "Suburban Gardens",
                subtitle: "Yards & Patios",
                items: [
                  "Raised bed configurations",
                  "Companion planting maps",
                  "Seasonal rotation plans",
                  "Irrigation system designs"
                ],
                delay: "0.7s"
              },
              {
                icon: Trees,
                title: "Large Plots",
                subtitle: "Homesteads & Farms",
                items: [
                  "Zone-based permaculture",
                  "Food forest planning",
                  "Water harvesting systems",
                  "Perennial integration"
                ],
                delay: "0.9s"
              }
            ].map((space, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-8 hover-lift opacity-0 animate-slide-in-left"
                style={{ animationDelay: space.delay, animationFillMode: 'forwards' }}
              >
                <div className="text-center">
                  <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4">
                    <space.icon className="h-12 w-12 text-green-700" />
                  </div>
                  <h3 className="font-bold text-2xl mb-2 text-gray-900">{space.title}</h3>
                  <p className="text-green-600 font-medium mb-6">{space.subtitle}</p>
                  <ul className="space-y-3 text-gray-700 text-left">
                    {space.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Climate Adaptability Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 opacity-0 animate-fade-in"
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Optimized for Your Climate
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto opacity-0 animate-fade-in"
               style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              Our AI adapts recommendations based on your specific growing conditions
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Sun, label: "Hot & Dry", desc: "Heat-tolerant varieties", delay: "0.5s" },
              { icon: Cloud, label: "Cool & Wet", desc: "Drainage solutions", delay: "0.6s" },
              { icon: Wind, label: "Windy Areas", desc: "Windbreak planning", delay: "0.7s" },
              { icon: Flower2, label: "Short Season", desc: "Fast-growing crops", delay: "0.8s" }
            ].map((climate, index) => (
              <div
                key={index}
                className="opacity-0 animate-bounce-in"
                style={{ animationDelay: climate.delay, animationFillMode: 'forwards' }}
              >
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100 hover:border-green-300 transition-all">
                  <climate.icon className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900">{climate.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{climate.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-green py-24 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 opacity-0 animate-fade-in"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Ready to Grow Your Own Food?
          </h2>
          <p className="text-xl mb-8 text-green-50 opacity-0 animate-fade-in"
             style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Join gardeners worldwide who are growing healthier, more sustainable food at home.
            Start with our free garden planning wizard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="opacity-0 animate-scale-in"
                 style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <Link href="/wizard">
                <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 px-8 py-6 text-lg hover-lift">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Planning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="opacity-0 animate-scale-in"
                 style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700 px-8 py-6 text-lg">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}