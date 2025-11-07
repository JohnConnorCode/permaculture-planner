import { StateNode, TLPointerEvent } from 'tldraw'
import { BedShape } from '../shapes/bed-shape'

/**
 * BedTool - Interactive tool for drawing garden beds
 *
 * Click and drag to create rectangular beds
 * Future: Support for custom polygon shapes
 */
export class BedTool extends StateNode {
  static override id = 'bed-tool'

  private startPoint: { x: number; y: number } | null = null
  private currentShapeId: string | null = null

  override onPointerDown: TLPointerEvent = () => {
    const { x, y } = this.editor.inputs.currentPagePoint
    this.startPoint = { x, y }

    // Create initial bed shape
    const shapeId = `bed-${Date.now()}`
    this.currentShapeId = shapeId

    this.editor.createShape<BedShape>({
      id: shapeId as any,
      type: 'bed',
      x,
      y,
      props: {
        w: 10,
        h: 10,
        name: 'Garden Bed',
        color: '#22c55e',
        pointsJson: '[]',
        elementType: '',
        elementCategory: 'bed',
        zone: -1,
      },
    })
  }

  override onPointerMove: TLPointerEvent = () => {
    if (!this.startPoint || !this.currentShapeId) return

    const { x, y } = this.editor.inputs.currentPagePoint
    const width = Math.abs(x - this.startPoint.x)
    const height = Math.abs(y - this.startPoint.y)

    // Update bed size
    this.editor.updateShape<BedShape>({
      id: this.currentShapeId as any,
      type: 'bed',
      props: {
        w: width,
        h: height,
      },
    })
  }

  override onPointerUp: TLPointerEvent = () => {
    // Finalize the bed
    this.startPoint = null
    this.currentShapeId = null

    // Stay in bed tool mode for creating multiple beds
  }

  override onCancel = () => {
    // Clean up if drawing was cancelled
    if (this.currentShapeId) {
      this.editor.deleteShape(this.currentShapeId as any)
      this.currentShapeId = null
      this.startPoint = null
    }

    this.editor.setCurrentTool('select')
  }
}
