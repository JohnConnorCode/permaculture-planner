'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Point {
  x: number
  y: number
}

interface SmartGuidesProps {
  activeElement?: {
    x: number
    y: number
    width: number
    height: number
  }
  elements: Array<{
    x: number
    y: number
    width: number
    height: number
  }>
  snapThreshold?: number
  showDistances?: boolean
  className?: string
}

export function SmartGuides({
  activeElement,
  elements,
  snapThreshold = 10,
  showDistances = true,
  className
}: SmartGuidesProps) {
  const [guides, setGuides] = useState<{
    vertical: number[]
    horizontal: number[]
    distances: { x?: number; y?: number }
  }>({ vertical: [], horizontal: [], distances: {} })

  useEffect(() => {
    if (!activeElement) {
      setGuides({ vertical: [], horizontal: [], distances: {} })
      return
    }

    const vertical: number[] = []
    const horizontal: number[] = []
    const distances: { x?: number; y?: number } = {}

    elements.forEach(element => {
      // Skip self
      if (element === activeElement) return

      // Check vertical alignment
      // Left edge alignment
      if (Math.abs(activeElement.x - element.x) < snapThreshold) {
        vertical.push(element.x)
      }
      // Right edge alignment
      if (Math.abs((activeElement.x + activeElement.width) - (element.x + element.width)) < snapThreshold) {
        vertical.push(element.x + element.width)
      }
      // Center alignment
      const activeCenter = activeElement.x + activeElement.width / 2
      const elementCenter = element.x + element.width / 2
      if (Math.abs(activeCenter - elementCenter) < snapThreshold) {
        vertical.push(elementCenter)
      }

      // Check horizontal alignment
      // Top edge alignment
      if (Math.abs(activeElement.y - element.y) < snapThreshold) {
        horizontal.push(element.y)
      }
      // Bottom edge alignment
      if (Math.abs((activeElement.y + activeElement.height) - (element.y + element.height)) < snapThreshold) {
        horizontal.push(element.y + element.height)
      }
      // Center alignment
      const activeMiddle = activeElement.y + activeElement.height / 2
      const elementMiddle = element.y + element.height / 2
      if (Math.abs(activeMiddle - elementMiddle) < snapThreshold) {
        horizontal.push(elementMiddle)
      }

      // Calculate distances to nearest element
      if (showDistances) {
        const xDistance = Math.min(
          Math.abs(activeElement.x - (element.x + element.width)),
          Math.abs((activeElement.x + activeElement.width) - element.x)
        )
        const yDistance = Math.min(
          Math.abs(activeElement.y - (element.y + element.height)),
          Math.abs((activeElement.y + activeElement.height) - element.y)
        )

        if (xDistance < 50 && (!distances.x || xDistance < distances.x)) {
          distances.x = Math.round(xDistance)
        }
        if (yDistance < 50 && (!distances.y || yDistance < distances.y)) {
          distances.y = Math.round(yDistance)
        }
      }
    })

    setGuides({ vertical: Array.from(new Set(vertical)), horizontal: Array.from(new Set(horizontal)), distances })
  }, [activeElement, elements, snapThreshold, showDistances])

  if (!activeElement || (guides.vertical.length === 0 && guides.horizontal.length === 0)) {
    return null
  }

  return (
    <svg
      className={cn("absolute inset-0 pointer-events-none z-50", className)}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Vertical guides */}
      {guides.vertical.map((x, i) => (
        <g key={`v-${i}`}>
          <line
            x1={x}
            y1={0}
            x2={x}
            y2="100%"
            stroke="#3B82F6"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.8"
          />
          {/* Animated pulse effect */}
          <line
            x1={x}
            y1={0}
            x2={x}
            y2="100%"
            stroke="#3B82F6"
            strokeWidth="2"
            opacity="0"
            className="animate-pulse-guide"
          />
        </g>
      ))}

      {/* Horizontal guides */}
      {guides.horizontal.map((y, i) => (
        <g key={`h-${i}`}>
          <line
            x1={0}
            y1={y}
            x2="100%"
            y2={y}
            stroke="#3B82F6"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.8"
          />
          {/* Animated pulse effect */}
          <line
            x1={0}
            y1={y}
            x2="100%"
            y2={y}
            stroke="#3B82F6"
            strokeWidth="2"
            opacity="0"
            className="animate-pulse-guide"
          />
        </g>
      ))}

      {/* Distance measurements */}
      {showDistances && activeElement && (
        <>
          {guides.distances.x && (
            <g>
              <rect
                x={activeElement.x + activeElement.width + 5}
                y={activeElement.y + activeElement.height / 2 - 10}
                width={30}
                height={20}
                fill="#3B82F6"
                rx="4"
                opacity="0.9"
              />
              <text
                x={activeElement.x + activeElement.width + 20}
                y={activeElement.y + activeElement.height / 2 + 4}
                fill="white"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                {guides.distances.x}px
              </text>
            </g>
          )}
          {guides.distances.y && (
            <g>
              <rect
                x={activeElement.x + activeElement.width / 2 - 15}
                y={activeElement.y + activeElement.height + 5}
                width={30}
                height={20}
                fill="#3B82F6"
                rx="4"
                opacity="0.9"
              />
              <text
                x={activeElement.x + activeElement.width / 2}
                y={activeElement.y + activeElement.height + 19}
                fill="white"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                {guides.distances.y}px
              </text>
            </g>
          )}
        </>
      )}

      <style jsx>{`
        @keyframes pulse-guide {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-guide {
          animation: pulse-guide 1.5s ease-in-out infinite;
        }
      `}</style>
    </svg>
  )
}

// Snap point to grid
export function snapToGrid(point: Point, gridSize: number = 10): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }
}

// Magnetic snap to other elements
export function magneticSnap(
  activeElement: { x: number; y: number; width: number; height: number },
  elements: Array<{ x: number; y: number; width: number; height: number }>,
  threshold: number = 10
): { x: number; y: number; snapped: boolean } {
  let snappedX = activeElement.x
  let snappedY = activeElement.y
  let didSnap = false

  elements.forEach(element => {
    // Skip self
    if (element === activeElement) return

    // Snap X coordinates
    if (Math.abs(activeElement.x - element.x) < threshold) {
      snappedX = element.x
      didSnap = true
    } else if (Math.abs(activeElement.x - (element.x + element.width)) < threshold) {
      snappedX = element.x + element.width
      didSnap = true
    } else if (Math.abs((activeElement.x + activeElement.width) - element.x) < threshold) {
      snappedX = element.x - activeElement.width
      didSnap = true
    }

    // Snap Y coordinates
    if (Math.abs(activeElement.y - element.y) < threshold) {
      snappedY = element.y
      didSnap = true
    } else if (Math.abs(activeElement.y - (element.y + element.height)) < threshold) {
      snappedY = element.y + element.height
      didSnap = true
    } else if (Math.abs((activeElement.y + activeElement.height) - element.y) < threshold) {
      snappedY = element.y - activeElement.height
      didSnap = true
    }
  })

  return { x: snappedX, y: snappedY, snapped: didSnap }
}