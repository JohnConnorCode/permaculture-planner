'use client'

import { Tldraw, Editor, TLShape, createShapeId, DefaultColorStyle } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState } from 'react'
import { permacultureShapes } from './shapes'
import { permacultureTools } from './tools'
import { GardenBed } from '@/lib/garden/garden-types'
import { dataAdapter } from './data-adapter'

interface PermacultureCanvasProps {
  initialData?: GardenBed[]
  onSave?: (data: GardenBed[]) => void
  className?: string
}

export function PermacultureCanvas({
  initialData = [],
  onSave,
  className = ''
}: PermacultureCanvasProps) {
  const [editor, setEditor] = useState<Editor | null>(null)

  // Load initial data when editor is ready
  useEffect(() => {
    if (!editor || !initialData.length) return

    const shapes = dataAdapter.gardenBedsToShapes(initialData)
    editor.createShapes(shapes)
    editor.zoomToFit({ animation: { duration: 300 } })
  }, [editor, initialData])

  // Auto-save changes
  useEffect(() => {
    if (!editor || !onSave) return

    const handleChange = () => {
      const currentShapes = editor.getCurrentPageShapes()
      const gardenBeds = dataAdapter.shapesToGardenBeds(currentShapes)
      onSave(gardenBeds)
    }

    // Listen for changes
    const unsubscribe = editor.store.listen(() => {
      handleChange()
    }, { scope: 'document' })

    return () => unsubscribe()
  }, [editor, onSave])

  return (
    <div className={`w-full h-full ${className}`}>
      <Tldraw
        shapeUtils={permacultureShapes}
        tools={permacultureTools}
        onMount={(editor) => {
          setEditor(editor)

          // Configure editor for permaculture use
          editor.updateInstanceState({
            isGridMode: true,
          })
        }}
        // Hide default UI elements we'll replace with custom ones
        hideUi={false}
        // Custom styling
        className="permaculture-canvas"
      />
    </div>
  )
}
