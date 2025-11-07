import { StateNode, TLPointerEvent } from 'tldraw'
import { ElementShape } from '../shapes/element-shape'
import { ElementSubtype, ElementCategory, ELEMENT_STYLES } from '@/lib/canvas-elements'

/**
 * ElementTool - Interactive tool for placing permaculture elements
 *
 * Supports all 27 element types with proper sizing and styling
 */
export class ElementTool extends StateNode {
  static override id = 'element-tool'

  private elementSubtype: ElementSubtype | null = null
  private elementCategory: ElementCategory | null = null

  /**
   * Set the element type to be placed
   */
  setElement(subtype: ElementSubtype, category: ElementCategory) {
    this.elementSubtype = subtype
    this.elementCategory = category
  }

  override onPointerDown: TLPointerEvent = (info) => {
    if (!this.elementSubtype || !this.elementCategory) return

    const { x, y } = this.editor.inputs.currentPagePoint

    this.createElementShape(x, y)
  }

  override onCancel = () => {
    this.editor.setCurrentTool('select')
  }

  private createElementShape(x: number, y: number) {
    if (!this.elementSubtype || !this.elementCategory) return

    const style = ELEMENT_STYLES[this.elementSubtype]
    const width = style.minWidth || 100
    const height = style.minHeight || style.minWidth || 100

    this.editor.createShape<ElementShape>({
      type: 'element',
      x: x - width / 2,
      y: y - height / 2,
      props: {
        w: width,
        h: height,
        name: this.elementSubtype.replace('_', ' '),
        subtype: this.elementSubtype,
        category: this.elementCategory,
        color: style.defaultStroke,
        fill: style.defaultFill,
        pointsJson: '[]',
        zone: -1,
        capacity: 0,
        material: '',
        flowDirection: '',
        connectedIds: '[]',
        metadataJson: '{}',
      },
    })
  }
}
