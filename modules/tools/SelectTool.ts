import { BaseTool } from './BaseTool'
import { PointerEvent, Node, BoundingBox } from '../scene/sceneTypes'

export class SelectTool extends BaseTool {
  private dragStart: { x: number; y: number } | null = null
  private selectedNodes: Set<string> = new Set()
  private draggedNode: Node | null = null
  private selectionBox: BoundingBox | null = null
  
  get id() { return 'select' }
  get name() { return 'Select' }
  get icon() { return 'cursor' }
  get cursor() { return 'default' }
  
  onPointerDown(event: PointerEvent): void {
    const { worldX, worldY, shiftKey } = event
    
    this.dragStart = { x: worldX, y: worldY }
    const node = this.getNodeAtPoint(worldX, worldY)
    
    if (node) {
      if (shiftKey) {
        // Toggle selection
        if (this.selectedNodes.has(node.id)) {
          this.selectedNodes.delete(node.id)
        } else {
          this.selectedNodes.add(node.id)
        }
      } else if (!this.selectedNodes.has(node.id)) {
        // Select single node
        this.selectedNodes.clear()
        this.selectedNodes.add(node.id)
      }
      
      this.draggedNode = node
      this.context.setSelection(Array.from(this.selectedNodes))
      this.isDragging = true
    } else {
      // Start selection box
      if (!shiftKey) {
        this.selectedNodes.clear()
        this.context.setSelection([])
      }
      this.selectionBox = {
        minX: worldX,
        minY: worldY,
        maxX: worldX,
        maxY: worldY
      }
    }
  }
  
  onPointerMove(event: PointerEvent): void {
    if (!this.dragStart) return
    
    const { worldX, worldY } = event
    const deltaX = worldX - this.dragStart.x
    const deltaY = worldY - this.dragStart.y
    
    if (this.draggedNode && this.isDragging) {
      // Move selected nodes
      for (const nodeId of Array.from(this.selectedNodes)) {
        const node = this.context.scene.layers
          .flatMap(l => l.nodes)
          .find(n => n.id === nodeId)
        
        if (node) {
          const newX = this.snapToGrid(node.transform.xIn + deltaX)
          const newY = this.snapToGrid(node.transform.yIn + deltaY)
          
          this.context.updateNode(nodeId, {
            transform: {
              ...node.transform,
              xIn: newX,
              yIn: newY
            }
          })
        }
      }
      
      this.dragStart = { x: worldX, y: worldY }
    } else if (this.selectionBox) {
      // Update selection box
      this.selectionBox = {
        minX: Math.min(this.dragStart.x, worldX),
        minY: Math.min(this.dragStart.y, worldY),
        maxX: Math.max(this.dragStart.x, worldX),
        maxY: Math.max(this.dragStart.y, worldY)
      }
      
      // Find nodes in selection box
      const nodesInBox = this.context.scene.layers
        .filter(l => l.visible && !l.locked)
        .flatMap(l => l.nodes)
        .filter(node => this.isNodeInBox(node, this.selectionBox!))
      
      this.selectedNodes.clear()
      nodesInBox.forEach(n => this.selectedNodes.add(n.id))
      this.context.setSelection(Array.from(this.selectedNodes))
    }
  }
  
  onPointerUp(event: PointerEvent): void {
    this.dragStart = null
    this.draggedNode = null
    this.selectionBox = null
    this.isDragging = false
  }
  
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      // Delete selected nodes
      for (const nodeId of Array.from(this.selectedNodes)) {
        this.context.removeNode(nodeId)
      }
      this.selectedNodes.clear()
      this.context.setSelection([])
    } else if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
      // Select all
      event.preventDefault()
      const allNodes = this.context.scene.layers
        .filter(l => l.visible && !l.locked)
        .flatMap(l => l.nodes)
      
      this.selectedNodes.clear()
      allNodes.forEach(n => this.selectedNodes.add(n.id))
      this.context.setSelection(Array.from(this.selectedNodes))
    } else if (event.key === 'Escape') {
      // Clear selection
      this.selectedNodes.clear()
      this.context.setSelection([])
    }
  }
  
  private isNodeInBox(node: Node, box: BoundingBox): boolean {
    if (!('size' in node)) return false
    
    const halfWidth = node.size.widthIn / 2
    const halfHeight = node.size.heightIn / 2
    const { xIn, yIn } = node.transform
    
    return (
      xIn - halfWidth >= box.minX &&
      xIn + halfWidth <= box.maxX &&
      yIn - halfHeight >= box.minY &&
      yIn + halfHeight <= box.maxY
    )
  }
}