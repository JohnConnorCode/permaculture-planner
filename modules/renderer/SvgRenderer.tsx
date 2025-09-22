// SVG Renderer implementation for the Visual Editor

import React from 'react'
import { Scene, Node, Viewport, Selection, isBedNode, isPathNode, isLabelNode, getNodeBounds } from '../scene/sceneTypes'

export interface RendererProps {
  scene: Scene
  viewport: Viewport
  selection: Selection
  onNodeClick?: (nodeId: string, event: React.MouseEvent) => void
  onNodeDoubleClick?: (nodeId: string, event: React.MouseEvent) => void
  onBackgroundClick?: (event: React.MouseEvent) => void
  showHandles?: boolean
  readOnly?: boolean
}

export const SvgRenderer: React.FC<RendererProps> = ({
  scene,
  viewport,
  selection,
  onNodeClick,
  onNodeDoubleClick,
  onBackgroundClick,
  showHandles = true,
  readOnly = false
}) => {
  const { zoom, pan, grid } = viewport
  const viewBox = `${-pan.x} ${-pan.y} ${scene.size.widthIn / zoom} ${scene.size.heightIn / zoom}`
  
  const renderGrid = () => {
    if (!grid.enabled) return null
    
    const spacing = grid.spacingIn
    const width = scene.size.widthIn
    const height = scene.size.heightIn
    
    const verticalLines = []
    const horizontalLines = []
    
    for (let x = 0; x <= width; x += spacing) {
      verticalLines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#e0e0e0"
          strokeWidth={0.5}
        />
      )
    }
    
    for (let y = 0; y <= height; y += spacing) {
      horizontalLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#e0e0e0"
          strokeWidth={0.5}
        />
      )
    }
    
    return (
      <g className="grid" opacity={0.5}>
        {verticalLines}
        {horizontalLines}
      </g>
    )
  }
  
  const renderNode = (node: Node, isSelected: boolean) => {
    const { xIn, yIn, rotationDeg } = node.transform
    const transform = `translate(${xIn}, ${yIn}) rotate(${rotationDeg})`
    
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!readOnly && onNodeClick) {
        onNodeClick(node.id, e)
      }
    }
    
    const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!readOnly && onNodeDoubleClick) {
        onNodeDoubleClick(node.id, e)
      }
    }
    
    if (isBedNode(node)) {
      const halfWidth = node.size.widthIn / 2
      const halfHeight = node.size.heightIn / 2
      
      return (
        <g
          key={node.id}
          data-id={node.id}
          transform={transform}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`node bed ${isSelected ? 'selected' : ''}`}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          <rect
            x={-halfWidth}
            y={-halfHeight}
            width={node.size.widthIn}
            height={node.size.heightIn}
            fill={node.bed.wicking ? '#e3f2fd' : '#f1f8e9'}
            stroke={isSelected ? '#2196f3' : '#689f38'}
            strokeWidth={isSelected ? 2 : 1}
            rx={2}
          />
          
          {node.bed.trellisNorth && (
            <line
              x1={-halfWidth}
              y1={-halfHeight}
              x2={halfWidth}
              y2={-halfHeight}
              stroke="#795548"
              strokeWidth={3}
              strokeDasharray="5,5"
            />
          )}
          
          {node.bed.familyTag && (
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fill="#333"
            >
              {node.bed.familyTag}
            </text>
          )}
          
          {node.style?.label?.text && (
            <text
              x={0}
              y={halfHeight + 12}
              textAnchor="middle"
              fontSize={10}
              fill="#666"
            >
              {node.style.label.text}
            </text>
          )}
        </g>
      )
    }
    
    if (isPathNode(node)) {
      const halfWidth = node.size.widthIn / 2
      const halfHeight = node.size.heightIn / 2
      
      return (
        <g
          key={node.id}
          data-id={node.id}
          transform={transform}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`node path ${isSelected ? 'selected' : ''}`}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          <rect
            x={-halfWidth}
            y={-halfHeight}
            width={node.size.widthIn}
            height={node.size.heightIn}
            fill="#d7ccc8"
            stroke={isSelected ? '#2196f3' : '#8d6e63'}
            strokeWidth={isSelected ? 2 : 1}
            opacity={0.6}
          />
        </g>
      )
    }
    
    if (isLabelNode(node)) {
      return (
        <g
          key={node.id}
          data-id={node.id}
          transform={transform}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`node label ${isSelected ? 'selected' : ''}`}
          style={{ cursor: readOnly ? 'default' : 'move' }}
        >
          <text
            x={0}
            y={0}
            textAnchor={node.textAlign === 'center' ? 'middle' : node.textAlign === 'left' ? 'start' : 'end'}
            dominantBaseline="middle"
            fontSize={node.fontSize}
            fill={isSelected ? '#2196f3' : '#333'}
          >
            {node.text}
          </text>
        </g>
      )
    }
    
    return null
  }
  
  const renderHandles = (node: Node) => {
    if (!showHandles || readOnly) return null
    if (!('size' in node)) return null
    
    const bounds = getNodeBounds(node)
    const { xIn, yIn } = node.transform
    const halfWidth = (bounds.maxX - bounds.minX) / 2
    const halfHeight = (bounds.maxY - bounds.minY) / 2
    
    const handleSize = 8 / zoom
    const handles = [
      { id: 'nw', x: xIn - halfWidth, y: yIn - halfHeight },
      { id: 'n', x: xIn, y: yIn - halfHeight },
      { id: 'ne', x: xIn + halfWidth, y: yIn - halfHeight },
      { id: 'e', x: xIn + halfWidth, y: yIn },
      { id: 'se', x: xIn + halfWidth, y: yIn + halfHeight },
      { id: 's', x: xIn, y: yIn + halfHeight },
      { id: 'sw', x: xIn - halfWidth, y: yIn + halfHeight },
      { id: 'w', x: xIn - halfWidth, y: yIn },
    ]
    
    return (
      <g className="handles">
        {handles.map(handle => (
          <rect
            key={handle.id}
            className={`handle handle-${handle.id}`}
            x={handle.x - handleSize / 2}
            y={handle.y - handleSize / 2}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#2196f3"
            strokeWidth={1}
            style={{ cursor: `${handle.id}-resize` }}
          />
        ))}
        
        {/* Rotation handle */}
        <g className="rotation-handle">
          <line
            x1={xIn}
            y1={yIn - halfHeight}
            x2={xIn}
            y2={yIn - halfHeight - 20 / zoom}
            stroke="#2196f3"
            strokeWidth={1}
          />
          <circle
            cx={xIn}
            cy={yIn - halfHeight - 20 / zoom}
            r={handleSize / 2}
            fill="white"
            stroke="#2196f3"
            strokeWidth={1}
            style={{ cursor: 'grab' }}
          />
        </g>
      </g>
    )
  }
  
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (!readOnly && onBackgroundClick) {
      onBackgroundClick(e)
    }
  }
  
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={viewBox}
      style={{ background: '#fafafa' }}
      onClick={handleBackgroundClick}
    >
      <defs>
        <pattern id="grid" width={grid.spacingIn} height={grid.spacingIn} patternUnits="userSpaceOnUse">
          <path
            d={`M ${grid.spacingIn} 0 L 0 0 0 ${grid.spacingIn}`}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect
        x={0}
        y={0}
        width={scene.size.widthIn}
        height={scene.size.heightIn}
        fill="white"
      />
      
      {/* Grid */}
      {renderGrid()}
      
      {/* Render layers */}
      {scene.layers
        .filter(layer => layer.visible)
        .sort((a, b) => a.order - b.order)
        .map(layer => (
          <g key={layer.id} className={`layer layer-${layer.id}`}>
            {layer.nodes.map(node => {
              const isSelected = selection.ids.includes(node.id)
              return renderNode(node, isSelected)
            })}
          </g>
        ))}
      
      {/* Render handles for selected nodes */}
      {selection.ids.map(nodeId => {
        const node = scene.layers
          .flatMap(l => l.nodes)
          .find(n => n.id === nodeId)
        
        if (!node) return null
        return renderHandles(node)
      })}
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <text x={10} y={20} fontSize={12} fill="#999">
          Zoom: {zoom.toFixed(2)} | Pan: ({pan.x.toFixed(0)}, {pan.y.toFixed(0)}) | Selected: {selection.ids.length}
        </text>
      )}
    </svg>
  )
}

export default SvgRenderer