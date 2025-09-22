import { BaseTool } from './BaseTool'
import { PointerEvent, BedNode } from '../scene/sceneTypes'
import { v4 as uuidv4 } from 'uuid'
import { validateNode } from '../scene/constraints'

export class DrawBedTool extends BaseTool {
  private dragStart: { x: number; y: number } | null = null
  private currentBed: BedNode | null = null
  private defaultOrientation: 'NS' | 'EW' = 'NS'
  
  get id() { return 'draw-bed' }
  get name() { return 'Draw Bed' }
  get icon() { return 'rectangle' }
  get cursor() { return 'crosshair' }
  
  onPointerDown(event: PointerEvent): void {
    const { worldX, worldY } = event
    
    this.dragStart = {
      x: this.snapToGrid(worldX),
      y: this.snapToGrid(worldY)
    }
    
    // Create initial bed
    this.currentBed = {
      id: `bed-${uuidv4()}`,
      type: 'Bed',
      transform: {
        xIn: this.dragStart.x,
        yIn: this.dragStart.y,
        rotationDeg: 0
      },
      size: {
        widthIn: 1,
        heightIn: 1
      },
      bed: {
        heightIn: 12,
        orientation: this.defaultOrientation,
        wicking: false,
        trellisNorth: false
      },
      style: {
        fill: '#f1f8e9',
        stroke: '#689f38',
        strokeWidthIn: 1
      },
      selectable: true,
      draggable: true,
      resizable: true,
      rotatable: true
    }
    
    this.isDragging = true
  }
  
  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging || !this.dragStart || !this.currentBed) return
    
    const { worldX, worldY } = event
    const endX = this.snapToGrid(worldX)
    const endY = this.snapToGrid(worldY)
    
    // Calculate size and position
    const width = Math.abs(endX - this.dragStart.x)
    const height = Math.abs(endY - this.dragStart.y)
    const centerX = (this.dragStart.x + endX) / 2
    const centerY = (this.dragStart.y + endY) / 2
    
    // Update bed size and position
    this.currentBed = {
      ...this.currentBed,
      transform: {
        ...this.currentBed.transform,
        xIn: centerX,
        yIn: centerY
      },
      size: {
        widthIn: Math.max(12, width),
        heightIn: Math.max(12, height)
      }
    }
    
    // Update orientation based on aspect ratio
    if (width > height) {
      this.currentBed.bed.orientation = 'EW'
    } else {
      this.currentBed.bed.orientation = 'NS'
    }
  }
  
  onPointerUp(event: PointerEvent): void {
    if (!this.currentBed || !this.dragStart) return
    
    // Validate bed constraints
    const validation = validateNode(this.currentBed, this.context.constraints, this.context.scene)
    
    if (validation.ok) {
      // Add bed to scene
      this.context.addNode(this.currentBed)
      
      // Select the new bed
      this.context.setSelection([this.currentBed.id])
    } else {
      // Show validation errors (would need UI for this)
      console.warn('Bed validation failed:', validation.violations)
    }
    
    this.currentBed = null
    this.dragStart = null
    this.isDragging = false
  }
  
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isDragging) {
      // Cancel current drawing
      this.currentBed = null
      this.dragStart = null
      this.isDragging = false
    } else if (event.key === 'Shift' && this.isDragging && this.currentBed) {
      // Constrain to square
      const size = Math.max(this.currentBed.size.widthIn, this.currentBed.size.heightIn)
      this.currentBed.size = {
        widthIn: size,
        heightIn: size
      }
    }
  }
}