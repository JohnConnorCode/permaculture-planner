'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft, Play, Pause, RotateCw, ZoomIn, ZoomOut,
  Move, Square, Circle, Trash2, Save, Download,
  Layers, Grid, Ruler, TreePine, Flower, Carrot,
  Sun, Droplets, Info
} from 'lucide-react'

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [zoom, setZoom] = useState(100)

  const demoSteps = [
    "Click and drag to create garden beds",
    "Select plants from the library",
    "View companion planting suggestions",
    "Generate irrigation layout",
    "Calculate materials needed"
  ]

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length)
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [isPlaying])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Interactive Garden Planner Demo</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <><Pause className="h-4 w-4 mr-2" /> Pause Tour</>
              ) : (
                <><Play className="h-4 w-4 mr-2" /> Start Tour</>
              )}
            </Button>
            <Link href="/wizard">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Create Your Garden
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar Tools */}
        <aside className="w-64 bg-white border-r p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Drawing Tools */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Drawing Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Move, label: "Select" },
                  { icon: Square, label: "Bed" },
                  { icon: Circle, label: "Round" },
                  { icon: Trash2, label: "Delete" }
                ].map((tool, idx) => (
                  <button
                    key={idx}
                    className="p-3 rounded-lg border hover:bg-green-50 hover:border-green-300 transition-all opacity-0 animate-fade-in"
                    style={{ animationDelay: `${0.1 + idx * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <tool.icon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-xs">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Plant Library */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Plant Library</h3>
              <div className="space-y-2">
                {[
                  { icon: TreePine, name: "Trees", count: 12 },
                  { icon: Flower, name: "Flowers", count: 24 },
                  { icon: Carrot, name: "Vegetables", count: 36 }
                ].map((category, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border hover:bg-green-50 hover:border-green-300 cursor-pointer transition-all opacity-0 animate-slide-in-left"
                    style={{ animationDelay: `${0.3 + idx * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View Options */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">View Options</h3>
              <div className="space-y-2">
                {[
                  { icon: Grid, label: "Show Grid" },
                  { icon: Ruler, label: "Show Measurements" },
                  { icon: Layers, label: "Show Layers" }
                ].map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer opacity-0 animate-fade-in"
                    style={{ animationDelay: `${0.5 + idx * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <input type="checkbox" className="rounded text-green-600" />
                    <option.icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative bg-gradient-to-br from-green-50/50 to-blue-50/30">
          {/* Top Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2 z-10">
            <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm font-medium">{zoom}%</span>
            <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Button variant="ghost" size="sm">
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Demo Garden Visualization */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div
              className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full opacity-0 animate-scale-in"
              style={{
                transform: `scale(${zoom / 100})`,
                animationDelay: '0.3s',
                animationFillMode: 'forwards'
              }}
            >
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1, 2, 3, 4, 5, 6].map((bed, idx) => (
                  <div
                    key={bed}
                    className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-green-400 flex items-center justify-center opacity-0 animate-fade-in"
                    style={{
                      animationDelay: `${0.5 + idx * 0.1}s`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <span className="text-green-700 font-semibold">Bed {bed}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2">
                <div className="px-4 py-2 bg-blue-100 rounded-lg text-blue-700 text-sm">
                  <Droplets className="h-4 w-4 inline mr-1" />
                  Irrigation Line
                </div>
                <div className="px-4 py-2 bg-yellow-100 rounded-lg text-yellow-700 text-sm">
                  <Sun className="h-4 w-4 inline mr-1" />
                  Full Sun Area
                </div>
              </div>
            </div>
          </div>

          {/* Demo Steps Indicator */}
          {isPlaying && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <Info className="h-5 w-5 text-green-600" />
                <span className="font-medium">Step {currentStep + 1} of {demoSteps.length}</span>
              </div>
              <p className="text-sm text-gray-600">{demoSteps[currentStep]}</p>
              <div className="flex gap-1 mt-3">
                {demoSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      idx === currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - Information */}
        <aside className="w-80 bg-white border-l p-4 overflow-y-auto">
          <div className="space-y-6">
            <Card className="opacity-0 animate-slide-in-right" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <CardHeader>
                <CardTitle className="text-lg">Garden Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Area</span>
                  <span className="font-medium">120 sq ft</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of Beds</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plant Varieties</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Water Usage</span>
                  <span className="font-medium">15 gal/week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="opacity-0 animate-slide-in-right" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <CardHeader>
                <CardTitle className="text-lg">Companion Planting</CardTitle>
                <CardDescription>Suggested plant combinations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { good: "Tomatoes", companion: "Basil" },
                  { good: "Carrots", companion: "Onions" },
                  { good: "Beans", companion: "Corn" }
                ].map((pair, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm">{pair.good}</span>
                    <span className="text-xs text-green-600">↔</span>
                    <span className="text-sm">{pair.companion}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="opacity-0 animate-slide-in-right" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <CardHeader>
                <CardTitle className="text-lg">Materials Needed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lumber (2x12)</span>
                    <span className="font-medium">96 ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Soil</span>
                    <span className="font-medium">4 cubic yards</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compost</span>
                    <span className="font-medium">1 cubic yard</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drip Line</span>
                    <span className="font-medium">150 ft</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}