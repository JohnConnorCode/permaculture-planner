import { BaseTool } from './BaseTool'
import { PointerEvent, Node, BedNode, ToolContext } from '../scene/sceneTypes'
import { v4 as uuidv4 } from 'uuid'

interface CurvePoint {
  x: number
  y: number
  controlX?: number
  controlY?: number
}

export class DrawCurvedBedTool extends BaseTool {
  id = 'draw-curved-bed'
  name = 'Draw Curved Bed'
  icon = 'curve'
  cursor = 'crosshair'

  private isDrawing = false
  private currentPoints: CurvePoint[] = []
  private currentPath: SVGPathElement | null = null
  private previewGroup: SVGGElement | null = null
  private bedWidth = 48 // Default 4 feet in inches
  private bedHeight = 12 // Default bed height
  private minSegmentLength = 12 // Minimum segment length in inches

  constructor(context: ToolContext) {
    super(context)
  }

  onActivate() {
    // Show helpful hint
    this.showHint('Click to add points, drag to create curves. Press Enter to finish, Escape to cancel.')
  }

  onDeactivate() {
    this.cancelDrawing()
  }

  onPointerDown(event: PointerEvent) {
    if (!this.isDrawing) {
      // Start new curved bed
      this.startDrawing({ x: event.worldX, y: event.worldY })
    } else {
      // Add new point to curve
      this.addPoint({ x: event.worldX, y: event.worldY }, event.shiftKey)
    }
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing) return

    // Update preview with current mouse position
    this.updatePreview({ x: event.worldX, y: event.worldY }, event.shiftKey)
  }

  onPointerUp(event: PointerEvent) {
    // Handle control point adjustment if dragging
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.finishDrawing()
    } else if (event.key === 'Escape') {
      this.cancelDrawing()
    } else if (event.key === 'Backspace' && this.currentPoints.length > 1) {
      // Remove last point
      this.currentPoints.pop()
      this.updatePath()
    }
  }

  onDoubleClick(event: PointerEvent) {
    // Finish drawing on double click
    if (this.isDrawing) {
      this.finishDrawing()
    }
  }

  private startDrawing(point: { x: number; y: number }) {
    this.isDrawing = true
    this.currentPoints = [{
      x: this.snapToGrid(point.x),
      y: this.snapToGrid(point.y)
    }]

    // Create preview group
    const svg = document.querySelector('svg')
    if (svg) {
      this.previewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      this.previewGroup.setAttribute('class', 'curved-bed-preview')
      this.previewGroup.style.pointerEvents = 'none'

      this.currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      this.currentPath.setAttribute('fill', 'none')
      this.currentPath.setAttribute('stroke', '#16a34a')
      this.currentPath.setAttribute('stroke-width', '2')
      this.currentPath.setAttribute('stroke-dasharray', '4 2')

      this.previewGroup.appendChild(this.currentPath)
      svg.appendChild(this.previewGroup)
    }
  }

  private addPoint(point: { x: number; y: number }, createCurve: boolean) {
    const snappedPoint = {
      x: this.snapToGrid(point.x),
      y: this.snapToGrid(point.y)
    }

    // Check minimum segment length
    const lastPoint = this.currentPoints[this.currentPoints.length - 1]
    const distance = Math.sqrt(
      Math.pow(snappedPoint.x - lastPoint.x, 2) +
      Math.pow(snappedPoint.y - lastPoint.y, 2)
    )

    if (distance < this.minSegmentLength) {
      return // Too close to last point
    }

    if (createCurve && this.currentPoints.length > 0) {
      // Calculate control points for smooth curve
      const controlPoint = this.calculateControlPoint(lastPoint, snappedPoint)
      this.currentPoints[this.currentPoints.length - 1].controlX = controlPoint.x
      this.currentPoints[this.currentPoints.length - 1].controlY = controlPoint.y
    }

    this.currentPoints.push(snappedPoint)
    this.updatePath()
  }

  private updatePreview(mousePos: { x: number; y: number }, createCurve: boolean) {
    if (!this.currentPath || this.currentPoints.length === 0) return

    const snappedPoint = {
      x: this.snapToGrid(mousePos.x),
      y: this.snapToGrid(mousePos.y)
    }

    // Create temporary path including preview point
    const previewPoints = [...this.currentPoints, snappedPoint]
    const pathData = this.generatePathData(previewPoints, createCurve)
    this.currentPath.setAttribute('d', pathData)

    // Show bed width outline
    this.updateBedOutline(previewPoints)
  }

  private updatePath() {
    if (!this.currentPath) return

    const pathData = this.generatePathData(this.currentPoints, false)
    this.currentPath.setAttribute('d', pathData)
    this.updateBedOutline(this.currentPoints)
  }

  private generatePathData(points: CurvePoint[], addCurve: boolean): string {
    if (points.length === 0) return ''

    let path = `M ${points[0].x} ${points[0].y}`

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]

      if (prev.controlX && prev.controlY) {
        // Quadratic Bezier curve
        path += ` Q ${prev.controlX} ${prev.controlY}, ${curr.x} ${curr.y}`
      } else {
        // Straight line
        path += ` L ${curr.x} ${curr.y}`
      }
    }

    return path
  }

  private updateBedOutline(points: CurvePoint[]) {
    if (!this.previewGroup || points.length < 2) return

    // Remove old outline
    const oldOutline = this.previewGroup.querySelector('.bed-outline')
    if (oldOutline) oldOutline.remove()

    // Create bed outline showing width
    const outline = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    outline.setAttribute('class', 'bed-outline')

    // Generate offset paths for bed width
    const leftPath = this.generateOffsetPath(points, -this.bedWidth / 2)
    const rightPath = this.generateOffsetPath(points, this.bedWidth / 2)

    // Create filled shape
    const bedShape = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const fullPath = leftPath + ' L' + rightPath.slice(1).split('L').reverse().join(' L')
    bedShape.setAttribute('d', fullPath + ' Z')
    bedShape.setAttribute('fill', '#86efac')
    bedShape.setAttribute('fill-opacity', '0.3')
    bedShape.setAttribute('stroke', '#16a34a')
    bedShape.setAttribute('stroke-width', '1')

    outline.appendChild(bedShape)
    this.previewGroup.appendChild(outline)
  }

  private generateOffsetPath(points: CurvePoint[], offset: number): string {
    // Simplified offset - in production would use proper curve offset algorithm
    if (points.length === 0) return ''

    const offsetPoints: CurvePoint[] = []

    for (let i = 0; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const next = points[i + 1]

      // Calculate normal vector
      let normalX = 0, normalY = 0

      if (prev && next) {
        // Middle point - average of two segments
        const dx1 = curr.x - prev.x
        const dy1 = curr.y - prev.y
        const dx2 = next.x - curr.x
        const dy2 = next.y - curr.y

        normalX = -(dy1 + dy2) / 2
        normalY = (dx1 + dx2) / 2
      } else if (prev) {
        // End point
        normalX = -(curr.y - prev.y)
        normalY = curr.x - prev.x
      } else if (next) {
        // Start point
        normalX = -(next.y - curr.y)
        normalY = next.x - curr.x
      }

      // Normalize
      const length = Math.sqrt(normalX * normalX + normalY * normalY)
      if (length > 0) {
        normalX /= length
        normalY /= length
      }

      offsetPoints.push({
        x: curr.x + normalX * offset,
        y: curr.y + normalY * offset,
        controlX: curr.controlX ? curr.controlX + normalX * offset : undefined,
        controlY: curr.controlY ? curr.controlY + normalY * offset : undefined
      })
    }

    return this.generatePathData(offsetPoints, false)
  }

  private calculateControlPoint(p1: CurvePoint, p2: CurvePoint): { x: number; y: number } {
    // Create smooth control point between two points
    const midX = (p1.x + p2.x) / 2
    const midY = (p1.y + p2.y) / 2

    // Offset perpendicular to create curve
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const offset = Math.sqrt(dx * dx + dy * dy) * 0.2 // 20% offset for smooth curve

    return {
      x: midX - dy * offset / Math.sqrt(dx * dx + dy * dy),
      y: midY + dx * offset / Math.sqrt(dx * dx + dy * dy)
    }
  }

  private finishDrawing() {
    if (!this.isDrawing || this.currentPoints.length < 2) {
      this.cancelDrawing()
      return
    }

    // Create curved bed node
    const pathData = this.generatePathData(this.currentPoints, false)
    const bounds = this.calculateBounds(this.currentPoints)

    const bedNode: BedNode = {
      id: uuidv4(),
      type: 'Bed',
      transform: {
        xIn: bounds.centerX,
        yIn: bounds.centerY,
        rotationDeg: 0
      },
      size: {
        widthIn: bounds.width,
        heightIn: bounds.height
      },
      bed: {
        heightIn: this.bedHeight,
        orientation: 'Custom',
        wicking: false,
        trellisNorth: false,
        pathData: pathData, // Store the curve path
        curvePoints: this.currentPoints // Store points for editing
      }
    }

    // Add to scene
    this.context.addNode(bedNode)
    this.context.setSelection([bedNode.id])

    this.cancelDrawing()
  }

  private cancelDrawing() {
    this.isDrawing = false
    this.currentPoints = []

    if (this.previewGroup) {
      this.previewGroup.remove()
      this.previewGroup = null
    }

    this.currentPath = null
  }

  private calculateBounds(points: CurvePoint[]): { centerX: number; centerY: number; width: number; height: number } {
    if (points.length === 0) {
      return { centerX: 0, centerY: 0, width: 0, height: 0 }
    }

    let minX = points[0].x
    let maxX = points[0].x
    let minY = points[0].y
    let maxY = points[0].y

    for (const point of points) {
      minX = Math.min(minX, point.x)
      maxX = Math.max(maxX, point.x)
      minY = Math.min(minY, point.y)
      maxY = Math.max(maxY, point.y)
    }

    // Account for bed width
    minX -= this.bedWidth / 2
    maxX += this.bedWidth / 2
    minY -= this.bedWidth / 2
    maxY += this.bedWidth / 2

    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY
    }
  }

  private showHint(message: string) {
    // Show hint in UI
    console.log('Hint:', message)
  }

  private showError(message: string) {
    // Show error in UI
    console.error('Error:', message)
  }
}