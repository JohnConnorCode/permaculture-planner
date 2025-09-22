'use client'

import { useState, useMemo } from 'react'
import {
  PLANTS,
  PlantData,
  PlantCategory,
  getPlantsByCategory,
  searchPlants
} from '@/lib/data/plant-database'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Droplet, Sun, Clock, Ruler, Info } from 'lucide-react'

interface PlantLibraryProps {
  onPlantSelect?: (plant: PlantData) => void
  showDetails?: boolean
}

export function PlantLibrary({ onPlantSelect, showDetails = true }: PlantLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'all'>('all')
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null)
  const [sunFilter, setSunFilter] = useState<'all' | 'full' | 'partial' | 'shade'>('all')
  const [waterFilter, setWaterFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  const filteredPlants = useMemo(() => {
    let plants = searchQuery ? searchPlants(searchQuery) : PLANTS

    if (selectedCategory !== 'all') {
      plants = plants.filter(p => p.category === selectedCategory)
    }

    if (sunFilter !== 'all') {
      plants = plants.filter(p => p.requirements.sun === sunFilter)
    }

    if (waterFilter !== 'all') {
      plants = plants.filter(p => p.requirements.water === waterFilter)
    }

    return plants
  }, [searchQuery, selectedCategory, sunFilter, waterFilter])

  const handleDragStart = (e: React.DragEvent, plant: PlantData) => {
    e.dataTransfer.setData('plant', JSON.stringify(plant))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handlePlantClick = (plant: PlantData) => {
    setSelectedPlant(plant)
    onPlantSelect?.(plant)
  }

  const categories: Array<{ value: PlantCategory | 'all'; label: string; icon: string }> = [
    { value: 'all', label: 'All Plants', icon: '🌱' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { value: 'herbs', label: 'Herbs', icon: '🌿' },
    { value: 'fruits', label: 'Fruits', icon: '🍓' },
    { value: 'flowers', label: 'Flowers', icon: '🌻' },
    { value: 'trees', label: 'Trees', icon: '🌳' },
    { value: 'shrubs', label: 'Shrubs', icon: '🌳' },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filters */}
      <div className="p-4 space-y-3 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sunFilter} onValueChange={(v: any) => setSunFilter(v)}>
            <SelectTrigger className="w-[120px]">
              <Sun className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Sun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Sun</SelectItem>
              <SelectItem value="full">Full Sun</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="shade">Shade</SelectItem>
            </SelectContent>
          </Select>

          <Select value={waterFilter} onValueChange={(v: any) => setWaterFilter(v)}>
            <SelectTrigger className="w-[120px]">
              <Droplet className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Water" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Water</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(v: any) => setSelectedCategory(v)} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b h-auto p-0">
          <ScrollArea className="w-full">
            <div className="flex">
              {categories.map(cat => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <span className="mr-1">{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                </TabsTrigger>
              ))}
            </div>
          </ScrollArea>
        </TabsList>

        {/* Plant Grid */}
        <TabsContent value={selectedCategory} className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPlants.map(plant => (
                <TooltipProvider key={plant.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card
                        className={`p-3 cursor-move hover:shadow-md transition-all ${
                          selectedPlant?.id === plant.id ? 'ring-2 ring-primary' : ''
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, plant)}
                        onClick={() => handlePlantClick(plant)}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="text-2xl">{plant.visual.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{plant.commonName}</h4>
                            <p className="text-xs text-muted-foreground italic truncate">
                              {plant.scientificName}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {plant.requirements.sun === 'full' && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  <Sun className="h-2 w-2" />
                                </Badge>
                              )}
                              {plant.requirements.water === 'high' && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  <Droplet className="h-2 w-2" />
                                </Badge>
                              )}
                              {plant.lifecycle.type === 'perennial' && (
                                <Badge variant="outline" className="text-xs px-1 py-0">P</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <PlantTooltip plant={plant} />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Plant Details Panel */}
      {showDetails && selectedPlant && (
        <>
          <Separator />
          <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <span className="text-2xl">{selectedPlant.visual.icon}</span>
                {selectedPlant.commonName}
              </h3>
              <p className="text-sm text-muted-foreground italic">{selectedPlant.scientificName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <Label className="text-xs">Spacing</Label>
                <p className="font-medium">
                  {selectedPlant.requirements.spacing.betweenPlants}" between plants
                </p>
              </div>
              <div>
                <Label className="text-xs">Size</Label>
                <p className="font-medium">
                  {selectedPlant.visual.matureSize.widthIn}" × {selectedPlant.visual.matureSize.heightIn}"
                </p>
              </div>
              <div>
                <Label className="text-xs">Days to Maturity</Label>
                <p className="font-medium">
                  {selectedPlant.lifecycle.daysToMaturity.min}-{selectedPlant.lifecycle.daysToMaturity.max} days
                </p>
              </div>
              {selectedPlant.yield && (
                <div>
                  <Label className="text-xs">Expected Yield</Label>
                  <p className="font-medium">
                    {selectedPlant.yield.amount.min}-{selectedPlant.yield.amount.max} {selectedPlant.yield.unit}
                  </p>
                </div>
              )}
            </div>

            {selectedPlant.companionship.beneficial.length > 0 && (
              <div>
                <Label className="text-xs">Good Companions</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedPlant.companionship.beneficial.map(id => (
                    <Badge key={id} variant="outline" className="text-xs">
                      {PLANTS.find(p => p.id === id)?.commonName || id}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedPlant.companionship.notes && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                <Info className="h-3 w-3 inline mr-1" />
                {selectedPlant.companionship.notes}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function PlantTooltip({ plant }: { plant: PlantData }) {
  return (
    <div className="space-y-2">
      <div>
        <p className="font-semibold">{plant.commonName}</p>
        <p className="text-xs italic">{plant.scientificName}</p>
      </div>
      <Separator />
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1">
          <Sun className="h-3 w-3" />
          <span>
            {plant.requirements.sun === 'full' ? 'Full Sun' :
             plant.requirements.sun === 'partial' ? 'Partial Sun' : 'Shade'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Droplet className="h-3 w-3" />
          <span>
            {plant.requirements.water === 'low' ? 'Low Water' :
             plant.requirements.water === 'medium' ? 'Medium Water' : 'High Water'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Ruler className="h-3 w-3" />
          <span>
            {plant.requirements.spacing.betweenPlants}" spacing
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>
            {plant.lifecycle.daysToMaturity.min}-{plant.lifecycle.daysToMaturity.max} days
          </span>
        </div>
      </div>
      {plant.benefits.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-1">
            {plant.benefits.map(b => (
              <Badge key={b} variant="secondary" className="text-xs">
                {b}
              </Badge>
            ))}
          </div>
        </>
      )}
      <div className="text-xs text-muted-foreground pt-1 border-t">
        Drag to add to garden
      </div>
    </div>
  )
}