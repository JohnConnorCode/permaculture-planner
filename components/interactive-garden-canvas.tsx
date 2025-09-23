'use client'

import { useState, useRef, useEffect } from 'react'
import { GardenElement } from '@/lib/config/garden-shapes'
import { cn } from '@/lib/utils'

interface InteractiveGardenCanvasProps {
  elements: GardenElement[]
  onElementClick?: (element: GardenElement) => void
  onElementDrag?: (id: string, x: number, y: number) => void
  onCanvasClick?: (x: number, y: number) => void
  selectedTool?: string
  zoom?: number
  showGrid?: boolean
  className?: string
}

export function InteractiveGardenCanvas({
  elements,
  onElementClick,
  onElementDrag,
  onCanvasClick,
  selectedTool = 'select',
  zoom = 100,
  showGrid = true,
  className
}: InteractiveGardenCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  // Handle mouse down on element
  const handleElementMouseDown = (e: React.MouseEvent, element: GardenElement) => {
    if (!element.interactive || selectedTool !== 'select') return

    e.stopPropagation()
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return

    const scale = zoom / 100
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    setDraggedElement(element.id)
    setDragOffset({
      x: x - element.x,
      y: y - element.y
    })
    setSelectedElement(element.id)
    onElementClick?.(element)
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement || !svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const scale = zoom / 100
    const x = (e.clientX - rect.left) / scale - dragOffset.x
    const y = (e.clientY - rect.top) / scale - dragOffset.y

    onElementDrag?.(draggedElement, x, y)
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setDraggedElement(null)
  }

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return

    const scale = zoom / 100
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    onCanvasClick?.(x, y)
  }

  // Render different shapes
  const renderElement = (element: GardenElement) => {
    const isHovered = hoveredElement === element.id
    const isSelected = selectedElement === element.id
    const isDragging = draggedElement === element.id

    const strokeWidth = isSelected ? 3 : isHovered ? 2 : 1
    const cursor = element.interactive && selectedTool === 'select' ? 'move' : 'pointer'
    const transform = element.rotation ? `rotate(${element.rotation} ${element.x} ${element.y})` : undefined

    switch (element.shape) {
      case 'rect':
        return (
          <g key={element.id} transform={transform}>
            <rect
              x={element.x}
              y={element.y}
              width={element.width || 60}
              height={element.height || 40}
              fill={element.fill || '#86efac'}
              stroke={element.stroke || '#16a34a'}
              strokeWidth={strokeWidth}
              opacity={element.opacity || 0.8}
              className={cn(
                "transition-all duration-200",
                element.interactive && "hover:opacity-100"
              )}
              style={{ cursor }}
              onMouseDown={(e) => handleElementMouseDown(e, element)}
              onMouseEnter={() => setHoveredElement(element.id)}
              onMouseLeave={() => setHoveredElement(null)}
            />
            {element.label && (
              <text
                x={element.x + (element.width || 60) / 2}
                y={element.y + (element.height || 40) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-gray-700 pointer-events-none select-none"
              >
                {element.label}
              </text>
            )}
            {isSelected && (
              <>
                {/* Selection handles */}
                <circle cx={element.x} cy={element.y} r="3" fill="#3b82f6" />
                <circle cx={element.x + (element.width || 60)} cy={element.y} r="3" fill="#3b82f6" />
                <circle cx={element.x} cy={element.y + (element.height || 40)} r="3" fill="#3b82f6" />
                <circle cx={element.x + (element.width || 60)} cy={element.y + (element.height || 40)} r="3" fill="#3b82f6" />
              </>
            )}
          </g>
        )

      case 'circle':
        return (
          <g key={element.id} transform={transform}>
            <circle
              cx={element.x}
              cy={element.y}
              r={element.radius || 30}
              fill={element.fill || '#22c55e'}
              stroke={element.stroke || '#15803d'}
              strokeWidth={strokeWidth}
              opacity={element.opacity || 0.8}
              className={cn(
                "transition-all duration-200",
                element.interactive && "hover:opacity-100"
              )}
              style={{ cursor }}
              onMouseDown={(e) => handleElementMouseDown(e, element)}
              onMouseEnter={() => setHoveredElement(element.id)}
              onMouseLeave={() => setHoveredElement(null)}
            />
            {element.label && (
              <text
                x={element.x}
                y={element.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-white pointer-events-none select-none"
              >
                {element.label}
              </text>
            )}
            {isSelected && (
              <>
                {/* Selection handles */}
                <circle cx={element.x - (element.radius || 30)} cy={element.y} r="3" fill="#3b82f6" />
                <circle cx={element.x + (element.radius || 30)} cy={element.y} r="3" fill="#3b82f6" />
                <circle cx={element.x} cy={element.y - (element.radius || 30)} r="3" fill="#3b82f6" />
                <circle cx={element.x} cy={element.y + (element.radius || 30)} r="3" fill="#3b82f6" />
              </>
            )}
          </g>
        )

      case 'polygon':
        if (!element.points) return null
        const polygonPoints = element.points
          .map(p => `${element.x + p.x},${element.y + p.y}`)
          .join(' ')

        return (
          <g key={element.id} transform={transform}>
            <polygon
              points={polygonPoints}
              fill={element.fill || '#86efac'}
              stroke={element.stroke || '#16a34a'}
              strokeWidth={strokeWidth}
              opacity={element.opacity || 0.8}
              className={cn(
                "transition-all duration-200",
                element.interactive && "hover:opacity-100"
              )}
              style={{ cursor }}
              onMouseDown={(e) => handleElementMouseDown(e, element)}
              onMouseEnter={() => setHoveredElement(element.id)}
              onMouseLeave={() => setHoveredElement(null)}
            />
            {element.label && element.points.length > 0 && (
              <text
                x={element.x + element.points.reduce((sum, p) => sum + p.x, 0) / element.points.length}
                y={element.y + element.points.reduce((sum, p) => sum + p.y, 0) / element.points.length}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-gray-700 pointer-events-none select-none"
              >
                {element.label}
              </text>
            )}
          </g>
        )

      case 'curve':
        if (!element.points || element.points.length < 2) return null
        let pathData = `M ${element.x + element.points[0].x} ${element.y + element.points[0].y}`
        for (let i = 1; i < element.points.length; i++) {
          const p = element.points[i]
          const prevP = element.points[i - 1]
          const controlX = element.x + (prevP.x + p.x) / 2
          const controlY = element.y + (prevP.y + p.y) / 2
          pathData += ` Q ${controlX} ${controlY}, ${element.x + p.x} ${element.y + p.y}`
        }

        return (
          <g key={element.id} transform={transform}>
            <path
              d={pathData}
              fill={element.fill || 'none'}
              stroke={element.stroke || '#3b82f6'}
              strokeWidth={strokeWidth * 2}
              opacity={element.opacity || 0.7}
              className="transition-all duration-200"
              style={{ cursor }}
              onMouseDown={(e) => handleElementMouseDown(e, element)}
              onMouseEnter={() => setHoveredElement(element.id)}
              onMouseLeave={() => setHoveredElement(null)}
            />
            {element.label && (
              <text
                x={element.x + element.points[Math.floor(element.points.length / 2)].x}
                y={element.y + element.points[Math.floor(element.points.length / 2)].y - 10}
                textAnchor="middle"
                className="text-xs font-medium fill-blue-600 pointer-events-none select-none"
              >
                {element.label}
              </text>
            )}
          </g>
        )

      default:
        return null
    }
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 600"
      className={cn("w-full h-full", className)}
      style={{ transform: `scale(${zoom / 100})` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* Grid */}
      {showGrid && (
        <>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="600" height="600" fill="url(#grid)" />
        </>
      )}

      {/* Render all elements */}
      {elements.map(renderElement)}

      {/* Cursor indicator */}
      {selectedTool !== 'select' && (
        <g className="pointer-events-none">
          <text x="10" y="20" className="text-xs fill-gray-500">
            Tool: {selectedTool}
          </text>
        </g>
      )}
    </svg>
  )
}