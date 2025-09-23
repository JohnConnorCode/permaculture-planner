'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users, MessageSquare, MapPin, Calendar, Heart, Share2,
  Star, TrendingUp, Award, Sprout, Github, Globe,
  BookOpen, Video, HelpCircle, ArrowRight, Search
} from 'lucide-react'

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const communityStats = [
    { label: "Active Gardeners", value: "12,847", icon: Users },
    { label: "Gardens Shared", value: "3,421", icon: Share2 },
    { label: "Plants Growing", value: "284K", icon: Sprout },
    { label: "Countries", value: "47", icon: Globe }
  ]

  const featuredGardens = [
    {
      title: "Urban Balcony Paradise",
      author: "Sarah M.",
      location: "Seattle, WA",
      likes: 342,
      description: "Maximizing production in 40 sq ft with vertical growing",
      tags: ["urban", "small-space", "containers"],
      image: "🌿"
    },
    {
      title: "Backyard Food Forest",
      author: "Mike T.",
      location: "Austin, TX",
      likes: 567,
      description: "3 years into converting lawn to productive permaculture",
      tags: ["food-forest", "perennials", "zone-8"],
      image: "🌳"
    },
    {
      title: "Desert Oasis Garden",
      author: "Ana R.",
      location: "Phoenix, AZ",
      likes: 423,
      description: "Water-wise raised beds with drip irrigation",
      tags: ["arid", "water-saving", "raised-beds"],
      image: "🌵"
    }
  ]

  const discussions = [
    {
      title: "Best companion plants for tomatoes?",
      author: "GreenThumb92",
      replies: 23,
      lastActive: "2 hours ago",
      category: "companion-planting"
    },
    {
      title: "DIY wicking bed construction guide",
      author: "UrbanGrower",
      replies: 45,
      lastActive: "5 hours ago",
      category: "construction"
    },
    {
      title: "Dealing with aphids organically",
      author: "NatureLover",
      replies: 18,
      lastActive: "1 day ago",
      category: "pest-control"
    },
    {
      title: "Winter crops for zone 6b",
      author: "ColdFramer",
      replies: 31,
      lastActive: "1 day ago",
      category: "seasonal"
    }
  ]

  const resources = [
    {
      type: "guide",
      title: "Complete Permaculture Principles Guide",
      description: "Learn the 12 principles and how to apply them",
      icon: BookOpen,
      link: "/guides/principles"
    },
    {
      type: "video",
      title: "Garden Design Masterclass Series",
      description: "8-part video series on permaculture design",
      icon: Video,
      link: "/videos/masterclass"
    },
    {
      type: "faq",
      title: "Frequently Asked Questions",
      description: "Common questions from the community",
      icon: HelpCircle,
      link: "/faq"
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              Growing Together
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Connect with gardeners worldwide. Share your journey, learn from others,
            and help build a global movement of sustainable food production.
          </p>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {communityStats.map((stat, index) => (
              <div key={index} className="bg-green-50 rounded-lg p-4 opacity-0 animate-scale-in" style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'forwards' }}>
                <stat.icon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Gardens Section */}
        <section className="mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Gardens</h2>
            <Link href="/gallery">
              <Button variant="outline">
                View Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredGardens.map((garden, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <div className="text-6xl text-center mb-4">{garden.image}</div>
                  <CardTitle className="text-lg">{garden.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {garden.location} • by {garden.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{garden.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {garden.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-red-500">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{garden.likes}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Discussion Forum Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Community Discussions</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search discussions..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="gradient-green text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {discussions.map((discussion, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>by {discussion.author}</span>
                          <span>{discussion.replies} replies</span>
                          <Badge variant="outline" className="text-xs">
                            {discussion.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {discussion.lastActive}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="text-center mt-4">
            <Link href="/forum">
              <Button variant="outline">
                View All Discussions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Learning Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Learning Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <div className="p-3 bg-green-100 rounded-lg w-fit mb-2">
                    <resource.icon className="h-6 w-6 text-green-700" />
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={resource.link}>
                    <Button variant="ghost" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Local Groups */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-green-700" />
                Find Local Gardeners
              </CardTitle>
              <CardDescription className="text-base">
                Connect with permaculture enthusiasts in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Local Groups Near You</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between p-2 bg-white rounded">
                      <span>Seattle Urban Gardeners</span>
                      <Badge>234 members</Badge>
                    </li>
                    <li className="flex items-center justify-between p-2 bg-white rounded">
                      <span>Pacific Northwest Permaculture</span>
                      <Badge>567 members</Badge>
                    </li>
                    <li className="flex items-center justify-between p-2 bg-white rounded">
                      <span>Cascadia Food Forest Network</span>
                      <Badge>123 members</Badge>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Upcoming Events</h4>
                  <ul className="space-y-2">
                    <li className="p-2 bg-white rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Seed Swap Saturday</span>
                      </div>
                      <div className="text-sm text-gray-600">March 15 • Green Lake Community Garden</div>
                    </li>
                    <li className="p-2 bg-white rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Permaculture Design Workshop</span>
                      </div>
                      <div className="text-sm text-gray-600">March 22 • Online</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button className="gradient-green text-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Groups Near Me
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contribution CTA */}
        <section className="text-center py-12 px-6 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">Help Us Grow</h2>
          <p className="text-lg mb-8 text-green-50 max-w-2xl mx-auto">
            This is an open-source project built by the community, for the community.
            Your contributions help make sustainable gardening accessible to everyone.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://github.com/JohnConnorCode/permaculture-planner" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
                <Github className="h-5 w-5 mr-2" />
                Contribute on GitHub
              </Button>
            </a>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700">
                <BookOpen className="h-5 w-5 mr-2" />
                Developer Docs
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}