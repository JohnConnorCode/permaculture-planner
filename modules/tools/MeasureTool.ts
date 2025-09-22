import { BaseTool } from './BaseTool'
import { PointerEvent, ToolContext } from '../scene/sceneTypes'

interface MeasurementPoint {
  x: number
  y: number
}

export class MeasureTool extends BaseTool {
  id = 'measure'
  name = 'Measure'
  icon = 'ruler'
  cursor = 'crosshair'

  private isDrawing = false
  private startPoint: MeasurementPoint | null = null
  private endPoint: MeasurementPoint | null = null
  private measurementLine: SVGLineElement | null = null
  private measurementText: SVGTextElement | null = null
  private measurementGroup: SVGGElement | null = null

  constructor(context: ToolContext) {
    super(context)
  }

  onActivate() {
    this.createMeasurementGroup()
  }

  onDeactivate() {
    this.clearMeasurement()
  }

  onPointerDown(event: PointerEvent) {
    this.isDrawing = true
    this.startPoint = {
      x: this.snapToGrid(event.worldX),
      y: this.snapToGrid(event.worldY)
    }
    this.endPoint = this.startPoint
    this.updateMeasurement()
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing || !this.startPoint) return

    this.endPoint = {
      x: this.snapToGrid(event.worldX),
      y: this.snapToGrid(event.worldY)
    }
    this.updateMeasurement()
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing) return

    // Keep the measurement visible until next measurement starts
    this.isDrawing = false
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.clearMeasurement()
    }
  }

  private createMeasurementGroup() {
    const svg = document.querySelector('svg')
    if (!svg) return

    this.measurementGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.measurementGroup.setAttribute('class', 'measurement-overlay')
    this.measurementGroup.style.pointerEvents = 'none'

    // Create measurement line
    this.measurementLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    this.measurementLine.setAttribute('stroke', '#ff6b6b')
    this.measurementLine.setAttribute('stroke-width', '2')
    this.measurementLine.setAttribute('stroke-dasharray', '5,5')
    this.measurementLine.setAttribute('marker-start', 'url(#arrow-start)')
    this.measurementLine.setAttribute('marker-end', 'url(#arrow-end)')

    // Create measurement text background
    const textBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    textBg.setAttribute('fill', 'white')
    textBg.setAttribute('stroke', '#ff6b6b')
    textBg.setAttribute('stroke-width', '1')
    textBg.setAttribute('rx', '3')

    // Create measurement text
    this.measurementText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    this.measurementText.setAttribute('fill', '#ff6b6b')
    this.measurementText.setAttribute('font-size', '14')
    this.measurementText.setAttribute('font-weight', 'bold')
    this.measurementText.setAttribute('text-anchor', 'middle')
    this.measurementText.setAttribute('dominant-baseline', 'middle')

    // Add arrow markers if not exists
    this.createArrowMarkers(svg)

    this.measurementGroup.appendChild(this.measurementLine)
    this.measurementGroup.appendChild(textBg)
    this.measurementGroup.appendChild(this.measurementText)
    svg.appendChild(this.measurementGroup)
  }

  private createArrowMarkers(svg: SVGSVGElement) {
    let defs = svg.querySelector('defs')
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      svg.appendChild(defs)
    }

    // Check if markers already exist
    if (!svg.querySelector('#arrow-start')) {
      const markerStart = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
      markerStart.setAttribute('id', 'arrow-start')
      markerStart.setAttribute('markerWidth', '10')
      markerStart.setAttribute('markerHeight', '10')
      markerStart.setAttribute('refX', '0')
      markerStart.setAttribute('refY', '5')
      markerStart.setAttribute('orient', 'auto')

      const pathStart = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathStart.setAttribute('d', 'M 10 0 L 0 5 L 10 10')
      pathStart.setAttribute('fill', 'none')
      pathStart.setAttribute('stroke', '#ff6b6b')
      pathStart.setAttribute('stroke-width', '2')

      markerStart.appendChild(pathStart)
      defs.appendChild(markerStart)
    }

    if (!svg.querySelector('#arrow-end')) {
      const markerEnd = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
      markerEnd.setAttribute('id', 'arrow-end')
      markerEnd.setAttribute('markerWidth', '10')
      markerEnd.setAttribute('markerHeight', '10')
      markerEnd.setAttribute('refX', '10')
      markerEnd.setAttribute('refY', '5')
      markerEnd.setAttribute('orient', 'auto')

      const pathEnd = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathEnd.setAttribute('d', 'M 0 0 L 10 5 L 0 10')
      pathEnd.setAttribute('fill', 'none')
      pathEnd.setAttribute('stroke', '#ff6b6b')
      pathEnd.setAttribute('stroke-width', '2')

      markerEnd.appendChild(pathEnd)
      defs.appendChild(markerEnd)
    }
  }

  private updateMeasurement() {
    if (!this.startPoint || !this.endPoint || !this.measurementLine || !this.measurementText) return

    // Update line
    this.measurementLine.setAttribute('x1', this.startPoint.x.toString())
    this.measurementLine.setAttribute('y1', this.startPoint.y.toString())
    this.measurementLine.setAttribute('x2', this.endPoint.x.toString())
    this.measurementLine.setAttribute('y2', this.endPoint.y.toString())

    // Calculate distance
    const dx = this.endPoint.x - this.startPoint.x
    const dy = this.endPoint.y - this.startPoint.y
    const distanceIn = Math.sqrt(dx * dx + dy * dy)

    // Convert to feet and inches
    const feet = Math.floor(distanceIn / 12)
    const inches = Math.round(distanceIn % 12)

    // Format distance text
    let distanceText = ''
    if (feet > 0) {
      distanceText = `${feet}' ${inches}"`
    } else {
      distanceText = `${inches}"`
    }

    // Also show area if it's a rectangle
    const width = Math.abs(dx)
    const height = Math.abs(dy)
    if (width > 0 && height > 0) {
      const areaSqFt = (width * height) / 144 // Convert square inches to square feet
      distanceText += ` (${areaSqFt.toFixed(1)} sq ft)`
    }

    // Update text
    this.measurementText.textContent = distanceText

    // Position text at midpoint
    const midX = (this.startPoint.x + this.endPoint.x) / 2
    const midY = (this.startPoint.y + this.endPoint.y) / 2
    this.measurementText.setAttribute('x', midX.toString())
    this.measurementText.setAttribute('y', midY.toString())

    // Update text background
    const textBg = this.measurementGroup?.querySelector('rect')
    if (textBg) {
      const bbox = this.measurementText.getBBox()
      textBg.setAttribute('x', (bbox.x - 4).toString())
      textBg.setAttribute('y', (bbox.y - 2).toString())
      textBg.setAttribute('width', (bbox.width + 8).toString())
      textBg.setAttribute('height', (bbox.height + 4).toString())
    }
  }

  private clearMeasurement() {
    if (this.measurementGroup) {
      this.measurementGroup.remove()
      this.measurementGroup = null
    }
    this.measurementLine = null
    this.measurementText = null
    this.startPoint = null
    this.endPoint = null
    this.isDrawing = false
  }
}