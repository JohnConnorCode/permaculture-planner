'use client'

import React, { useState, useMemo } from 'react'
import { ELEMENT_STYLES, ElementSubtype, ElementCategory } from '@/lib/canvas-elements'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search, Droplets, Home, Mountain, Wind, Egg, Recycle, X } from 'lucide-react'

interface ElementsLibraryPanelProps {
  /** Callback when an element is selected to be placed */
  onElementSelect: (subtype: ElementSubtype, category: ElementCategory) => void
  /** Current selected element subtype */
  selectedElement?: ElementSubtype
}

// Element metadata for display
const ELEMENT_INFO: Record<ElementSubtype, {
  name: string
  description: string
  icon: string
  category: ElementCategory
}> = {
  // Beds
  raised_bed: { name: 'Raised Bed', description: 'Elevated growing bed', icon: '📦', category: 'bed' },
  in_ground: { name: 'In-Ground Bed', description: 'Traditional soil bed', icon: '🌱', category: 'bed' },
  container: { name: 'Container', description: 'Pot or container garden', icon: '🪴', category: 'bed' },
  hugelkultur: { name: 'Hugelkultur', description: 'Wood-core mound bed', icon: '⛰️', category: 'bed' },
  keyhole: { name: 'Keyhole Garden', description: 'Circular bed with center compost', icon: '🔑', category: 'bed' },

  // Water Management
  water_tank: { name: 'Water Tank', description: 'Rainwater storage', icon: '💧', category: 'water_management' },
  pond: { name: 'Pond', description: 'Water feature for irrigation & wildlife', icon: '🌊', category: 'water_management' },
  swale: { name: 'Swale', description: 'Water harvesting contour', icon: '〰️', category: 'water_management' },
  rain_garden: { name: 'Rain Garden', description: 'Bioswale for drainage', icon: '🌧️', category: 'water_management' },
  greywater: { name: 'Greywater System', description: 'Water recycling system', icon: '♻️', category: 'water_management' },

  // Structures
  greenhouse: { name: 'Greenhouse', description: 'Season extension structure', icon: '🏠', category: 'structure' },
  shed: { name: 'Shed', description: 'Tool & supply storage', icon: '🛖', category: 'structure' },
  trellis: { name: 'Trellis', description: 'Vertical growing support', icon: '🪜', category: 'structure' },
  arbor: { name: 'Arbor', description: 'Arched garden feature', icon: '🌉', category: 'structure' },
  pergola: { name: 'Pergola', description: 'Overhead shade structure', icon: '🏛️', category: 'structure' },
  cold_frame: { name: 'Cold Frame', description: 'Mini greenhouse box', icon: '📦', category: 'structure' },

  // Access
  path: { name: 'Path', description: 'Walking/working pathway', icon: '🛤️', category: 'access' },
  fence: { name: 'Fence', description: 'Boundary or animal barrier', icon: '🚧', category: 'access' },
  gate: { name: 'Gate', description: 'Access point', icon: '🚪', category: 'access' },
  stairs: { name: 'Stairs', description: 'Steps for elevation changes', icon: '🪜', category: 'access' },
  ramp: { name: 'Ramp', description: 'Accessible slope', icon: '⏫', category: 'access' },

  // Energy
  solar_panel: { name: 'Solar Panel', description: 'Photovoltaic energy', icon: '☀️', category: 'energy' },
  wind_turbine: { name: 'Wind Turbine', description: 'Wind power generation', icon: '🌀', category: 'energy' },
  battery: { name: 'Battery Storage', description: 'Energy storage system', icon: '🔋', category: 'energy' },

  // Animals
  chicken_coop: { name: 'Chicken Coop', description: 'Poultry housing', icon: '🐔', category: 'animal' },
  beehive: { name: 'Beehive', description: 'Pollinator home', icon: '🐝', category: 'animal' },
  rabbit_hutch: { name: 'Rabbit Hutch', description: 'Rabbit housing', icon: '🐰', category: 'animal' },
  duck_pond: { name: 'Duck Pond', description: 'Waterfowl habitat', icon: '🦆', category: 'animal' },

  // Waste
  compost_bin: { name: 'Compost Bin', description: 'Organic waste processor', icon: '♻️', category: 'waste' },
  worm_farm: { name: 'Worm Farm', description: 'Vermicomposting system', icon: '🪱', category: 'waste' },
  biodigester: { name: 'Biodigester', description: 'Biogas production', icon: '⚗️', category: 'waste' },
}

// Category metadata
const CATEGORY_INFO: Record<ElementCategory, { name: string; icon: React.ReactNode; description: string }> = {
  bed: { name: 'Garden Beds', icon: <Mountain className="h-4 w-4" />, description: 'Growing areas' },
  water_management: { name: 'Water', icon: <Droplets className="h-4 w-4" />, description: 'Water systems' },
  structure: { name: 'Structures', icon: <Home className="h-4 w-4" />, description: 'Buildings & support' },
  access: { name: 'Access', icon: <Mountain className="h-4 w-4" />, description: 'Paths & gates' },
  energy: { name: 'Energy', icon: <Wind className="h-4 w-4" />, description: 'Power systems' },
  animal: { name: 'Animals', icon: <Egg className="h-4 w-4" />, description: 'Livestock & pollinators' },
  waste: { name: 'Waste', icon: <Recycle className="h-4 w-4" />, description: 'Composting systems' },
}

/**
 * ElementsLibraryPanel - Interface for placing permaculture elements
 *
 * Features:
 * - All 27 element types organized by category
 * - Search and filter
 * - Visual cards with icons
 * - Click to select, then place on canvas
 */
export function ElementsLibraryPanel({
  onElementSelect,
  selectedElement,
}: ElementsLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryTab, setCategoryTab] = useState<ElementCategory | 'all'>('all')

  // Get all element subtypes
  const allElements = useMemo(() => {
    return Object.keys(ELEMENT_STYLES) as ElementSubtype[]
  }, [])

  // Filter elements
  const filteredElements = useMemo(() => {
    return allElements.filter(subtype => {
      const info = ELEMENT_INFO[subtype]

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!info.name.toLowerCase().includes(query) &&
            !info.description.toLowerCase().includes(query) &&
            !subtype.toLowerCase().includes(query)) {
          return false
        }
      }

      // Category filter
      if (categoryTab !== 'all' && info.category !== categoryTab) {
        return false
      }

      return true
    })
  }, [allElements, searchQuery, categoryTab])

  // Group elements by category
  const groupedElements = useMemo(() => {
    const groups: Record<ElementCategory, ElementSubtype[]> = {
      bed: [],
      water_management: [],
      structure: [],
      access: [],
      energy: [],
      animal: [],
      waste: [],
    }

    filteredElements.forEach(subtype => {
      const info = ELEMENT_INFO[subtype]
      groups[info.category].push(subtype)
    })

    return groups
  }, [filteredElements])

  const handleElementClick = (subtype: ElementSubtype) => {
    const info = ELEMENT_INFO[subtype]
    onElementSelect(subtype, info.category)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryTab('all')
  }

  const hasActiveFilters = searchQuery || categoryTab !== 'all'

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Mountain className="h-5 w-5 text-purple-600" />
            Elements Library
          </h2>
          <Badge variant="secondary" className="font-mono">
            {filteredElements.length}/{allElements.length}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Category Tabs */}
      <Tabs value={categoryTab} onValueChange={(v: any) => setCategoryTab(v)} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start overflow-x-auto border-b rounded-none h-auto flex-wrap gap-1 p-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="bed">📦 Beds</TabsTrigger>
          <TabsTrigger value="water_management">💧 Water</TabsTrigger>
          <TabsTrigger value="structure">🏠 Structures</TabsTrigger>
          <TabsTrigger value="access">🚪 Access</TabsTrigger>
          <TabsTrigger value="energy">⚡ Energy</TabsTrigger>
          <TabsTrigger value="animal">🐔 Animals</TabsTrigger>
          <TabsTrigger value="waste">♻️ Waste</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {categoryTab === 'all' ? (
              // Show grouped by category
              Object.entries(groupedElements).map(([category, elements]) => {
                if (elements.length === 0) return null
                const catInfo = CATEGORY_INFO[category as ElementCategory]
                return (
                  <div key={category} className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                      {catInfo.icon}
                      {catInfo.name} ({elements.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {elements.map(subtype => (
                        <ElementCard
                          key={subtype}
                          subtype={subtype}
                          info={ELEMENT_INFO[subtype]}
                          isSelected={selectedElement === subtype}
                          onClick={() => handleElementClick(subtype)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              // Show filtered list
              <div className="grid grid-cols-1 gap-2">
                {filteredElements.map(subtype => (
                  <ElementCard
                    key={subtype}
                    subtype={subtype}
                    info={ELEMENT_INFO[subtype]}
                    isSelected={selectedElement === subtype}
                    onClick={() => handleElementClick(subtype)}
                  />
                ))}
              </div>
            )}

            {filteredElements.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Mountain className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No elements found matching your criteria</p>
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

interface ElementCardProps {
  subtype: ElementSubtype
  info: typeof ELEMENT_INFO[ElementSubtype]
  isSelected: boolean
  onClick: () => void
}

function ElementCard({ subtype, info, isSelected, onClick }: ElementCardProps) {
  const style = ELEMENT_STYLES[subtype]
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    // Set the element data for transfer
    e.dataTransfer.setData('application/x-element', JSON.stringify({ subtype, category: info.category }))
    e.dataTransfer.effectAllowed = 'copy'

    // Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    dragImage.style.opacity = '0.8'
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 0, 0)
    setTimeout(() => document.body.removeChild(dragImage), 0)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <Card
      className={`cursor-grab active:cursor-grabbing transition-all hover:shadow-lg hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Element Icon */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-transform hover:scale-110"
            style={{
              backgroundColor: `${style.defaultFill}80`,
              border: `2px solid ${style.defaultStroke}`
            }}
          >
            {info.icon}
          </div>

          {/* Element Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">{info.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {info.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {CATEGORY_INFO[info.category].name}
              </Badge>
              {style.minWidth && (
                <Badge variant="outline" className="text-xs">
                  {style.minWidth}×{style.minHeight || style.minWidth}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
