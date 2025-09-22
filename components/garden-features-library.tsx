'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Droplets, Droplet, Waves, CloudRain,
  Trees, Home, Umbrella, Armchair,
  Trash2, Package, Recycle,
  Info
} from 'lucide-react'

export interface GardenFeature {
  id: string
  name: string
  category: 'irrigation' | 'structure' | 'compost'
  icon: React.ReactNode
  description: string
  defaultSize: { widthIn: number; heightIn: number }
  properties: Record<string, any>
}

const FEATURES: GardenFeature[] = [
  // Irrigation Features
  {
    id: 'drip-line',
    name: 'Drip Line',
    category: 'irrigation',
    icon: <Droplet className="h-5 w-5" />,
    description: 'Efficient water delivery directly to plant roots',
    defaultSize: { widthIn: 48, heightIn: 2 },
    properties: {
      irrigationType: 'drip-line',
      flowRate: 0.5 // gallons per hour per emitter
    }
  },
  {
    id: 'sprinkler',
    name: 'Sprinkler',
    category: 'irrigation',
    icon: <Droplets className="h-5 w-5" />,
    description: 'Overhead watering for larger areas',
    defaultSize: { widthIn: 12, heightIn: 12 },
    properties: {
      irrigationType: 'sprinkler',
      coverage: 120, // 10 foot radius
      flowRate: 2.5
    }
  },
  {
    id: 'rain-barrel',
    name: 'Rain Barrel',
    category: 'irrigation',
    icon: <CloudRain className="h-5 w-5" />,
    description: 'Rainwater collection and storage',
    defaultSize: { widthIn: 30, heightIn: 30 },
    properties: {
      irrigationType: 'rain-barrel',
      capacity: 55 // gallons
    }
  },
  {
    id: 'swale',
    name: 'Swale',
    category: 'irrigation',
    icon: <Waves className="h-5 w-5" />,
    description: 'Passive water harvesting and infiltration',
    defaultSize: { widthIn: 48, heightIn: 24 },
    properties: {
      irrigationType: 'swale'
    }
  },
  {
    id: 'pond',
    name: 'Garden Pond',
    category: 'irrigation',
    icon: <Waves className="h-5 w-5" />,
    description: 'Water storage and wildlife habitat',
    defaultSize: { widthIn: 96, heightIn: 72 },
    properties: {
      irrigationType: 'pond',
      capacity: 500
    }
  },

  // Structure Features
  {
    id: 'bench',
    name: 'Garden Bench',
    category: 'structure',
    icon: <Armchair className="h-5 w-5" />,
    description: 'Seating for rest and garden enjoyment',
    defaultSize: { widthIn: 60, heightIn: 18 },
    properties: {
      structureType: 'bench',
      material: 'wood',
      seats: 3
    }
  },
  {
    id: 'pergola',
    name: 'Pergola',
    category: 'structure',
    icon: <Home className="h-5 w-5" />,
    description: 'Overhead structure for shade and climbing plants',
    defaultSize: { widthIn: 120, heightIn: 96 },
    properties: {
      structureType: 'pergola',
      material: 'wood',
      shadePercentage: 60,
      heightFt: 8
    }
  },
  {
    id: 'shade-sail',
    name: 'Shade Sail',
    category: 'structure',
    icon: <Umbrella className="h-5 w-5" />,
    description: 'Fabric shade structure',
    defaultSize: { widthIn: 144, heightIn: 144 },
    properties: {
      structureType: 'shade-sail',
      material: 'fabric',
      shadePercentage: 90,
      heightFt: 10
    }
  },
  {
    id: 'trellis',
    name: 'Trellis',
    category: 'structure',
    icon: <Trees className="h-5 w-5" />,
    description: 'Support for climbing plants',
    defaultSize: { widthIn: 48, heightIn: 6 },
    properties: {
      structureType: 'trellis',
      material: 'wood',
      heightFt: 6
    }
  },
  {
    id: 'arbor',
    name: 'Garden Arbor',
    category: 'structure',
    icon: <Trees className="h-5 w-5" />,
    description: 'Decorative entrance with climbing plant support',
    defaultSize: { widthIn: 48, heightIn: 24 },
    properties: {
      structureType: 'arbor',
      material: 'wood',
      heightFt: 7
    }
  },

  // Compost Features
  {
    id: 'compost-bin',
    name: 'Compost Bin',
    category: 'compost',
    icon: <Package className="h-5 w-5" />,
    description: 'Enclosed composting system',
    defaultSize: { widthIn: 36, heightIn: 36 },
    properties: {
      compostType: 'bin',
      material: 'wood',
      capacity: 27, // cubic feet
      numberOfBins: 1
    }
  },
  {
    id: 'three-bin',
    name: 'Three Bin System',
    category: 'compost',
    icon: <Recycle className="h-5 w-5" />,
    description: 'Multi-stage composting system',
    defaultSize: { widthIn: 108, heightIn: 36 },
    properties: {
      compostType: 'bin',
      material: 'wood',
      capacity: 81,
      numberOfBins: 3
    }
  },
  {
    id: 'compost-tumbler',
    name: 'Compost Tumbler',
    category: 'compost',
    icon: <Recycle className="h-5 w-5" />,
    description: 'Rotating composter for faster decomposition',
    defaultSize: { widthIn: 30, heightIn: 30 },
    properties: {
      compostType: 'tumbler',
      material: 'plastic',
      capacity: 18
    }
  },
  {
    id: 'worm-bin',
    name: 'Worm Bin',
    category: 'compost',
    icon: <Package className="h-5 w-5" />,
    description: 'Vermicomposting system',
    defaultSize: { widthIn: 24, heightIn: 18 },
    properties: {
      compostType: 'worm-bin',
      material: 'plastic',
      capacity: 4
    }
  },
  {
    id: 'leaf-mold',
    name: 'Leaf Mold Bin',
    category: 'compost',
    icon: <Trash2 className="h-5 w-5" />,
    description: 'Dedicated leaf composting area',
    defaultSize: { widthIn: 48, heightIn: 48 },
    properties: {
      compostType: 'leaf-mold',
      material: 'wire',
      capacity: 64
    }
  }
]

interface GardenFeaturesLibraryProps {
  onFeatureSelect?: (feature: GardenFeature) => void
}

export function GardenFeaturesLibrary({ onFeatureSelect }: GardenFeaturesLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'irrigation' | 'structure' | 'compost'>('all')
  const [selectedFeature, setSelectedFeature] = useState<GardenFeature | null>(null)

  const filteredFeatures = selectedCategory === 'all'
    ? FEATURES
    : FEATURES.filter(f => f.category === selectedCategory)

  const handleDragStart = (e: React.DragEvent, feature: GardenFeature) => {
    e.dataTransfer.setData('gardenFeature', JSON.stringify(feature))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleFeatureClick = (feature: GardenFeature) => {
    setSelectedFeature(feature)
    onFeatureSelect?.(feature)
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={selectedCategory} onValueChange={(v: any) => setSelectedCategory(v)} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="irrigation">Water</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="compost">Compost</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="flex-1 mt-2">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {filteredFeatures.map(feature => (
                <TooltipProvider key={feature.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card
                        className={`p-3 cursor-move hover:shadow-md transition-all ${
                          selectedFeature?.id === feature.id ? 'ring-2 ring-primary' : ''
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, feature)}
                        onClick={() => handleFeatureClick(feature)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-primary">{feature.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{feature.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <div className="space-y-1">
                        <p className="font-semibold">{feature.name}</p>
                        <p className="text-xs">{feature.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Size: {Math.round(feature.defaultSize.widthIn / 12)}' × {Math.round(feature.defaultSize.heightIn / 12)}'
                        </p>
                        <p className="text-xs font-medium pt-1 border-t">Drag to place on garden</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {selectedFeature && (
        <div className="p-4 border-t space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-primary">{selectedFeature.icon}</div>
            <div>
              <h3 className="font-semibold text-sm">{selectedFeature.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedFeature.category}</p>
            </div>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Default Size:</span>
              <span>{Math.round(selectedFeature.defaultSize.widthIn / 12)}' × {Math.round(selectedFeature.defaultSize.heightIn / 12)}'</span>
            </div>
            {selectedFeature.properties.capacity && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capacity:</span>
                <span>
                  {selectedFeature.properties.capacity}
                  {selectedFeature.category === 'irrigation' ? ' gal' : ' cu ft'}
                </span>
              </div>
            )}
            {selectedFeature.properties.shadePercentage && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shade:</span>
                <span>{selectedFeature.properties.shadePercentage}%</span>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <Info className="h-3 w-3 inline mr-1" />
            Drag to place in your garden design
          </div>
        </div>
      )}
    </div>
  )
}