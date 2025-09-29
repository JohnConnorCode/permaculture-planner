'use client'

import React, { useState, useRef, useCallback } from 'react'
import { CanvasRenderer } from './canvas-renderer'
import { InteractionLayer } from './interaction-layer'
import { useGardenDesigner } from '@/contexts/garden-designer-context'

interface GardenCanvasProps {
  width?: number
  height?: number
  className?: string
}

export function GardenCanvas({
  width = 800,
  height = 600,
  className = ''
}: GardenCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { state } = useGardenDesigner()

  // ViewBox state for panning and zooming
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 1000,
    height: 750
  })

  // Apply zoom
  const scaledViewBox = {
    x: viewBox.x,
    y: viewBox.y,
    width: viewBox.width * (100 / state.viewSettings.zoom),
    height: viewBox.height * (100 / state.viewSettings.zoom)
  }

  // Handle viewbox changes from interaction layer
  const handleViewBoxChange = useCallback((newViewBox: typeof viewBox) => {
    setViewBox(newViewBox)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-50 rounded-lg border ${className}`}
      style={{ width, height }}
    >
      {/* Rendering layer */}
      <CanvasRenderer
        width={width}
        height={height}
        viewBox={scaledViewBox}
      />

      {/* Interaction layer */}
      <InteractionLayer
        width={width}
        height={height}
        viewBox={scaledViewBox}
        onViewBoxChange={handleViewBoxChange}
      />

      {/* Context menu overlay */}
      {state.showContextMenu && (
        <div
          className="absolute bg-white rounded-lg shadow-lg border p-1 z-50"
          style={{
            left: state.contextMenuPosition.x,
            top: state.contextMenuPosition.y
          }}
        >
          <ContextMenu />
        </div>
      )}

      {/* Status overlay */}
      <div className="absolute bottom-2 left-2 bg-white/90 rounded px-2 py-1 text-xs">
        <span className="text-gray-600">
          Zoom: {state.viewSettings.zoom}% | Tool: {state.selectedTool}
        </span>
      </div>
    </div>
  )
}

// Context menu component
function ContextMenu() {
  const { state, dispatch, groupSelectedPlants, ungroupPlants, copyBed, pasteBed } = useGardenDesigner()

  const handleGroup = () => {
    if (state.selectedPlantIds.length > 1) {
      // Create group from selected plants
      // Find the bed ID from selected plants
      let bedId = ''
      for (const bed of state.beds) {
        if (bed.plants.some(p => state.selectedPlantIds.includes(p.id))) {
          bedId = bed.id
          break
        }
      }

      // Create PlantedItem objects from selected IDs
      const plantedItems = state.beds.flatMap(bed =>
        bed.plants.filter(p => state.selectedPlantIds.includes(p.id))
      )

      const group = {
        id: `group-${Date.now()}`,
        name: `Group ${state.plantGroups.length + 1}`,
        bedId,
        plants: plantedItems,
        plantingDate: new Date()
      }
      groupSelectedPlants(group as any)
    }
    dispatch({ type: 'HIDE_CONTEXT_MENU' })
  }

  const handleUngroup = () => {
    // Find groups containing selected plants
    const groupsToUngroup = state.plantGroups.filter(g =>
      g.plants.some(p => state.selectedPlantIds.includes(p.id))
    )
    groupsToUngroup.forEach(g => ungroupPlants(g.id))
    dispatch({ type: 'HIDE_CONTEXT_MENU' })
  }

  const handleCopy = () => {
    if (state.selectedBedId) {
      const bed = state.beds.find(b => b.id === state.selectedBedId)
      if (bed) copyBed(bed)
    }
    dispatch({ type: 'HIDE_CONTEXT_MENU' })
  }

  const handlePaste = () => {
    pasteBed()
    dispatch({ type: 'HIDE_CONTEXT_MENU' })
  }

  return (
    <>
      {state.selectedPlantIds.length > 1 && (
        <button
          className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
          onClick={handleGroup}
        >
          Group Selected
        </button>
      )}
      {state.selectedPlantIds.length > 0 && (
        <button
          className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
          onClick={handleUngroup}
        >
          Ungroup Selected
        </button>
      )}
      <div className="border-t my-1" />
      <button
        className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
        onClick={handleCopy}
      >
        Copy
      </button>
      <button
        className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
        onClick={handlePaste}
        disabled={!state.clipboard}
      >
        Paste
      </button>
    </>
  )
}