'use client'

import { useEditor } from 'tldraw'
import { useEffect, useState } from 'react'
import { ElementShape } from '../shapes/element-shape'
import { ElementSubtype } from '@/lib/canvas-elements'

/**
 * ElementImpactZonesOverlay
 *
 * Shows functional impact zones for garden elements:
 * - Water tanks → Irrigation coverage radius (based on capacity)
 * - Greenhouses → Protected growing area & microclimate zone
 * - Beehives → Pollination radius
 * - Compost bins → Nutrient distribution area
 * - Solar panels → Shade zones
 * - Structures → Access zones
 *
 * Makes elements feel "alive" and shows their functional relationships
 */

interface ImpactZone {
  elementId: string
  elementName: string
  elementType: ElementSubtype
  centerX: number
  centerY: number
  radius: number
  color: string
  label: string
  opacity: number
  pattern?: 'dots' | 'waves' | 'rays'
}

function calculateImpactZone(
  subtype: ElementSubtype,
  bounds: { x: number; y: number; w: number; h: number },
  capacity?: number
): ImpactZone | null {
  const centerX = bounds.x + bounds.w / 2
  const centerY = bounds.y + bounds.h / 2

  switch (subtype) {
    // Water Management - irrigation coverage
    case 'water_tank':
      const tankCapacity = capacity || 500 // gallons
      // Rule: 1 gallon serves ~1 sq ft at 1"/week
      // Radius calculation: r = sqrt(capacity / π)
      const waterRadius = Math.sqrt(tankCapacity / Math.PI) * 2.5 // scale for visual
      return {
        elementId: '',
        elementName: 'Water Tank',
        elementType: 'water_tank',
        centerX,
        centerY,
        radius: waterRadius,
        color: '#3b82f6',
        label: `Irrigation: ~${Math.round(tankCapacity)} sq ft`,
        opacity: 0.15,
        pattern: 'waves',
      }

    case 'pond':
      return {
        elementId: '',
        elementName: 'Pond',
        elementType: 'pond',
        centerX,
        centerY,
        radius: 150,
        color: '#0ea5e9',
        label: 'Humidity & Wildlife Zone',
        opacity: 0.1,
        pattern: 'waves',
      }

    case 'rain_garden':
      return {
        elementId: '',
        elementName: 'Rain Garden',
        elementType: 'rain_garden',
        centerX,
        centerY,
        radius: 100,
        color: '#06b6d4',
        label: 'Water Catchment',
        opacity: 0.15,
      }

    // Structures - microclimate effects
    case 'greenhouse':
      const greenhouseRadius = Math.max(bounds.w, bounds.h) * 0.8
      return {
        elementId: '',
        elementName: 'Greenhouse',
        elementType: 'greenhouse',
        centerX,
        centerY,
        radius: greenhouseRadius,
        color: '#22c55e',
        label: 'Extended Season Zone',
        opacity: 0.12,
        pattern: 'rays',
      }

    case 'shed':
      return {
        elementId: '',
        elementName: 'Shed',
        elementType: 'shed',
        centerX,
        centerY,
        radius: 60,
        color: '#f59e0b',
        label: 'Tool Access Zone',
        opacity: 0.08,
      }

    // Animals - pollination & foraging
    case 'beehive':
      return {
        elementId: '',
        elementName: 'Beehive',
        elementType: 'beehive',
        centerX,
        centerY,
        radius: 200, // Bees forage within ~300ft, show 200px
        color: '#fbbf24',
        label: 'Pollination Radius',
        opacity: 0.1,
        pattern: 'dots',
      }

    case 'chicken_coop':
      return {
        elementId: '',
        elementName: 'Chicken Coop',
        elementType: 'chicken_coop',
        centerX,
        centerY,
        radius: 120,
        color: '#ef4444',
        label: 'Foraging & Fertilizer Zone',
        opacity: 0.1,
      }

    // Waste Management - nutrient distribution
    case 'compost_bin':
      return {
        elementId: '',
        elementName: 'Compost',
        elementType: 'compost_bin',
        centerX,
        centerY,
        radius: 80,
        color: '#a16207',
        label: 'Nutrient Distribution',
        opacity: 0.15,
        pattern: 'dots',
      }

    case 'worm_farm':
      return {
        elementId: '',
        elementName: 'Worm Farm',
        elementType: 'worm_farm',
        centerX,
        centerY,
        radius: 60,
        color: '#92400e',
        label: 'Worm Casting Zone',
        opacity: 0.12,
      }

    // Energy - shade zones
    case 'solar_panel':
      return {
        elementId: '',
        elementName: 'Solar Panel',
        elementType: 'solar_panel',
        centerX,
        centerY,
        radius: 100,
        color: '#64748b',
        label: 'Shade Zone (seasonal)',
        opacity: 0.1,
      }

    default:
      return null
  }
}

export function ElementImpactZonesOverlay({ visible = false }: { visible?: boolean }) {
  const editor = useEditor()
  const [impactZones, setImpactZones] = useState<ImpactZone[]>([])

  useEffect(() => {
    if (!editor || !visible) {
      setImpactZones([])
      return
    }

    const updateImpactZones = () => {
      const allShapes = editor.getCurrentPageShapes()
      const elementShapes = allShapes.filter(s => s.type === 'element') as ElementShape[]

      const zones: ImpactZone[] = []

      elementShapes.forEach(element => {
        const bounds = editor.getShapePageBounds(element.id)
        if (!bounds) return

        const zone = calculateImpactZone(
          element.props.subtype,
          bounds,
          element.props.capacity
        )

        if (zone) {
          zones.push({
            ...zone,
            elementId: element.id,
            elementName: element.props.name || zone.elementName,
          })
        }
      })

      setImpactZones(zones)
    }

    const handleChange = () => {
      updateImpactZones()
    }

    editor.on('change', handleChange)
    updateImpactZones()

    return () => {
      editor.off('change', handleChange)
    }
  }, [editor, visible])

  if (!visible || impactZones.length === 0) return null

  return (
    <svg
      className="tl-overlays__item pointer-events-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 850, // Below companion lines
      }}
    >
      <defs>
        {/* Dot pattern for beehives, compost */}
        <pattern id="impact-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" />
        </pattern>

        {/* Wave pattern for water */}
        <pattern id="impact-waves" x="0" y="0" width="30" height="15" patternUnits="userSpaceOnUse">
          <path
            d="M0,7.5 Q7.5,0 15,7.5 T30,7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.3"
          />
        </pattern>

        {/* Ray pattern for greenhouses */}
        <pattern id="impact-rays" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        </pattern>
      </defs>

      {impactZones.map((zone, index) => {
        const patternUrl = zone.pattern ? `url(#impact-${zone.pattern})` : undefined

        return (
          <g key={`${zone.elementId}-${index}`}>
            {/* Impact zone circle */}
            <circle
              cx={zone.centerX}
              cy={zone.centerY}
              r={zone.radius}
              fill={patternUrl || zone.color}
              fillOpacity={zone.opacity}
              stroke={zone.color}
              strokeWidth={2}
              strokeDasharray="8,4"
              strokeOpacity={0.4}
            >
              <title>{`${zone.elementName}: ${zone.label}`}</title>
            </circle>

            {/* Label badge */}
            <g transform={`translate(${zone.centerX}, ${zone.centerY - zone.radius - 10})`}>
              <rect
                x="-60"
                y="-12"
                width="120"
                height="24"
                fill="white"
                fillOpacity={0.95}
                rx="12"
                stroke={zone.color}
                strokeWidth={1.5}
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill={zone.color}
              >
                {zone.label}
              </text>
            </g>
          </g>
        )
      })}

      {/* Legend */}
      {impactZones.length > 0 && (
        <g transform="translate(20, 100)">
          <rect x="0" y="0" width="200" height="60" fill="white" fillOpacity={0.9} rx="8" />

          <text x="10" y="20" fontSize="12" fontWeight="600" fill="#1f2937">
            Element Impact Zones
          </text>

          <circle cx="20" cy="40" r="8" fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" />
          <text x="35" y="44" fontSize="11" fill="#374151">
            Water
          </text>

          <circle cx="95" cy="40" r="8" fill="#fbbf24" fillOpacity={0.1} stroke="#fbbf24" />
          <text x="110" y="44" fontSize="11" fill="#374151">
            Pollination
          </text>
        </g>
      )}
    </svg>
  )
}
