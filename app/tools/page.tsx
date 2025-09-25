'use client'

import { useState } from 'react'
import { WaterWasteModule } from '@/components/water-waste-module'
import { ExportPanel } from '@/components/export-panel'
import { PermacultureDesigner } from '@/components/permaculture-designer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimateOnScroll } from '@/components/animate-on-scroll'
import {
  Droplets,
  Download,
  TreePine,
  Calculator,
  MapPin,
  BarChart3,
  Sparkles
} from 'lucide-react'

// Mock data for demo
const mockPlan = {
  name: 'My Permaculture Garden',
  dimensions: { width: 10, length: 15 },
  beds: [
    { id: '1', name: 'Vegetable Bed', width: 3, height: 6, x: 1, y: 1, shape: 'rectangle' as const },
    { id: '2', name: 'Herb Spiral', width: 2, height: 2, x: 5, y: 3, shape: 'circle' as const },
  ],
  plants: [
    { id: '1', name: 'Tomatoes', x: 2, y: 2 },
    { id: '2', name: 'Apple Tree', x: 7, y: 7 },
  ],
  structures: [
    { id: '1', name: 'Compost Bin', type: 'compost' as const, x: 9, y: 1, width: 1, height: 1 },
    { id: '2', name: 'Water Feature', type: 'other' as const, x: 5, y: 10, width: 2, height: 2 },
  ],
  paths: []
}

const mockClimate = {
  precipitation: { annual_mm: 800 },
  temperature: { annual_avg: 20 },
  frost: { frost_free_days: 200 }
}

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('designer')

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <AnimateOnScroll animation="fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Permaculture Planning Tools
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl">
              Professional tools for designing sustainable gardens with water management,
              site intelligence, and detailed export capabilities
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-green-700 hover:bg-green-50"
                onClick={() => setActiveTab('designer')}
              >
                <TreePine className="mr-2 h-5 w-5" />
                Garden Designer
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-white border-white hover:bg-white/10"
                onClick={() => setActiveTab('water')}
              >
                <Droplets className="mr-2 h-5 w-5" />
                Water Management
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <AnimateOnScroll animation="slide-in-left">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
              <TabsTrigger value="designer" className="flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                <span className="hidden sm:inline">Designer</span>
              </TabsTrigger>
              <TabsTrigger value="water" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                <span className="hidden sm:inline">Water</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Site Intel</span>
              </TabsTrigger>
            </TabsList>
          </AnimateOnScroll>

          <TabsContent value="designer" className="space-y-6">
            <AnimateOnScroll animation="fade-in">
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Visual Garden Designer
                  </h2>
                  <p className="text-gray-600">
                    Drag and drop plants, structures, and permaculture elements to create your garden
                  </p>
                </div>
                <PermacultureDesigner />
              </Card>
            </AnimateOnScroll>
          </TabsContent>

          <TabsContent value="water" className="space-y-6">
            <AnimateOnScroll animation="fade-in">
              <WaterWasteModule 
                gardenArea={150} 
                climate={mockClimate}
                plants={[]} 
              />
            </AnimateOnScroll>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <AnimateOnScroll animation="fade-in">
              <ExportPanel plan={mockPlan} />
            </AnimateOnScroll>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <AnimateOnScroll animation="fade-in">
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-green-600" />
                    Site Intelligence
                  </h2>
                  <p className="text-gray-600">
                    Automatic climate, soil, and elevation data for any location
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      AI-Powered Analysis
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Climate zone detection</li>
                      <li>• Frost date predictions</li>
                      <li>• Rainfall patterns</li>
                      <li>• Soil composition analysis</li>
                      <li>• Native plant recommendations</li>
                    </ul>
                  </Card>

                  <Card className="p-4 bg-green-50 border-green-200">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      Data Sources
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• USDA Hardiness Zones</li>
                      <li>• Local weather stations</li>
                      <li>• Elevation maps</li>
                      <li>• Soil survey databases</li>
                      <li>• Watershed boundaries</li>
                    </ul>
                  </Card>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Try it out:</strong> Enter any location in the Garden Wizard to see automatic
                    site intelligence data including climate zones, soil types, and personalized recommendations.
                  </p>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => window.location.href = '/wizard'}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Open Garden Wizard
                  </Button>
                </div>
              </Card>
            </AnimateOnScroll>
          </TabsContent>
        </Tabs>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <AnimateOnScroll animation="slide-in-left">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 p-3 bg-blue-100 rounded-lg inline-block">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Calculations</h3>
              <p className="text-gray-600 text-sm">
                Automatic water needs, compost production, and carbon sequestration calculations
                based on your garden design.
              </p>
            </Card>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-in-left" delay="0.1">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 p-3 bg-green-100 rounded-lg inline-block">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Professional Export</h3>
              <p className="text-gray-600 text-sm">
                Generate detailed PDF reports and high-quality site plans with dimensions,
                legends, and professional annotations.
              </p>
            </Card>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-in-left" delay="0.2">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 p-3 bg-purple-100 rounded-lg inline-block">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Recommendations</h3>
              <p className="text-gray-600 text-sm">
                Get personalized plant selections and design suggestions based on your
                climate, soil, and garden goals.
              </p>
            </Card>
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  )
}