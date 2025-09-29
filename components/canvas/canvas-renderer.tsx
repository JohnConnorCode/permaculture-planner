'use client'

import React from 'react'
import { GardenBed, PlantedItem } from '@/components/garden-designer-canvas'
import { getPlantById } from '@/lib/data/plant-library'
import { ELEMENT_STYLES } from '@/lib/canvas-elements'
import { PlantGroup } from '@/lib/plant-management'
import { useGardenDesigner } from '@/contexts/garden-designer-context'

interface CanvasRendererProps {
  width: number
  height: number
  viewBox: { x: number; y: number; width: number; height: number }
}

export function CanvasRenderer({ width, height, viewBox }: CanvasRendererProps) {
  const { state } = useGardenDesigner()
  const { beds, plantGroups, viewSettings, selectedBedId, selectedPlantIds } = state

  // Render a single bed
  const renderBed = (bed: GardenBed) => {
    const isSelected = bed.id === selectedBedId
    const pathData = bed.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

    // If it's an element, use element styles
    if (bed.elementType && bed.elementCategory) {
      const elementStyle = ELEMENT_STYLES[bed.elementCategory]?.[bed.elementType]
      if (elementStyle) {
        return (
          <g key={bed.id}>
            <path
              d={pathData}
              fill={elementStyle.fill}
              stroke={isSelected ? '#3b82f6' : elementStyle.stroke}
              strokeWidth={isSelected ? 3 : 2}
              strokeDasharray={elementStyle.strokeDasharray}
              opacity={0.8}
            />
            {viewSettings.showLabels && bed.name && (
              <text
                x={bed.points[0].x}
                y={bed.points[0].y - 10}
                fill="#374151"
                fontSize="14"
                fontWeight="500"
              >
                {bed.name}
              </text>
            )}
          </g>
        )
      }
    }

    // Regular garden bed
    return (
      <g key={bed.id}>
        <path
          d={pathData}
          fill={bed.fill || '#f3f4f6'}
          stroke={isSelected ? '#3b82f6' : bed.stroke || '#9ca3af'}
          strokeWidth={isSelected ? 3 : 2}
          strokeDasharray={isSelected ? '5,5' : undefined}
        />
        {viewSettings.showLabels && bed.name && (
          <text
            x={bed.points[0].x}
            y={bed.points[0].y - 10}
            fill="#374151"
            fontSize="14"
            fontWeight="500"
          >
            {bed.name}
          </text>
        )}
      </g>
    )
  }

  // Render plants in a bed
  const renderPlants = (bed: GardenBed) => {
    return bed.plants.map((plant) => {
      const plantInfo = getPlantById(plant.plantId)
      if (!plantInfo) return null

      const isSelected = selectedPlantIds.includes(plant.id)
      const group = plantGroups.find(g =>
        g.bedId === bed.id && g.plantIds.includes(plant.id)
      )

      return (
        <g key={plant.id}>
          <circle
            cx={plant.x}
            cy={plant.y}
            r={20}
            fill={group ? '#e0e7ff' : '#fff'}
            stroke={isSelected ? '#3b82f6' : group ? '#6366f1' : '#d1d5db'}
            strokeWidth={isSelected ? 2 : 1}
            strokeDasharray={isSelected ? '3,3' : undefined}
          />
          <text
            x={plant.x}
            y={plant.y + 5}
            textAnchor="middle"
            fontSize="20"
          >
            {plantInfo.icon}
          </text>
          {viewSettings.showLabels && (
            <text
              x={plant.x}
              y={plant.y + 35}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {plantInfo.name}
            </text>
          )}
        </g>
      )
    })
  }

  // Render grid
  const renderGrid = () => {
    if (!viewSettings.showGrid) return null

    const gridSize = 50
    const lines = []

    // Vertical lines
    for (let x = viewBox.x; x < viewBox.x + viewBox.width; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={viewBox.y}
          x2={x}
          y2={viewBox.y + viewBox.height}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      )
    }

    // Horizontal lines
    for (let y = viewBox.y; y < viewBox.y + viewBox.height; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={viewBox.x}
          y1={y}
          x2={viewBox.x + viewBox.width}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      )
    }

    return <g>{lines}</g>
  }

  // Render group boundaries
  const renderGroupBoundaries = () => {
    return plantGroups.map(group => {
      const bed = beds.find(b => b.id === group.bedId)
      if (!bed) return null

      const groupPlants = bed.plants.filter(p => group.plantIds.includes(p.id))
      if (groupPlants.length === 0) return null

      // Calculate bounding box
      const xs = groupPlants.map(p => p.x)
      const ys = groupPlants.map(p => p.y)
      const minX = Math.min(...xs) - 30
      const maxX = Math.max(...xs) + 30
      const minY = Math.min(...ys) - 30
      const maxY = Math.max(...ys) + 30

      return (
        <g key={group.id}>
          <rect
            x={minX}
            y={minY}
            width={maxX - minX}
            height={maxY - minY}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.5"
            rx="10"
          />
          {viewSettings.showLabels && (
            <text
              x={minX + 5}
              y={minY - 5}
              fill="#6366f1"
              fontSize="12"
              fontWeight="500"
            >
              {group.name}
            </text>
          )}
        </g>
      )
    })
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      style={{ background: '#fafafa' }}
    >
      {/* Grid layer */}
      {renderGrid()}

      {/* Beds layer */}
      <g id="beds-layer">
        {beds.map(renderBed)}
      </g>

      {/* Plants layer */}
      <g id="plants-layer">
        {beds.map(bed => (
          <g key={`plants-${bed.id}`}>
            {renderPlants(bed)}
          </g>
        ))}
      </g>

      {/* Groups layer */}
      <g id="groups-layer">
        {renderGroupBoundaries()}
      </g>

      {/* Zone indicators */}
      {viewSettings.showZones && (
        <g id="zones-layer">
          {beds.map(bed => bed.zone !== undefined && (
            <text
              key={`zone-${bed.id}`}
              x={bed.points[0].x + 10}
              y={bed.points[0].y + 20}
              fill="#9333ea"
              fontSize="12"
              fontWeight="bold"
            >
              Zone {bed.zone}
            </text>
          ))}
        </g>
      )}
    </svg>
  )
}