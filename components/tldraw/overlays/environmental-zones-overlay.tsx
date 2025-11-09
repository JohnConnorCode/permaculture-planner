'use client'

import { useEditor } from 'tldraw'
import { useEffect, useState } from 'react'
import { PlantShape } from '../shapes/plant-shape'
import { PLANT_LIBRARY } from '@/lib/data/plant-library'

/**
 * EnvironmentalZonesOverlay
 *
 * Shows environmental requirements as color-coded zones:
 * - Sun zones: Full sun, partial shade, full shade
 * - Water zones: High, medium, low water needs
 * - Nutrient zones: Heavy feeders, moderate, light feeders
 */

export type EnvironmentalMode = 'sun' | 'water' | 'nutrients' | 'spacing'

interface ZoneVisualization {
  centerX: number
  centerY: number
  radius: number
  color: string
  label: string
  plantId: string
  plantName: string
  icon: string
}

export function EnvironmentalZonesOverlay({
  mode,
  visible = false,
}: {
  mode: EnvironmentalMode
  visible?: boolean
}) {
  const editor = useEditor()
  const [zones, setZones] = useState<ZoneVisualization[]>([])

  useEffect(() => {
    if (!editor || !visible) {
      setZones([])
      return
    }

    const updateZones = () => {
      const allShapes = editor.getCurrentPageShapes()
      const plantShapes = allShapes.filter(s => s.type === 'plant') as PlantShape[]

      const newZones: ZoneVisualization[] = []

      plantShapes.forEach(plantShape => {
        const bounds = editor.getShapePageBounds(plantShape.id)
        if (!bounds) return

        const plantInfo = PLANT_LIBRARY.find(p => p.id === plantShape.props.plantId)
        if (!plantInfo) return

        const centerX = bounds.x + bounds.w / 2
        const centerY = bounds.y + bounds.h / 2

        let color: string
        let label: string
        let radius: number

        switch (mode) {
          case 'sun':
            radius = 60
            switch (plantInfo.requirements.sun) {
              case 'full':
                color = '#fbbf24' // Amber
                label = `☀️ Full Sun`
                break
              case 'partial':
                color = '#a3e635' // Lime
                label = `⛅ Partial Shade`
                break
              case 'shade':
                color = '#60a5fa' // Blue
                label = `🌑 Full Shade`
                break
              default:
                return
            }
            break

          case 'water':
            radius = 50
            switch (plantInfo.requirements.water) {
              case 'high':
                color = '#0ea5e9' // Sky blue
                label = `💧💧💧 High Water`
                break
              case 'medium':
                color = '#06b6d4' // Cyan
                label = `💧💧 Medium Water`
                break
              case 'low':
                color = '#d97706' // Amber
                label = `💧 Low Water`
                break
              default:
                return
            }
            break

          case 'nutrients':
            // Estimate nutrient needs based on plant type
            radius = 55
            const isHeavyFeeder = ['tomato', 'corn', 'squash', 'cabbage', 'pepper'].includes(plantInfo.id)
            const isLightFeeder = ['beans', 'peas', 'radish', 'lettuce'].includes(plantInfo.id)

            if (isHeavyFeeder) {
              color = '#dc2626' // Red
              label = `🍖 Heavy Feeder`
            } else if (isLightFeeder) {
              color = '#84cc16' // Lime
              label = `🥬 Light Feeder`
            } else {
              color = '#f59e0b' // Amber
              label = `🌱 Moderate Feeder`
            }
            break

          case 'spacing':
            radius = plantInfo.size.spacing * 2.5 // Convert spacing to visual radius
            color = '#8b5cf6' // Purple
            label = `${plantInfo.size.spacing}" spacing`
            break

          default:
            return
        }

        newZones.push({
          centerX,
          centerY,
          radius,
          color,
          label,
          plantId: plantInfo.id,
          plantName: plantInfo.name,
          icon: plantInfo.icon,
        })
      })

      setZones(newZones)
    }

    const handleChange = () => {
      updateZones()
    }

    editor.on('change', handleChange)
    updateZones()

    return () => {
      editor.off('change', handleChange)
    }
  }, [editor, visible, mode])

  if (!visible || zones.length === 0) return null

  // Get mode display name and description
  const modeInfo = {
    sun: {
      title: 'Sun Requirements',
      description: 'Shows sunlight needs for each plant',
    },
    water: {
      title: 'Water Needs',
      description: 'Shows irrigation requirements',
    },
    nutrients: {
      title: 'Nutrient Requirements',
      description: 'Shows feeding intensity needs',
    },
    spacing: {
      title: 'Optimal Spacing',
      description: 'Shows required spacing radius',
    },
  }

  return (
    <svg
      className="tl-overlays__item pointer-events-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 860,
      }}
    >
      <defs>
        {/* Gradient for zones */}
        <radialGradient id="env-zone-gradient">
          <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.05 }} />
        </radialGradient>
      </defs>

      {zones.map((zone, index) => (
        <g key={`${zone.plantId}-${index}`}>
          {/* Zone circle */}
          <circle
            cx={zone.centerX}
            cy={zone.centerY}
            r={zone.radius}
            fill={`url(#env-zone-gradient)`}
            stroke={zone.color}
            strokeWidth={2}
            strokeDasharray={mode === 'spacing' ? '4,4' : undefined}
            strokeOpacity={0.6}
            style={{ color: zone.color }}
          >
            <title>
              {zone.icon} {zone.plantName}: {zone.label}
            </title>
          </circle>

          {/* Label badge */}
          {mode !== 'spacing' && (
            <g transform={`translate(${zone.centerX}, ${zone.centerY - zone.radius - 8})`}>
              <rect
                x="-50"
                y="-10"
                width="100"
                height="20"
                fill="white"
                fillOpacity={0.95}
                rx="10"
                stroke={zone.color}
                strokeWidth={1.5}
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill={zone.color}
              >
                {zone.label}
              </text>
            </g>
          )}
        </g>
      ))}

      {/* Legend */}
      <g transform="translate(20, 180)">
        <rect x="0" y="0" width="200" height="70" fill="white" fillOpacity={0.9} rx="8" />

        <text x="10" y="20" fontSize="12" fontWeight="600" fill="#1f2937">
          {modeInfo[mode].title}
        </text>

        <text x="10" y="35" fontSize="9" fill="#6b7280">
          {modeInfo[mode].description}
        </text>

        {/* Mode-specific legend items */}
        {mode === 'sun' && (
          <g>
            <circle cx="20" cy="52" r="6" fill="#fbbf24" fillOpacity={0.3} stroke="#fbbf24" />
            <text x="32" y="56" fontSize="9" fill="#374151">Full Sun</text>

            <circle cx="90" cy="52" r="6" fill="#a3e635" fillOpacity={0.3} stroke="#a3e635" />
            <text x="102" y="56" fontSize="9" fill="#374151">Partial</text>
          </g>
        )}

        {mode === 'water' && (
          <g>
            <circle cx="20" cy="52" r="6" fill="#0ea5e9" fillOpacity={0.3} stroke="#0ea5e9" />
            <text x="32" y="56" fontSize="9" fill="#374151">High</text>

            <circle cx="75" cy="52" r="6" fill="#06b6d4" fillOpacity={0.3} stroke="#06b6d4" />
            <text x="87" y="56" fontSize="9" fill="#374151">Medium</text>

            <circle cx="145" cy="52" r="6" fill="#d97706" fillOpacity={0.3} stroke="#d97706" />
            <text x="157" y="56" fontSize="9" fill="#374151">Low</text>
          </g>
        )}

        {mode === 'nutrients' && (
          <g>
            <circle cx="20" cy="52" r="6" fill="#dc2626" fillOpacity={0.3} stroke="#dc2626" />
            <text x="32" y="56" fontSize="9" fill="#374151">Heavy</text>

            <circle cx="90" cy="52" r="6" fill="#84cc16" fillOpacity={0.3} stroke="#84cc16" />
            <text x="102" y="56" fontSize="9" fill="#374151">Light</text>
          </g>
        )}
      </g>
    </svg>
  )
}
