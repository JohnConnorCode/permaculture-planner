import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {
  Scene,
  Layer,
  Node,
  Viewport,
  Selection,
  EditorState,
  HistoryState,
  Command,
  ConstraintSettings,
  Units,
  ToolId,
  ValidationResult
} from './sceneTypes'
import { validateNode, validateScene } from './constraints'
import { v4 as uuidv4 } from 'uuid'

interface SceneStore extends EditorState {
  // Scene mutations
  addNode: (node: Node, layerId?: string) => void
  updateNode: (nodeId: string, updates: Partial<Node>) => void
  removeNode: (nodeId: string) => void
  moveNode: (nodeId: string, deltaX: number, deltaY: number) => void
  resizeNode: (nodeId: string, width: number, height: number) => void
  rotateNode: (nodeId: string, degrees: number) => void
  
  // Layer operations
  addLayer: (name: string) => string
  removeLayer: (layerId: string) => void
  setLayerVisibility: (layerId: string, visible: boolean) => void
  setLayerLocked: (layerId: string, locked: boolean) => void
  reorderLayers: (layerIds: string[]) => void
  
  // Selection
  setSelection: (nodeIds: string[]) => void
  addToSelection: (nodeId: string) => void
  removeFromSelection: (nodeId: string) => void
  clearSelection: () => void
  selectAll: () => void
  
  // Viewport
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  zoomToFit: () => void
  zoomToSelection: () => void
  
  // Tools
  setActiveTool: (toolId: ToolId) => void
  
  // Grid and snapping
  setGridEnabled: (enabled: boolean) => void
  setGridSpacing: (spacing: number) => void
  setSnapEnabled: (enabled: boolean) => void
  
  // Units
  setUnits: (units: Units) => void
  
  // History
  undo: () => void
  redo: () => void
  executeCommand: (command: Command) => void
  clearHistory: () => void
  
  // Validation
  validateScene: () => ValidationResult
  validateNode: (nodeId: string) => ValidationResult
  
  // Scene management
  newScene: (name: string, widthIn: number, heightIn: number) => void
  loadScene: (scene: Scene) => void
  clearScene: () => void
  
  // Helpers
  getNode: (nodeId: string) => Node | undefined
  getLayer: (layerId: string) => Layer | undefined
  getSelectedNodes: () => Node[]
  getAllNodes: () => Node[]
}

// Default constraint settings
const defaultConstraints: ConstraintSettings = {
  bedWidthMaxIn: 48,
  pathWidthMinIn: 18,
  pathWidthWheelbarrowIn: 36,
  snapToleranceIn: 0.25,
  preventOverlap: true,
  accessibility: false
}

// Create default scene
function createDefaultScene(): Scene {
  const mainLayer: Layer = {
    id: 'layer-main',
    name: 'Main',
    visible: true,
    locked: false,
    order: 0,
    nodes: []
  }
  
  return {
    id: uuidv4(),
    name: 'New Garden Plan',
    size: { widthIn: 240, heightIn: 240 }, // 20ft x 20ft default
    layers: [mainLayer],
    meta: {}
  }
}

// Create the store
export const useSceneStore = create<SceneStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial state
        scene: createDefaultScene(),
        viewport: {
          zoom: 1,
          pan: { x: 0, y: 0 },
          grid: {
            enabled: true,
            spacingIn: 12, // 1 foot grid
            showRulers: true
          }
        },
        selection: {
          ids: [],
          primaryId: undefined
        },
        activeTool: 'select' as ToolId,
        history: {
          undoStack: [],
          redoStack: [],
          maxStackSize: 50
        },
        ui: {
          rulers: true,
          minimap: false,
          grid: true,
          units: 'imperial' as Units,
          snapEnabled: true,
          snapTolerance: 0.25
        },
        constraints: defaultConstraints,
        
        // Scene mutations
        addNode: (node, layerId) =>
          set((state) => {
            const layer = layerId
              ? state.scene.layers.find((l: Layer) => l.id === layerId)
              : state.scene.layers[0]
            
            if (layer && !layer.locked) {
              // Validate before adding
              const validation = validateNode(node, state.constraints)
              if (validation.ok) {
                layer.nodes.push(node)
              }
            }
          }),
        
        updateNode: (nodeId, updates) =>
          set((state) => {
            for (const layer of state.scene.layers) {
              const nodeIndex = layer.nodes.findIndex((n: Node) => n.id === nodeId)
              if (nodeIndex !== -1 && !layer.locked) {
                const node = layer.nodes[nodeIndex]
                const updatedNode = { ...node, ...updates } as Node

                // Validate before updating
                const validation = validateNode(updatedNode, state.constraints)
                if (validation.ok) {
                  layer.nodes[nodeIndex] = updatedNode
                }
                break
              }
            }
          }),
        
        removeNode: (nodeId) =>
          set((state) => {
            for (const layer of state.scene.layers) {
              if (!layer.locked) {
                const index = layer.nodes.findIndex((n: Node) => n.id === nodeId)
                if (index !== -1) {
                  layer.nodes.splice(index, 1)
                  
                  // Remove from selection
                  const selIndex = state.selection.ids.indexOf(nodeId)
                  if (selIndex !== -1) {
                    state.selection.ids.splice(selIndex, 1)
                  }
                  if (state.selection.primaryId === nodeId) {
                    state.selection.primaryId = state.selection.ids[0]
                  }
                  break
                }
              }
            }
          }),
        
        moveNode: (nodeId, deltaX, deltaY) =>
          set((state) => {
            const node = get().getNode(nodeId)
            if (node) {
              get().updateNode(nodeId, {
                transform: {
                  ...node.transform,
                  xIn: node.transform.xIn + deltaX,
                  yIn: node.transform.yIn + deltaY
                }
              })
            }
          }),
        
        resizeNode: (nodeId, width, height) =>
          set((state) => {
            const node = get().getNode(nodeId)
            if (node && 'size' in node) {
              get().updateNode(nodeId, {
                ...node,
                size: { widthIn: width, heightIn: height }
              })
            }
          }),
        
        rotateNode: (nodeId, degrees) =>
          set((state) => {
            const node = get().getNode(nodeId)
            if (node) {
              get().updateNode(nodeId, {
                transform: {
                  ...node.transform,
                  rotationDeg: degrees
                }
              })
            }
          }),
        
        // Layer operations
        addLayer: (name) => {
          const id = `layer-${uuidv4()}`
          set((state) => {
            const maxOrder = Math.max(...state.scene.layers.map((l: Layer) => l.order), -1)
            state.scene.layers.push({
              id,
              name,
              visible: true,
              locked: false,
              order: maxOrder + 1,
              nodes: []
            })
          })
          return id
        },
        
        removeLayer: (layerId) =>
          set((state) => {
            const index = state.scene.layers.findIndex((l: Layer) => l.id === layerId)
            if (index !== -1 && state.scene.layers.length > 1) {
              state.scene.layers.splice(index, 1)
            }
          }),
        
        setLayerVisibility: (layerId, visible) =>
          set((state) => {
            const layer = state.scene.layers.find((l: Layer) => l.id === layerId)
            if (layer) {
              layer.visible = visible
            }
          }),
        
        setLayerLocked: (layerId, locked) =>
          set((state) => {
            const layer = state.scene.layers.find((l: Layer) => l.id === layerId)
            if (layer) {
              layer.locked = locked
            }
          }),
        
        reorderLayers: (layerIds) =>
          set((state) => {
            const orderedLayers = layerIds
              .map((id: string) => state.scene.layers.find((l: Layer) => l.id === id))
              .filter(Boolean) as Layer[]
            
            orderedLayers.forEach((layer, index) => {
              layer.order = index
            })
            
            state.scene.layers.sort((a: Layer, b: Layer) => a.order - b.order)
          }),
        
        // Selection
        setSelection: (nodeIds) =>
          set((state) => {
            state.selection.ids = nodeIds
            state.selection.primaryId = nodeIds[0]
          }),
        
        addToSelection: (nodeId) =>
          set((state) => {
            if (!state.selection.ids.includes(nodeId)) {
              state.selection.ids.push(nodeId)
              if (!state.selection.primaryId) {
                state.selection.primaryId = nodeId
              }
            }
          }),
        
        removeFromSelection: (nodeId) =>
          set((state) => {
            const index = state.selection.ids.indexOf(nodeId)
            if (index !== -1) {
              state.selection.ids.splice(index, 1)
              if (state.selection.primaryId === nodeId) {
                state.selection.primaryId = state.selection.ids[0]
              }
            }
          }),
        
        clearSelection: () =>
          set((state) => {
            state.selection.ids = []
            state.selection.primaryId = undefined
          }),
        
        selectAll: () =>
          set((state) => {
            const allIds = state.scene.layers
              .filter((l: Layer) => l.visible && !l.locked)
              .flatMap((l: Layer) => l.nodes.map((n: Node) => n.id))
            
            state.selection.ids = allIds
            state.selection.primaryId = allIds[0]
          }),
        
        // Viewport
        setZoom: (zoom) =>
          set((state) => {
            state.viewport.zoom = Math.max(0.1, Math.min(4, zoom))
          }),
        
        setPan: (x, y) =>
          set((state) => {
            state.viewport.pan = { x, y }
          }),
        
        zoomToFit: () =>
          set((state) => {
            // Calculate bounds of all nodes
            const nodes = get().getAllNodes()
            if (nodes.length === 0) return
            
            let minX = Infinity, minY = Infinity
            let maxX = -Infinity, maxY = -Infinity
            
            for (const node of nodes) {
              if ('size' in node) {
                const halfW = node.size.widthIn / 2
                const halfH = node.size.heightIn / 2
                minX = Math.min(minX, node.transform.xIn - halfW)
                minY = Math.min(minY, node.transform.yIn - halfH)
                maxX = Math.max(maxX, node.transform.xIn + halfW)
                maxY = Math.max(maxY, node.transform.yIn + halfH)
              }
            }
            
            // Center and zoom
            const centerX = (minX + maxX) / 2
            const centerY = (minY + maxY) / 2
            const width = maxX - minX
            const height = maxY - minY
            
            // Assuming viewport is roughly 800x600 pixels
            const zoom = Math.min(800 / width, 600 / height, 2)
            
            state.viewport.pan = { x: -centerX, y: -centerY }
            state.viewport.zoom = zoom
          }),
        
        zoomToSelection: () => {
          const selected = get().getSelectedNodes()
          if (selected.length > 0) {
            // Similar to zoomToFit but for selected nodes
            get().zoomToFit() // Simplified for now
          }
        },
        
        // Tools
        setActiveTool: (toolId) =>
          set((state) => {
            state.activeTool = toolId
          }),
        
        // Grid and snapping
        setGridEnabled: (enabled) =>
          set((state) => {
            state.viewport.grid.enabled = enabled
            state.ui.grid = enabled
          }),
        
        setGridSpacing: (spacing) =>
          set((state) => {
            state.viewport.grid.spacingIn = spacing
          }),
        
        setSnapEnabled: (enabled) =>
          set((state) => {
            state.ui.snapEnabled = enabled
          }),
        
        // Units
        setUnits: (units) =>
          set((state) => {
            state.ui.units = units
          }),
        
        // History
        undo: () =>
          set((state) => {
            if (state.history.undoStack.length > 0) {
              const command = state.history.undoStack.pop()!
              const prevState = get()
              const invertedCommand = command.invert(prevState, prevState)
              state.history.redoStack.push(invertedCommand)
              
              // Apply the undo
              // This would need to restore previous state
            }
          }),
        
        redo: () =>
          set((state) => {
            if (state.history.redoStack.length > 0) {
              const command = state.history.redoStack.pop()!
              command.apply(get())
              state.history.undoStack.push(command)
            }
          }),
        
        executeCommand: (command) =>
          set((state) => {
            command.apply(get())
            state.history.undoStack.push(command)
            state.history.redoStack = [] // Clear redo stack
            
            // Limit stack size
            if (state.history.undoStack.length > state.history.maxStackSize) {
              state.history.undoStack.shift()
            }
          }),
        
        clearHistory: () =>
          set((state) => {
            state.history.undoStack = []
            state.history.redoStack = []
          }),
        
        // Validation
        validateScene: () => {
          return validateScene(get().scene, get().constraints)
        },
        
        validateNode: (nodeId) => {
          const node = get().getNode(nodeId)
          if (!node) {
            return { ok: false, violations: [] }
          }
          return validateNode(node, get().constraints)
        },
        
        // Scene management
        newScene: (name, widthIn, heightIn) =>
          set((state) => {
            state.scene = {
              ...createDefaultScene(),
              name,
              size: { widthIn, heightIn }
            }
            state.selection = { ids: [], primaryId: undefined }
            state.history = { undoStack: [], redoStack: [], maxStackSize: 50 }
          }),
        
        loadScene: (scene) =>
          set((state) => {
            state.scene = scene
            state.selection = { ids: [], primaryId: undefined }
            state.history = { undoStack: [], redoStack: [], maxStackSize: 50 }
          }),
        
        clearScene: () =>
          set((state) => {
            for (const layer of state.scene.layers) {
              layer.nodes = []
            }
            state.selection = { ids: [], primaryId: undefined }
          }),
        
        // Helpers
        getNode: (nodeId) => {
          const state = get()
          for (const layer of state.scene.layers) {
            const node = layer.nodes.find((n: Node) => n.id === nodeId)
            if (node) return node
          }
          return undefined
        },
        
        getLayer: (layerId) => {
          return get().scene.layers.find((l: Layer) => l.id === layerId)
        },
        
        getSelectedNodes: () => {
          const state = get()
          return state.selection.ids
            .map((id: string) => state.getNode(id))
            .filter(Boolean) as Node[]
        },
        
        getAllNodes: () => {
          return get().scene.layers.flatMap((l: Layer) => l.nodes)
        }
      }))
    )
  )
)

// Install uuid if needed: npm install uuid @types/uuid