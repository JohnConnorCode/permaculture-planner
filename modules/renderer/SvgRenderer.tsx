// SVG Renderer implementation for the Visual Editor

import React from 'react'
import { Scene, Node, Viewport, Selection, isBedNode, isPathNode, isLabelNode, isPlantNode, isIrrigationNode, isStructureNode, isCompostNode, getNodeBounds } from '../scene/sceneTypes'
import { DimensionLayer } from './DimensionLayer'
import { TexturePatterns } from './TexturePatterns'

export interface RendererProps {
  scene: Scene
  viewport: Viewport
  selection: Selection
  onNodeClick?: (nodeId: string, event: React.MouseEvent) => void
  onNodeDoubleClick?: (nodeId: string, event: React.MouseEvent) => void
  onBackgroundClick?: (event: React.MouseEvent) => void
  showHandles?: boolean
  showDimensions?: boolean
  showTextures?: boolean
  units?: 'imperial' | 'metric'
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
  showDimensions = true,
  showTextures = true,
  units = 'imperial',
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
          {node.bed.pathData ? (
            // Curved bed with custom path
            <path
              d={node.bed.pathData}
              fill={showTextures ? 'url(#soil-texture)' : (node.bed.wicking ? '#e3f2fd' : '#f1f8e9')}
              stroke={isSelected ? '#2196f3' : '#689f38'}
              strokeWidth={isSelected ? 2 : 1}
              filter={showTextures ? 'url(#bed-elevation)' : undefined}
            />
          ) : (
            // Regular rectangular bed
            <rect
              x={-halfWidth}
              y={-halfHeight}
              width={node.size.widthIn}
              height={node.size.heightIn}
              fill={showTextures ? 'url(#soil-texture)' : (node.bed.wicking ? '#e3f2fd' : '#f1f8e9')}
              stroke={isSelected ? '#2196f3' : '#689f38'}
              strokeWidth={isSelected ? 2 : 1}
              rx={2}
              filter={showTextures ? 'url(#bed-elevation)' : undefined}
            />
          )}
          
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
            fill={showTextures ?
              (node.path.material === 'mulch' ? 'url(#mulch-texture)' :
               node.path.material === 'gravel' ? 'url(#gravel-texture)' :
               node.path.material === 'pavers' ? 'url(#brick-texture)' :
               'url(#mulch-texture)')
              : '#d7ccc8'}
            stroke={isSelected ? '#2196f3' : '#8d6e63'}
            strokeWidth={isSelected ? 2 : 1}
            opacity={showTextures ? 1 : 0.6}
            filter={showTextures ? 'url(#shadow-soft)' : undefined}
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

    if (isPlantNode(node)) {
      const radius = node.plant.spacingIn / 2 // Visual radius based on spacing

      return (
        <g
          key={node.id}
          data-id={node.id}
          transform={transform}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`node plant ${isSelected ? 'selected' : ''}`}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          {/* Spacing circle */}
          <circle
            cx={0}
            cy={0}
            r={radius}
            fill="rgba(139, 195, 74, 0.1)"
            stroke="rgba(139, 195, 74, 0.3)"
            strokeWidth={1}
            strokeDasharray="2,2"
          />

          {/* Plant icon background */}
          <circle
            cx={0}
            cy={0}
            r={12}
            fill="white"
            stroke={isSelected ? '#2196f3' : '#8bc34a'}
            strokeWidth={isSelected ? 2 : 1}
            filter={showTextures ? 'url(#plant-shadow)' : undefined}
          />

          {/* Plant icon */}
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={16}
            style={{ userSelect: 'none' }}
          >
            {node.plant.icon}
          </text>

          {/* Plant name label */}
          <text
            x={0}
            y={radius + 8}
            textAnchor="middle"
            fontSize={10}
            fill="#666"
            style={{ userSelect: 'none' }}
          >
            {node.plant.commonName}
          </text>
        </g>
      )
    }

    if (isIrrigationNode(node)) {
      const irrigationType = node.irrigation.irrigationType

      return (
        <g
          key={node.id}
          data-id={node.id}
          transform={transform}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`node irrigation ${isSelected ? 'selected' : ''}`}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          {/* Different rendering based on irrigation type */}
          {irrigationType === 'sprinkler' && (
            <>
              <circle
                cx={0}
                cy={0}
                r={node.irrigation.coverage || 60}
                fill="rgba(59, 130, 246, 0.1)"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <circle
                cx={0}
                cy={0}
                r={6}
                fill="#3b82f6"
                stroke={isSelected ? '#2196f3' : '#3b82f6'}
                strokeWidth={isSelected ? 2 : 1}
              />
            </>
          )}

          {irrigationType === 'drip-line' && node.irrigation.points && (
            <polyline
              points={node.irrigation.points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="2,4"
            />
          )}

          {(irrigationType === 'rain-barrel' || irrigationType === 'pond') && node.size && (
            <rect
              x={-node.size.widthIn / 2}
              y={-node.size.heightIn / 2}
              width={node.size.widthIn}
              height={node.size.heightIn}
              rx={irrigationType === 'rain-barrel' ? node.size.widthIn / 4 : 8}
              fill="rgba(59, 130, 246, 0.2)"
              stroke={isSelected ? '#2196f3' : '#3b82f6'}
              strokeWidth={isSelected ? 2 : 1}
            />
          )}

          {irrigationType === 'swale' && node.size && (
            <path
              d={`M ${-node.size.widthIn/2} 0 Q 0 ${node.size.heightIn/2} ${node.size.widthIn/2} 0`}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          )}

          <text
            x={0}
            y={20}
            textAnchor="middle"
            fontSize={10}
            fill="#3b82f6"
          >
            {irrigationType.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
          </text>
        </g>
      )
    }

    if (isStructureNode(node)) {
      const structureType = node.structure.structureType
      const halfWidth = node.size.widthIn / 2
      const halfHeight = node.size.heightIn / 2

      return (
        <g
          key={node.id}
          data-id={node.id}
          transform={transform}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`node structure ${isSelected ? 'selected' : ''}`}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          {/* Base structure */}
          <rect
            x={-halfWidth}
            y={-halfHeight}
            width={node.size.widthIn}
            height={node.size.heightIn}
            fill={
              structureType === 'bench' ? '#8b7355' :
              structureType === 'shade-sail' ? 'rgba(156, 163, 175, 0.3)' :
              'rgba(139, 115, 85, 0.2)'
            }
            stroke={isSelected ? '#2196f3' : '#8b7355'}
            strokeWidth={isSelected ? 2 : 1}
            rx={4}
          />

          {/* Structure-specific details */}
          {structureType === 'pergola' && (
            <>
              <line x1={-halfWidth} y1={-halfHeight/2} x2={halfWidth} y2={-halfHeight/2} stroke="#6b5d4f" strokeWidth={2} />
              <line x1={-halfWidth} y1={0} x2={halfWidth} y2={0} stroke="#6b5d4f" strokeWidth={2} />
              <line x1={-halfWidth} y1={halfHeight/2} x2={halfWidth} y2={halfHeight/2} stroke="#6b5d4f" strokeWidth={2} />
            </>
          )}

          {structureType === 'bench' && (
            <>
              <rect x={-halfWidth+4} y={-halfHeight+4} width={node.size.widthIn-8} height={4} fill="#6b5d4f" />
              <rect x={-halfWidth+4} y={-4} width={4} height={halfHeight} fill="#6b5d4f" />
              <rect x={halfWidth-8} y={-4} width={4} height={halfHeight} fill="#6b5d4f" />
            </>
          )}

          {structureType === 'trellis' && (
            <>
              <line x1={-halfWidth/2} y1={-halfHeight} x2={-halfWidth/2} y2={halfHeight} stroke="#6b5d4f" strokeWidth={2} />
              <line x1={0} y1={-halfHeight} x2={0} y2={halfHeight} stroke="#6b5d4f" strokeWidth={2} />
              <line x1={halfWidth/2} y1={-halfHeight} x2={halfWidth/2} y2={halfHeight} stroke="#6b5d4f" strokeWidth={2} />
              <line x1={-halfWidth} y1={-halfHeight/2} x2={halfWidth} y2={-halfHeight/2} stroke="#6b5d4f" strokeWidth={1} />
              <line x1={-halfWidth} y1={0} x2={halfWidth} y2={0} stroke="#6b5d4f" strokeWidth={1} />
            </>
          )}

          <text
            x={0}
            y={halfHeight + 12}
            textAnchor="middle"
            fontSize={10}
            fill="#6b5d4f"
          >
            {structureType.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
          </text>
        </g>
      )
    }

    if (isCompostNode(node)) {
      const compostType = node.compost.compostType
      const halfWidth = node.size.widthIn / 2
      const halfHeight = node.size.heightIn / 2

      return (
        <g
          key={node.id}
          data-id={node.id}
          transform={transform}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={`node compost ${isSelected ? 'selected' : ''}`}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          <rect
            x={-halfWidth}
            y={-halfHeight}
            width={node.size.widthIn}
            height={node.size.heightIn}
            fill="rgba(139, 69, 19, 0.2)"
            stroke={isSelected ? '#2196f3' : '#8b4513'}
            strokeWidth={isSelected ? 2 : 1}
            rx={compostType === 'tumbler' ? halfWidth : 2}
          />

          {/* Multi-bin dividers */}
          {node.compost.numberOfBins && node.compost.numberOfBins > 1 && (
            <>
              {Array.from({ length: node.compost.numberOfBins - 1 }).map((_, i) => (
                <line
                  key={i}
                  x1={-halfWidth + (node.size.widthIn / (node.compost.numberOfBins || 1)) * (i + 1)}
                  y1={-halfHeight}
                  x2={-halfWidth + (node.size.widthIn / (node.compost.numberOfBins || 1)) * (i + 1)}
                  y2={halfHeight}
                  stroke="#8b4513"
                  strokeWidth={1}
                />
              ))}
            </>
          )}

          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fill="#8b4513"
          >
            {node.compost.numberOfBins === 3 ? '3-Bin System' : compostType.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
          </text>

          {node.compost.capacity && (
            <text
              x={0}
              y={halfHeight + 12}
              textAnchor="middle"
              fontSize={9}
              fill="#666"
            >
              {node.compost.capacity} cu ft
            </text>
          )}
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
      {/* Texture patterns and effects */}
      {showTextures && <TexturePatterns />}

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

      {/* Dimension layer */}
      <DimensionLayer
        nodes={scene.layers.flatMap(l => l.nodes)}
        zoom={zoom}
        enabled={showDimensions}
        units={units}
      />

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