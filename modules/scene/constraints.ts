// Constraint validation for the visual editor

import {
  Node,
  Scene,
  ValidationResult,
  ConstraintSettings,
  ConstraintViolation,
  isBedNode,
  isPathNode,
  getNodeBounds,
  boundsOverlap
} from './sceneTypes'

// Default constraint values
export const DEFAULT_CONSTRAINTS: ConstraintSettings = {
  bedWidthMaxIn: 48,
  pathWidthMinIn: 18,
  pathWidthWheelbarrowIn: 36,
  snapToleranceIn: 0.25,
  preventOverlap: true,
  accessibility: false
}

// Validate a single node
export function validateNode(
  node: Node,
  constraints: ConstraintSettings,
  scene?: Scene
): ValidationResult {
  const violations: ValidationResult['violations'] = []
  
  // Bed width constraint
  if (isBedNode(node)) {
    const maxWidth = constraints.accessibility ? 36 : constraints.bedWidthMaxIn
    
    if (node.size.widthIn > maxWidth) {
      violations?.push({
        code: 'BED_WIDTH_EXCEEDS_MAX',
        nodeId: node.id,
        detail: `Bed width ${node.size.widthIn}" exceeds maximum ${maxWidth}"`,
        suggestion: constraints.accessibility
          ? 'For accessibility, bed width should not exceed 36 inches'
          : 'Standard beds should not exceed 48 inches for reach'
      })
    }
    
    // Check trellis orientation
    if (node.bed.trellisNorth && node.bed.orientation === 'EW') {
      violations?.push({
        code: 'TRELLIS_NOT_NORTH',
        nodeId: node.id,
        detail: 'Trellis should be on north side with NS orientation',
        suggestion: 'Change bed orientation to NS or move trellis to avoid shading'
      })
    }
  }
  
  // Path width constraint
  if (isPathNode(node)) {
    const minWidth = constraints.accessibility
      ? constraints.pathWidthWheelbarrowIn
      : constraints.pathWidthMinIn
    
    if (node.size.widthIn < minWidth) {
      violations?.push({
        code: 'PATH_WIDTH_BELOW_MIN',
        nodeId: node.id,
        detail: `Path width ${node.size.widthIn}" is below minimum ${minWidth}"`,
        suggestion: constraints.accessibility
          ? 'Wheelchair accessible paths need at least 36 inches'
          : 'Paths should be at least 18 inches wide for walking'
      })
    }
  }
  
  // Check bounds
  if (scene) {
    const bounds = getNodeBounds(node)
    
    if (
      bounds.minX < 0 ||
      bounds.minY < 0 ||
      bounds.maxX > scene.size.widthIn ||
      bounds.maxY > scene.size.heightIn
    ) {
      violations?.push({
        code: 'OUT_OF_BOUNDS',
        nodeId: node.id,
        detail: 'Node extends outside scene boundaries',
        suggestion: 'Move or resize the element to fit within the plan area'
      })
    }
  }
  
  return {
    ok: !violations || violations.length === 0,
    violations: violations?.length ? violations : undefined
  }
}

// Validate entire scene
export function validateScene(
  scene: Scene,
  constraints: ConstraintSettings
): ValidationResult {
  const allViolations: ValidationResult['violations'] = []
  const allNodes = scene.layers.flatMap(layer => layer.nodes)
  
  // Validate each node
  for (const node of allNodes) {
    const result = validateNode(node, constraints, scene)
    if (result.violations) {
      allViolations?.push(...result.violations)
    }
  }
  
  // Check for overlaps if enabled
  if (constraints.preventOverlap) {
    const overlaps = findOverlaps(allNodes)
    
    for (const [nodeA, nodeB] of overlaps) {
      allViolations?.push({
        code: 'OVERLAP',
        nodeId: nodeA.id,
        detail: `${nodeA.id} overlaps with ${nodeB.id}`,
        suggestion: 'Adjust positions to prevent bed overlap'
      })
    }
  }
  
  return {
    ok: !allViolations || allViolations.length === 0,
    violations: allViolations?.length ? allViolations : undefined
  }
}

// Find overlapping nodes
function findOverlaps(nodes: Node[]): Array<[Node, Node]> {
  const overlaps: Array<[Node, Node]> = []
  const bedNodes = nodes.filter(isBedNode)
  
  for (let i = 0; i < bedNodes.length; i++) {
    for (let j = i + 1; j < bedNodes.length; j++) {
      const boundsA = getNodeBounds(bedNodes[i])
      const boundsB = getNodeBounds(bedNodes[j])
      
      if (boundsOverlap(boundsA, boundsB)) {
        overlaps.push([bedNodes[i], bedNodes[j]])
      }
    }
  }
  
  return overlaps
}

// Clamp value to constraint limits
export function clampToConstraints(
  value: number,
  type: 'bedWidth' | 'pathWidth' | 'bedHeight',
  constraints: ConstraintSettings
): number {
  switch (type) {
    case 'bedWidth':
      const maxWidth = constraints.accessibility ? 36 : constraints.bedWidthMaxIn
      return Math.min(value, maxWidth)
    
    case 'pathWidth':
      const minWidth = constraints.accessibility
        ? constraints.pathWidthWheelbarrowIn
        : constraints.pathWidthMinIn
      return Math.max(value, minWidth)
    
    case 'bedHeight':
      // Standard bed height constraints
      return Math.max(6, Math.min(48, value))
    
    default:
      return value
  }
}

// Suggest fixes for violations
export function suggestFixes(
  violations: NonNullable<ValidationResult['violations']>
): Map<string, string[]> {
  const fixes = new Map<string, string[]>()
  
  for (const violation of violations) {
    if (!fixes.has(violation.nodeId)) {
      fixes.set(violation.nodeId, [])
    }
    
    const nodeFixes = fixes.get(violation.nodeId)!
    
    switch (violation.code) {
      case 'BED_WIDTH_EXCEEDS_MAX':
        nodeFixes.push('Reduce bed width to 48" or less')
        nodeFixes.push('Split into two narrower beds')
        break
      
      case 'PATH_WIDTH_BELOW_MIN':
        nodeFixes.push('Increase path width to at least 18"')
        nodeFixes.push('Combine with adjacent path')
        break
      
      case 'OVERLAP':
        nodeFixes.push('Move beds apart')
        nodeFixes.push('Reduce bed sizes')
        nodeFixes.push('Reorganize layout')
        break
      
      case 'TRELLIS_NOT_NORTH':
        nodeFixes.push('Rotate bed to NS orientation')
        nodeFixes.push('Move trellis to north side')
        nodeFixes.push('Remove trellis if not needed')
        break
      
      case 'OUT_OF_BOUNDS':
        nodeFixes.push('Move element within boundaries')
        nodeFixes.push('Reduce element size')
        nodeFixes.push('Increase plan area')
        break
    }
  }
  
  return fixes
}

// Auto-fix violations where possible
export function autoFixViolations(
  node: Node,
  violations: NonNullable<ValidationResult['violations']>,
  constraints: ConstraintSettings
): Node {
  let fixedNode = { ...node }
  
  for (const violation of violations) {
    switch (violation.code) {
      case 'BED_WIDTH_EXCEEDS_MAX':
        if (isBedNode(fixedNode)) {
          const maxWidth = constraints.accessibility ? 36 : constraints.bedWidthMaxIn
          fixedNode = {
            ...fixedNode,
            size: {
              ...fixedNode.size,
              widthIn: Math.min(fixedNode.size.widthIn, maxWidth)
            }
          } as Node
        }
        break
      
      case 'PATH_WIDTH_BELOW_MIN':
        if (isPathNode(fixedNode)) {
          const minWidth = constraints.accessibility
            ? constraints.pathWidthWheelbarrowIn
            : constraints.pathWidthMinIn
          fixedNode = {
            ...fixedNode,
            size: {
              ...fixedNode.size,
              widthIn: Math.max(fixedNode.size.widthIn, minWidth)
            }
          } as Node
        }
        break
      
      case 'TRELLIS_NOT_NORTH':
        if (isBedNode(fixedNode)) {
          fixedNode = {
            ...fixedNode,
            bed: {
              ...fixedNode.bed,
              orientation: 'NS'
            }
          } as Node
        }
        break
    }
  }
  
  return fixedNode
}

// Check if a position is valid for placing a node
export function isValidPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  scene: Scene,
  excludeNodeId?: string,
  constraints?: ConstraintSettings
): boolean {
  // Check scene bounds
  const halfWidth = width / 2
  const halfHeight = height / 2
  
  if (
    x - halfWidth < 0 ||
    y - halfHeight < 0 ||
    x + halfWidth > scene.size.widthIn ||
    y + halfHeight > scene.size.heightIn
  ) {
    return false
  }
  
  // Check overlaps if constraint enabled
  if (constraints?.preventOverlap) {
    const testBounds = {
      minX: x - halfWidth,
      minY: y - halfHeight,
      maxX: x + halfWidth,
      maxY: y + halfHeight
    }
    
    const allNodes = scene.layers.flatMap(layer => layer.nodes)
    
    for (const node of allNodes) {
      if (node.id === excludeNodeId) continue
      if (!isBedNode(node)) continue
      
      const nodeBounds = getNodeBounds(node)
      if (boundsOverlap(testBounds, nodeBounds)) {
        return false
      }
    }
  }
  
  return true
}

// Get constraint limits for UI
export function getConstraintLimits(
  type: 'bedWidth' | 'pathWidth' | 'bedHeight',
  constraints: ConstraintSettings
): { min: number; max: number; step: number } {
  switch (type) {
    case 'bedWidth':
      return {
        min: 12,
        max: constraints.accessibility ? 36 : constraints.bedWidthMaxIn,
        step: 1
      }
    
    case 'pathWidth':
      return {
        min: constraints.accessibility
          ? constraints.pathWidthWheelbarrowIn
          : constraints.pathWidthMinIn,
        max: 60,
        step: 1
      }
    
    case 'bedHeight':
      return {
        min: 6,
        max: 48,
        step: 1
      }
    
    default:
      return { min: 0, max: 100, step: 1 }
  }
}