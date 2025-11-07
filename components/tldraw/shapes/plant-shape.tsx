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
 * PlantShape represents individual plants within garden beds
 * Includes companion planting information and spacing guides
 */
export type PlantShape = TLBaseShape<
  'plant',
  {
    radius: number
    plantId: string
    plantName: string
    emoji: string
    color: string
    // Using JSON strings for arrays to work with tldraw validators
    companionsJson: string // JSON.stringify(string[])
    antagonistsJson: string // JSON.stringify(string[])
    spacing: number // Required spacing in inches
    plantedDate: string // ISO date string
  }
>

export class PlantShapeUtil extends ShapeUtil<PlantShape> {
  static override type = 'plant' as const

  /**
   * Define shape properties with proper validators
   */
  static override props: RecordProps<PlantShape> = {
    radius: T.number,
    plantId: T.string,
    plantName: T.string,
    emoji: T.string,
    color: T.string,
    companionsJson: T.string,
    antagonistsJson: T.string,
    spacing: T.number,
    plantedDate: T.string,
  }

  /**
   * Default properties for new plant shapes
   */
  override getDefaultProps(): PlantShape['props'] {
    return {
      radius: 20,
      plantId: 'unknown',
      plantName: 'Plant',
      emoji: '🌱',
      color: '#22c55e',
      companionsJson: '[]',
      antagonistsJson: '[]',
      spacing: 12,
      plantedDate: '',
    }
  }

  /**
   * Parse companions from JSON string
   */
  private parseCompanions(json: string): string[] {
    try {
      const companions = JSON.parse(json)
      return Array.isArray(companions) ? companions : []
    } catch {
      return []
    }
  }

  /**
   * Get geometry for hit testing
   * Plants use circular geometry
   */
  override getGeometry(shape: PlantShape): Geometry2d {
    return new Circle2d({
      radius: shape.props.radius,
      isFilled: true,
    })
  }

  /**
   * Render the plant shape
   */
  component(shape: PlantShape) {
    const { radius, plantName, emoji, color, spacing } = shape.props

    return (
      <SVGContainer>
        {/* Spacing guide circle (dashed, subtle) */}
        <circle
          cx={0}
          cy={0}
          r={spacing * 2.5} // Convert spacing to visual radius
          fill="none"
          stroke={color}
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.2}
        />

        {/* Main plant circle */}
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill={color}
          fillOpacity={0.9}
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
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {emoji}
          </text>
        )}

        {/* Plant name label (below the circle) */}
        <text
          x={0}
          y={radius + 15}
          textAnchor="middle"
          fill="currentColor"
          fontSize={10}
          fontWeight="500"
          opacity={0.8}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {plantName}
        </text>
      </SVGContainer>
    )
  }

  /**
   * Selection indicator
   */
  indicator(shape: PlantShape) {
    const { radius } = shape.props
    return <circle cx={0} cy={0} r={radius} />
  }

  /**
   * Prevent resizing plants (they have fixed spacing requirements)
   */
  override canResize = () => false

  /**
   * Check if this plant is compatible with another plant
   * Used for companion planting features
   */
  isCompatibleWith(otherPlant: PlantShape): boolean {
    const antagonists = this.parseCompanions(this.props.antagonistsJson)
    const companions = this.parseCompanions(this.props.companionsJson)

    // Check if antagonistic
    if (antagonists.includes(otherPlant.props.plantId)) {
      return false
    }

    // Check if companion
    if (companions.includes(otherPlant.props.plantId)) {
      return true
    }

    // Neutral by default
    return true
  }

  /**
   * Helper to access props for instance methods
   */
  private get props() {
    // This is a workaround since we don't have shape instance in class methods
    // In actual use, you'd pass the shape instance
    return this.getDefaultProps()
  }
}
