// Scene types for the Visual Editor
// All measurements in inches internally

export type Units = 'imperial' | 'metric'
export type NodeType = 'Bed' | 'Path' | 'Label' | 'Guide' | 'Image' | 'Plant' | 'Irrigation' | 'Structure' | 'Compost'
export type ToolId = 'select' | 'draw-bed' | 'draw-path' | 'measure' | 'text' | 'pan-zoom' | 'irrigation' | 'structure' | 'compost'

// Core scene structure
export interface Scene {
  id: string
  name: string
  size: { widthIn: number; heightIn: number }
  layers: Layer[]
  meta?: Record<string, unknown>
}

export interface Layer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  order: number
  nodes: Node[]
}

// Transform and styling
export interface Transform {
  xIn: number
  yIn: number
  rotationDeg: number
}

export interface Style {
  fill?: string
  stroke?: string
  strokeWidthIn?: number
  opacity?: number
  dash?: number[]
  label?: {
    text?: string
    fontSizePt?: number
    fontFamily?: string
  }
}

// Base node interface
export interface NodeBase {
  id: string
  type: NodeType
  transform: Transform
  style?: Style
  selectable?: boolean
  draggable?: boolean
  resizable?: boolean
  rotatable?: boolean
  meta?: Record<string, unknown>
}

// Specific node types
export interface BedNode extends NodeBase {
  type: 'Bed'
  size: { widthIn: number; heightIn: number }
  bed: {
    heightIn: number
    orientation: 'NS' | 'EW' | 'Custom'
    wicking: boolean
    trellisNorth: boolean
    familyTag?: string
    pathData?: string // SVG path data for curved beds
    curvePoints?: Array<{ x: number; y: number; controlX?: number; controlY?: number }> // Control points for editing
  }
}

export interface PathNode extends NodeBase {
  type: 'Path'
  size: { widthIn: number; heightIn: number }
  path: {
    material?: 'mulch' | 'gravel' | 'pavers'
  }
}

export interface LabelNode extends NodeBase {
  type: 'Label'
  text: string
  textAlign: 'left' | 'center' | 'right'
  fontSize: number
}

export interface GuideNode extends NodeBase {
  type: 'Guide'
  orientation: 'horizontal' | 'vertical'
  position: number // inches from origin
}

export interface ImageNode extends NodeBase {
  type: 'Image'
  size: { widthIn: number; heightIn: number }
  src: string
  aspectLocked?: boolean
}

export interface PlantNode extends NodeBase {
  type: 'Plant'
  plant: {
    plantId: string // Reference to plant database
    commonName: string
    icon: string
    matureSize: { widthIn: number; heightIn: number }
    spacingIn: number
    plantedDate?: string
    notes?: string
  }
  parentBedId?: string // ID of the bed this plant belongs to
}

export interface IrrigationNode extends NodeBase {
  type: 'Irrigation'
  size?: { widthIn: number; heightIn: number }
  irrigation: {
    irrigationType: 'drip-line' | 'sprinkler' | 'soaker-hose' | 'rain-barrel' | 'swale' | 'pond'
    flowRate?: number // gallons per hour
    coverage?: number // radius in inches for sprinklers
    capacity?: number // gallons for storage
    points?: Array<{ x: number; y: number }> // For lines/paths
  }
}

export interface StructureNode extends NodeBase {
  type: 'Structure'
  size: { widthIn: number; heightIn: number; heightFt?: number }
  structure: {
    structureType: 'bench' | 'pergola' | 'trellis' | 'shade-sail' | 'greenhouse' | 'shed' | 'arbor' | 'gazebo'
    material?: 'wood' | 'metal' | 'fabric' | 'bamboo'
    seats?: number // For benches
    shadePercentage?: number // For shade structures
  }
}

export interface CompostNode extends NodeBase {
  type: 'Compost'
  size: { widthIn: number; heightIn: number }
  compost: {
    compostType: 'bin' | 'pile' | 'tumbler' | 'worm-bin' | 'leaf-mold'
    capacity?: number // cubic feet
    material?: 'wood' | 'plastic' | 'wire' | 'concrete-blocks'
    numberOfBins?: number
  }
}

export type Node = BedNode | PathNode | LabelNode | GuideNode | ImageNode | PlantNode | IrrigationNode | StructureNode | CompostNode

// Viewport and grid
export interface Viewport {
  zoom: number // 0.1 to 4.0
  pan: { x: number; y: number } // world units (inches)
  grid: {
    enabled: boolean
    spacingIn: number
    showRulers: boolean
  }
}

// Selection
export interface Selection {
  ids: string[]
  primaryId?: string
}

// Bounding box for spatial indexing
export interface BoundingBox {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

// Editor state
export interface EditorState {
  scene: Scene
  viewport: Viewport
  selection: Selection
  activeTool: ToolId
  history: HistoryState
  ui: {
    rulers: boolean
    minimap: boolean
    grid: boolean
    units: Units
    snapEnabled: boolean
    snapTolerance: number
  }
  constraints: ConstraintSettings
}

// History for undo/redo
export interface HistoryState {
  undoStack: Command[]
  redoStack: Command[]
  maxStackSize: number
}

// Commands for undo/redo
export interface Command {
  id: string
  name: string
  timestamp: number
  apply(state: EditorState): EditorState
  invert(prev: EditorState, next: EditorState): Command
}

// Constraint settings
export interface ConstraintSettings {
  bedWidthMaxIn: number
  pathWidthMinIn: number
  pathWidthWheelbarrowIn: number
  snapToleranceIn: number
  preventOverlap: boolean
  accessibility: boolean
}

// Validation
export type ConstraintViolation =
  | 'BED_WIDTH_EXCEEDS_MAX'
  | 'PATH_WIDTH_BELOW_MIN'
  | 'OVERLAP'
  | 'TRELLIS_NOT_NORTH'
  | 'OUT_OF_BOUNDS'

export interface ValidationResult {
  ok: boolean
  violations?: Array<{
    code: ConstraintViolation
    nodeId: string
    detail?: string
    suggestion?: string
  }>
}

// File format for persistence
export interface PlanFileV1 {
  version: 'plan.v1'
  scene: Scene
  viewport?: Viewport
  createdAt: string
  updatedAt: string
  meta?: {
    units: Units
    hardSurface: boolean
    constraints?: Partial<ConstraintSettings>
  }
}

// Renderer capabilities
export interface RendererCapabilities {
  supportsPatterns: boolean
  supportsFilters: boolean
  supportsGradients: boolean
  maxNodesBeforeDegrade: number
  exportFormats: string[]
}

// Tool context
export interface ToolContext {
  scene: Scene
  viewport: Viewport
  selection: Selection
  constraints: ConstraintSettings
  grid: { enabled: boolean; spacingIn: number }
  addNode(node: Node): void
  updateNode(id: string, updates: Partial<Node>): void
  removeNode(id: string): void
  setSelection(ids: string[]): void
  worldToScreen(point: { xIn: number; yIn: number }): { x: number; y: number }
  screenToWorld(point: { x: number; y: number }): { xIn: number; yIn: number }
}

// Pointer event unified interface
export interface PointerEvent {
  pointerId: number
  pointerType: 'mouse' | 'touch' | 'pen'
  screenX: number
  screenY: number
  worldX: number // in inches
  worldY: number // in inches
  pressure: number
  shiftKey: boolean
  ctrlKey: boolean
  altKey: boolean
  metaKey: boolean
}

// Export options
export interface ExportOptions {
  format: 'svg' | 'png' | 'pdf'
  dpi?: number
  includeLabels?: boolean
  includeGrid?: boolean
  includeDimensions?: boolean
  backgroundColor?: string
  padding?: number
}

// Helper functions for node type guards
export function isBedNode(node: Node): node is BedNode {
  return node.type === 'Bed'
}

export function isPathNode(node: Node): node is PathNode {
  return node.type === 'Path'
}

export function isLabelNode(node: Node): node is LabelNode {
  return node.type === 'Label'
}

export function isGuideNode(node: Node): node is GuideNode {
  return node.type === 'Guide'
}

export function isImageNode(node: Node): node is ImageNode {
  return node.type === 'Image'
}

export function isPlantNode(node: Node): node is PlantNode {
  return node.type === 'Plant'
}

export function isIrrigationNode(node: Node): node is IrrigationNode {
  return node.type === 'Irrigation'
}

export function isStructureNode(node: Node): node is StructureNode {
  return node.type === 'Structure'
}

export function isCompostNode(node: Node): node is CompostNode {
  return node.type === 'Compost'
}

// Helper to get node bounds
export function getNodeBounds(node: Node): BoundingBox {
  const { xIn, yIn, rotationDeg } = node.transform
  
  let width = 0
  let height = 0
  
  if ('size' in node && node.size) {
    width = node.size.widthIn
    height = node.size.heightIn
  } else if (isLabelNode(node)) {
    // Estimate text bounds
    width = node.text.length * 6 // rough estimate
    height = node.fontSize
  } else if (isGuideNode(node)) {
    // Guides are infinite lines
    return {
      minX: node.orientation === 'vertical' ? node.position : -Infinity,
      minY: node.orientation === 'horizontal' ? node.position : -Infinity,
      maxX: node.orientation === 'vertical' ? node.position : Infinity,
      maxY: node.orientation === 'horizontal' ? node.position : Infinity
    }
  }
  
  // Apply rotation if needed (simplified for axis-aligned)
  if (rotationDeg % 90 === 0) {
    const rotations = Math.abs(rotationDeg / 90) % 4
    if (rotations === 1 || rotations === 3) {
      [width, height] = [height, width]
    }
  }
  
  return {
    minX: xIn - width / 2,
    minY: yIn - height / 2,
    maxX: xIn + width / 2,
    maxY: yIn + height / 2
  }
}

// Check if two bounding boxes overlap
export function boundsOverlap(a: BoundingBox, b: BoundingBox): boolean {
  return !(
    a.maxX < b.minX ||
    a.minX > b.maxX ||
    a.maxY < b.minY ||
    a.minY > b.maxY
  )
}

// Check if point is in bounds
export function pointInBounds(point: { x: number; y: number }, bounds: BoundingBox): boolean {
  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  )
}