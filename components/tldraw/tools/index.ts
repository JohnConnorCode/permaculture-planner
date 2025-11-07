/**
 * Custom tools for the permaculture canvas
 *
 * Professional interactive tools for:
 * - Drawing garden beds (click and drag)
 * - Placing plants (click to place)
 * - Adding permaculture elements (click to place)
 */

import { PlantTool } from './plant-tool'
import { ElementTool } from './element-tool'
import { BedTool } from './bed-tool'

// Export all custom tools for tldraw
export const permacultureTools = [
  PlantTool,
  ElementTool,
  BedTool,
]

// Export individual tools
export { PlantTool, ElementTool, BedTool }
