'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle, Star, Heart, Users, Github,
  Leaf, Code, Globe, Lock, BookOpen,
  GitFork, MessageCircle, Coffee, Award,
  Sparkles, Share2, Download, Zap, Shield,
  Gift, Rocket, TrendingUp, ExternalLink
} from 'lucide-react'

const FEATURES = [
  { text: 'Unlimited garden projects', icon: CheckCircle },
  { text: 'All professional design tools', icon: CheckCircle },
  { text: '500+ plant database', icon: CheckCircle },
  { text: 'Companion planting guides', icon: CheckCircle },
  { text: 'Advanced analytics', icon: CheckCircle },
  { text: 'Climate zone analysis', icon: CheckCircle },
  { text: 'Export to any format', icon: CheckCircle },
  { text: 'Mobile app access', icon: CheckCircle },
  { text: 'Community support', icon: CheckCircle },
  { text: 'Regular updates', icon: CheckCircle },
  { text: 'No ads, ever', icon: CheckCircle },
  { text: 'Your data stays yours', icon: CheckCircle }
]

// Contributors will be pulled from GitHub API in the future
const CONTRIBUTORS: any[] = []

const WAYS_TO_HELP = [
  {
    title: 'Try the Platform',
    description: 'Explore the demo and provide feedback',
    icon: MessageCircle,
    action: 'View Demo',
    link: '/demo'
  },
  {
    title: 'Share Ideas',
    description: 'Suggest features for permaculture design',
    icon: Leaf,
    action: 'Community',
    link: '/community'
  },
  {
    title: 'Learn Permaculture',
    description: 'Explore permaculture principles and ethics',
    icon: BookOpen,
    action: 'Learn More',
    link: '/docs'
  }
]

// No sponsors yet - this is a community project
const SPONSORS: any[] = []

export default function SupportPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
      {/* Header */}
      <section className="py-12 px-4 text-center">
        <div className="container mx-auto max-w-6xl">
          <Badge className="mb-4 bg-green-100 text-green-700 opacity-0 animate-fade-in" variant="secondary" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <Heart className="h-3 w-3 mr-1" />
            100% Free & Open Source
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Free Forever. For Everyone.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Permaculture Planner is a community-driven, open-source project.
            No subscriptions, no paywalls, no limits. Join us in making sustainable gardening accessible to all.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup" className="opacity-0 animate-slide-in-left" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Rocket className="h-5 w-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/demo" className="opacity-0 animate-slide-in-right" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <Button size="lg" variant="outline">
                <Leaf className="h-5 w-5 mr-2" />
                Try the Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Everything. No Strings Attached.</h2>
            <p className="text-gray-600">Every feature, every tool, completely free.</p>
          </div>

          <Card className="max-w-4xl mx-auto opacity-0 animate-scale-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                <Sparkles className="inline h-6 w-6 text-yellow-500 mr-2" />
                All Features Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {FEATURES.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
                <p className="text-green-800 font-semibold">
                  No hidden costs. No premium tiers. No "Pro" version.
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Everything we build is available to everyone.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Open Source */}
      <section className="py-12 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8">Why We're Open Source</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sustainable gardening knowledge should be free and accessible to everyone,
                  regardless of their economic situation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built by gardeners, for gardeners. Our community shapes every feature
                  based on real needs, not profit margins.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your garden data stays yours. No selling to advertisers, no tracking,
                  no corporate surveillance. Ever.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Source Vision */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8">A Community Vision</h2>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                This platform is being built as an open-source tool for the permaculture community.
                While still in early development, our goal is to create comprehensive design tools
                that embody permaculture ethics and principles.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Earth Care</h4>
                    <p className="text-sm text-gray-600">Design systems that regenerate ecosystems</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">People Care</h4>
                    <p className="text-sm text-gray-600">Build resilient communities and food security</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Share2 className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Fair Share</h4>
                    <p className="text-sm text-gray-600">Distribute surplus and limit consumption</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ways to Help */}
      <section className="py-12 px-4 bg-green-50/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">How You Can Help</h2>
          <p className="text-center text-gray-600 mb-8">
            No coding skills? No problem! There are many ways to support the project.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {WAYS_TO_HELP.map((way, index) => {
              const Icon = way.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle className="text-lg">{way.title}</CardTitle>
                    <CardDescription>{way.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={way.link}
                      target={way.link.startsWith('http') ? '_blank' : undefined}
                      rel={way.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <Button variant="outline" className="w-full">
                        {way.action}
                        {way.link.startsWith('http') && <ExternalLink className="h-4 w-4 ml-2" />}
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="text-center">
              <Rocket className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Join the Movement</CardTitle>
              <CardDescription className="text-lg">
                Help build tools for regenerative design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 mb-6">
                This platform is in early development. Your feedback and ideas
                help shape the future of permaculture design tools.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/demo">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Leaf className="h-4 w-4 mr-2" />
                    Explore the Demo
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join the Garden Revolution
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Start planning your sustainable garden today. No credit card, no account required to explore.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Try the Demo
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}