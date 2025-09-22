// Pure scene operations for transformations and manipulations

import {
  Node,
  Transform,
  BoundingBox,
  Scene,
  Layer,
  getNodeBounds,
  boundsOverlap,
  BedNode,
  PathNode
} from './sceneTypes'

// Transform operations
export function translateNode(node: Node, deltaX: number, deltaY: number): Node {
  return {
    ...node,
    transform: {
      ...node.transform,
      xIn: node.transform.xIn + deltaX,
      yIn: node.transform.yIn + deltaY
    }
  }
}

export function rotateNode(node: Node, degrees: number, absolute = false): Node {
  return {
    ...node,
    transform: {
      ...node.transform,
      rotationDeg: absolute
        ? degrees
        : (node.transform.rotationDeg + degrees) % 360
    }
  }
}

export function resizeNode(node: Node, width: number, height: number): Node {
  if (!('size' in node)) {
    return node
  }
  
  return {
    ...node,
    size: { widthIn: width, heightIn: height }
  } as Node
}

export function scaleNode(node: Node, scaleX: number, scaleY: number): Node {
  if (!('size' in node)) {
    return node
  }
  
  const currentNode = node as BedNode | PathNode
  return {
    ...currentNode,
    size: {
      widthIn: currentNode.size.widthIn * scaleX,
      heightIn: currentNode.size.heightIn * scaleY
    }
  } as Node
}

// Alignment operations
export function alignNodes(
  nodes: Node[],
  alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
): Node[] {
  if (nodes.length < 2) return nodes
  
  // Calculate bounds for all nodes
  const bounds = nodes.map(getNodeBounds)
  
  let targetValue: number
  
  switch (alignment) {
    case 'left':
      targetValue = Math.min(...bounds.map(b => b.minX))
      return nodes.map((node, i) => {
        const offset = targetValue - bounds[i].minX
        return translateNode(node, offset, 0)
      })
    
    case 'right':
      targetValue = Math.max(...bounds.map(b => b.maxX))
      return nodes.map((node, i) => {
        const offset = targetValue - bounds[i].maxX
        return translateNode(node, offset, 0)
      })
    
    case 'center':
      const minX = Math.min(...bounds.map(b => b.minX))
      const maxX = Math.max(...bounds.map(b => b.maxX))
      targetValue = (minX + maxX) / 2
      return nodes.map((node, i) => {
        const centerX = (bounds[i].minX + bounds[i].maxX) / 2
        const offset = targetValue - centerX
        return translateNode(node, offset, 0)
      })
    
    case 'top':
      targetValue = Math.min(...bounds.map(b => b.minY))
      return nodes.map((node, i) => {
        const offset = targetValue - bounds[i].minY
        return translateNode(node, 0, offset)
      })
    
    case 'bottom':
      targetValue = Math.max(...bounds.map(b => b.maxY))
      return nodes.map((node, i) => {
        const offset = targetValue - bounds[i].maxY
        return translateNode(node, 0, offset)
      })
    
    case 'middle':
      const minY = Math.min(...bounds.map(b => b.minY))
      const maxY = Math.max(...bounds.map(b => b.maxY))
      targetValue = (minY + maxY) / 2
      return nodes.map((node, i) => {
        const centerY = (bounds[i].minY + bounds[i].maxY) / 2
        const offset = targetValue - centerY
        return translateNode(node, 0, offset)
      })
    
    default:
      return nodes
  }
}

// Distribution operations
export function distributeNodes(
  nodes: Node[],
  direction: 'horizontal' | 'vertical',
  spacing?: number
): Node[] {
  if (nodes.length < 3) return nodes
  
  // Sort nodes by position
  const sorted = [...nodes].sort((a, b) => {
    if (direction === 'horizontal') {
      return a.transform.xIn - b.transform.xIn
    } else {
      return a.transform.yIn - b.transform.yIn
    }
  })
  
  const bounds = sorted.map(getNodeBounds)
  
  if (spacing !== undefined) {
    // Distribute with fixed spacing
    let currentPos = direction === 'horizontal' 
      ? sorted[0].transform.xIn 
      : sorted[0].transform.yIn
    
    return sorted.map((node, i) => {
      if (i === 0) return node
      
      const prevBounds = bounds[i - 1]
      const currentBounds = bounds[i]
      
      if (direction === 'horizontal') {
        currentPos += (prevBounds.maxX - prevBounds.minX) / 2 + spacing + 
                     (currentBounds.maxX - currentBounds.minX) / 2
        const offset = currentPos - node.transform.xIn
        return translateNode(node, offset, 0)
      } else {
        currentPos += (prevBounds.maxY - prevBounds.minY) / 2 + spacing + 
                     (currentBounds.maxY - currentBounds.minY) / 2
        const offset = currentPos - node.transform.yIn
        return translateNode(node, 0, offset)
      }
    })
  } else {
    // Distribute evenly within bounds
    const firstBounds = bounds[0]
    const lastBounds = bounds[bounds.length - 1]
    
    const start = direction === 'horizontal' 
      ? (firstBounds.minX + firstBounds.maxX) / 2
      : (firstBounds.minY + firstBounds.maxY) / 2
    
    const end = direction === 'horizontal'
      ? (lastBounds.minX + lastBounds.maxX) / 2
      : (lastBounds.minY + lastBounds.maxY) / 2
    
    const totalDistance = end - start
    const step = totalDistance / (nodes.length - 1)
    
    return sorted.map((node, i) => {
      const targetPos = start + step * i
      
      if (direction === 'horizontal') {
        const offset = targetPos - node.transform.xIn
        return translateNode(node, offset, 0)
      } else {
        const offset = targetPos - node.transform.yIn
        return translateNode(node, 0, offset)
      }
    })
  }
}

// Duplicate nodes with offset
export function duplicateNodes(
  nodes: Node[],
  offsetX: number = 12,
  offsetY: number = 12
): Node[] {
  return nodes.map(node => ({
    ...node,
    id: `${node.id}-copy-${Date.now()}`,
    transform: {
      ...node.transform,
      xIn: node.transform.xIn + offsetX,
      yIn: node.transform.yIn + offsetY
    }
  }))
}

// Flip nodes
export function flipNodes(
  nodes: Node[],
  axis: 'horizontal' | 'vertical',
  center?: { x: number; y: number }
): Node[] {
  // Calculate center if not provided
  const bounds = nodes.map(getNodeBounds)
  const minX = Math.min(...bounds.map(b => b.minX))
  const maxX = Math.max(...bounds.map(b => b.maxX))
  const minY = Math.min(...bounds.map(b => b.minY))
  const maxY = Math.max(...bounds.map(b => b.maxY))
  
  const flipCenter = center || {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2
  }
  
  return nodes.map(node => {
    if (axis === 'horizontal') {
      const distance = node.transform.xIn - flipCenter.x
      return {
        ...node,
        transform: {
          ...node.transform,
          xIn: flipCenter.x - distance,
          rotationDeg: -node.transform.rotationDeg
        }
      }
    } else {
      const distance = node.transform.yIn - flipCenter.y
      return {
        ...node,
        transform: {
          ...node.transform,
          yIn: flipCenter.y - distance,
          rotationDeg: -node.transform.rotationDeg
        }
      }
    }
  })
}

// Snap to grid
export function snapToGrid(
  value: number,
  gridSpacing: number,
  tolerance?: number
): number {
  const snapped = Math.round(value / gridSpacing) * gridSpacing
  
  if (tolerance !== undefined) {
    const diff = Math.abs(value - snapped)
    return diff <= tolerance ? snapped : value
  }
  
  return snapped
}

export function snapNodeToGrid(
  node: Node,
  gridSpacing: number,
  tolerance?: number
): Node {
  return {
    ...node,
    transform: {
      ...node.transform,
      xIn: snapToGrid(node.transform.xIn, gridSpacing, tolerance),
      yIn: snapToGrid(node.transform.yIn, gridSpacing, tolerance)
    }
  }
}

// Find overlapping nodes
export function findOverlappingNodes(
  node: Node,
  otherNodes: Node[],
  padding: number = 0
): Node[] {
  const nodeBounds = getNodeBounds(node)
  
  // Expand bounds by padding
  const expandedBounds: BoundingBox = {
    minX: nodeBounds.minX - padding,
    minY: nodeBounds.minY - padding,
    maxX: nodeBounds.maxX + padding,
    maxY: nodeBounds.maxY + padding
  }
  
  return otherNodes.filter(other => {
    if (other.id === node.id) return false
    const otherBounds = getNodeBounds(other)
    return boundsOverlap(expandedBounds, otherBounds)
  })
}

// Auto-arrange nodes in a grid
export function arrangeInGrid(
  nodes: Node[],
  columns: number,
  spacing: number = 12,
  startX: number = 0,
  startY: number = 0
): Node[] {
  return nodes.map((node, index) => {
    const col = index % columns
    const row = Math.floor(index / columns)
    
    // Get node size for spacing calculation
    let width = 48 // default
    let height = 48 // default
    
    if ('size' in node) {
      const sizedNode = node as BedNode | PathNode
      width = sizedNode.size.widthIn
      height = sizedNode.size.heightIn
    }
    
    const x = startX + col * (width + spacing) + width / 2
    const y = startY + row * (height + spacing) + height / 2
    
    return {
      ...node,
      transform: {
        ...node.transform,
        xIn: x,
        yIn: y
      }
    }
  })
}

// Calculate total area of nodes
export function calculateTotalArea(nodes: Node[]): number {
  return nodes.reduce((total, node) => {
    if ('size' in node) {
      const sizedNode = node as BedNode | PathNode
      return total + (sizedNode.size.widthIn * sizedNode.size.heightIn)
    }
    return total
  }, 0)
}

// Find nodes within a selection rectangle
export function findNodesInRect(
  rect: BoundingBox,
  nodes: Node[],
  mode: 'intersect' | 'contain' = 'intersect'
): Node[] {
  return nodes.filter(node => {
    const bounds = getNodeBounds(node)
    
    if (mode === 'intersect') {
      return boundsOverlap(rect, bounds)
    } else {
      // Contain mode - node must be fully inside rect
      return (
        bounds.minX >= rect.minX &&
        bounds.maxX <= rect.maxX &&
        bounds.minY >= rect.minY &&
        bounds.maxY <= rect.maxY
      )
    }
  })
}

// Group nodes by type
export function groupNodesByType(nodes: Node[]): Map<string, Node[]> {
  const groups = new Map<string, Node[]>()
  
  for (const node of nodes) {
    const type = node.type
    if (!groups.has(type)) {
      groups.set(type, [])
    }
    groups.get(type)!.push(node)
  }
  
  return groups
}

// Sort nodes by layer order and position
export function sortNodesForRendering(scene: Scene): Node[] {
  const allNodes: Node[] = []
  
  // Process layers in order
  const sortedLayers = [...scene.layers].sort((a, b) => a.order - b.order)
  
  for (const layer of sortedLayers) {
    if (layer.visible) {
      allNodes.push(...layer.nodes)
    }
  }
  
  return allNodes
}

// Calculate scene bounds
export function calculateSceneBounds(scene: Scene): BoundingBox {
  const allNodes = scene.layers.flatMap(l => l.nodes)
  
  if (allNodes.length === 0) {
    return { minX: 0, minY: 0, maxX: scene.size.widthIn, maxY: scene.size.heightIn }
  }
  
  let minX = Infinity, minY = Infinity
  let maxX = -Infinity, maxY = -Infinity
  
  for (const node of allNodes) {
    const bounds = getNodeBounds(node)
    minX = Math.min(minX, bounds.minX)
    minY = Math.min(minY, bounds.minY)
    maxX = Math.max(maxX, bounds.maxX)
    maxY = Math.max(maxY, bounds.maxY)
  }
  
  return { minX, minY, maxX, maxY }
}