'use client'

import { Tldraw, Editor, TLShape } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState, useCallback } from 'react'
import { permacultureShapes } from './shapes'
import { permacultureTools } from './tools'
import { GardenBed } from '@/lib/garden/garden-types'
import { dataAdapter } from './data-adapter'
import { CanvasErrorBoundary } from './canvas-error-boundary'
import { Loader2 } from 'lucide-react'

interface PermacultureCanvasProps {
  /** Initial garden bed data to load */
  initialData?: GardenBed[]
  /** Callback when canvas data changes */
  onSave?: (data: GardenBed[]) => void
  /** Additional CSS classes */
  className?: string
  /** Show loading state */
  loading?: boolean
  /** Disable auto-save */
  disableAutoSave?: boolean
  /** Debounce delay for auto-save (ms) */
  saveDebounce?: number
}

/**
 * PermacultureCanvas - High-performance canvas powered by tldraw
 *
 * Features:
 * - 60fps smooth interactions
 * - Viewport culling (only renders visible shapes)
 * - Touch & mobile support
 * - Professional transform handles
 * - Built-in undo/redo
 * - Multi-selection & grouping
 *
 * @example
 * ```tsx
 * <PermacultureCanvas
 *   initialData={gardenBeds}
 *   onSave={(beds) => console.log('Saved:', beds)}
 * />
 * ```
 */
function PermacultureCanvasInner({
  initialData = [],
  onSave,
  className = '',
  loading = false,
  disableAutoSave = false,
  saveDebounce = 1000,
}: PermacultureCanvasProps) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  /**
   * Load initial data when editor is ready
   */
  useEffect(() => {
    if (!editor || isInitialized || !initialData.length) return

    try {
      const shapes = dataAdapter.gardenBedsToShapes(initialData)
      if (shapes.length > 0) {
        editor.createShapes(shapes)
        // Zoom to fit all content with animation
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
   * Auto-save changes with debouncing
   */
  const handleSave = useCallback(
    (shapes: TLShape[]) => {
      if (!onSave || disableAutoSave) return

      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }

      // Debounce the save operation
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

    // Configure editor for permaculture use
    mountedEditor.updateInstanceState({
      isGridMode: true, // Show grid by default
    })

    // Set grid size for better alignment
    mountedEditor.user.updateUserPreferences({
      isDynamicSizeMode: false,
    })
  }, [])

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
        // Keep tldraw's default UI - it's professional and fully featured
        hideUi={false}
        // Custom styling
        className="permaculture-canvas"
        // Accessibility
        autoFocus
      />
    </div>
  )
}

/**
 * Exported component with error boundary
 */
export function PermacultureCanvas(props: PermacultureCanvasProps) {
  return (
    <CanvasErrorBoundary>
      <PermacultureCanvasInner {...props} />
    </CanvasErrorBoundary>
  )
}
