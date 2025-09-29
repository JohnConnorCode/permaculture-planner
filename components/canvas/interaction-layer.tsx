'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useGardenDesigner } from '@/contexts/garden-designer-context'
import { PlantedItem } from '@/components/garden-designer-canvas'
import { createElementShape } from '@/lib/canvas-elements'

interface InteractionLayerProps {
  width: number
  height: number
  viewBox: { x: number; y: number; width: number; height: number }
  onViewBoxChange: (viewBox: { x: number; y: number; width: number; height: number }) => void
}

export function InteractionLayer({ width, height, viewBox, onViewBoxChange }: InteractionLayerProps) {
  const { state, dispatch, addBed, updateBed, addPlantToBed } = useGardenDesigner()
  const svgRef = useRef<SVGSVGElement>(null)

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawPoints, setDrawPoints] = useState<{ x: number; y: number }[]>([])
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  // Selection rectangle
  const [selectionRect, setSelectionRect] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }

    const pt = svgRef.current.createSVGPoint()
    pt.x = clientX
    pt.y = clientY

    const ctm = svgRef.current.getScreenCTM()
    if (!ctm) return { x: 0, y: 0 }

    const svgPoint = pt.matrixTransform(ctm.inverse())
    return { x: svgPoint.x, y: svgPoint.y }
  }, [])

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const point = screenToSVG(e.clientX, e.clientY)
    const { selectedTool, beds } = state

    if (selectedTool === 'select') {
      // Check if clicking on a plant
      for (const bed of beds) {
        for (const plant of bed.plants) {
          const dist = Math.sqrt(
            Math.pow(plant.x - point.x, 2) + Math.pow(plant.y - point.y, 2)
          )
          if (dist < 20) {
            if (e.ctrlKey || e.metaKey) {
              // Toggle selection
              if (state.selectedPlantIds.includes(plant.id)) {
                dispatch({ type: 'REMOVE_FROM_SELECTION', plantId: plant.id })
              } else {
                dispatch({ type: 'ADD_TO_SELECTION', plantId: plant.id })
              }
            } else {
              // Single selection
              dispatch({ type: 'SELECT_PLANTS', plantIds: [plant.id] })
            }
            return
          }
        }
      }

      // Start selection rectangle
      setDragStart(point)
      setSelectionRect({ x: point.x, y: point.y, width: 0, height: 0 })
    } else if (selectedTool === 'pan') {
      setDragStart(point)
    } else if (['rectangle', 'circle', 'triangle', 'hexagon'].includes(selectedTool)) {
      // Create shape immediately
      const shape = createElementShape(selectedTool as any, point, point)
      const newBed = {
        id: `bed-${Date.now()}`,
        name: `${selectedTool} ${beds.length + 1}`,
        points: shape,
        fill: '#e5e7eb',
        stroke: '#6b7280',
        plants: []
      }
      addBed(newBed)
    } else if (selectedTool === 'pencil') {
      setIsDrawing(true)
      setDrawPoints([point])
    } else if (selectedTool === 'plant' && state.selectedPlant) {
      // Find bed at click point
      for (const bed of beds) {
        if (isPointInPolygon(point, bed.points)) {
          const newPlant: PlantedItem = {
            id: `plant-${Date.now()}`,
            plantId: state.selectedPlant.id,
            x: point.x,
            y: point.y,
            plantedDate: new Date()
          }
          addPlantToBed(bed.id, newPlant)
          break
        }
      }
    }
  }, [state, screenToSVG, addBed, addPlantToBed, dispatch])

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const point = screenToSVG(e.clientX, e.clientY)

    if (state.selectedTool === 'select' && dragStart && selectionRect) {
      // Update selection rectangle
      const rect = {
        x: Math.min(dragStart.x, point.x),
        y: Math.min(dragStart.y, point.y),
        width: Math.abs(point.x - dragStart.x),
        height: Math.abs(point.y - dragStart.y)
      }
      setSelectionRect(rect)

      // Select plants within rectangle
      const selectedPlants: string[] = []
      for (const bed of state.beds) {
        for (const plant of bed.plants) {
          if (
            plant.x >= rect.x &&
            plant.x <= rect.x + rect.width &&
            plant.y >= rect.y &&
            plant.y <= rect.y + rect.height
          ) {
            selectedPlants.push(plant.id)
          }
        }
      }
      dispatch({ type: 'SELECT_PLANTS', plantIds: selectedPlants })
    } else if (state.selectedTool === 'pan' && dragStart) {
      // Pan the view
      const dx = point.x - dragStart.x
      const dy = point.y - dragStart.y
      onViewBoxChange({
        x: viewBox.x - dx,
        y: viewBox.y - dy,
        width: viewBox.width,
        height: viewBox.height
      })
    } else if (state.selectedTool === 'pencil' && isDrawing) {
      setDrawPoints(prev => [...prev, point])
    }
  }, [state, dragStart, selectionRect, isDrawing, screenToSVG, viewBox, onViewBoxChange, dispatch])

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (state.selectedTool === 'pencil' && isDrawing && drawPoints.length > 2) {
      // Create bed from drawn points
      const newBed = {
        id: `bed-${Date.now()}`,
        name: `Custom Bed ${state.beds.length + 1}`,
        points: drawPoints,
        fill: '#e5e7eb',
        stroke: '#6b7280',
        plants: []
      }
      addBed(newBed)
    }

    // Reset states
    setIsDrawing(false)
    setDrawPoints([])
    setDragStart(null)
    setSelectionRect(null)
  }, [state, isDrawing, drawPoints, addBed])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Group/Ungroup
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault()
        // Group selected plants logic
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault()
        // Ungroup selected plants logic
      }
      // Copy/Paste
      else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
        // Copy logic
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        // Paste logic
      }
      // Delete
      else if (e.key === 'Delete') {
        // Delete selected items
      }
      // Clear selection
      else if (e.key === 'Escape') {
        dispatch({ type: 'CLEAR_SELECTION' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  // Helper function to check if point is inside polygon
  const isPointInPolygon = (point: { x: number; y: number }, polygon: { x: number; y: number }[]) => {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x
      const yi = polygon[i].y
      const xj = polygon[j].x
      const yj = polygon[j].y
      const intersect = yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }
    return inside
  }

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        cursor: getCursor(state.selectedTool, state.isDragging)
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Selection rectangle */}
      {selectionRect && (
        <rect
          x={selectionRect.x}
          y={selectionRect.y}
          width={selectionRect.width}
          height={selectionRect.height}
          fill="rgba(59, 130, 246, 0.1)"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}

      {/* Drawing preview */}
      {isDrawing && drawPoints.length > 0 && (
        <polyline
          points={drawPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}
    </svg>
  )
}

// Get cursor based on tool and state
function getCursor(tool: string, isDragging: boolean) {
  switch (tool) {
    case 'pan':
      return isDragging ? 'grabbing' : 'grab'
    case 'pencil':
      return 'crosshair'
    case 'delete':
      return 'not-allowed'
    case 'plant':
      return 'copy'
    default:
      return 'default'
  }
}