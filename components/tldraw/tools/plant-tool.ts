import { StateNode, TLClickEvent, TLPointerEvent } from 'tldraw'
import { PlantShape } from '../shapes/plant-shape'
import { PlantInfo } from '@/lib/data/plant-library'

/**
 * PlantTool - Interactive tool for placing plants on canvas
 *
 * Usage:
 * 1. Select a plant from the library
 * 2. Click on a bed to place the plant
 * 3. Plant is automatically positioned with proper spacing
 */
export class PlantTool extends StateNode {
  static override id = 'plant-tool'

  private plantInfo: PlantInfo | null = null

  /**
   * Set the plant to be placed
   */
  setPlant(plant: PlantInfo) {
    this.plantInfo = plant
  }

  /**
   * Handle click to place plant
   */
  override onPointerDown: TLPointerEvent = (info) => {
    if (!this.plantInfo) return

    const { x, y } = this.editor.inputs.currentPagePoint

    // Create plant shape at click location
    this.createPlantShape(x, y)
  }

  override onPointerMove: TLPointerEvent = () => {
    // Could show preview circle following cursor
  }

  override onCancel = () => {
    // Return to select tool
    this.editor.setCurrentTool('select')
  }

  private createPlantShape(x: number, y: number) {
    if (!this.plantInfo) return

    const plantId = `plant-${Date.now()}`
    const radius = Math.max(20, this.plantInfo.size.spacing / 2)

    this.editor.createShape<PlantShape>({
      type: 'plant',
      x,
      y,
      props: {
        radius,
        plantId: this.plantInfo.id,
        plantName: this.plantInfo.name,
        emoji: this.plantInfo.icon,
        color: this.plantInfo.color,
        companionsJson: JSON.stringify(this.plantInfo.companions),
        antagonistsJson: JSON.stringify(this.plantInfo.antagonists),
        spacing: this.plantInfo.size.spacing,
        plantedDate: new Date().toISOString(),
      },
    })

    // Stay in plant tool mode for placing multiple plants
    // Press Escape to return to select tool
  }
}
