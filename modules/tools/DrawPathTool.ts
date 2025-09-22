import { BaseTool } from './BaseTool'
import { PointerEvent, PathNode } from '../scene/sceneTypes'
import { v4 as uuidv4 } from 'uuid'
import { validateNode } from '../scene/constraints'

export class DrawPathTool extends BaseTool {
  private dragStart: { x: number; y: number } | null = null
  private currentPath: PathNode | null = null
  
  get id() { return 'draw-path' }
  get name() { return 'Draw Path' }
  get icon() { return 'path' }
  get cursor() { return 'crosshair' }
  
  onPointerDown(event: PointerEvent): void {
    const { worldX, worldY } = event
    
    this.dragStart = {
      x: this.snapToGrid(worldX),
      y: this.snapToGrid(worldY)
    }
    
    // Create initial path
    this.currentPath = {
      id: `path-${uuidv4()}`,
      type: 'Path',
      transform: {
        xIn: this.dragStart.x,
        yIn: this.dragStart.y,
        rotationDeg: 0
      },
      size: {
        widthIn: this.context.constraints.pathWidthMinIn,
        heightIn: 1
      },
      path: {
        material: 'mulch'
      },
      style: {
        fill: '#d7ccc8',
        stroke: '#8d6e63',
        strokeWidthIn: 1,
        opacity: 0.6
      },
      selectable: true,
      draggable: true,
      resizable: true,
      rotatable: true
    }
    
    this.isDragging = true
  }
  
  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging || !this.dragStart || !this.currentPath) return
    
    const { worldX, worldY } = event
    const endX = this.snapToGrid(worldX)
    const endY = this.snapToGrid(worldY)
    
    // Calculate dimensions
    const deltaX = Math.abs(endX - this.dragStart.x)
    const deltaY = Math.abs(endY - this.dragStart.y)
    
    let width: number
    let height: number
    let centerX: number
    let centerY: number
    
    // Determine if horizontal or vertical path
    if (deltaX > deltaY) {
      // Horizontal path
      width = deltaX || 1
      height = this.context.constraints.pathWidthMinIn
      centerX = (this.dragStart.x + endX) / 2
      centerY = this.dragStart.y
    } else {
      // Vertical path
      width = this.context.constraints.pathWidthMinIn
      height = deltaY || 1
      centerX = this.dragStart.x
      centerY = (this.dragStart.y + endY) / 2
    }
    
    // Update path
    this.currentPath = {
      ...this.currentPath,
      transform: {
        ...this.currentPath.transform,
        xIn: centerX,
        yIn: centerY
      },
      size: {
        widthIn: width,
        heightIn: height
      }
    }
  }
  
  onPointerUp(event: PointerEvent): void {
    if (!this.currentPath || !this.dragStart) return
    
    // Ensure minimum size
    if (this.currentPath.size.widthIn < 6 && this.currentPath.size.heightIn < 6) {
      // Too small, cancel
      this.currentPath = null
      this.dragStart = null
      this.isDragging = false
      return
    }
    
    // Validate path constraints
    const validation = validateNode(this.currentPath, this.context.constraints, this.context.scene)
    
    if (validation.ok) {
      // Add path to scene
      this.context.addNode(this.currentPath)
      
      // Select the new path
      this.context.setSelection([this.currentPath.id])
    } else {
      console.warn('Path validation failed:', validation.violations)
    }
    
    this.currentPath = null
    this.dragStart = null
    this.isDragging = false
  }
  
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isDragging) {
      // Cancel current drawing
      this.currentPath = null
      this.dragStart = null
      this.isDragging = false
    } else if (event.key === 'w' && this.currentPath) {
      // Toggle wheelbarrow width
      const minWidth = event.shiftKey 
        ? this.context.constraints.pathWidthWheelbarrowIn
        : this.context.constraints.pathWidthMinIn
      
      if (this.currentPath.size.widthIn > this.currentPath.size.heightIn) {
        this.currentPath.size.heightIn = minWidth
      } else {
        this.currentPath.size.widthIn = minWidth
      }
    }
  }
}