'use client'

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import { GardenBed, PlantedItem } from '@/components/garden-designer-canvas'
import { PlantInfo } from '@/lib/data/plant-library'
import { ElementSubtype } from '@/lib/canvas-elements'
import { PlantGroup } from '@/lib/plant-management'

// View settings for the canvas
export interface ViewSettings {
  zoom: number
  showGrid: boolean
  showLabels: boolean
  showSpacing: boolean
  showSunRequirements: boolean
  showWaterRequirements: boolean
  showZones: boolean
  panOffset: { x: number; y: number }
}

// Tool types
export type Tool = 'select' | 'rectangle' | 'circle' | 'triangle' | 'hexagon' | 'pencil' | 'delete' | 'plant' | 'element' | 'pan' | 'move'

// Designer state interface
export interface DesignerState {
  // Data
  beds: GardenBed[]
  plantGroups: PlantGroup[]

  // Selection
  selectedBedId: string | null
  selectedPlantIds: string[]
  selectedGroupId: string | null

  // Tools
  selectedTool: Tool
  selectedPlant: PlantInfo | null
  selectedElement: ElementSubtype | null

  // View
  viewSettings: ViewSettings

  // UI State
  isDragging: boolean
  isDrawing: boolean
  showContextMenu: boolean
  contextMenuPosition: { x: number; y: number }

  // History
  canUndo: boolean
  canRedo: boolean

  // Clipboard
  clipboard: GardenBed | null
}

// Action types
export type DesignerAction =
  | { type: 'SET_BEDS'; beds: GardenBed[] }
  | { type: 'ADD_BED'; bed: GardenBed }
  | { type: 'UPDATE_BED'; id: string; updates: Partial<GardenBed> }
  | { type: 'DELETE_BED'; id: string }
  | { type: 'SELECT_BED'; id: string | null }
  | { type: 'ADD_PLANT'; bedId: string; plant: PlantedItem }
  | { type: 'REMOVE_PLANT'; bedId: string; plantId: string }
  | { type: 'SELECT_TOOL'; tool: Tool }
  | { type: 'SELECT_PLANT'; plant: PlantInfo | null }
  | { type: 'SELECT_ELEMENT'; element: ElementSubtype | null }
  | { type: 'UPDATE_VIEW'; settings: Partial<ViewSettings> }
  | { type: 'SET_DRAGGING'; isDragging: boolean }
  | { type: 'SET_DRAWING'; isDrawing: boolean }
  | { type: 'SHOW_CONTEXT_MENU'; position: { x: number; y: number } }
  | { type: 'HIDE_CONTEXT_MENU' }
  | { type: 'COPY_BED'; bed: GardenBed }
  | { type: 'PASTE_BED' }
  | { type: 'GROUP_PLANTS'; group: PlantGroup }
  | { type: 'UNGROUP_PLANTS'; groupId: string }
  | { type: 'SELECT_PLANTS'; plantIds: string[] }
  | { type: 'ADD_TO_SELECTION'; plantId: string }
  | { type: 'REMOVE_FROM_SELECTION'; plantId: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'UNDO' }
  | { type: 'REDO' }

// Initial state
const initialState: DesignerState = {
  beds: [],
  plantGroups: [],
  selectedBedId: null,
  selectedPlantIds: [],
  selectedGroupId: null,
  selectedTool: 'select',
  selectedPlant: null,
  selectedElement: null,
  viewSettings: {
    zoom: 100,
    showGrid: true,
    showLabels: true,
    showSpacing: false,
    showSunRequirements: false,
    showWaterRequirements: false,
    showZones: false,
    panOffset: { x: 0, y: 0 }
  },
  isDragging: false,
  isDrawing: false,
  showContextMenu: false,
  contextMenuPosition: { x: 0, y: 0 },
  canUndo: false,
  canRedo: false,
  clipboard: null
}

// Reducer
function designerReducer(state: DesignerState, action: DesignerAction): DesignerState {
  switch (action.type) {
    case 'SET_BEDS':
      return { ...state, beds: action.beds }

    case 'ADD_BED':
      return { ...state, beds: [...state.beds, action.bed] }

    case 'UPDATE_BED':
      return {
        ...state,
        beds: state.beds.map(bed =>
          bed.id === action.id ? { ...bed, ...action.updates } : bed
        )
      }

    case 'DELETE_BED':
      return {
        ...state,
        beds: state.beds.filter(bed => bed.id !== action.id),
        selectedBedId: state.selectedBedId === action.id ? null : state.selectedBedId
      }

    case 'SELECT_BED':
      return { ...state, selectedBedId: action.id }

    case 'ADD_PLANT':
      return {
        ...state,
        beds: state.beds.map(bed =>
          bed.id === action.bedId
            ? { ...bed, plants: [...bed.plants, action.plant] }
            : bed
        )
      }

    case 'REMOVE_PLANT':
      return {
        ...state,
        beds: state.beds.map(bed =>
          bed.id === action.bedId
            ? { ...bed, plants: bed.plants.filter(p => p.id !== action.plantId) }
            : bed
        )
      }

    case 'SELECT_TOOL':
      return {
        ...state,
        selectedTool: action.tool,
        // Clear plant/element selection when switching tools
        selectedPlant: action.tool === 'plant' ? state.selectedPlant : null,
        selectedElement: action.tool === 'element' ? state.selectedElement : null
      }

    case 'SELECT_PLANT':
      return {
        ...state,
        selectedPlant: action.plant,
        selectedTool: action.plant ? 'plant' : state.selectedTool,
        selectedElement: null
      }

    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElement: action.element,
        selectedTool: action.element ? 'element' : state.selectedTool,
        selectedPlant: null
      }

    case 'UPDATE_VIEW':
      return {
        ...state,
        viewSettings: { ...state.viewSettings, ...action.settings }
      }

    case 'SET_DRAGGING':
      return { ...state, isDragging: action.isDragging }

    case 'SET_DRAWING':
      return { ...state, isDrawing: action.isDrawing }

    case 'SHOW_CONTEXT_MENU':
      return {
        ...state,
        showContextMenu: true,
        contextMenuPosition: action.position
      }

    case 'HIDE_CONTEXT_MENU':
      return { ...state, showContextMenu: false }

    case 'COPY_BED':
      return { ...state, clipboard: action.bed }

    case 'PASTE_BED':
      if (!state.clipboard) return state
      const newBed = {
        ...state.clipboard,
        id: `bed-${Date.now()}`,
        name: `${state.clipboard.name} (Copy)`
      }
      return { ...state, beds: [...state.beds, newBed] }

    case 'GROUP_PLANTS':
      return { ...state, plantGroups: [...state.plantGroups, action.group] }

    case 'UNGROUP_PLANTS':
      return {
        ...state,
        plantGroups: state.plantGroups.filter(g => g.id !== action.groupId)
      }

    case 'SELECT_PLANTS':
      return { ...state, selectedPlantIds: action.plantIds }

    case 'ADD_TO_SELECTION':
      return {
        ...state,
        selectedPlantIds: [...state.selectedPlantIds, action.plantId]
      }

    case 'REMOVE_FROM_SELECTION':
      return {
        ...state,
        selectedPlantIds: state.selectedPlantIds.filter(id => id !== action.plantId)
      }

    case 'CLEAR_SELECTION':
      return { ...state, selectedPlantIds: [], selectedBedId: null }

    case 'UNDO':
    case 'REDO':
      // These will be handled by the history hook
      return state

    default:
      return state
  }
}

// Context
interface DesignerContextValue {
  state: DesignerState
  dispatch: React.Dispatch<DesignerAction>

  // Convenience methods
  selectTool: (tool: Tool) => void
  selectPlant: (plant: PlantInfo | null) => void
  selectElement: (element: ElementSubtype | null) => void
  updateViewSettings: (settings: Partial<ViewSettings>) => void
  addBed: (bed: GardenBed) => void
  updateBed: (id: string, updates: Partial<GardenBed>) => void
  deleteBed: (id: string) => void
  addPlantToBed: (bedId: string, plant: PlantedItem) => void
  removePlantFromBed: (bedId: string, plantId: string) => void
  copyBed: (bed: GardenBed) => void
  pasteBed: () => void
  groupSelectedPlants: (group: PlantGroup) => void
  ungroupPlants: (groupId: string) => void
}

const GardenDesignerContext = createContext<DesignerContextValue | undefined>(undefined)

// Provider component
export function GardenDesignerProvider({
  children,
  initialBeds = [],
  initialGroups = []
}: {
  children: ReactNode
  initialBeds?: GardenBed[]
  initialGroups?: PlantGroup[]
}) {
  const [state, dispatch] = useReducer(designerReducer, {
    ...initialState,
    beds: initialBeds,
    plantGroups: initialGroups
  })

  // Convenience methods
  const selectTool = useCallback((tool: Tool) => {
    dispatch({ type: 'SELECT_TOOL', tool })
  }, [])

  const selectPlant = useCallback((plant: PlantInfo | null) => {
    dispatch({ type: 'SELECT_PLANT', plant })
  }, [])

  const selectElement = useCallback((element: ElementSubtype | null) => {
    dispatch({ type: 'SELECT_ELEMENT', element })
  }, [])

  const updateViewSettings = useCallback((settings: Partial<ViewSettings>) => {
    dispatch({ type: 'UPDATE_VIEW', settings })
  }, [])

  const addBed = useCallback((bed: GardenBed) => {
    dispatch({ type: 'ADD_BED', bed })
  }, [])

  const updateBed = useCallback((id: string, updates: Partial<GardenBed>) => {
    dispatch({ type: 'UPDATE_BED', id, updates })
  }, [])

  const deleteBed = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BED', id })
  }, [])

  const addPlantToBed = useCallback((bedId: string, plant: PlantedItem) => {
    dispatch({ type: 'ADD_PLANT', bedId, plant })
  }, [])

  const removePlantFromBed = useCallback((bedId: string, plantId: string) => {
    dispatch({ type: 'REMOVE_PLANT', bedId, plantId })
  }, [])

  const copyBed = useCallback((bed: GardenBed) => {
    dispatch({ type: 'COPY_BED', bed })
  }, [])

  const pasteBed = useCallback(() => {
    dispatch({ type: 'PASTE_BED' })
  }, [])

  const groupSelectedPlants = useCallback((group: PlantGroup) => {
    dispatch({ type: 'GROUP_PLANTS', group })
  }, [])

  const ungroupPlants = useCallback((groupId: string) => {
    dispatch({ type: 'UNGROUP_PLANTS', groupId })
  }, [])

  const value: DesignerContextValue = {
    state,
    dispatch,
    selectTool,
    selectPlant,
    selectElement,
    updateViewSettings,
    addBed,
    updateBed,
    deleteBed,
    addPlantToBed,
    removePlantFromBed,
    copyBed,
    pasteBed,
    groupSelectedPlants,
    ungroupPlants
  }

  return (
    <GardenDesignerContext.Provider value={value}>
      {children}
    </GardenDesignerContext.Provider>
  )
}

// Hook to use the context
export function useGardenDesigner() {
  const context = useContext(GardenDesignerContext)
  if (!context) {
    throw new Error('useGardenDesigner must be used within a GardenDesignerProvider')
  }
  return context
}