'use client'

import { useEditor, TLShape } from 'tldraw'
import { useEffect, useState } from 'react'
import { PlantShape } from '../shapes/plant-shape'
import { checkCompatibility } from '@/lib/data/plant-library'

/**
 * CompanionHighlightOverlay
 *
 * Shows real-time visual feedback for companion planting compatibility:
 * - Green glow for good companions
 * - Red glow for antagonistic plants
 * - Spacing warnings for overcrowding
 *
 * Activates during plant placement to guide user decisions
 */
export function CompanionHighlightOverlay() {
  const editor = useEditor()
  const [highlights, setHighlights] = useState<Map<string, 'good' | 'bad' | 'warning'>>(new Map())
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)
  const [activePlantId, setActivePlantId] = useState<string | null>(null)

  useEffect(() => {
    if (!editor) return

    const updateHighlights = () => {
      const currentTool = editor.getCurrentToolId()

      // Only show highlights when placing plants
      if (currentTool !== 'plant-tool') {
        setHighlights(new Map())
        setCursorPos(null)
        setActivePlantId(null)
        return
      }

      // Get cursor position
      const pagePoint = editor.inputs.currentPagePoint
      setCursorPos(pagePoint)

      // Get the plant being placed from the tool state
      const plantTool = editor.getStateDescendant('plant-tool') as any
      if (!plantTool?.plantInfo) {
        setHighlights(new Map())
        return
      }

      const placingPlant = plantTool.plantInfo
      setActivePlantId(placingPlant.id)

      // Find all existing plant shapes on canvas
      const allShapes = editor.getCurrentPageShapes()
      const plantShapes = allShapes.filter(s => s.type === 'plant') as PlantShape[]

      const newHighlights = new Map<string, 'good' | 'bad' | 'warning'>()

      plantShapes.forEach(plantShape => {
        // Calculate distance from cursor to this plant
        const plantCenter = editor.getShapePageBounds(plantShape.id)
        if (!plantCenter) return

        const plantX = plantCenter.x + plantCenter.w / 2
        const plantY = plantCenter.y + plantCenter.h / 2
        const distance = Math.sqrt(
          Math.pow(plantX - pagePoint.x, 2) + Math.pow(plantY - pagePoint.y, 2)
        )

        // Only highlight nearby plants (within 200px / ~16 feet at scale)
        if (distance > 200) return

        // Check compatibility
        const compatibility = checkCompatibility(placingPlant.id, plantShape.props.plantId)

        // Check spacing requirements
        const combinedSpacing = (placingPlant.size.spacing + plantShape.props.spacing) / 2
        const requiredDistance = combinedSpacing * 2.5 // Convert spacing to pixel units

        if (distance < requiredDistance) {
          // Too close - spacing warning
          newHighlights.set(plantShape.id, 'warning')
        } else if (compatibility === 'bad') {
          // Antagonistic relationship
          newHighlights.set(plantShape.id, 'bad')
        } else if (compatibility === 'good') {
          // Good companion
          newHighlights.set(plantShape.id, 'good')
        }
      })

      setHighlights(newHighlights)
    }

    // Update on pointer move
    const handlePointerMove = () => {
      updateHighlights()
    }

    // Update when tool changes
    const handleToolChange = () => {
      updateHighlights()
    }

    editor.on('pointer-move', handlePointerMove)
    editor.on('change-history', handleToolChange)

    // Initial update
    updateHighlights()

    return () => {
      editor.off('pointer-move', handlePointerMove)
      editor.off('change-history', handleToolChange)
    }
  }, [editor])

  if (highlights.size === 0 || !cursorPos) return null

  return (
    <svg
      className="tl-overlays__item pointer-events-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 999,
      }}
    >
      {Array.from(highlights.entries()).map(([shapeId, highlightType]) => {
        const shape = editor.getShape(shapeId) as PlantShape | undefined
        if (!shape) return null

        const bounds = editor.getShapePageBounds(shapeId)
        if (!bounds) return null

        const centerX = bounds.x + bounds.w / 2
        const centerY = bounds.y + bounds.h / 2
        const radius = bounds.w / 2

        // Color based on relationship
        let glowColor: string
        let strokeColor: string
        let strokeWidth: number

        switch (highlightType) {
          case 'good':
            glowColor = 'rgba(34, 197, 94, 0.3)' // green
            strokeColor = '#22c55e'
            strokeWidth = 3
            break
          case 'bad':
            glowColor = 'rgba(239, 68, 68, 0.3)' // red
            strokeColor = '#ef4444'
            strokeWidth = 3
            break
          case 'warning':
            glowColor = 'rgba(251, 191, 36, 0.3)' // amber
            strokeColor = '#fbbf24'
            strokeWidth = 2
            break
        }

        return (
          <g key={shapeId}>
            {/* Glow effect */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius + 15}
              fill={glowColor}
              className="animate-pulse"
            />
            {/* Stroke ring */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius + 8}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={highlightType === 'warning' ? '5,5' : undefined}
              className="animate-pulse"
            />
          </g>
        )
      })}

      {/* Preview circle at cursor */}
      {activePlantId && (
        <g>
          <circle
            cx={cursorPos.x}
            cy={cursorPos.y}
            r={30}
            fill="rgba(100, 116, 139, 0.2)"
            stroke="#64748b"
            strokeWidth={2}
            strokeDasharray="4,4"
          />
        </g>
      )}
    </svg>
  )
}
