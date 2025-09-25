'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Droplets,
  Cloud,
  Zap,
  TreePine,
  Recycle,
  AlertTriangle,
  Info,
  Calculator,
  Settings,
  BarChart3
} from 'lucide-react'

interface WaterWasteModuleProps {
  gardenArea: number // in square meters
  climate?: any // Site intelligence data
  plants?: any[] // Selected plants
}

export function WaterWasteModule({ 
  gardenArea = 100, 
  climate,
  plants = [] 
}: WaterWasteModuleProps) {
  // Water Management State
  const [rainwaterHarvest, setRainwaterHarvest] = useState(true)
  const [roofArea, setRoofArea] = useState(150) // square meters
  const [tankSize, setTankSize] = useState(5000) // liters
  const [irrigationType, setIrrigationType] = useState<'drip' | 'sprinkler' | 'manual'>('drip')
  const [graywater, setGraywater] = useState(false)
  const [swales, setSwales] = useState(false)
  
  // Composting State
  const [compostSystem, setCompostSystem] = useState<'bin' | 'pile' | 'tumbler' | 'worm'>('bin')
  const [kitchenWaste, setKitchenWaste] = useState(5) // kg per week
  const [gardenWaste, setGardenWaste] = useState(10) // kg per week
  const [humanure, setHumanure] = useState(false)

  // Calculations
  const annualRainfall = climate?.precipitation?.annual_mm || 800
  const monthlyWaterNeed = calculateWaterNeed(gardenArea, plants, irrigationType)
  const rainwaterPotential = calculateRainwaterPotential(roofArea, annualRainfall)
  const waterSelfSufficiency = Math.min(100, (rainwaterPotential / (monthlyWaterNeed * 12)) * 100)
  const compostProduction = calculateCompostProduction(kitchenWaste, gardenWaste)
  const carbonCredits = calculateCarbonCredits(compostProduction, gardenArea)

  function calculateWaterNeed(area: number, plants: any[], irrigation: string): number {
    // Base water need: 5L per square meter per week
    let baseNeed = area * 5 * 4 // Monthly
    
    // Adjust for irrigation efficiency
    const efficiency = {
      drip: 0.9,
      sprinkler: 0.7,
      manual: 0.5
    }[irrigation] || 0.7
    
    return Math.round(baseNeed / efficiency)
  }

  function calculateRainwaterPotential(roof: number, rainfall: number): number {
    // Roof collection efficiency ~80%
    return Math.round(roof * (rainfall / 1000) * 0.8 * 1000) // liters per year
  }

  function calculateCompostProduction(kitchen: number, garden: number): number {
    // Compost reduces to ~30% of input volume
    return Math.round((kitchen + garden) * 52 * 0.3) // kg per year
  }

  function calculateCarbonCredits(compost: number, area: number): number {
    // Rough estimate: 1kg compost = 0.5kg CO2 sequestered
    return Math.round(compost * 0.5)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Water & Waste Management</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Design sustainable water harvesting and waste recycling systems for your permaculture garden
        </p>
      </div>

      <Tabs defaultValue="water" className="space-y-4 sm:space-y-6">
        <TabsList className="grid grid-cols-3 w-full h-12 sm:h-10">
          <TabsTrigger value="water" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 text-xs sm:text-sm">
            <Droplets className="h-4 w-4" />
            Water
          </TabsTrigger>
          <TabsTrigger value="composting" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 text-xs sm:text-sm">
            <Recycle className="h-4 w-4" />
            <span className="hidden sm:inline">Composting</span>
            <span className="sm:hidden">Compost</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 text-xs sm:text-sm">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="water" className="space-y-6">
          {/* Rainwater Harvesting */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  Rainwater Harvesting
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Capture and store rainwater for irrigation
                </p>
              </div>
              <Switch
                checked={rainwaterHarvest}
                onCheckedChange={setRainwaterHarvest}
              />
            </div>

            {rainwaterHarvest && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="roof-area">Roof Collection Area (m²)</Label>
                  <Input
                    id="roof-area"
                    type="number"
                    value={roofArea}
                    onChange={(e) => setRoofArea(Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available roof area for water collection
                  </p>
                </div>

                <div>
                  <Label htmlFor="tank-size">Storage Tank Size (liters)</Label>
                  <Select 
                    value={tankSize.toString()} 
                    onValueChange={(v) => setTankSize(Number(v))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">1,000L (Small)</SelectItem>
                      <SelectItem value="2500">2,500L (Medium)</SelectItem>
                      <SelectItem value="5000">5,000L (Large)</SelectItem>
                      <SelectItem value="10000">10,000L (Extra Large)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Annual Collection Potential:</strong> {(rainwaterPotential / 1000).toFixed(1)}m³
                    <br />
                    <strong>Monthly Garden Need:</strong> {(monthlyWaterNeed / 1000).toFixed(1)}m³
                    <br />
                    <strong>Water Self-Sufficiency:</strong> {waterSelfSufficiency.toFixed(0)}%
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </Card>

          {/* Irrigation System */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-green-600" />
              Irrigation System
            </h3>

            <div className="space-y-4">
              <div>
                <Label>Irrigation Type</Label>
                <Select 
                  value={irrigationType} 
                  onValueChange={(v: any) => setIrrigationType(v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drip">Drip Irrigation (90% efficient)</SelectItem>
                    <SelectItem value="sprinkler">Sprinkler (70% efficient)</SelectItem>
                    <SelectItem value="manual">Manual Watering (50% efficient)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="graywater" className="text-base">Graywater Recycling</Label>
                  <p className="text-sm text-gray-600">Reuse water from sinks and showers</p>
                </div>
                <Switch
                  id="graywater"
                  checked={graywater}
                  onCheckedChange={setGraywater}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="swales" className="text-base">Swales & Contours</Label>
                  <p className="text-sm text-gray-600">Passive water harvesting earthworks</p>
                </div>
                <Switch
                  id="swales"
                  checked={swales}
                  onCheckedChange={setSwales}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="composting" className="space-y-6">
          {/* Composting System */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Recycle className="h-5 w-5 text-brown-600" />
              Composting System
            </h3>

            <div className="space-y-4">
              <div>
                <Label>Compost System Type</Label>
                <Select 
                  value={compostSystem} 
                  onValueChange={(v: any) => setCompostSystem(v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bin">Compost Bin (3-bin system)</SelectItem>
                    <SelectItem value="pile">Open Pile</SelectItem>
                    <SelectItem value="tumbler">Tumbler Composter</SelectItem>
                    <SelectItem value="worm">Worm Farm (Vermicompost)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="kitchen-waste">
                  Kitchen Waste (kg/week): {kitchenWaste}
                </Label>
                <Slider
                  id="kitchen-waste"
                  min={0}
                  max={20}
                  step={1}
                  value={[kitchenWaste]}
                  onValueChange={([v]) => setKitchenWaste(v)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="garden-waste">
                  Garden Waste (kg/week): {gardenWaste}
                </Label>
                <Slider
                  id="garden-waste"
                  min={0}
                  max={50}
                  step={5}
                  value={[gardenWaste]}
                  onValueChange={([v]) => setGardenWaste(v)}
                  className="mt-2"
                />
              </div>

              <Alert>
                <TreePine className="h-4 w-4" />
                <AlertDescription>
                  <strong>Annual Compost Production:</strong> ~{compostProduction}kg
                  <br />
                  <strong>Coverage:</strong> {(compostProduction / 50).toFixed(0)}m² at 5cm depth
                  <br />
                  <strong>CO₂ Sequestered:</strong> ~{carbonCredits}kg/year
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <Label htmlFor="humanure" className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Humanure System
                  </Label>
                  <p className="text-sm text-gray-600">
                    Advanced composting toilet system (requires proper design)
                  </p>
                </div>
                <Switch
                  id="humanure"
                  checked={humanure}
                  onCheckedChange={setHumanure}
                />
              </div>
            </div>
          </Card>

          {/* Waste Reduction Tips */}
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-lg mb-3">Waste Reduction Strategies</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Implement "chop and drop" mulching for prunings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Use cardboard sheet mulching to suppress weeds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Create biochar from woody waste for soil amendment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Establish a leaf mold bin for autumn leaves</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Practice crop rotation to reduce disease buildup</span>
              </li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* System Analysis */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-blue-600" />
              System Analysis
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Water Balance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Rainfall:</span>
                    <span className="font-medium">{annualRainfall}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collection Potential:</span>
                    <span className="font-medium">{(rainwaterPotential / 1000).toFixed(1)}m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Garden Water Need:</span>
                    <span className="font-medium">{(monthlyWaterNeed * 12 / 1000).toFixed(1)}m³/year</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600 font-medium">Self-Sufficiency:</span>
                    <span className="font-bold text-green-600">{waterSelfSufficiency.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-3">Nutrient Cycling</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organic Input:</span>
                    <span className="font-medium">{(kitchenWaste + gardenWaste) * 52}kg/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compost Output:</span>
                    <span className="font-medium">{compostProduction}kg/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area Coverage:</span>
                    <span className="font-medium">{(compostProduction / 50).toFixed(0)}m²</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600 font-medium">CO₂ Sequestered:</span>
                    <span className="font-bold text-green-600">{carbonCredits}kg/year</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-blue-600" />
              System Recommendations
            </h3>
            
            <div className="space-y-3">
              {waterSelfSufficiency < 50 && (
                <Alert>
                  <Droplets className="h-4 w-4" />
                  <AlertDescription>
                    Consider increasing roof collection area or tank size to improve water self-sufficiency.
                    Currently at {waterSelfSufficiency.toFixed(0)}% - aim for at least 50%.
                  </AlertDescription>
                </Alert>
              )}
              
              {!graywater && gardenArea > 50 && (
                <Alert>
                  <Droplets className="h-4 w-4" />
                  <AlertDescription>
                    With {gardenArea}m² of garden, graywater recycling could significantly reduce water needs.
                  </AlertDescription>
                </Alert>
              )}
              
              {compostProduction < gardenArea * 5 && (
                <Alert>
                  <Recycle className="h-4 w-4" />
                  <AlertDescription>
                    Your compost production could be increased. Consider adding more organic inputs or
                    partnering with neighbors for their kitchen waste.
                  </AlertDescription>
                </Alert>
              )}
              
              {irrigationType !== 'drip' && (
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    Switching to drip irrigation could save {Math.round((1 - 0.9/0.7) * monthlyWaterNeed * 12)}L 
                    of water annually.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>

          {/* Cost-Benefit Analysis */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Investment Summary</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-gray-600">Setup Cost</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${rainwaterHarvest ? 2000 + tankSize/5 : 500}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-gray-600">Annual Savings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${Math.round(waterSelfSufficiency * 3 + carbonCredits * 0.1)}
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-gray-600">Payback Period</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {((rainwaterHarvest ? 2000 + tankSize/5 : 500) / 
                      (waterSelfSufficiency * 3 + carbonCredits * 0.1)).toFixed(1)} years
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}