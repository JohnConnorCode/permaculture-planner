'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlantInfo, getPlantById, getCompanionPlants, getAntagonistPlants } from '@/lib/data/plant-library'
import { Sun, Droplets, Ruler, Calendar, MapPin, Info } from 'lucide-react'

interface PlantInfoModalProps {
  plantId: string | null
  isOpen: boolean
  onClose: () => void
}

export function PlantInfoModal({ plantId, isOpen, onClose }: PlantInfoModalProps) {
  if (!plantId) return null

  const plant = getPlantById(plantId)
  if (!plant) return null

  const companions = getCompanionPlants(plantId)
  const antagonists = getAntagonistPlants(plantId)

  const getSunIcon = (requirement: string) => {
    switch (requirement) {
      case 'full': return '☀️'
      case 'partial': return '⛅'
      case 'shade': return '🌥️'
      default: return '☀️'
    }
  }

  const getWaterIcon = (requirement: string) => {
    switch (requirement) {
      case 'high': return '💧💧💧'
      case 'medium': return '💧💧'
      case 'low': return '💧'
      default: return '💧'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-4xl">{plant.icon}</span>
            {plant.name}
          </DialogTitle>
          <DialogDescription>
            <Badge variant="secondary" className="mt-2">
              {plant.category}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="companions">Companions</TabsTrigger>
            <TabsTrigger value="growing">Growing Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Size at Maturity
                </h4>
                <p className="text-lg">
                  {plant.size.mature_width}" wide × {plant.size.mature_height}" tall
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Spacing: {plant.size.spacing}" between plants
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timing
                </h4>
                <p className="text-sm">
                  <strong>Plant:</strong> {plant.planting_time}
                </p>
                <p className="text-sm mt-1">
                  <strong>Harvest:</strong> {plant.harvest_time}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Quick Facts</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-1">{getSunIcon(plant.requirements.sun)}</div>
                  <div className="text-xs text-gray-600">{plant.requirements.sun} sun</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">{getWaterIcon(plant.requirements.water)}</div>
                  <div className="text-xs text-gray-600">{plant.requirements.water} water</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="text-xs text-gray-600">{plant.requirements.soil} soil</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Sun className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold">Sun Requirements</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {plant.requirements.sun === 'full' && 'Needs at least 6-8 hours of direct sunlight daily'}
                    {plant.requirements.sun === 'partial' && 'Thrives with 3-6 hours of direct sunlight'}
                    {plant.requirements.sun === 'shade' && 'Prefers indirect light or less than 3 hours of sun'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Droplets className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold">Water Needs</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {plant.requirements.water === 'high' && 'Keep soil consistently moist, water daily in hot weather'}
                    {plant.requirements.water === 'medium' && 'Water when top inch of soil is dry, about 2-3 times per week'}
                    {plant.requirements.water === 'low' && 'Drought tolerant once established, water deeply but infrequently'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold">Growing Zones</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {plant.requirements.zone.map(zone => (
                      <Badge key={zone} variant="outline">Zone {zone}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="companions" className="space-y-4 mt-4">
            {companions.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-600 mb-2">
                  ✅ Good Companion Plants
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {companions.map(companion => (
                    <div key={companion.id} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <span className="text-xl">{companion.icon}</span>
                      <span className="text-sm">{companion.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  These plants help each other grow better when planted nearby
                </p>
              </div>
            )}

            {antagonists.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 mb-2">
                  ❌ Plants to Avoid
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {antagonists.map(antagonist => (
                    <div key={antagonist.id} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                      <span className="text-xl">{antagonist.icon}</span>
                      <span className="text-sm">{antagonist.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Keep these plants separated to avoid growth problems
                </p>
              </div>
            )}

            {companions.length === 0 && antagonists.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Info className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No specific companion planting information available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="growing" className="space-y-4 mt-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">🌱 Growing Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Start seeds indoors 6-8 weeks before last frost</li>
                <li>• Transplant after soil has warmed to 60°F</li>
                <li>• Mulch around plants to retain moisture</li>
                <li>• Fertilize every 2-3 weeks during growing season</li>
                <li>• Harvest regularly to encourage more production</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🐛 Common Issues</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Watch for aphids and treat with neem oil</li>
                <li>• Prevent fungal diseases with good air circulation</li>
                <li>• Use row covers to protect from pests</li>
                <li>• Rotate crops yearly to prevent soil depletion</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}