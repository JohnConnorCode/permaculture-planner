import {
  ShapeUtil,
  TLBaseShape,
  RecordProps,
  T,
  Edge2d,
  Geometry2d,
  SVGContainer,
  Vec,
} from 'tldraw'

/**
 * CompanionLineShape visualizes plant relationships
 * Green lines = beneficial companions
 * Red lines = antagonistic plants
 */
export type CompanionLineShape = TLBaseShape<
  'companion-line',
  {
    startX: number
    startY: number
    endX: number
    endY: number
    relationship: 'good' | 'bad' | 'neutral'
    plant1Id: string
    plant2Id: string
    plant1Name: string
    plant2Name: string
  }
>

export class CompanionLineShapeUtil extends ShapeUtil<CompanionLineShape> {
  static override type = 'companion-line' as const

  static override props: RecordProps<CompanionLineShape> = {
    startX: T.number,
    startY: T.number,
    endX: T.number,
    endY: T.number,
    relationship: T.string as T.Validator<'good' | 'bad' | 'neutral'>,
    plant1Id: T.string,
    plant2Id: T.string,
    plant1Name: T.string,
    plant2Name: T.string,
  }

  override getDefaultProps(): CompanionLineShape['props'] {
    return {
      startX: 0,
      startY: 0,
      endX: 100,
      endY: 100,
      relationship: 'neutral',
      plant1Id: '',
      plant2Id: '',
      plant1Name: '',
      plant2Name: '',
    }
  }

  override getGeometry(shape: CompanionLineShape): Geometry2d {
    const { startX, startY, endX, endY } = shape.props
    return new Edge2d({
      start: new Vec(startX, startY),
      end: new Vec(endX, endY),
    })
  }

  component(shape: CompanionLineShape) {
    const { startX, startY, endX, endY, relationship, plant1Name, plant2Name } = shape.props

    const color = this.getRelationshipColor(relationship)
    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2

    return (
      <SVGContainer>
        {/* Connection line */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={relationship === 'good' ? '0' : '5 5'}
          opacity={0.6}
        />

        {/* Arrowhead for good companions */}
        {relationship === 'good' && (
          <>
            <defs>
              <marker
                id={`arrow-${shape.id}`}
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill={color} />
              </marker>
            </defs>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={color}
              strokeWidth={2}
              opacity={0.6}
              markerEnd={`url(#arrow-${shape.id})`}
            />
          </>
        )}

        {/* Warning icon for antagonistic relationships */}
        {relationship === 'bad' && (
          <g transform={`translate(${midX}, ${midY})`}>
            <circle cx={0} cy={0} r={12} fill="white" stroke={color} strokeWidth={2} />
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={16}
              fontWeight="bold"
              fill={color}
            >
              ⚠
            </text>
          </g>
        )}

        {/* Heart icon for beneficial companions */}
        {relationship === 'good' && (
          <g transform={`translate(${midX}, ${midY})`}>
            <circle cx={0} cy={0} r={10} fill={color} opacity={0.9} />
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
              fill="white"
            >
              ♥
            </text>
          </g>
        )}
      </SVGContainer>
    )
  }

  indicator(shape: CompanionLineShape) {
    const { startX, startY, endX, endY } = shape.props
    return <line x1={startX} y1={startY} x2={endX} y2={endY} />
  }

  private getRelationshipColor(relationship: 'good' | 'bad' | 'neutral'): string {
    switch (relationship) {
      case 'good':
        return '#22c55e' // Green
      case 'bad':
        return '#ef4444' // Red
      case 'neutral':
        return '#94a3b8' // Gray
    }
  }

  // Companion lines should not be resizable or editable directly
  override canResize = () => false
  override canEdit = () => false
}
