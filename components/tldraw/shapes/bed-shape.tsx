import {
  BaseBoxShapeUtil,
  TLBaseShape,
  RecordProps,
  T,
  Rectangle2d,
  Geometry2d,
  Polygon2d,
  SVGContainer,
  DefaultColorStyle,
  getDefaultColorTheme,
} from 'tldraw'

// Define the shape type
export type BedShape = TLBaseShape<
  'bed',
  {
    w: number
    h: number
    name: string
    color: string
    points?: { x: number; y: number }[]
    elementType?: string
    elementCategory?: 'bed' | 'water_management' | 'structure' | 'access' | 'energy' | 'animal' | 'waste'
    zone?: 0 | 1 | 2 | 3 | 4 | 5
  }
>

export class BedShapeUtil extends BaseBoxShapeUtil<BedShape> {
  static override type = 'bed' as const

  // Define the shape's default props
  static override props: RecordProps<BedShape> = {
    w: T.number,
    h: T.number,
    name: T.string,
    color: T.string,
    points: T.arrayOf(T.any).optional(),
    elementType: T.string.optional(),
    elementCategory: T.string.optional(),
    zone: T.number.optional(),
  }

  // Default properties for new shapes
  getDefaultProps(): BedShape['props'] {
    return {
      w: 200,
      h: 100,
      name: 'Garden Bed',
      color: '#22c55e',
      points: undefined,
      elementType: undefined,
      elementCategory: 'bed',
      zone: undefined,
    }
  }

  // Get the geometry for hit testing and bounds calculation
  getGeometry(shape: BedShape): Geometry2d {
    // If custom points are defined, use polygon geometry
    if (shape.props.points && shape.props.points.length > 2) {
      const points = shape.props.points.map((p: any) => ({ x: p.x, y: p.y }) as any)
      return new Polygon2d({
        points: points as any,
        isFilled: true,
      })
    }

    // Otherwise use rectangle
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  // Render the shape as SVG
  component(shape: BedShape) {
    const { w, h, name, color, points, zone, elementCategory } = shape.props

    // Determine fill based on element category
    const fillColor = this.getCategoryColor(elementCategory, color)
    const strokeColor = color

    if (points && points.length > 2) {
      // Render as polygon
      const pathData = this.pointsToPath(points)

      return (
        <SVGContainer>
          <path
            d={pathData}
            fill={fillColor}
            fillOpacity={0.3}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Zone label */}
          {zone !== undefined && (
            <text
              x={points[0].x + 10}
              y={points[0].y + 20}
              fill={strokeColor}
              fontSize={14}
              fontWeight="bold"
            >
              Zone {zone}
            </text>
          )}
          {/* Bed name */}
          <text
            x={points[0].x + 10}
            y={points[0].y + 40}
            fill="#000"
            fontSize={12}
          >
            {name}
          </text>
        </SVGContainer>
      )
    }

    // Render as rectangle
    return (
      <SVGContainer>
        <rect
          width={w}
          height={h}
          fill={fillColor}
          fillOpacity={0.3}
          stroke={strokeColor}
          strokeWidth={2}
          rx={4}
          ry={4}
        />
        {/* Zone label */}
        {zone !== undefined && (
          <text
            x={10}
            y={20}
            fill={strokeColor}
            fontSize={14}
            fontWeight="bold"
          >
            Zone {zone}
          </text>
        )}
        {/* Bed name */}
        <text
          x={10}
          y={40}
          fill="#000"
          fontSize={12}
        >
          {name}
        </text>
      </SVGContainer>
    )
  }

  // Indicator shown when shape is being created
  indicator(shape: BedShape) {
    const { w, h, points } = shape.props

    if (points && points.length > 2) {
      const pathData = this.pointsToPath(points)
      return <path d={pathData} />
    }

    return <rect width={w} height={h} rx={4} ry={4} />
  }

  // Helper: Convert points to SVG path
  private pointsToPath(points: { x: number; y: number }[]): string {
    if (points.length === 0) return ''

    const [first, ...rest] = points
    let path = `M ${first.x} ${first.y}`

    for (const point of rest) {
      path += ` L ${point.x} ${point.y}`
    }

    path += ' Z' // Close the path
    return path
  }

  // Helper: Get color based on element category
  private getCategoryColor(category?: string, defaultColor?: string): string {
    const categoryColors: Record<string, string> = {
      bed: '#22c55e',
      water_management: '#3b82f6',
      structure: '#8b5cf6',
      access: '#64748b',
      energy: '#eab308',
      animal: '#f59e0b',
      waste: '#84cc16',
    }

    return categoryColors[category || 'bed'] || defaultColor || '#22c55e'
  }
}
