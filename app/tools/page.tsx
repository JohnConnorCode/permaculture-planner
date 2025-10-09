'use client'

import { useState } from 'react'
import { WaterWasteModule } from '@/components/water-waste-module'
import { ExportPanel } from '@/components/export-panel'
import { PermacultureDesigner } from '@/components/permaculture-designer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import {
  Droplets,
  Download,
  TreePine,
  Calculator
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
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Design Tools
          </h1>
          <p className="text-lg text-green-100 max-w-2xl">
            Plan and visualize your permaculture garden
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto">
            <TabsTrigger value="designer" className="flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              <span>Designer</span>
            </TabsTrigger>
            <TabsTrigger value="water" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              <span>Water</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="designer">
            <Card className="p-4 sm:p-6">
              <PermacultureDesigner />
            </Card>
          </TabsContent>

          <TabsContent value="water">
            <WaterWasteModule
              gardenArea={150}
              climate={mockClimate}
              plants={[]}
            />
          </TabsContent>

          <TabsContent value="export">
            <ExportPanel plan={mockPlan} />
          </TabsContent>
        </Tabs>

        {/* Features Grid */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="mb-3 p-3 bg-blue-100 rounded-lg inline-block">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Resource Calculations</h3>
            <p className="text-gray-600 text-sm">
              Calculate water needs, compost production, and planting schedules
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-3 p-3 bg-green-100 rounded-lg inline-block">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Export & Share</h3>
            <p className="text-gray-600 text-sm">
              Generate PDF reports and share your garden plans
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}