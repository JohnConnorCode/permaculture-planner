import { BedShapeUtil } from './bed-shape'
import { PlantShapeUtil } from './plant-shape'
import { ElementShapeUtil } from './element-shape'
import { ZoneShapeUtil } from './zone-shape'
import { CompanionLineShapeUtil } from './companion-line-shape'

// Export all custom shape utilities
export const permacultureShapes = [
  BedShapeUtil,
  PlantShapeUtil,
  ElementShapeUtil,
  ZoneShapeUtil,
  CompanionLineShapeUtil,
]

// Export individual shape utilities and types
export { BedShapeUtil, PlantShapeUtil, ElementShapeUtil, ZoneShapeUtil, CompanionLineShapeUtil }
export type { BedShape } from './bed-shape'
export type { PlantShape } from './plant-shape'
export type { ElementShape } from './element-shape'
export type { ZoneShape } from './zone-shape'
export type { CompanionLineShape } from './companion-line-shape'
