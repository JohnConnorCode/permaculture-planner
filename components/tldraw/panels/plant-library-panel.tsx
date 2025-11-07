'use client'

import React, { useState, useMemo } from 'react'
import { PLANT_LIBRARY, PlantInfo, getPlantsByCategory } from '@/lib/data/plant-library'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Sun,
  Cloud,
  CloudRain,
  Droplets,
  Sprout,
  X,
  Info,
  Calendar,
  Ruler,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface PlantLibraryPanelProps {
  /** Callback when a plant is selected to be placed */
  onPlantSelect: (plant: PlantInfo) => void
  /** Current selected plant ID */
  selectedPlantId?: string
  /** Show compact view */
  compact?: boolean
}

/**
 * PlantLibraryPanel - Comprehensive plant selection interface
 *
 * Features:
 * - 30+ plants with full metadata
 * - Search and filter by category, sun, water requirements
 * - Drag-and-drop support
 * - Detailed plant information modals
 * - Companion planting information
 * - Visual plant cards with emojis
 */
export function PlantLibraryPanel({
  onPlantSelect,
  selectedPlantId,
  compact = false,
}: PlantLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sunFilter, setSunFilter] = useState<'all' | 'full' | 'partial' | 'shade'>('all')
  const [waterFilter, setWaterFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [categoryTab, setCategoryTab] = useState<PlantInfo['category'] | 'all'>('all')
  const [selectedPlant, setSelectedPlant] = useState<PlantInfo | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Filter plants based on search and filters
  const filteredPlants = useMemo(() => {
    return PLANT_LIBRARY.filter(plant => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!plant.name.toLowerCase().includes(query) && !plant.id.toLowerCase().includes(query)) {
          return false
        }
      }

      // Category filter
      if (categoryTab !== 'all' && plant.category !== categoryTab) {
        return false
      }

      // Sun filter
      if (sunFilter !== 'all' && plant.requirements.sun !== sunFilter) {
        return false
      }

      // Water filter
      if (waterFilter !== 'all' && plant.requirements.water !== waterFilter) {
        return false
      }

      return true
    })
  }, [searchQuery, categoryTab, sunFilter, waterFilter])

  // Group plants by category for "all" view
  const groupedPlants = useMemo(() => {
    const groups: Record<PlantInfo['category'], PlantInfo[]> = {
      vegetable: [],
      fruit: [],
      herb: [],
      flower: [],
      tree: [],
      shrub: [],
      groundcover: [],
      vine: [],
    }

    filteredPlants.forEach(plant => {
      groups[plant.category].push(plant)
    })

    return groups
  }, [filteredPlants])

  const handlePlantClick = (plant: PlantInfo) => {
    setSelectedPlant(plant)
    onPlantSelect(plant)
  }

  const handleShowDetails = (plant: PlantInfo, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedPlant(plant)
    setShowDetails(true)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSunFilter('all')
    setWaterFilter('all')
    setCategoryTab('all')
  }

  const hasActiveFilters = searchQuery || sunFilter !== 'all' || waterFilter !== 'all' || categoryTab !== 'all'

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sprout className="h-5 w-5 text-green-600" />
            Plant Library
          </h2>
          <Badge variant="secondary" className="font-mono">
            {filteredPlants.length}/{PLANT_LIBRARY.length}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={sunFilter} onValueChange={(v: any) => setSunFilter(v)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sun</SelectItem>
              <SelectItem value="full">☀️ Full</SelectItem>
              <SelectItem value="partial">⛅ Partial</SelectItem>
              <SelectItem value="shade">☁️ Shade</SelectItem>
            </SelectContent>
          </Select>

          <Select value={waterFilter} onValueChange={(v: any) => setWaterFilter(v)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Water" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Water</SelectItem>
              <SelectItem value="low">💧 Low</SelectItem>
              <SelectItem value="medium">💧💧 Medium</SelectItem>
              <SelectItem value="high">💧💧💧 High</SelectItem>
            </SelectContent>
          </Select>
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
          <TabsTrigger value="vegetable">🥕 Vegetables</TabsTrigger>
          <TabsTrigger value="herb">🌿 Herbs</TabsTrigger>
          <TabsTrigger value="fruit">🍓 Fruits</TabsTrigger>
          <TabsTrigger value="flower">🌸 Flowers</TabsTrigger>
          <TabsTrigger value="tree">🌳 Trees</TabsTrigger>
          <TabsTrigger value="shrub">🌲 Shrubs</TabsTrigger>
          <TabsTrigger value="groundcover">☘️ Ground Cover</TabsTrigger>
          <TabsTrigger value="vine">🍇 Vines</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {categoryTab === 'all' ? (
              // Show grouped by category
              Object.entries(groupedPlants).map(([category, plants]) => {
                if (plants.length === 0) return null
                return (
                  <div key={category} className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground capitalize">
                      {category}s ({plants.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {plants.map(plant => (
                        <PlantCard
                          key={plant.id}
                          plant={plant}
                          isSelected={selectedPlantId === plant.id}
                          onClick={() => handlePlantClick(plant)}
                          onShowDetails={(e) => handleShowDetails(plant, e)}
                          compact={compact}
                        />
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              // Show filtered list
              <div className="grid grid-cols-1 gap-2">
                {filteredPlants.map(plant => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    isSelected={selectedPlantId === plant.id}
                    onClick={() => handlePlantClick(plant)}
                    onShowDetails={(e) => handleShowDetails(plant, e)}
                    compact={compact}
                  />
                ))}
              </div>
            )}

            {filteredPlants.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Sprout className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No plants found matching your criteria</p>
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </Tabs>

      {/* Plant Details Dialog */}
      {selectedPlant && (
        <PlantDetailsDialog
          plant={selectedPlant}
          open={showDetails}
          onOpenChange={setShowDetails}
        />
      )}
    </div>
  )
}

interface PlantCardProps {
  plant: PlantInfo
  isSelected: boolean
  onClick: () => void
  onShowDetails: (e: React.MouseEvent) => void
  compact?: boolean
}

function PlantCard({ plant, isSelected, onClick, onShowDetails, compact }: PlantCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Plant Icon */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${plant.color}20` }}
          >
            {plant.icon}
          </div>

          {/* Plant Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm">{plant.name}</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onShowDetails}
              >
                <Info className="h-3 w-3" />
              </Button>
            </div>

            {!compact && (
              <>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {plant.requirements.sun === 'full' && <Sun className="h-3 w-3" />}
                  {plant.requirements.sun === 'partial' && <Cloud className="h-3 w-3" />}
                  {plant.requirements.sun === 'shade' && <CloudRain className="h-3 w-3" />}
                  <span className="capitalize">{plant.requirements.sun}</span>
                  <Separator orientation="vertical" className="h-3" />
                  {Array.from({ length: plant.requirements.water === 'high' ? 3 : plant.requirements.water === 'medium' ? 2 : 1 }).map((_, i) => (
                    <Droplets key={i} className="h-3 w-3 text-blue-500" />
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs">
                  <Badge variant="secondary" className="text-xs">
                    {plant.size.spacing}" spacing
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {plant.harvest_time}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PlantDetailsDialogProps {
  plant: PlantInfo
  open: boolean
  onOpenChange: (open: boolean) => void
}

function PlantDetailsDialog({ plant, open, onOpenChange }: PlantDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: `${plant.color}20` }}
            >
              {plant.icon}
            </div>
            <div>
              <DialogTitle className="text-2xl">{plant.name}</DialogTitle>
              <DialogDescription className="capitalize">
                {plant.category}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Requirements */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              Growing Requirements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Sun</p>
                  <p className="text-xs text-muted-foreground capitalize">{plant.requirements.sun}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Water</p>
                  <p className="text-xs text-muted-foreground capitalize">{plant.requirements.water}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Spacing</p>
                  <p className="text-xs text-muted-foreground">{plant.size.spacing} inches</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Mature Size</p>
                  <p className="text-xs text-muted-foreground">
                    {plant.size.mature_width}W × {plant.size.mature_height}H in
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timing */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timing
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Planting Time</p>
                <p className="text-xs text-muted-foreground">{plant.planting_time}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Harvest Time</p>
                <p className="text-xs text-muted-foreground">{plant.harvest_time}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Companion Planting */}
          {(plant.companions.length > 0 || plant.antagonists.length > 0) && (
            <div>
              <h3 className="font-semibold mb-3">Companion Planting</h3>
              {plant.companions.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-green-600 mb-2">Good Companions ♥</p>
                  <div className="flex flex-wrap gap-2">
                    {plant.companions.map(id => {
                      const companion = PLANT_LIBRARY.find(p => p.id === id)
                      return companion ? (
                        <Badge key={id} variant="outline" className="bg-green-50">
                          {companion.icon} {companion.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
              {plant.antagonists.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-600 mb-2">Avoid ⚠</p>
                  <div className="flex flex-wrap gap-2">
                    {plant.antagonists.map(id => {
                      const antagonist = PLANT_LIBRARY.find(p => p.id === id)
                      return antagonist ? (
                        <Badge key={id} variant="outline" className="bg-red-50">
                          {antagonist.icon} {antagonist.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Zones */}
          <div>
            <h3 className="font-semibold mb-3">USDA Hardiness Zones</h3>
            <div className="flex flex-wrap gap-1">
              {plant.requirements.zone.map(zone => (
                <Badge key={zone} variant="secondary">
                  Zone {zone}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
