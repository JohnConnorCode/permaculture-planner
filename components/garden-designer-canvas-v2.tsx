'use client'

import React, { useEffect, useState } from 'react'
import { GardenDesignerProvider, useGardenDesigner } from '@/contexts/garden-designer-context'
import { GardenCanvas } from './canvas/garden-canvas'
import { ToolPalette } from './canvas/tool-system'
import { PlantInfo } from '@/lib/data/plant-library'
import { ElementSubtype } from '@/lib/canvas-elements'

// Export the same interfaces for backward compatibility
export type { GardenBed, PlantedItem } from './garden-designer-canvas'

interface GardenDesignerCanvasProps {
  beds: any[]
  onBedsChange: (beds: any[]) => void
  selectedPlant?: PlantInfo | null
  selectedTool?: string
  selectedElement?: ElementSubtype | null
  zoom?: number
  showGrid?: boolean
  showLabels?: boolean
  showSpacing?: boolean
  showSunRequirements?: boolean
  showWaterRequirements?: boolean
}

// Internal component that uses the context
function GardenDesignerCanvasInner({
  beds,
  onBedsChange,
  selectedPlant,
  selectedTool,
  selectedElement,
  zoom = 100,
  showGrid = true,
  showLabels = true,
  showSpacing = false,
  showSunRequirements = false,
  showWaterRequirements = false
}: GardenDesignerCanvasProps) {
  const { state, dispatch, selectTool, selectPlant, selectElement, updateViewSettings } = useGardenDesigner()

  // Sync beds with parent
  useEffect(() => {
    if (JSON.stringify(state.beds) !== JSON.stringify(beds)) {
      dispatch({ type: 'SET_BEDS', beds })
    }
  }, [beds, state.beds, dispatch])

  // Notify parent of bed changes
  useEffect(() => {
    if (state.beds !== beds) {
      onBedsChange(state.beds)
    }
  }, [state.beds, beds, onBedsChange])

  // Sync tool selection
  useEffect(() => {
    if (selectedTool && selectedTool !== state.selectedTool) {
      selectTool(selectedTool as any)
    }
  }, [selectedTool, state.selectedTool, selectTool])

  // Sync plant selection
  useEffect(() => {
    if (selectedPlant !== state.selectedPlant) {
      selectPlant(selectedPlant || null)
    }
  }, [selectedPlant, state.selectedPlant, selectPlant])

  // Sync element selection
  useEffect(() => {
    if (selectedElement !== state.selectedElement) {
      selectElement(selectedElement || null)
    }
  }, [selectedElement, state.selectedElement, selectElement])

  // Sync view settings
  useEffect(() => {
    updateViewSettings({
      zoom,
      showGrid,
      showLabels,
      showSpacing,
      showSunRequirements,
      showWaterRequirements
    })
  }, [zoom, showGrid, showLabels, showSpacing, showSunRequirements, showWaterRequirements, updateViewSettings])

  return (
    <div className="relative w-full h-full">
      {/* Main canvas */}
      <GardenCanvas className="w-full h-full" />

      {/* Floating tool palette */}
      <div className="absolute top-4 left-4">
        <ToolPalette
          selectedTool={state.selectedTool}
          onSelectTool={selectTool}
          orientation="vertical"
          compact
        />
      </div>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
        <button
          className="p-2 hover:bg-gray-100 rounded"
          onClick={() => updateViewSettings({ zoom: Math.min(200, state.viewSettings.zoom + 10) })}
        >
          +
        </button>
        <div className="text-center text-sm py-1">{state.viewSettings.zoom}%</div>
        <button
          className="p-2 hover:bg-gray-100 rounded"
          onClick={() => updateViewSettings({ zoom: Math.max(50, state.viewSettings.zoom - 10) })}
        >
          -
        </button>
      </div>
    </div>
  )
}

// Backward-compatible wrapper component
export function GardenDesignerCanvas(props: GardenDesignerCanvasProps) {
  return (
    <GardenDesignerProvider initialBeds={props.beds}>
      <GardenDesignerCanvasInner {...props} />
    </GardenDesignerProvider>
  )
}

// For new implementations, export the modular components
export { GardenCanvas } from './canvas/garden-canvas'
export { CanvasRenderer } from './canvas/canvas-renderer'
export { InteractionLayer } from './canvas/interaction-layer'
export { ToolPalette, TOOLS } from './canvas/tool-system'
export { GardenDesignerProvider, useGardenDesigner } from '@/contexts/garden-designer-context'