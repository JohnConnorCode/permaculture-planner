'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Droplets, Home, TreePine, Route, Zap, Bird, Recycle,
  Droplet, Waves, Filter, Trees, Package, Grid3x3,
  Sun, Wind, Battery, Egg, Hexagon, Fish, Bug
} from 'lucide-react'
import { ElementSubtype, ELEMENT_STYLES } from '@/lib/canvas-elements'

interface ElementSelectorProps {
  selectedElement: ElementSubtype | null
  onElementSelect: (element: ElementSubtype) => void
}

const ELEMENT_CATEGORIES = {
  water_management: {
    label: 'Water',
    icon: Droplets,
    elements: [
      { type: 'water_tank' as ElementSubtype, label: 'Water Tank', icon: Droplet },
      { type: 'pond' as ElementSubtype, label: 'Pond', icon: Waves },
      { type: 'swale' as ElementSubtype, label: 'Swale', icon: Filter },
      { type: 'rain_garden' as ElementSubtype, label: 'Rain Garden', icon: Trees },
      { type: 'greywater' as ElementSubtype, label: 'Greywater System', icon: Filter }
    ]
  },
  structure: {
    label: 'Structures',
    icon: Home,
    elements: [
      { type: 'greenhouse' as ElementSubtype, label: 'Greenhouse', icon: Home },
      { type: 'shed' as ElementSubtype, label: 'Shed', icon: Package },
      { type: 'trellis' as ElementSubtype, label: 'Trellis', icon: Grid3x3 },
      { type: 'arbor' as ElementSubtype, label: 'Arbor', icon: Trees },
      { type: 'pergola' as ElementSubtype, label: 'Pergola', icon: Home },
      { type: 'cold_frame' as ElementSubtype, label: 'Cold Frame', icon: Package }
    ]
  },
  access: {
    label: 'Access',
    icon: Route,
    elements: [
      { type: 'path' as ElementSubtype, label: 'Path', icon: Route },
      { type: 'fence' as ElementSubtype, label: 'Fence', icon: Grid3x3 },
      { type: 'gate' as ElementSubtype, label: 'Gate', icon: Package },
      { type: 'stairs' as ElementSubtype, label: 'Stairs', icon: Route },
      { type: 'ramp' as ElementSubtype, label: 'Ramp', icon: Route }
    ]
  },
  energy: {
    label: 'Energy',
    icon: Zap,
    elements: [
      { type: 'solar_panel' as ElementSubtype, label: 'Solar Panel', icon: Sun },
      { type: 'wind_turbine' as ElementSubtype, label: 'Wind Turbine', icon: Wind },
      { type: 'battery' as ElementSubtype, label: 'Battery Storage', icon: Battery }
    ]
  },
  animal: {
    label: 'Animals',
    icon: Bird,
    elements: [
      { type: 'chicken_coop' as ElementSubtype, label: 'Chicken Coop', icon: Egg },
      { type: 'beehive' as ElementSubtype, label: 'Beehive', icon: Hexagon },
      { type: 'rabbit_hutch' as ElementSubtype, label: 'Rabbit Hutch', icon: Package },
      { type: 'duck_pond' as ElementSubtype, label: 'Duck Pond', icon: Fish }
    ]
  },
  waste: {
    label: 'Waste',
    icon: Recycle,
    elements: [
      { type: 'compost_bin' as ElementSubtype, label: 'Compost Bin', icon: Recycle },
      { type: 'worm_farm' as ElementSubtype, label: 'Worm Farm', icon: Bug },
      { type: 'biodigester' as ElementSubtype, label: 'Biodigester', icon: Zap }
    ]
  }
}

export function ElementSelector({ selectedElement, onElementSelect }: ElementSelectorProps) {
  const [activeCategory, setActiveCategory] = useState('water_management')

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
          {Object.entries(ELEMENT_CATEGORIES).map(([key, category]) => {
            const Icon = category.icon
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="flex flex-col gap-1 h-auto py-2 data-[state=active]:bg-green-50"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{category.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <ScrollArea className="flex-1 mt-4">
          {Object.entries(ELEMENT_CATEGORIES).map(([categoryKey, category]) => (
            <TabsContent key={categoryKey} value={categoryKey} className="mt-0">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {category.elements.map((element) => {
                  const Icon = element.icon
                  const style = ELEMENT_STYLES[element.type]
                  const isSelected = selectedElement === element.type

                  return (
                    <Button
                      key={element.type}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`h-auto flex flex-col gap-2 p-3 ${
                        isSelected ? 'ring-2 ring-green-500' : ''
                      }`}
                      onClick={() => onElementSelect(element.type)}
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: style.defaultFill === 'none' ? 'transparent' : style.defaultFill,
                          border: `2px solid ${style.defaultStroke}`,
                        }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs text-center">{element.label}</span>
                    </Button>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </div>
  )
}