'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import {
  Droplets, Home, TreePine, Route, Zap, Bird, Recycle,
  Droplet, Waves, Filter, Trees, Package, Grid3x3,
  Sun, Wind, Battery, Egg, Hexagon, Fish, Bug, Hand, Move
} from 'lucide-react'
import { ElementSubtype, ELEMENT_STYLES } from '@/lib/canvas-elements'
import { isTouchDevice, getDeviceType } from '@/lib/utils/responsive-utils'
import { cn } from '@/lib/utils'

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
  const [isTouch, setIsTouch] = useState(false)
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [draggedElement, setDraggedElement] = useState<ElementSubtype | null>(null)

  useEffect(() => {
    setIsTouch(isTouchDevice())
    setDeviceType(getDeviceType())

    const handleResize = () => {
      setDeviceType(getDeviceType())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDragStart = (element: ElementSubtype) => (e: React.DragEvent) => {
    setDraggedElement(element)
    onElementSelect(element)
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('elementType', element)
  }

  const handleDragEnd = () => {
    setDraggedElement(null)
  }

  const handleTouchSelect = (element: ElementSubtype) => {
    onElementSelect(element)
  }

  const getGridColumns = () => {
    if (deviceType === 'mobile') return 'grid-cols-2'
    if (deviceType === 'tablet') return 'grid-cols-3'
    return 'grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
  }

  const getElementGridColumns = () => {
    if (deviceType === 'mobile') return 'grid-cols-2'
    if (deviceType === 'tablet') return 'grid-cols-2'
    return 'grid-cols-2' // Compact for sidebar
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white rounded-lg shadow-sm">
      {isTouch && (
        <div className="px-3 py-2 bg-blue-50 border-b border-blue-200 flex items-center gap-2">
          <Hand className="h-3 w-3 text-blue-600" />
          <span className="text-xs text-blue-700">Tap to select, then tap canvas to place</span>
        </div>
      )}
      {!isTouch && deviceType === 'desktop' && (
        <div className="px-3 py-2 bg-gray-50 border-b flex items-center gap-2">
          <Move className="h-3 w-3 text-gray-600" />
          <span className="text-xs text-gray-600">Drag elements onto the canvas</span>
        </div>
      )}

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex flex-col h-full">
        <TabsList className={cn(
          "grid gap-1 h-auto p-1 shrink-0 bg-gray-100",
          getGridColumns()
        )}>
          {Object.entries(ELEMENT_CATEGORIES).map(([key, category]) => {
            const Icon = category.icon
            return (
              <TabsTrigger
                key={key}
                value={key}
                className={cn(
                  "flex flex-col gap-1 h-auto text-center",
                  "data-[state=active]:bg-green-100 data-[state=active]:text-green-700",
                  "data-[state=active]:border-green-300",
                  "hover:bg-gray-50 transition-all min-w-0 rounded-md",
                  deviceType === 'mobile' ? 'py-1.5 px-1' : 'py-2 px-2'
                )}
              >
                <Icon className={cn(
                  "mx-auto",
                  deviceType === 'mobile' ? "h-4 w-4" : "h-5 w-5"
                )} />
                <span className={cn(
                  "leading-tight truncate w-full font-medium",
                  deviceType === 'mobile' ? "text-[10px]" : "text-xs"
                )}>{category.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <ScrollArea className="flex-1 mt-2 px-2">
          {Object.entries(ELEMENT_CATEGORIES).map(([categoryKey, category]) => (
            <TabsContent key={categoryKey} value={categoryKey} className="mt-0">
              <div className={cn(
                "grid gap-2 pb-2",
                getElementGridColumns()
              )}>
                {category.elements.map((element) => {
                  const Icon = element.icon
                  const style = ELEMENT_STYLES[element.type]
                  const isSelected = selectedElement === element.type

                  if (isTouch) {
                    return (
                      <Card
                        key={element.type}
                        className={cn(
                          "cursor-pointer transition-all",
                          "flex flex-col gap-2 p-3 min-w-0",
                          "hover:shadow-md active:scale-95",
                          isSelected && 'ring-2 ring-green-500 bg-green-50 shadow-lg'
                        )}
                        onClick={() => handleTouchSelect(element.type)}
                      >
                        <div
                          className={cn(
                            "rounded-md flex items-center justify-center mx-auto",
                            deviceType === 'mobile' ? 'w-12 h-12' : 'w-14 h-14'
                          )}
                          style={{
                            backgroundColor: style.defaultFill === 'none' ? 'transparent' : style.defaultFill,
                            border: `2px solid ${style.defaultStroke}`,
                          }}
                        >
                          <Icon className={cn(
                            deviceType === 'mobile' ? 'h-5 w-5' : 'h-6 w-6',
                            'text-gray-700'
                          )} />
                        </div>
                        <span className={cn(
                          "text-center leading-tight break-words font-medium",
                          deviceType === 'mobile' ? 'text-xs' : 'text-sm'
                        )}>{element.label}</span>
                      </Card>
                    )
                  }

                  return (
                    <Card
                      key={element.type}
                      className={cn(
                        "cursor-move transition-all",
                        "flex flex-col gap-1.5 p-2 min-w-0",
                        "hover:shadow-md hover:scale-105",
                        isSelected && 'ring-2 ring-green-500 bg-green-50 shadow-lg',
                        draggedElement === element.type && 'opacity-50 scale-95'
                      )}
                      draggable
                      onDragStart={handleDragStart(element.type)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onElementSelect(element.type)}
                    >
                      <div
                        className="rounded-md flex items-center justify-center mx-auto w-10 h-10"
                        style={{
                          backgroundColor: style.defaultFill === 'none' ? 'transparent' : style.defaultFill,
                          border: `2px solid ${style.defaultStroke}`,
                        }}
                      >
                        <Icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <span className="text-center leading-tight break-words font-medium text-[11px]">{element.label}</span>
                    </Card>
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