import {
  ShapeUtil,
  TLBaseShape,
  RecordProps,
  T,
  Circle2d,
  Geometry2d,
  SVGContainer,
} from 'tldraw'

/**
 * ZoneShape represents permaculture zones (0-5)
 * Displays as concentric circles or overlay regions
 */
export type ZoneShape = TLBaseShape<
  'zone',
  {
    radius: number
    zoneNumber: 0 | 1 | 2 | 3 | 4 | 5
    color: string
    label: string
    description: string
    centerX: number
    centerY: number
  }
>

const ZONE_COLORS: Record<number, string> = {
  0: '#dc2626', // Red - Home
  1: '#ea580c', // Orange - Intensive
  2: '#f59e0b', // Amber - Semi-intensive
  3: '#eab308', // Yellow - Occasional
  4: '#84cc16', // Lime - Minimal
  5: '#22c55e', // Green - Wild
}

const ZONE_LABELS: Record<number, string> = {
  0: 'Zone 0 - Home',
  1: 'Zone 1 - Intensive',
  2: 'Zone 2 - Semi-intensive',
  3: 'Zone 3 - Occasional',
  4: 'Zone 4 - Minimal',
  5: 'Zone 5 - Wild',
}

const ZONE_DESCRIPTIONS: Record<number, string> = {
  0: 'Indoor areas, visited multiple times per day',
  1: 'Daily visit - herbs, salad greens, compost',
  2: '2-3x/week - main crops, small animals',
  3: 'Weekly - orchards, larger animals',
  4: 'Monthly - foraging, firewood',
  5: 'Observation only - wilderness',
}

export class ZoneShapeUtil extends ShapeUtil<ZoneShape> {
  static override type = 'zone' as const

  static override props: RecordProps<ZoneShape> = {
    radius: T.number,
    zoneNumber: T.number as T.Validator<0 | 1 | 2 | 3 | 4 | 5>,
    color: T.string,
    label: T.string,
    description: T.string,
    centerX: T.number,
    centerY: T.number,
  }

  override getDefaultProps(): ZoneShape['props'] {
    return {
      radius: 100,
      zoneNumber: 1,
      color: ZONE_COLORS[1],
      label: ZONE_LABELS[1],
      description: ZONE_DESCRIPTIONS[1],
      centerX: 0,
      centerY: 0,
    }
  }

  override getGeometry(shape: ZoneShape): Geometry2d {
    return new Circle2d({
      radius: shape.props.radius,
      isFilled: false,
    })
  }

  component(shape: ZoneShape) {
    const { radius, zoneNumber, color, label, description } = shape.props

    return (
      <SVGContainer>
        {/* Zone circle */}
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill={color}
          fillOpacity={0.05}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="8 4"
        />

        {/* Zone label on the circle */}
        <g transform={`translate(${radius - 10}, -5)`}>
          <rect
            x={-80}
            y={-12}
            width={160}
            height={24}
            fill={color}
            fillOpacity={0.9}
            rx={4}
          />
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize={11}
            fontWeight="bold"
          >
            {label}
          </text>
        </g>

        {/* Description tooltip near center */}
        {radius > 100 && (
          <g transform={`translate(0, ${radius * 0.7})`}>
            <text
              x={0}
              y={0}
              textAnchor="middle"
              fill={color}
              fontSize={10}
              opacity={0.7}
            >
              {description}
            </text>
          </g>
        )}
      </SVGContainer>
    )
  }

  indicator(shape: ZoneShape) {
    const { radius } = shape.props
    return <circle cx={0} cy={0} r={radius} />
  }

  // Zones should not be resizable - they're based on functional distance from home
  override canResize = () => false

  // Zones should be in the background, non-interactive by default
  override isAspectRatioLocked = () => true
}
