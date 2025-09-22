import { ToolContext, PointerEvent, Node } from '../scene/sceneTypes'

export abstract class BaseTool {
  protected context: ToolContext
  protected isActive: boolean = false
  protected isDragging: boolean = false
  
  constructor(context: ToolContext) {
    this.context = context
  }
  
  abstract get id(): string
  abstract get name(): string
  abstract get icon(): string
  abstract get cursor(): string
  
  activate(): void {
    this.isActive = true
    this.onActivate()
  }
  
  deactivate(): void {
    this.isActive = false
    this.isDragging = false
    this.onDeactivate()
  }
  
  protected onActivate(): void {}
  protected onDeactivate(): void {}
  
  abstract onPointerDown(event: PointerEvent): void
  abstract onPointerMove(event: PointerEvent): void
  abstract onPointerUp(event: PointerEvent): void
  
  onKeyDown(event: KeyboardEvent): void {}
  onKeyUp(event: KeyboardEvent): void {}
  
  protected snapToGrid(value: number): number {
    if (!this.context.grid.enabled) return value
    const spacing = this.context.grid.spacingIn
    return Math.round(value / spacing) * spacing
  }
  
  protected getNodeAtPoint(x: number, y: number): Node | undefined {
    const nodes = [...this.context.scene.layers]
      .filter(layer => layer.visible && !layer.locked)
      .flatMap(layer => layer.nodes)
      .reverse()
    
    for (const node of nodes) {
      if (this.isPointInNode(x, y, node)) {
        return node
      }
    }
    
    return undefined
  }
  
  protected isPointInNode(x: number, y: number, node: Node): boolean {
    if (!('size' in node)) return false
    
    const halfWidth = node.size.widthIn / 2
    const halfHeight = node.size.heightIn / 2
    const { xIn, yIn } = node.transform
    
    return (
      x >= xIn - halfWidth &&
      x <= xIn + halfWidth &&
      y >= yIn - halfHeight &&
      y <= yIn + halfHeight
    )
  }
}