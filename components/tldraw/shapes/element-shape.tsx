import {
  BaseBoxShapeUtil,
  TLBaseShape,
  RecordProps,
  T,
  Rectangle2d,
  Geometry2d,
  Polygon2d,
  Circle2d,
  SVGContainer,
  Vec,
  HTMLContainer,
} from 'tldraw'
import { ELEMENT_STYLES, ElementSubtype, createElementShape } from '@/lib/canvas-elements'

/**
 * ElementShape represents all permaculture elements:
 * - Water management (tanks, ponds, swales, rain gardens, greywater)
 * - Structures (greenhouses, sheds, trellises, arbors, pergolas, cold frames)
 * - Access (paths, fences, gates, stairs, ramps)
 * - Energy (solar panels, wind turbines, batteries)
 * - Animals (chicken coops, beehives, rabbit hutches, duck ponds)
 * - Waste (compost bins, worm farms, biodigesters)
 */
export type ElementShape = TLBaseShape<
  'element',
  {
    w: number
    h: number
    name: string
    subtype: ElementSubtype
    category: string
    color: string
    fill: string
    // Custom properties serialized as JSON
    pointsJson: string // For custom polygon shapes
    zone: number
    capacity: number // For water tanks, compost bins, etc.
    material: string // For structures
    flowDirection: string // For swales, paths
    connectedIds: string // JSON array of connected element IDs
    metadataJson: string // Additional properties as JSON
  }
>

export class ElementShapeUtil extends BaseBoxShapeUtil<ElementShape> {
  static override type = 'element' as const

  static override props: RecordProps<ElementShape> = {
    w: T.number,
    h: T.number,
    name: T.string,
    subtype: T.string as T.Validator<ElementSubtype>,
    category: T.string,
    color: T.string,
    fill: T.string,
    pointsJson: T.string,
    zone: T.number,
    capacity: T.number,
    material: T.string,
    flowDirection: T.string,
    connectedIds: T.string,
    metadataJson: T.string,
  }

  getDefaultProps(): ElementShape['props'] {
    return {
      w: 100,
      h: 100,
      name: 'Element',
      subtype: 'raised_bed',
      category: 'bed',
      color: '#22c55e',
      fill: '#d4f4dd',
      pointsJson: '[]',
      zone: -1,
      capacity: 0,
      material: '',
      flowDirection: '',
      connectedIds: '[]',
      metadataJson: '{}',
    }
  }

  private parsePoints(pointsJson: string): { x: number; y: number }[] {
    try {
      const points = JSON.parse(pointsJson)
      return Array.isArray(points) ? points : []
    } catch {
      return []
    }
  }

  private parseConnectedIds(connectedIds: string): string[] {
    try {
      const ids = JSON.parse(connectedIds)
      return Array.isArray(ids) ? ids : []
    } catch {
      return []
    }
  }

  getGeometry(shape: ElementShape): Geometry2d {
    const points = this.parsePoints(shape.props.pointsJson)
    const style = ELEMENT_STYLES[shape.props.subtype]

    // Custom polygon shapes
    if (points.length > 2) {
      const vecPoints = points.map(p => new Vec(p.x, p.y))
      return new Polygon2d({
        points: vecPoints,
        isFilled: true,
      })
    }

    // Circle shapes (water tanks, beehives, etc.)
    if (style?.defaultShape === 'circle') {
      const radius = Math.min(shape.props.w, shape.props.h) / 2
      return new Circle2d({
        radius,
        isFilled: true,
      })
    }

    // Default rectangle
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: ElementShape) {
    const { w, h, name, subtype, fill, color, pointsJson, zone, capacity, material } = shape.props
    const points = this.parsePoints(pointsJson)
    const style = ELEMENT_STYLES[subtype]
    const showZone = zone >= 0

    // Render circle shapes
    if (style?.defaultShape === 'circle') {
      const radius = Math.min(w, h) / 2
      return (
        <SVGContainer>
          <circle
            cx={0}
            cy={0}
            r={radius}
            fill={fill}
            fillOpacity={0.4}
            stroke={color}
            strokeWidth={style.defaultStrokeWidth || 2}
          />
          {this.renderIcon(style.icon, radius)}
          {this.renderLabel(name, subtype, zone, showZone, capacity, 0, radius + 20)}
        </SVGContainer>
      )
    }

    // Render custom polygon shapes
    if (points.length > 2) {
      const pathData = this.pointsToPath(points)
      const centroid = this.getCentroid(points)

      return (
        <SVGContainer>
          {this.renderPattern(pathData, subtype, fill, style)}
          <path
            d={pathData}
            fill={fill}
            fillOpacity={0.4}
            stroke={color}
            strokeWidth={style.defaultStrokeWidth || 2}
          />
          {this.renderLabel(name, subtype, zone, showZone, capacity, centroid.x, centroid.y)}
        </SVGContainer>
      )
    }

    // Render path/line shapes (swales, paths, fences)
    if (style?.defaultShape === 'path') {
      return (
        <SVGContainer>
          <rect
            width={w}
            height={h}
            fill={fill}
            fillOpacity={0.4}
            stroke={color}
            strokeWidth={style.defaultStrokeWidth || 2}
          />
          {this.renderPathPattern(subtype, w, h)}
          {this.renderLabel(name, subtype, zone, showZone, capacity, 10, h / 2)}
        </SVGContainer>
      )
    }

    // Default rectangle shape
    return (
      <SVGContainer>
        <rect
          width={w}
          height={h}
          fill={fill}
          fillOpacity={0.4}
          stroke={color}
          strokeWidth={style?.defaultStrokeWidth || 2}
          rx={4}
          ry={4}
        />
        {this.renderStructureDetails(subtype, w, h, material)}
        {this.renderLabel(name, subtype, zone, showZone, capacity, 10, showZone ? 40 : 25)}
      </SVGContainer>
    )
  }

  indicator(shape: ElementShape) {
    const { w, h, pointsJson, subtype } = shape.props
    const points = this.parsePoints(pointsJson)
    const style = ELEMENT_STYLES[subtype]

    if (points.length > 2) {
      const pathData = this.pointsToPath(points)
      return <path d={pathData} />
    }

    if (style?.defaultShape === 'circle') {
      const radius = Math.min(w, h) / 2
      return <circle cx={0} cy={0} r={radius} />
    }

    return <rect width={w} height={h} rx={4} ry={4} />
  }

  // Helper methods

  private pointsToPath(points: { x: number; y: number }[]): string {
    if (points.length === 0) return ''
    const [first, ...rest] = points
    let path = `M ${first.x} ${first.y}`
    for (const point of rest) {
      path += ` L ${point.x} ${point.y}`
    }
    path += ' Z'
    return path
  }

  private getCentroid(points: { x: number; y: number }[]): { x: number; y: number } {
    const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 })
    return { x: sum.x / points.length, y: sum.y / points.length }
  }

  private renderIcon(icon: string | undefined, radius: number) {
    if (!icon) return null

    // Map icon names to emojis/symbols
    const iconMap: Record<string, string> = {
      droplet: '💧',
      filter: '⚗️',
      greenhouse: '🌿',
      home: '🏠',
      arch: '🌉',
      box: '📦',
      door: '🚪',
      wind: '🌀',
      battery: '🔋',
      egg: '🥚',
      hexagon: '⬡',
      rabbit: '🐰',
      recycle: '♻️',
      zap: '⚡',
    }

    const emoji = iconMap[icon] || icon

    return (
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={radius * 1.2}
        opacity={0.8}
      >
        {emoji}
      </text>
    )
  }

  private renderLabel(
    name: string,
    subtype: string,
    zone: number,
    showZone: boolean,
    capacity: number,
    x: number,
    y: number
  ) {
    return (
      <g>
        {showZone && (
          <text
            x={x}
            y={y - 15}
            fill="currentColor"
            fontSize={12}
            fontWeight="bold"
            opacity={0.9}
          >
            Zone {zone}
          </text>
        )}
        <text
          x={x}
          y={y}
          fill="currentColor"
          fontSize={11}
          fontWeight="500"
          opacity={0.8}
        >
          {name}
        </text>
        {capacity > 0 && (
          <text
            x={x}
            y={y + 15}
            fill="currentColor"
            fontSize={9}
            opacity={0.6}
          >
            {capacity} gal
          </text>
        )}
      </g>
    )
  }

  private renderPattern(
    pathData: string,
    subtype: ElementSubtype,
    fill: string,
    style: typeof ELEMENT_STYLES[ElementSubtype]
  ) {
    if (!style?.pattern) return null

    // Pattern rendering based on type
    if (style.pattern === 'water') {
      return (
        <defs>
          <pattern id={`water-${subtype}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M0 10 Q5 5, 10 10 T20 10"
              stroke={fill}
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
          </pattern>
        </defs>
      )
    }

    return null
  }

  private renderPathPattern(subtype: ElementSubtype, width: number, height: number) {
    const style = ELEMENT_STYLES[subtype]

    if (style?.pattern === 'gravel') {
      // Render gravel dots pattern
      const dots = []
      for (let i = 0; i < width; i += 10) {
        for (let j = 0; j < height; j += 10) {
          dots.push(
            <circle
              key={`${i}-${j}`}
              cx={i + Math.random() * 5}
              cy={j + Math.random() * 5}
              r={1}
              fill="currentColor"
              opacity={0.3}
            />
          )
        }
      }
      return <g>{dots}</g>
    }

    if (style?.pattern === 'fence') {
      // Render fence posts
      const posts = []
      for (let i = 0; i < width; i += 20) {
        posts.push(
          <line
            key={i}
            x1={i}
            y1={0}
            x2={i}
            y2={height}
            stroke="currentColor"
            strokeWidth={2}
            opacity={0.5}
          />
        )
      }
      return <g>{posts}</g>
    }

    return null
  }

  private renderStructureDetails(subtype: ElementSubtype, width: number, height: number, material: string) {
    const style = ELEMENT_STYLES[subtype]

    if (subtype === 'greenhouse') {
      // Render greenhouse ribs
      const ribs = []
      const ribSpacing = 30
      for (let i = ribSpacing; i < width; i += ribSpacing) {
        ribs.push(
          <line
            key={i}
            x1={i}
            y1={0}
            x2={i}
            y2={height}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.3}
            strokeDasharray="5 5"
          />
        )
      }
      return <g>{ribs}</g>
    }

    if (subtype === 'solar_panel') {
      // Render solar cell grid
      const cells = []
      const cellSize = 20
      for (let x = cellSize; x < width; x += cellSize) {
        for (let y = cellSize; y < height; y += cellSize) {
          cells.push(
            <rect
              key={`${x}-${y}`}
              x={x - cellSize + 2}
              y={y - cellSize + 2}
              width={cellSize - 4}
              height={cellSize - 4}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.5}
              opacity={0.4}
            />
          )
        }
      }
      return <g>{cells}</g>
    }

    if (subtype === 'trellis' && style?.pattern === 'grid') {
      // Render trellis grid
      const lines = []
      const spacing = 15
      for (let i = 0; i < width; i += spacing) {
        lines.push(
          <line key={`v-${i}`} x1={i} y1={0} x2={i} y2={height} stroke="currentColor" strokeWidth={1} opacity={0.4} />
        )
      }
      for (let i = 0; i < height; i += spacing) {
        lines.push(
          <line key={`h-${i}`} x1={0} y1={i} x2={width} y2={i} stroke="currentColor" strokeWidth={1} opacity={0.4} />
        )
      }
      return <g>{lines}</g>
    }

    return null
  }
}
