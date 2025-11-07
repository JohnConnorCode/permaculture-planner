import {
  ShapeUtil,
  TLBaseShape,
  RecordProps,
  T,
  Circle2d,
  Geometry2d,
  SVGContainer,
} from 'tldraw'

// Define the plant shape type
export type PlantShape = TLBaseShape<
  'plant',
  {
    radius: number
    plantId: string
    plantName: string
    emoji?: string
    color: string
    companions?: string[] // Compatible plant IDs
    antagonists?: string[] // Incompatible plant IDs
    spacing: number // Required spacing in inches
    plantedDate?: string
  }
>

export class PlantShapeUtil extends ShapeUtil<PlantShape> {
  static override type = 'plant' as const

  // Define the shape's props
  static override props: RecordProps<PlantShape> = {
    radius: T.number,
    plantId: T.string,
    plantName: T.string,
    emoji: T.string.optional(),
    color: T.string,
    companions: T.arrayOf(T.any).optional(),
    antagonists: T.arrayOf(T.any).optional(),
    spacing: T.number,
    plantedDate: T.string.optional(),
  }

  // Default properties
  override getDefaultProps(): PlantShape['props'] {
    return {
      radius: 20,
      plantId: 'unknown',
      plantName: 'Plant',
      emoji: '🌱',
      color: '#22c55e',
      companions: [],
      antagonists: [],
      spacing: 12,
      plantedDate: undefined,
    }
  }

  // Geometry for hit testing
  override getGeometry(shape: PlantShape): Geometry2d {
    return new Circle2d({
      radius: shape.props.radius,
      isFilled: true,
    })
  }

  // Get bounding box
  getBoundsFromShape(shape: PlantShape) {
    const r = shape.props.radius
    return {
      minX: -r,
      minY: -r,
      maxX: r,
      maxY: r,
      width: r * 2,
      height: r * 2,
    }
  }

  // Render the plant shape
  component(shape: PlantShape) {
    const { radius, plantName, emoji, color, spacing } = shape.props

    return (
      <SVGContainer>
        {/* Spacing guide circle (optional, can be toggled) */}
        <circle
          cx={0}
          cy={0}
          r={spacing * 2} // Convert spacing to visual radius
          fill="none"
          stroke={color}
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.3}
        />

        {/* Main plant circle */}
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill={color}
          fillOpacity={0.8}
          stroke="#fff"
          strokeWidth={2}
        />

        {/* Emoji or plant icon */}
        {emoji && (
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={radius * 1.2}
          >
            {emoji}
          </text>
        )}

        {/* Plant name label (below the circle) */}
        <text
          x={0}
          y={radius + 15}
          textAnchor="middle"
          fill="#000"
          fontSize={10}
          fontWeight="500"
        >
          {plantName}
        </text>
      </SVGContainer>
    )
  }

  // Selection indicator
  indicator(shape: PlantShape) {
    const { radius } = shape.props
    return <circle cx={0} cy={0} r={radius} />
  }

  // Override to prevent resizing (plants have fixed spacing)
  override canResize = () => false

  // Helper method to check companion compatibility
  isCompatibleWith(otherPlant: PlantShape): boolean {
    const { companions, antagonists, plantId } = this.getDefaultProps()

    if (antagonists?.includes(otherPlant.props.plantId)) {
      return false
    }

    if (companions?.includes(otherPlant.props.plantId)) {
      return true
    }

    // Neutral by default
    return true
  }
}
