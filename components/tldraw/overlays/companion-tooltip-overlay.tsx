'use client'

import { useEditor } from 'tldraw'
import { useEffect, useState } from 'react'
import { PlantShape } from '../shapes/plant-shape'
import {
  getDetailedRelationship,
  formatBenefit,
  formatAntagonismReason,
  DetailedCompanionRelationship,
} from '@/lib/data/companion-relationships'
import { PLANT_LIBRARY } from '@/lib/data/plant-library'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

/**
 * CompanionTooltipOverlay
 *
 * Shows detailed tooltip when hovering over plants during placement
 * Displays:
 * - Relationship type and strength
 * - Specific benefits or antagonism reasons
 * - Optimal spacing
 * - Mechanism explanation
 * - Research source
 */
export function CompanionTooltipOverlay() {
  const editor = useEditor()
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    content: {
      plantName: string
      plantIcon: string
      relationship: DetailedCompanionRelationship
      otherPlantName: string
    } | null
  } | null>(null)

  useEffect(() => {
    if (!editor) return

    const updateTooltip = () => {
      const currentTool = editor.getCurrentToolId()

      // Only show during plant placement
      if (currentTool !== 'plant-tool') {
        setTooltip(null)
        return
      }

      // Get the plant being placed
      const plantTool = editor.getStateDescendant('plant-tool') as any
      if (!plantTool?.plantInfo) {
        setTooltip(null)
        return
      }

      const placingPlant = plantTool.plantInfo
      const pagePoint = editor.inputs.currentPagePoint

      // Find hovered plant shape
      const shapesAtPoint = editor.getShapesAtPoint(pagePoint)
      const hoveredPlantShape = shapesAtPoint.find(s => s.type === 'plant') as PlantShape | undefined

      if (!hoveredPlantShape) {
        setTooltip(null)
        return
      }

      // Get detailed relationship
      const relationship = getDetailedRelationship(
        placingPlant.id,
        hoveredPlantShape.props.plantId
      )

      if (!relationship) {
        setTooltip(null)
        return
      }

      const hoveredPlantInfo = PLANT_LIBRARY.find(p => p.id === hoveredPlantShape.props.plantId)
      if (!hoveredPlantInfo) {
        setTooltip(null)
        return
      }

      // Convert page point to screen coordinates for tooltip positioning
      const screenPoint = editor.pageToScreen(pagePoint)

      setTooltip({
        x: screenPoint.x,
        y: screenPoint.y,
        content: {
          plantName: hoveredPlantInfo.name,
          plantIcon: hoveredPlantInfo.icon,
          relationship,
          otherPlantName: placingPlant.name,
        },
      })
    }

    const handlePointerMove = () => {
      updateTooltip()
    }

    const handleToolChange = () => {
      updateTooltip()
    }

    editor.on('pointer-move', handlePointerMove)
    editor.on('change-history', handleToolChange)

    return () => {
      editor.off('pointer-move', handlePointerMove)
      editor.off('change-history', handleToolChange)
    }
  }, [editor])

  if (!tooltip || !tooltip.content) return null

  const { relationship, plantName, plantIcon, otherPlantName } = tooltip.content
  const isBeneficial = relationship.relationship === 'beneficial'

  return (
    <div
      style={{
        position: 'fixed',
        left: tooltip.x + 20,
        top: tooltip.y - 10,
        zIndex: 10000,
        pointerEvents: 'none',
        maxWidth: '360px',
      }}
    >
      <Card className={`shadow-2xl border-2 ${isBeneficial ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{plantIcon}</span>
            <div className="flex-1">
              <CardTitle className="text-sm">
                {plantName} {isBeneficial ? '↔️' : '⚠️'} {otherPlantName}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                <Badge
                  variant={isBeneficial ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {relationship.strength.toUpperCase()} {relationship.relationship.toUpperCase()}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Benefits or Problems */}
          {isBeneficial && relationship.benefits && relationship.benefits.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-1 text-green-700">Benefits:</p>
              <div className="flex flex-wrap gap-1">
                {relationship.benefits.map(benefit => (
                  <Badge key={benefit} variant="outline" className="text-xs bg-white">
                    {formatBenefit(benefit)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!isBeneficial && relationship.antagonismReasons && relationship.antagonismReasons.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-1 text-red-700">Problems:</p>
              <div className="flex flex-wrap gap-1">
                {relationship.antagonismReasons.map(reason => (
                  <Badge key={reason} variant="outline" className="text-xs bg-white">
                    {formatAntagonismReason(reason)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Mechanism */}
          {relationship.mechanism && (
            <div>
              <p className="text-xs font-semibold mb-1">How it works:</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {relationship.mechanism}
              </p>
            </div>
          )}

          <Separator />

          {/* Spacing recommendation */}
          {isBeneficial && relationship.optimalDistance && (
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Optimal spacing:</span>
              <Badge variant="secondary">
                {relationship.optimalDistance.min}" - {relationship.optimalDistance.max}"
              </Badge>
            </div>
          )}

          {!isBeneficial && relationship.minimumSeparation && (
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Minimum separation:</span>
              <Badge variant="destructive">
                {relationship.minimumSeparation}"+
              </Badge>
            </div>
          )}

          {/* Source */}
          {relationship.source && (
            <div className="text-xs text-muted-foreground italic">
              Source: {relationship.source}
            </div>
          )}

          {/* Notes */}
          {relationship.notes && (
            <div className="text-xs bg-white p-2 rounded border border-border">
              <span className="font-semibold">💡 Tip: </span>
              {relationship.notes}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
