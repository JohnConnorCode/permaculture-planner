'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PermacultureDesigner } from '@/components/permaculture-designer'
import { Info, TreePine, Sprout, HelpCircle } from 'lucide-react'

export default function EnhancedDemoPage() {
  const [viewMode, setViewMode] = useState<'permaculture' | 'simple'>('permaculture')
  const [showTutorial, setShowTutorial] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-white">
      {/* Header */}
      <section className="py-6 px-4 border-b glass">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                Permaculture Designer
              </h1>
              <p className="text-gray-600 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                Design complete permaculture systems with plants, structures, social spaces, and more
              </p>
            </div>
            <div className="flex gap-2 opacity-0 animate-slide-in-right" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <TabsList>
                  <TabsTrigger value="permaculture" className="gap-2">
                    <TreePine className="h-4 w-4" />
                    Advanced
                  </TabsTrigger>
                  <TabsTrigger value="simple" className="gap-2">
                    <Sprout className="h-4 w-4" />
                    Simple
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="outline"
                onClick={() => setShowTutorial(true)}
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interface */}
      <section className="container mx-auto max-w-7xl p-4">
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <PermacultureDesigner />
        </div>
      </section>

      {/* Help Section */}
      <section className="container mx-auto max-w-7xl p-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Permaculture Mode:</strong> 🏡 Place structures like benches, compost bins, rain barrels •
            🌿 Design with 50+ plants including fruits, herbs, and vegetables •
            🔄 Create food forests and companion planting guilds •
            💧 Integrate water management systems •
            👥 Add social spaces for community gathering
          </AlertDescription>
        </Alert>
      </section>
    </div>
  )
}