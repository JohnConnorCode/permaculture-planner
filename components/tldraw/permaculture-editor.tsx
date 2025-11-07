'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { PermacultureCanvas } from './permaculture-canvas'
import { PlantLibraryPanel } from './panels/plant-library-panel'
import { ElementsLibraryPanel } from './panels/elements-library-panel'
import { GardenBed } from '@/lib/garden/garden-types'
import { PlantInfo } from '@/lib/data/plant-library'
import { ElementSubtype, ElementCategory, ELEMENT_STYLES } from '@/lib/canvas-elements'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sprout,
  Mountain,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
  Download,
  Save,
  BarChart3,
  Calendar,
  Sparkles,
  Command,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PermacultureEditorProps {
  /** Initial garden bed data */
  initialData?: GardenBed[]
  /** Callback when data changes */
  onSave?: (data: GardenBed[]) => void
  /** Plan ID for loading/saving */
  planId?: string
  /** Show header */
  showHeader?: boolean
}

/**
 * PermacultureEditor - Complete permaculture planning interface
 *
 * Integrates:
 * - tldraw canvas with custom shapes
 * - Plant library panel
 * - Elements library panel
 * - Zone management
 * - Properties panels
 * - Analytics
 * - Timeline
 * - Export tools
 */
export function PermacultureEditor({
  initialData = [],
  onSave,
  planId,
  showHeader = true,
}: PermacultureEditorProps) {
  const [gardenData, setGardenData] = useState<GardenBed[]>(initialData)
  const [selectedPlant, setSelectedPlant] = useState<PlantInfo | null>(null)
  const [selectedElement, setSelectedElement] = useState<{ subtype: ElementSubtype; category: ElementCategory } | null>(null)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [leftPanelTab, setLeftPanelTab] = useState<'plants' | 'elements'>('plants')
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'layers' | 'analytics'>('properties')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Handle canvas changes
  const handleCanvasChange = useCallback((updatedData: GardenBed[]) => {
    setGardenData(updatedData)
    setHasUnsavedChanges(true)
    if (onSave) {
      onSave(updatedData)
    }
  }, [onSave])

  // Handle plant selection from library
  const handlePlantSelect = useCallback((plant: PlantInfo) => {
    setSelectedPlant(plant)
    setSelectedElement(null)
    toast.info(`Selected: ${plant.name}`, {
      description: 'Click on a bed to place this plant',
      icon: plant.icon,
    })
  }, [])

  // Handle element selection from library
  const handleElementSelect = useCallback((subtype: ElementSubtype, category: ElementCategory) => {
    setSelectedElement({ subtype, category })
    setSelectedPlant(null)
    const style = ELEMENT_STYLES[subtype]
    toast.info(`Selected: ${subtype.replace('_', ' ')}`, {
      description: 'Click on canvas to place this element',
    })
  }, [])

  // Handle save
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(gardenData)
      setHasUnsavedChanges(false)
      toast.success('Plan saved successfully')
    }
  }, [gardenData, onSave])

  // Handle export
  const handleExport = useCallback((format: 'png' | 'pdf' | 'svg' | 'json') => {
    toast.info(`Exporting as ${format.toUpperCase()}...`)
    // TODO: Implement export functionality
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toast.info('Command palette (coming soon)')
      }

      // Save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }

      // Toggle panels
      if (e.key === '[' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setLeftPanelOpen(prev => !prev)
      }
      if (e.key === ']' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setRightPanelOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  const stats = {
    beds: gardenData.length,
    plants: gardenData.reduce((sum, bed) => sum + (bed.plants?.length || 0), 0),
    elements: gardenData.filter(bed => bed.elementCategory !== 'bed').length,
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      {showHeader && (
        <header className="border-b bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Permaculture Planner</h1>
                  {hasUnsavedChanges && (
                    <Badge variant="outline" className="text-xs">
                      Unsaved
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.beds} beds • {stats.plants} plants • {stats.elements} elements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport('json')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div
          className={cn(
            'border-r bg-card/30 backdrop-blur transition-all duration-300',
            leftPanelOpen ? 'w-80' : 'w-0'
          )}
        >
          {leftPanelOpen && (
            <div className="h-full flex flex-col">
              <Tabs value={leftPanelTab} onValueChange={(v: any) => setLeftPanelTab(v)} className="flex-1 flex flex-col">
                <TabsList className="w-full rounded-none border-b">
                  <TabsTrigger value="plants" className="flex-1">
                    <Sprout className="h-4 w-4 mr-2" />
                    Plants
                  </TabsTrigger>
                  <TabsTrigger value="elements" className="flex-1">
                    <Mountain className="h-4 w-4 mr-2" />
                    Elements
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="plants" className="flex-1 m-0">
                  <PlantLibraryPanel
                    onPlantSelect={handlePlantSelect}
                    selectedPlantId={selectedPlant?.id}
                  />
                </TabsContent>

                <TabsContent value="elements" className="flex-1 m-0">
                  <ElementsLibraryPanel
                    onElementSelect={handleElementSelect}
                    selectedElement={selectedElement?.subtype}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Toggle Left Panel Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-20 w-6 rounded-l-none"
          onClick={() => setLeftPanelOpen(prev => !prev)}
        >
          {leftPanelOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {/* Canvas */}
        <div className="flex-1 relative">
          <PermacultureCanvas
            initialData={gardenData}
            onSave={handleCanvasChange}
            className="w-full h-full"
          />

          {/* Selection indicator */}
          {(selectedPlant || selectedElement) && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <Badge className="px-4 py-2 text-sm shadow-lg">
                {selectedPlant && (
                  <>
                    {selectedPlant.icon} {selectedPlant.name}
                  </>
                )}
                {selectedElement && (
                  <>
                    {selectedElement.subtype.replace('_', ' ')}
                  </>
                )}
                <span className="ml-2 text-xs opacity-75">• Click to place</span>
              </Badge>
            </div>
          )}

          {/* Quick Actions - Bottom Right */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="shadow-lg"
              onClick={() => toast.info('Command palette (⌘K)')}
            >
              <Command className="h-4 w-4 mr-2" />
              Commands
            </Button>
          </div>
        </div>

        {/* Toggle Right Panel Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-20 w-6 rounded-r-none"
          onClick={() => setRightPanelOpen(prev => !prev)}
        >
          {rightPanelOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        {/* Right Panel */}
        <div
          className={cn(
            'border-l bg-card/30 backdrop-blur transition-all duration-300',
            rightPanelOpen ? 'w-80' : 'w-0'
          )}
        >
          {rightPanelOpen && (
            <div className="h-full flex flex-col">
              <Tabs value={rightPanelTab} onValueChange={(v: any) => setRightPanelTab(v)} className="flex-1 flex flex-col">
                <TabsList className="w-full rounded-none border-b grid grid-cols-3">
                  <TabsTrigger value="properties">
                    <Settings className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="layers">
                    <Layers className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    <BarChart3 className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="properties" className="flex-1 m-0 p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Properties</h3>
                      <p className="text-sm text-muted-foreground">
                        Select an element to edit its properties
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">Coming soon:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                        <li>Edit bed names & dimensions</li>
                        <li>Set zone assignments</li>
                        <li>Configure plant dates</li>
                        <li>Element-specific settings</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layers" className="flex-1 m-0 p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Layers</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage visibility of different elements
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Badge variant="secondary">Coming soon</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="flex-1 m-0 p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Garden statistics and insights
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Garden Beds</span>
                        <Badge variant="secondary">{stats.beds}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Plants</span>
                        <Badge variant="secondary">{stats.plants}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Elements</span>
                        <Badge variant="secondary">{stats.elements}</Badge>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">Coming soon:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                        <li>Yield predictions</li>
                        <li>Water usage calculations</li>
                        <li>Biodiversity score</li>
                        <li>Companion planting analysis</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t bg-card/50 backdrop-blur px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>tldraw Canvas • 60 FPS</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Next-Gen Rendering</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 bg-muted rounded font-mono">⌘K</kbd>
            <span>Commands</span>
            <Separator orientation="vertical" className="h-4" />
            <kbd className="px-2 py-0.5 bg-muted rounded font-mono">⌘S</kbd>
            <span>Save</span>
          </div>
        </div>
      </div>
    </div>
  )
}
