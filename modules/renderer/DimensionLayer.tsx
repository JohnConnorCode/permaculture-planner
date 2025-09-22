import React from 'react'
import { Node, isBedNode, isPathNode, isStructureNode, isCompostNode, isIrrigationNode } from '../scene/sceneTypes'

interface DimensionLayerProps {
  nodes: Node[]
  zoom: number
  enabled: boolean
  units: 'imperial' | 'metric'
}

export function DimensionLayer({ nodes, zoom, enabled, units }: DimensionLayerProps) {
  if (!enabled) return null

  // Only show dimensions when zoomed in enough
  const minZoomForDimensions = 0.5
  if (zoom < minZoomForDimensions) return null

  const formatDimension = (inches: number): string => {
    if (units === 'metric') {
      const cm = inches * 2.54
      if (cm >= 100) {
        const m = cm / 100
        return `${m.toFixed(1)}m`
      }
      return `${Math.round(cm)}cm`
    } else {
      const feet = Math.floor(inches / 12)
      const remainingInches = Math.round(inches % 12)
      if (feet > 0 && remainingInches > 0) {
        return `${feet}' ${remainingInches}"`
      } else if (feet > 0) {
        return `${feet}'`
      } else {
        return `${remainingInches}"`
      }
    }
  }

  const renderNodeDimensions = (node: Node) => {
    // Only show dimensions for certain node types
    if (!isBedNode(node) && !isPathNode(node) && !isStructureNode(node) &&
        !isCompostNode(node) && !isIrrigationNode(node)) {
      return null
    }

    // Skip nodes without size
    if (!('size' in node) || !node.size) return null

    const { xIn, yIn } = node.transform
    const { widthIn, heightIn } = node.size
    const halfWidth = widthIn / 2
    const halfHeight = heightIn / 2

    // Adjust dimension text size based on zoom
    const fontSize = Math.max(10, Math.min(14, 12 / zoom))
    const offset = 8 / zoom // Distance from the object edge

    // Dimension line style
    const lineStyle = {
      stroke: '#666',
      strokeWidth: 1 / zoom,
      strokeDasharray: `${2 / zoom},${2 / zoom}`
    }

    // Text background style
    const textBgStyle = {
      fill: 'white',
      stroke: '#666',
      strokeWidth: 0.5 / zoom,
      rx: 2 / zoom
    }

    // Text style
    const textStyle = {
      fill: '#333',
      fontSize: `${fontSize}px`,
      fontFamily: 'monospace',
      fontWeight: 'bold' as const,
      textAnchor: 'middle' as const,
      dominantBaseline: 'middle' as const
    }

    return (
      <g key={node.id} className="dimension-group">
        {/* Width dimension (bottom) */}
        <g className="width-dimension">
          {/* Dimension line */}
          <line
            x1={xIn - halfWidth}
            y1={yIn + halfHeight + offset}
            x2={xIn + halfWidth}
            y2={yIn + halfHeight + offset}
            {...lineStyle}
          />

          {/* End caps */}
          <line
            x1={xIn - halfWidth}
            y1={yIn + halfHeight + offset - 2 / zoom}
            x2={xIn - halfWidth}
            y2={yIn + halfHeight + offset + 2 / zoom}
            {...lineStyle}
          />
          <line
            x1={xIn + halfWidth}
            y1={yIn + halfHeight + offset - 2 / zoom}
            x2={xIn + halfWidth}
            y2={yIn + halfHeight + offset + 2 / zoom}
            {...lineStyle}
          />

          {/* Dimension text background */}
          <rect
            x={xIn - formatDimension(widthIn).length * fontSize * 0.3}
            y={yIn + halfHeight + offset - fontSize * 0.6}
            width={formatDimension(widthIn).length * fontSize * 0.6}
            height={fontSize * 1.2}
            {...textBgStyle}
          />

          {/* Dimension text */}
          <text
            x={xIn}
            y={yIn + halfHeight + offset}
            {...textStyle}
          >
            {formatDimension(widthIn)}
          </text>
        </g>

        {/* Height dimension (right) */}
        <g className="height-dimension">
          {/* Dimension line */}
          <line
            x1={xIn + halfWidth + offset}
            y1={yIn - halfHeight}
            x2={xIn + halfWidth + offset}
            y2={yIn + halfHeight}
            {...lineStyle}
          />

          {/* End caps */}
          <line
            x1={xIn + halfWidth + offset - 2 / zoom}
            y1={yIn - halfHeight}
            x2={xIn + halfWidth + offset + 2 / zoom}
            y2={yIn - halfHeight}
            {...lineStyle}
          />
          <line
            x1={xIn + halfWidth + offset - 2 / zoom}
            y1={yIn + halfHeight}
            x2={xIn + halfWidth + offset + 2 / zoom}
            y2={yIn + halfHeight}
            {...lineStyle}
          />

          {/* Dimension text with rotation */}
          <g transform={`translate(${xIn + halfWidth + offset}, ${yIn}) rotate(90)`}>
            {/* Text background */}
            <rect
              x={-formatDimension(heightIn).length * fontSize * 0.3}
              y={-fontSize * 0.6}
              width={formatDimension(heightIn).length * fontSize * 0.6}
              height={fontSize * 1.2}
              {...textBgStyle}
            />

            {/* Dimension text */}
            <text
              x={0}
              y={0}
              {...textStyle}
            >
              {formatDimension(heightIn)}
            </text>
          </g>
        </g>

        {/* Special dimensions for structures */}
        {isStructureNode(node) && node.structure.structureType === 'greenhouse' && node.size.heightFt && (
          <g className="height-label">
            <rect
              x={xIn - 20 / zoom}
              y={yIn - halfHeight - 20 / zoom}
              width={40 / zoom}
              height={15 / zoom}
              fill="rgba(255, 255, 255, 0.9)"
              stroke="#666"
              strokeWidth={0.5 / zoom}
              rx={2 / zoom}
            />
            <text
              x={xIn}
              y={yIn - halfHeight - 12 / zoom}
              {...textStyle}
              fontSize={`${fontSize * 0.9}px`}
            >
              H: {node.size.heightFt}'
            </text>
          </g>
        )}

        {/* Area label for beds */}
        {isBedNode(node) && (
          <g className="area-label">
            <rect
              x={xIn - 25 / zoom}
              y={yIn - 7 / zoom}
              width={50 / zoom}
              height={14 / zoom}
              fill="rgba(255, 255, 255, 0.85)"
              stroke="#4a5568"
              strokeWidth={0.5 / zoom}
              rx={2 / zoom}
            />
            <text
              x={xIn}
              y={yIn}
              {...textStyle}
              fontSize={`${fontSize * 0.85}px`}
              fill="#4a5568"
            >
              {((widthIn * heightIn) / 144).toFixed(1)} sq ft
            </text>
          </g>
        )}

        {/* Capacity labels for compost */}
        {isCompostNode(node) && node.compost.capacity && (
          <g className="capacity-label">
            <rect
              x={xIn - 30 / zoom}
              y={yIn + halfHeight + 20 / zoom}
              width={60 / zoom}
              height={14 / zoom}
              fill="rgba(255, 255, 255, 0.9)"
              stroke="#8b4513"
              strokeWidth={0.5 / zoom}
              rx={2 / zoom}
            />
            <text
              x={xIn}
              y={yIn + halfHeight + 27 / zoom}
              {...textStyle}
              fontSize={`${fontSize * 0.85}px`}
              fill="#8b4513"
            >
              {node.compost.capacity} cu ft
            </text>
          </g>
        )}

        {/* Flow rate labels for irrigation */}
        {isIrrigationNode(node) && node.irrigation.flowRate && (
          <g className="flow-label">
            <rect
              x={xIn - 25 / zoom}
              y={yIn - 7 / zoom}
              width={50 / zoom}
              height={14 / zoom}
              fill="rgba(255, 255, 255, 0.9)"
              stroke="#3b82f6"
              strokeWidth={0.5 / zoom}
              rx={2 / zoom}
            />
            <text
              x={xIn}
              y={yIn}
              {...textStyle}
              fontSize={`${fontSize * 0.85}px`}
              fill="#3b82f6"
            >
              {node.irrigation.flowRate} gph
            </text>
          </g>
        )}
      </g>
    )
  }

  return (
    <g className="dimension-layer" style={{ pointerEvents: 'none' }}>
      {nodes.map(renderNodeDimensions)}
    </g>
  )
}