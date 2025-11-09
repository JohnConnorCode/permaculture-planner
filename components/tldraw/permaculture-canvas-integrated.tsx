'use client'

import { Tldraw, Editor, TLShape, TLComponents } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import { permacultureShapes } from './shapes'
import { permacultureTools } from './tools'
import { PlantTool } from './tools/plant-tool'
import { ElementTool } from './tools/element-tool'
import { GardenBed } from '@/lib/garden/garden-types'
import { dataAdapter } from './data-adapter'
import { CanvasErrorBoundary } from './canvas-error-boundary'
import { PlantInfo } from '@/lib/data/plant-library'
import { ElementSubtype, ElementCategory } from '@/lib/canvas-elements'
import { Loader2 } from 'lucide-react'
import { OverlaysContainer } from './overlays'

interface PermacultureCanvasIntegratedProps {
  initialData?: GardenBed[]
  onSave?: (data: GardenBed[]) => void
  onEditorReady?: (editor: Editor) => void
  selectedPlant?: PlantInfo | null
  selectedElement?: { subtype: ElementSubtype; category: ElementCategory } | null
  className?: string
  loading?: boolean
  disableAutoSave?: boolean
  saveDebounce?: number
  showCompanionLines?: boolean
  showImpactZones?: boolean
}

export interface PermacultureCanvasHandle {
  editor: Editor | null
  activatePlantTool: (plant: PlantInfo) => void
  activateElementTool: (subtype: ElementSubtype, category: ElementCategory) => void
  activateBedTool: () => void
  returnToSelect: () => void
}

/**
 * PermacultureCanvasIntegrated - Fully wired canvas with tool integration
 *
 * PRODUCTION-READY with:
 * - Editor instance exposed via ref
 * - Tool activation methods
 * - Real-time data synchronization
 * - Plant/Element tool integration
 */
const PermacultureCanvasIntegratedInner = forwardRef<PermacultureCanvasHandle, PermacultureCanvasIntegratedProps>(
  ({
    initialData = [],
    onSave,
    onEditorReady,
    selectedPlant,
    selectedElement,
    className = '',
    loading = false,
    disableAutoSave = false,
    saveDebounce = 1000,
    showCompanionLines = false,
    showImpactZones = false,
  }, ref) => {
    const [editor, setEditor] = useState<Editor | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    /**
     * Expose editor and tool activation methods
     */
    useImperativeHandle(ref, () => ({
      editor,
      activatePlantTool: (plant: PlantInfo) => {
        if (!editor) return
        const plantTool = editor.getStateDescendant('plant-tool') as PlantTool
        if (plantTool) {
          plantTool.setPlant(plant)
          editor.setCurrentTool('plant-tool')
        }
      },
      activateElementTool: (subtype: ElementSubtype, category: ElementCategory) => {
        if (!editor) return
        const elementTool = editor.getStateDescendant('element-tool') as ElementTool
        if (elementTool) {
          elementTool.setElement(subtype, category)
          editor.setCurrentTool('element-tool')
        }
      },
      activateBedTool: () => {
        if (!editor) return
        editor.setCurrentTool('bed-tool')
      },
      returnToSelect: () => {
        if (!editor) return
        editor.setCurrentTool('select')
      },
    }), [editor])

    /**
     * Activate tools when plant/element is selected
     */
    useEffect(() => {
      if (!editor) return

      if (selectedPlant) {
        const plantTool = editor.getStateDescendant('plant-tool') as PlantTool
        if (plantTool) {
          plantTool.setPlant(selectedPlant)
          editor.setCurrentTool('plant-tool')
        }
      } else if (selectedElement) {
        const elementTool = editor.getStateDescendant('element-tool') as ElementTool
        if (elementTool) {
          elementTool.setElement(selectedElement.subtype, selectedElement.category)
          editor.setCurrentTool('element-tool')
        }
      }
    }, [editor, selectedPlant, selectedElement])

    /**
     * Load initial data
     */
    useEffect(() => {
      if (!editor || isInitialized || !initialData.length) return

      try {
        const shapes = dataAdapter.gardenBedsToShapes(initialData)
        if (shapes.length > 0) {
          editor.createShapes(shapes)
          setTimeout(() => {
            editor.zoomToFit({ animation: { duration: 300 } })
          }, 100)
        }
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to load initial data:', error)
      }
    }, [editor, initialData, isInitialized])

    /**
     * Auto-save changes
     */
    const handleSave = useCallback(
      (shapes: TLShape[]) => {
        if (!onSave || disableAutoSave) return

        if (saveTimeout) {
          clearTimeout(saveTimeout)
        }

        const timeout = setTimeout(() => {
          try {
            const gardenBeds = dataAdapter.shapesToGardenBeds(shapes)
            onSave(gardenBeds)
          } catch (error) {
            console.error('Failed to save canvas data:', error)
          }
        }, saveDebounce)

        setSaveTimeout(timeout)
      },
      [onSave, disableAutoSave, saveDebounce, saveTimeout]
    )

    /**
     * Listen for canvas changes
     */
    useEffect(() => {
      if (!editor) return

      const unsubscribe = editor.store.listen(() => {
        const currentShapes = editor.getCurrentPageShapes()
        handleSave(currentShapes)
      }, { scope: 'document' })

      return () => {
        unsubscribe()
        if (saveTimeout) {
          clearTimeout(saveTimeout)
        }
      }
    }, [editor, handleSave, saveTimeout])

    /**
     * Handle drag and drop
     */
    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      // Only set false if leaving the canvas entirely
      if (e.currentTarget === e.target) {
        setIsDragOver(false)
      }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (!editor) return

      // Get plant data if dragging a plant
      const plantData = e.dataTransfer.getData('application/x-plant')
      if (plantData) {
        try {
          const plant = JSON.parse(plantData) as PlantInfo
          // Activate plant tool with the dropped plant
          const plantTool = editor.getStateDescendant('plant-tool') as PlantTool
          if (plantTool) {
            plantTool.setPlant(plant)
            editor.setCurrentTool('plant-tool')

            // Get drop position relative to canvas
            const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect()
            const x = e.clientX - bounds.left
            const y = e.clientY - bounds.top

            // Convert to canvas coordinates and trigger placement
            const point = editor.screenToPage({ x, y })
            // Simulate a click at the drop point to place the plant
            editor.dispatch({
              type: 'pointer',
              target: 'canvas',
              name: 'pointer_down',
              ...point,
            })
            setTimeout(() => {
              editor.dispatch({
                type: 'pointer',
                target: 'canvas',
                name: 'pointer_up',
                ...point,
              })
            }, 10)
          }
        } catch (error) {
          console.error('Failed to handle plant drop:', error)
        }
      }

      // Get element data if dragging an element
      const elementData = e.dataTransfer.getData('application/x-element')
      if (elementData) {
        try {
          const { subtype, category } = JSON.parse(elementData) as { subtype: ElementSubtype; category: ElementCategory }
          // Activate element tool with the dropped element
          const elementTool = editor.getStateDescendant('element-tool') as ElementTool
          if (elementTool) {
            elementTool.setElement(subtype, category)
            editor.setCurrentTool('element-tool')

            // Get drop position relative to canvas
            const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect()
            const x = e.clientX - bounds.left
            const y = e.clientY - bounds.top

            // Convert to canvas coordinates and trigger placement
            const point = editor.screenToPage({ x, y })
            // Simulate a click at the drop point to place the element
            editor.dispatch({
              type: 'pointer',
              target: 'canvas',
              name: 'pointer_down',
              ...point,
            })
            setTimeout(() => {
              editor.dispatch({
                type: 'pointer',
                target: 'canvas',
                name: 'pointer_up',
                ...point,
              })
            }, 10)
          }
        } catch (error) {
          console.error('Failed to handle element drop:', error)
        }
      }
    }, [editor])

    /**
     * Handle editor mount
     */
    const handleMount = useCallback((mountedEditor: Editor) => {
      setEditor(mountedEditor)

      // Configure editor
      mountedEditor.updateInstanceState({
        isGridMode: true,
      })

      mountedEditor.user.updateUserPreferences({
        isDynamicSizeMode: false,
      })

      // Notify parent
      if (onEditorReady) {
        onEditorReady(mountedEditor)
      }
    }, [onEditorReady])

    // Custom components for tldraw overlays
    const components: TLComponents = {
      InFrontOfTheCanvas: () => (
        <OverlaysContainer
          showCompanionLines={showCompanionLines}
          showImpactZones={showImpactZones}
        />
      ),
    }

    if (loading) {
      return (
        <div className={`w-full h-full flex items-center justify-center bg-muted/10 ${className}`}>
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading canvas...</p>
          </div>
        </div>
      )
    }

    return (
      <div
        className={`w-full h-full relative ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 z-50 pointer-events-none border-4 border-dashed border-primary bg-primary/5 flex items-center justify-center">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg px-6 py-4 shadow-xl border-2 border-primary">
              <p className="text-lg font-semibold text-primary">Drop here to place</p>
            </div>
          </div>
        )}
        <Tldraw
          shapeUtils={permacultureShapes}
          tools={permacultureTools}
          onMount={handleMount}
          hideUi={false}
          className="permaculture-canvas"
          autoFocus
          components={components}
        />
      </div>
    )
  }
)

PermacultureCanvasIntegratedInner.displayName = 'PermacultureCanvasIntegrated'

/**
 * Exported component with error boundary and ref forwarding
 */
export const PermacultureCanvasIntegrated = forwardRef<PermacultureCanvasHandle, PermacultureCanvasIntegratedProps>(
  (props, ref) => {
    return (
      <CanvasErrorBoundary>
        <PermacultureCanvasIntegratedInner {...props} ref={ref} />
      </CanvasErrorBoundary>
    )
  }
)

PermacultureCanvasIntegrated.displayName = 'PermacultureCanvasIntegrated'
