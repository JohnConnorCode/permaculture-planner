'use client'

import { Tldraw, Editor, TLShape } from 'tldraw'
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
  }, ref) => {
    const [editor, setEditor] = useState<Editor | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

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
      <div className={`w-full h-full ${className}`}>
        <Tldraw
          shapeUtils={permacultureShapes}
          tools={permacultureTools}
          onMount={handleMount}
          hideUi={false}
          className="permaculture-canvas"
          autoFocus
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
