'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  ShoppingCart,
  Hammer,
  DollarSign,
  Package,
  Droplets,
  Download,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { MaterialsCalculator } from '@/lib/algorithms/materials-calculator'
import { cn } from '@/lib/utils'
import { SiteData } from './analytics-panel'

interface MaterialsPanelProps {
  /** Current garden beds */
  gardenBeds: GardenBed[]
  /** Site data for accurate calculations */
  siteData?: SiteData | null
}

/**
 * MaterialsPanel - Shopping list and cost estimates
 *
 * Features:
 * - Accurate soil volumes
 * - Lumber calculations
 * - Shopping list generation
 * - Cost estimates (low/high)
 * - Irrigation materials
 */
export function MaterialsPanel({
  gardenBeds,
  siteData = null,
}: MaterialsPanelProps) {
  const calculator = useMemo(() => new MaterialsCalculator(), [])

  // Calculate materials
  const materials = useMemo(() => {
    if (gardenBeds.length === 0) return null

    const surface = (siteData?.surfaceType as 'soil' | 'hard') || 'soil'
    const enableDrip = siteData?.waterSource === 'spigot' || siteData?.waterSource === 'rain'

    return calculator.calculateFromGardenBeds(gardenBeds, 12, surface, enableDrip)
  }, [gardenBeds, siteData, calculator])

  const shoppingList = useMemo(() => {
    if (!materials) return []
    return calculator.generateShoppingList(materials)
  }, [materials, calculator])

  const hasContent = gardenBeds.length > 0

  const downloadShoppingList = () => {
    if (!shoppingList.length) return

    const text = [
      'PERMACULTURE GARDEN - SHOPPING LIST',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      ...shoppingList.map((item, idx) => `${idx + 1}. ${item}`),
      '',
      `Estimated Cost: $${materials?.estimated_cost.low || 0} - $${materials?.estimated_cost.high || 0}`,
    ].join('\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `shopping-list-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Materials & Costs
          </h2>
          {materials && (
            <Button variant="outline" size="sm" onClick={downloadShoppingList}>
              <Download className="h-3 w-3 mr-2" />
              Export
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Complete materials list and cost estimates
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {!hasContent && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Add beds to see materials list
                </p>
              </CardContent>
            </Card>
          )}

          {hasContent && materials && (
            <>
              {/* Cost Summary */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-green-900 dark:text-green-100">
                    <DollarSign className="h-5 w-5" />
                    Total Cost Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700 dark:text-green-300">Budget (Treated Pine)</span>
                      <Badge variant="secondary" className="font-mono text-base">
                        ${materials.estimated_cost.low.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700 dark:text-green-300">Premium (Cedar)</span>
                      <Badge variant="secondary" className="font-mono text-base">
                        ${materials.estimated_cost.high.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Soil & Amendments */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Package className="h-4 w-4 text-amber-600" />
                    Soil & Amendments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Raised Bed Soil</span>
                      <Badge variant="outline" className="font-mono">
                        {materials.soil.cubicYards > 2
                          ? `${materials.soil.cubicYards} cu yd`
                          : `${materials.soil.bags40lb} bags`}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Compost</span>
                      <Badge variant="outline" className="font-mono">
                        {materials.compost.cubicYards > 1
                          ? `${materials.compost.cubicYards} cu yd`
                          : `${materials.compost.bags40lb} bags`}
                      </Badge>
                    </div>
                    {materials.mulch.cubicFeet > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Wood Mulch</span>
                        <Badge variant="outline" className="font-mono">
                          {materials.mulch.bags} bags
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    Order 10% extra to account for settling
                  </div>
                </CardContent>
              </Card>

              {/* Lumber */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Hammer className="h-4 w-4 text-orange-600" />
                    Lumber & Hardware
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {materials.lumber.boards2x10x8 > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">2×10×8' Boards</span>
                        <Badge variant="outline" className="font-mono">
                          {materials.lumber.boards2x10x8}
                        </Badge>
                      </div>
                    )}
                    {materials.lumber.boards2x10x10 > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">2×10×10' Boards</span>
                        <Badge variant="outline" className="font-mono">
                          {materials.lumber.boards2x10x10}
                        </Badge>
                      </div>
                    )}
                    {materials.lumber.boards2x10x12 > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">2×10×12' Boards</span>
                        <Badge variant="outline" className="font-mono">
                          {materials.lumber.boards2x10x12}
                        </Badge>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Corner Brackets</span>
                      <Badge variant="outline" className="font-mono">
                        {materials.lumber.cornerBrackets}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2.5" Screws</span>
                      <Badge variant="outline" className="font-mono">
                        {Math.ceil(materials.lumber.screws / 100)} boxes
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Irrigation */}
              {materials.irrigation.timer && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      Irrigation System
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">1/4" Drip Line</span>
                      <Badge variant="outline" className="font-mono">
                        {materials.irrigation.dripLineFt} ft
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Emitters (0.5 GPH)</span>
                      <Badge variant="outline" className="font-mono">
                        {materials.irrigation.emitters}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">1/2" Main Line</span>
                      <Badge variant="outline" className="font-mono">
                        {materials.irrigation.mainLineFt} ft
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hose Timer</span>
                      <Badge variant="outline">1</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shopping List */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Shopping List ({shoppingList.length} items)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {shoppingList.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className="text-muted-foreground min-w-[20px]">{idx + 1}.</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
