'use client'

import { useEditor, TLShape } from 'tldraw'
import { useEffect, useState } from 'react'
import { PlantShape } from '../shapes/plant-shape'
import { checkCompatibility } from '@/lib/data/plant-library'

/**
 * CompanionLinesOverlay
 *
 * Visualizes companion planting relationships with colored lines:
 * - Green lines = Good companions (beneficial relationship)
 * - Red lines = Antagonistic (harmful relationship)
 * - Line thickness indicates proximity strength
 *
 * Can be toggled on/off for cleaner canvas when not needed
 */

interface CompanionLine {
  startX: number
  startY: number
  endX: number
  endY: number
  relationship: 'good' | 'bad'
  plant1Name: string
  plant2Name: string
  distance: number
}

export function CompanionLinesOverlay({
  visible = false,
  opacity = 60,
  maxDistance = 300,
}: {
  visible?: boolean
  opacity?: number
  maxDistance?: number
}) {
  const editor = useEditor()
  const [lines, setLines] = useState<CompanionLine[]>([])

  useEffect(() => {
    if (!editor || !visible) {
      setLines([])
      return
    }

    const updateLines = () => {
      const allShapes = editor.getCurrentPageShapes()
      const plantShapes = allShapes.filter(s => s.type === 'plant') as PlantShape[]

      const companionLines: CompanionLine[] = []

      // Check all pairs of plants
      for (let i = 0; i < plantShapes.length; i++) {
        for (let j = i + 1; j < plantShapes.length; j++) {
          const plant1 = plantShapes[i]
          const plant2 = plantShapes[j]

          const bounds1 = editor.getShapePageBounds(plant1.id)
          const bounds2 = editor.getShapePageBounds(plant2.id)

          if (!bounds1 || !bounds2) continue

          const x1 = bounds1.x + bounds1.w / 2
          const y1 = bounds1.y + bounds1.h / 2
          const x2 = bounds2.x + bounds2.w / 2
          const y2 = bounds2.y + bounds2.h / 2

          // Calculate distance
          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

          // Only show relationships within configurable distance
          if (distance > maxDistance) continue

          // Check compatibility
          const compatibility = checkCompatibility(plant1.props.plantId, plant2.props.plantId)

          // Only show good and bad relationships (skip neutral)
          if (compatibility === 'neutral') continue

          companionLines.push({
            startX: x1,
            startY: y1,
            endX: x2,
            endY: y2,
            relationship: compatibility,
            plant1Name: plant1.props.plantName,
            plant2Name: plant2.props.plantName,
            distance,
          })
        }
      }

      setLines(companionLines)
    }

    // Update when shapes change
    const handleChange = () => {
      updateLines()
    }

    editor.on('change', handleChange)
    updateLines() // Initial update

    return () => {
      editor.off('change', handleChange)
    }
  }, [editor, visible, maxDistance])

  if (!visible || lines.length === 0) return null

  const normalizedOpacity = opacity / 100

  return (
    <svg
      className="tl-overlays__item pointer-events-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 900, // Below highlight overlay but above canvas
      }}
    >
      <defs>
        {/* Gradient for good relationships */}
        <linearGradient id="companion-gradient-good" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: normalizedOpacity }} />
          <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: normalizedOpacity }} />
        </linearGradient>

        {/* Gradient for bad relationships */}
        <linearGradient id="companion-gradient-bad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: normalizedOpacity }} />
          <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: normalizedOpacity }} />
        </linearGradient>

        {/* Glow filter for lines */}
        <filter id="companion-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {lines.map((line, index) => {
        // Calculate line thickness based on distance (closer = thicker)
        const maxDistance = 300
        const normalizedDistance = Math.min(line.distance, maxDistance) / maxDistance
        const thickness = 4 - (normalizedDistance * 2) // 2-4px

        const color = line.relationship === 'good' ? '#22c55e' : '#ef4444'
        const gradientId =
          line.relationship === 'good' ? 'companion-gradient-good' : 'companion-gradient-bad'

        return (
          <g key={`${index}-${line.plant1Name}-${line.plant2Name}`}>
            {/* Background line for glow effect */}
            <line
              x1={line.startX}
              y1={line.startY}
              x2={line.endX}
              y2={line.endY}
              stroke={color}
              strokeWidth={thickness + 2}
              strokeOpacity={0.2}
              filter="url(#companion-glow)"
            />

            {/* Main line */}
            <line
              x1={line.startX}
              y1={line.startY}
              x2={line.endX}
              y2={line.endY}
              stroke={`url(#${gradientId})`}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={line.relationship === 'bad' ? '8,4' : undefined}
            >
              <title>
                {line.plant1Name} {line.relationship === 'good' ? '↔️' : '⚠️'} {line.plant2Name}
              </title>
            </line>

            {/* Midpoint indicator for very close pairs */}
            {line.distance < 100 && (
              <circle
                cx={(line.startX + line.endX) / 2}
                cy={(line.startY + line.endY) / 2}
                r={line.relationship === 'good' ? 4 : 5}
                fill={color}
                fillOpacity={0.8}
              >
                <title>
                  {line.plant1Name} {line.relationship === 'good' ? '↔️' : '⚠️'} {line.plant2Name}
                </title>
              </circle>
            )}
          </g>
        )
      })}

      {/* Legend */}
      {lines.length > 0 && (
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="200" height="70" fill="white" fillOpacity={0.9} rx="8" />

          <text x="10" y="20" fontSize="12" fontWeight="600" fill="#1f2937">
            Companion Relationships
          </text>

          <line x1="10" y1="35" x2="40" y2="35" stroke="#22c55e" strokeWidth="3" />
          <text x="50" y="39" fontSize="11" fill="#374151">
            Good Companions
          </text>

          <line
            x1="10"
            y1="55"
            x2="40"
            y2="55"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="8,4"
          />
          <text x="50" y="59" fontSize="11" fill="#374151">
            Antagonistic
          </text>
        </g>
      )}
    </svg>
  )
}
