'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimateOnScroll } from '@/components/animate-on-scroll'
import { ParallaxScroll } from '@/components/parallax-scroll'
import { OnboardingTour, WelcomeBanner, useOnboarding } from '@/components/ui/onboarding'
import { SkipToMain } from '@/components/ui/accessibility'
import { HelpIcon, QuickTooltip, permacultureHelpTips } from '@/components/ui/contextual-help'
import { MobileOptimizedButton } from '@/components/ui/mobile-touch'
import {
  Leaf, Grid3x3, Droplets, Calendar, BarChart3, Bot,
  ArrowRight, Sparkles, TreePine, Flower2, Sprout,
  CheckCircle, TrendingUp, Globe, Zap, Shield,
  Sun, Cloud, Wind, Home, Building, Trees,
  Recycle, Users, Heart, Mountain, Layers,
  ThermometerSun, Compass, CircleDot
} from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const onboarding = useOnboarding()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SkipToMain />

      {/* Welcome Banner for New Users */}
      {onboarding.showWelcome && (
        <div className="relative z-20">
          <WelcomeBanner
            onStartTour={onboarding.startTour}
            onDismiss={onboarding.dismissWelcome}
            className="m-4 mb-0"
          />
        </div>
      )}

      {/* Hero Section with Sequential Animations */}
      <section id="main-content" className="gradient-hero relative overflow-hidden py-24 px-4">
        {/* Animated background elements with parallax */}
        <ParallaxScroll speed={0.3} className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-green-200 opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-green-300 opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </ParallaxScroll>
        <ParallaxScroll speed={0.5} className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-green-100 opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        </ParallaxScroll>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge with fade-in */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg mb-6 hover-nature">
              <CircleDot className="h-4 w-4 text-green-700" />
              <span className="text-sm font-medium text-green-700">Complete Permaculture Design System</span>
            </div>
          </div>

          {/* Title with sequential fade-in */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 opacity-0 animate-fade-in"
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              Design Regenerative
            </span>
            <br />
            <span className="opacity-0 animate-fade-in inline-block"
                  style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Ecosystems
            </span>
          </h1>

          {/* Description with fade-in */}
          <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-3xl mx-auto opacity-0 animate-fade-in"
             style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            Design complete permaculture systems: water harvesting, food forests, energy flows,
            zones, sectors, and guilds. Create abundance while regenerating the land.
          </p>

          {/* CTA Buttons with staggered animation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="opacity-0 animate-slide-in-left"
                 style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
              <QuickTooltip content="Start our guided wizard to create your personalized permaculture design" side="bottom">
                <Link href="/wizard">
                  <MobileOptimizedButton
                    size="lg"
                    className="gradient-understory text-white font-semibold px-8 py-6 text-lg group w-full sm:w-auto rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                    hapticFeedback
                  >
                    <Leaf className="mr-2 h-5 w-5 relative z-10" />
                    <span className="relative z-10">Begin Your Design</span>
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </MobileOptimizedButton>
                </Link>
              </QuickTooltip>
            </div>
            <div className="opacity-0 animate-slide-in-right"
                 style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
              <QuickTooltip content="Explore our complete platform with interactive examples" side="bottom">
                <Link href="/demo">
                  <MobileOptimizedButton
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg border-green-300 w-full sm:w-auto rounded-xl hover:bg-green-50 transition-all duration-300 group hover:border-green-400"
                  >
                    <TreePine className="mr-2 h-5 w-5 group-hover:text-green-600 transition-colors duration-300" />
                    <span className="group-hover:text-green-700 transition-colors duration-300">Explore Platform</span>
                  </MobileOptimizedButton>
                </Link>
              </QuickTooltip>
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
            <AnimateOnScroll animation="animate-fade-in" delay="0.1s">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Holistic Design for
                <span className="text-green-600"> Living Systems</span>
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll animation="animate-fade-in" delay="0.3s">
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Complete permaculture design tools: zones, sectors, water systems, soil building, and energy flows
              </p>
            </AnimateOnScroll>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: "Zone & Sector Analysis",
                description: "Map energy flows, sun patterns, wind, water, and access. Place elements by frequency of use and maintenance needs.",
                benefit: "Optimize energy efficiency",
                delay: "0.1s",
                helpTip: {
                  title: "Permaculture Zones & Sectors",
                  description: "Zones organize your space by frequency of use (Zone 1 = daily access, Zone 5 = wild areas). Sectors identify external energy flows like sun, wind, and water that flow through your land.",
                  type: "info" as const
                }
              },
              {
                icon: Droplets,
                title: "Water Harvesting Systems",
                description: "Design swales, ponds, rain gardens, and greywater systems. Calculate catchment and storage capacity.",
                benefit: "Capture every drop",
                delay: "0.2s",
                helpTip: permacultureHelpTips.waterRetention
              },
              {
                icon: TreePine,
                title: "Food Forest Designer",
                description: "Layer canopy, understory, shrubs, herbs, ground cover, vines, and roots in productive guilds.",
                benefit: "7-layer abundance",
                delay: "0.3s",
                helpTip: permacultureHelpTips.polyculture
              },
              {
                icon: Recycle,
                title: "Soil Building & Composting",
                description: "Design composting systems, vermiculture, and nutrient cycling. Build living soil from waste streams.",
                benefit: "Close the loop",
                delay: "0.4s",
                helpTip: permacultureHelpTips.soilHealth
              },
              {
                icon: ThermometerSun,
                title: "Microclimate Mapping",
                description: "Identify frost pockets, heat sinks, wind tunnels. Use thermal mass and windbreaks strategically.",
                benefit: "Extend growing seasons",
                delay: "0.5s",
                helpTip: {
                  title: "Creating Microclimates",
                  description: "Small areas with unique growing conditions created by topography, structures, and plantings. Use thermal mass, windbreaks, and elevation changes to create warmer or cooler zones.",
                  type: "tip" as const
                }
              },
              {
                icon: Mountain,
                title: "Earthworks & Contouring",
                description: "Design berms, terraces, and keyline systems. Slow, spread, and sink water across your landscape.",
                benefit: "Regenerate landscapes",
                delay: "0.6s",
                helpTip: {
                  title: "Earthworks & Water Flow",
                  description: "Shape the land to capture and direct water flow. Keyline design follows natural contours to distribute water evenly across the landscape, preventing erosion and maximizing infiltration.",
                  type: "info" as const
                }
              }
            ].map((feature, index) => (
              <AnimateOnScroll
                key={index}
                animation="animate-scale-in"
                delay={feature.delay}
              >
                <Card className="card-nature hover-lift border-green-100 group rounded-xl h-full shadow-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl w-fit group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-8 w-8 text-green-700 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    {feature.helpTip && (
                      <HelpIcon tip={feature.helpTip} size="sm" variant="subtle" />
                    )}
                  </div>
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
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect For Section with Icons */}
      <section className="py-20 px-4 bg-gradient-to-b from-white via-green-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <AnimateOnScroll animation="animate-fade-in" delay="0.1s">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Works Anywhere You Want to
                <span className="text-green-600"> Grow</span>
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll animation="animate-fade-in" delay="0.3s">
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From tiny balconies to backyard homesteads, we adapt to your space
              </p>
            </AnimateOnScroll>
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
              <AnimateOnScroll
                key={index}
                animation="animate-slide-in-left"
                delay={space.delay}
              >
                <div className="glass rounded-xl p-8 hover-lift h-full shadow-md hover:shadow-xl transition-all duration-300 group border border-green-100/50 hover:border-green-200">
                <div className="text-center">
                  <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <space.icon className="h-12 w-12 text-green-700 group-hover:rotate-6 transition-transform duration-300" />
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
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Climate Adaptability Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <AnimateOnScroll animation="animate-fade-in" delay="0.1s">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Optimized for Your Climate
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll animation="animate-fade-in" delay="0.3s">
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI adapts recommendations based on your specific growing conditions
              </p>
            </AnimateOnScroll>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Sun, label: "Hot & Dry", desc: "Heat-tolerant varieties", delay: "0.5s" },
              { icon: Cloud, label: "Cool & Wet", desc: "Drainage solutions", delay: "0.6s" },
              { icon: Wind, label: "Windy Areas", desc: "Windbreak planning", delay: "0.7s" },
              { icon: Flower2, label: "Short Season", desc: "Fast-growing crops", delay: "0.8s" }
            ].map((climate, index) => {
              const IconComponent = climate.icon;
              return (
                <AnimateOnScroll
                  key={index}
                  animation="animate-fade-in"
                  delay={climate.delay}
                >
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100 hover:border-green-300 transition-all hover-lift card-nature shadow-sm hover:shadow-lg group cursor-pointer">
                    <IconComponent className="h-12 w-12 text-green-600 mx-auto mb-3 group-hover:scale-110 group-hover:text-green-700 transition-all duration-300" />
                    <div className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">{climate.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{climate.desc}</div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-6xl mx-auto text-center">
          <AnimateOnScroll animation="animate-fade-in" delay="0.1s">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Built by Gardeners, for Gardeners
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="animate-fade-in" delay="0.3s">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              This is an <strong>open-source project</strong>. We believe everyone should have access to tools
              that help them grow food sustainably. Contribute code, share templates, or help translate
              for gardeners worldwide.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="animate-fade-in" delay="0.5s">
            <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/JohnConnorCode/permaculture-planner" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="hover-lift rounded-lg hover-nature">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </Button>
            </a>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="hover-lift rounded-lg hover-nature">
                <Sparkles className="h-5 w-5 mr-2" />
                Contribute
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" size="lg" className="hover-lift rounded-lg hover-nature">
                <Globe className="h-5 w-5 mr-2" />
                Join Community
              </Button>
            </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-canopy py-24 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 opacity-0 animate-fade-in"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Start Growing Today
          </h2>
          <p className="text-xl mb-8 text-green-50 opacity-0 animate-fade-in"
             style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Whether you have a balcony or a backyard, our tools help you create
            productive gardens that work with nature, not against it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="opacity-0 animate-scale-in"
                 style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <Link href="/wizard">
                <MobileOptimizedButton
                  size="lg"
                  className="bg-white text-green-700 hover:bg-green-50 px-8 py-6 text-lg rounded-lg shadow-lg"
                  hapticFeedback
                >
                  <Leaf className="mr-2 h-5 w-5" />
                  Design Your Garden
                  <ArrowRight className="ml-2 h-5 w-5" />
                </MobileOptimizedButton>
              </Link>
            </div>
            <div className="opacity-0 animate-scale-in"
                 style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <Link href="/demo">
                <MobileOptimizedButton
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/80 text-white bg-white/10 hover:bg-white/20 px-8 py-6 text-lg rounded-lg backdrop-blur-sm"
                >
                  <TreePine className="mr-2 h-5 w-5" />
                  See Full Platform
                </MobileOptimizedButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Tour */}
      <OnboardingTour
        isVisible={onboarding.showTour}
        onClose={() => onboarding.completeTour()}
        onComplete={() => onboarding.completeTour()}
      />
    </div>
  )
}