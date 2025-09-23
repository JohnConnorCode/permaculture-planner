'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft, Play, Pause, RotateCw, ZoomIn, ZoomOut, Maximize2,
  Move, Square, Circle, Trash2, Save, Download, Upload,
  Layers, Grid, Ruler, TreePine, Flower, Carrot, Apple,
  Sun, Droplets, Info, Wind, Thermometer, MapPin,
  BarChart3, TrendingUp, Calendar, Clock, CheckCircle,
  AlertTriangle, Lightbulb, Heart, GitBranch, Sparkles,
  Mountain, Trees, Home, Tent, Fish, Bird, Bug,
  Zap, Battery, Recycle, Leaf, Globe, Users
} from 'lucide-react'

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [selectedZone, setSelectedZone] = useState(1)
  const [activeTab, setActiveTab] = useState('design')

  const demoSteps = [
    {
      title: "Zone Mapping",
      description: "Define zones based on frequency of use and energy requirements",
      icon: MapPin
    },
    {
      title: "Sector Analysis",
      description: "Analyze sun, wind, water flow, and external energies",
      icon: Sun
    },
    {
      title: "Water Systems",
      description: "Design swales, ponds, and rainwater harvesting",
      icon: Droplets
    },
    {
      title: "Food Forest Layers",
      description: "Plan canopy, understory, shrub, and ground layers",
      icon: Trees
    },
    {
      title: "Guild Creation",
      description: "Build plant communities that support each other",
      icon: Heart
    },
    {
      title: "Yield Analysis",
      description: "Track production, inputs, and system efficiency",
      icon: BarChart3
    }
  ]

  const zones = [
    { id: 0, name: "Zone 0", description: "Home & daily living", color: "bg-red-500" },
    { id: 1, name: "Zone 1", description: "Kitchen garden & herbs", color: "bg-orange-500" },
    { id: 2, name: "Zone 2", description: "Small livestock & orchards", color: "bg-yellow-500" },
    { id: 3, name: "Zone 3", description: "Main crops & grazing", color: "bg-green-500" },
    { id: 4, name: "Zone 4", description: "Timber & foraging", color: "bg-blue-500" },
    { id: 5, name: "Zone 5", description: "Wildlife & wilderness", color: "bg-purple-500" }
  ]

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length)
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [isPlaying, demoSteps.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Permaculture Design Platform</h1>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Full Featured Demo
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pause Tour' : 'Start Tour'}
            </Button>
            <Link href="/wizard">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Start Your Design
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Demo Area */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Tools & Zones */}
          <div className="lg:col-span-1 space-y-4">
            {/* Design Tools */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Design Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Move, label: "Select" },
                    { icon: MapPin, label: "Zone" },
                    { icon: Trees, label: "Forest" },
                    { icon: Droplets, label: "Water" },
                    { icon: Home, label: "Structure" },
                    { icon: Ruler, label: "Measure" }
                  ].map((tool, i) => (
                    <Button
                      key={i}
                      variant={i === 0 ? "default" : "outline"}
                      size="sm"
                      className="flex flex-col h-16 p-2"
                    >
                      <tool.icon className="h-5 w-5 mb-1" />
                      <span className="text-xs">{tool.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Zone Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Permaculture Zones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {zones.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-all ${
                      selectedZone === zone.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${zone.color}`} />
                      <div>
                        <div className="text-sm font-medium">{zone.name}</div>
                        <div className="text-xs text-gray-500">{zone.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center - Canvas */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] relative overflow-hidden">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <Button size="sm" variant="secondary">
                  <ZoomIn className="h-4 w-4 mr-1" />
                  {zoom}%
                </Button>
                <Button size="sm" variant="secondary">
                  <Grid className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button size="sm" variant="secondary">
                  <Layers className="h-4 w-4 mr-1" />
                  Layers
                </Button>
              </div>

              {/* Interactive Canvas */}
              <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 relative">
                {/* Zone Visualization */}
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Concentric Zones */}
                  {zones.slice(0, 4).map((zone, i) => (
                    <circle
                      key={zone.id}
                      cx="50%"
                      cy="50%"
                      r={`${15 + i * 10}%`}
                      fill={zone.id === selectedZone ? 'rgba(34, 197, 94, 0.1)' : 'transparent'}
                      stroke={zone.id === selectedZone ? '#22c55e' : '#d1d5db'}
                      strokeWidth={zone.id === selectedZone ? '2' : '1'}
                      strokeDasharray={zone.id === 0 ? '0' : '5,5'}
                      className="transition-all cursor-pointer"
                      onClick={() => setSelectedZone(zone.id)}
                    />
                  ))}

                  {/* Example Elements */}
                  <g transform="translate(200, 150)">
                    <rect x="0" y="0" width="80" height="60" fill="#8b4513" rx="4" />
                    <text x="40" y="35" textAnchor="middle" className="text-xs fill-white">Compost</text>
                  </g>

                  <g transform="translate(320, 200)">
                    <circle cx="30" cy="30" r="25" fill="#4ade80" />
                    <text x="30" y="35" textAnchor="middle" className="text-xs">Apple Tree</text>
                  </g>

                  <g transform="translate(150, 280)">
                    <path d="M 0 0 Q 50 20 100 0" stroke="#3b82f6" strokeWidth="3" fill="none" />
                    <text x="50" y="30" textAnchor="middle" className="text-xs fill-blue-600">Swale</text>
                  </g>
                </svg>

                {/* Overlay Info */}
                {isPlaying && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        {React.createElement(demoSteps[currentStep].icon, { className: "h-5 w-5 text-green-600" })}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{demoSteps[currentStep].title}</h4>
                        <p className="text-xs text-gray-600">{demoSteps[currentStep].description}</p>
                      </div>
                    </div>
                    <Progress value={(currentStep + 1) / demoSteps.length * 100} className="h-1 mt-3" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel - Analysis & Data */}
          <div className="lg:col-span-1 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="yield">Yield</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Current Selection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Apple className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">Apple Tree Guild</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Zone 2 • Canopy Layer
                        </div>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Height:</span>
                          <span className="font-medium">15-20 ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spread:</span>
                          <span className="font-medium">12-15 ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Years to yield:</span>
                          <span className="font-medium">3-5 years</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Guild Companions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { name: "Comfrey", role: "Nutrient accumulator", icon: Leaf },
                      { name: "Nasturtium", role: "Pest deterrent", icon: Bug },
                      { name: "Chives", role: "Disease prevention", icon: Flower }
                    ].map((companion, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <companion.icon className="h-3 w-3 text-green-600" />
                        <span className="font-medium">{companion.name}</span>
                        <span className="text-gray-500">• {companion.role}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Site Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Sun className="h-3 w-3" /> Sun Exposure
                        </span>
                        <Badge variant="secondary" className="bg-yellow-100">Full Sun</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Droplets className="h-3 w-3" /> Water Access
                        </span>
                        <Badge variant="secondary" className="bg-blue-100">Good</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Wind className="h-3 w-3" /> Wind Exposure
                        </span>
                        <Badge variant="secondary" className="bg-gray-100">Moderate</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Mountain className="h-3 w-3" /> Slope
                        </span>
                        <Badge variant="secondary" className="bg-green-100">5° South</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded text-xs">
                      <p className="font-medium text-blue-900">Add nitrogen fixer</p>
                      <p className="text-blue-700 mt-1">Consider adding clover or beans as groundcover</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded text-xs">
                      <p className="font-medium text-green-900">Water harvesting opportunity</p>
                      <p className="text-green-700 mt-1">Slope is ideal for swale placement</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="yield" className="space-y-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Projected Yields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Year 1-2</span>
                          <span className="font-medium">Establishment</span>
                        </div>
                        <Progress value={20} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Year 3-5</span>
                          <span className="font-medium">150 lbs/year</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Year 6+</span>
                          <span className="font-medium">300+ lbs/year</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Total System Yield:</span>
                          <span className="font-bold text-green-700">1,200 lbs/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Water Efficiency:</span>
                          <span className="font-medium text-blue-600">85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Biodiversity Score:</span>
                          <span className="font-medium text-purple-600">92/100</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { month: "March", task: "Prepare beds & swales", icon: CheckCircle, done: true },
                      { month: "April", task: "Plant fruit trees", icon: Trees, done: true },
                      { month: "May", task: "Establish groundcover", icon: Leaf, done: false },
                      { month: "June", task: "Install irrigation", icon: Droplets, done: false }
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs ${item.done ? 'opacity-60' : ''}`}>
                        <item.icon className={`h-3 w-3 ${item.done ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="font-medium w-12">{item.month}</span>
                        <span className={item.done ? 'line-through' : ''}>{item.task}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                AI-Powered Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get intelligent suggestions based on your climate, soil, and goals.
                The system learns from thousands of successful permaculture designs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Climate Adapted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Automatically adjusts recommendations for your hardiness zone,
                rainfall patterns, and local conditions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Community Wisdom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Connect with local permaculture practitioners. Share designs,
                get feedback, and learn from nearby success stories.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Design Your Permaculture System?</h2>
              <p className="mb-6 text-green-50">
                Join thousands creating abundant, regenerative landscapes
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/wizard">
                  <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-green-50">
                    <Leaf className="mr-2 h-5 w-5" />
                    Start Free Design
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}