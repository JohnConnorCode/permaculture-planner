'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { PlantInfo, getPlantById, checkCompatibility } from '@/lib/data/plant-library'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, XCircle, ZoomIn, ZoomOut, Maximize2, Move, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface GardenBed {
  id: string
  name: string
  points: { x: number; y: number }[]
  fill: string
  stroke: string
  plants: PlantedItem[]
  width?: number
  height?: number
  rotation?: number
}

export interface PlantedItem {
  id: string
  plantId: string
  x: number
  y: number
  plantedDate?: Date
}

interface ViewBox {
  x: number
  y: number
  width: number
  height: number
}

interface GardenDesignerCanvasProps {
  beds: GardenBed[]
  onBedsChange: (beds: GardenBed[]) => void
  selectedPlant: PlantInfo | null
  selectedTool: string
  zoom?: number
  showGrid?: boolean
  showLabels?: boolean
  showSpacing?: boolean
  showSunRequirements?: boolean
  showWaterRequirements?: boolean
  className?: string
}

export function GardenDesignerCanvas({
  beds,
  onBedsChange,
  selectedPlant,
  selectedTool,
  zoom: externalZoom,
  showGrid = true,
  showLabels = true,
  showSpacing = false,
  showSunRequirements = false,
  showWaterRequirements = false,
  className
}: GardenDesignerCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Canvas state
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([])
  const [selectedBed, setSelectedBed] = useState<string | null>(null)
  const [hoveredPlant, setHoveredPlant] = useState<string | null>(null)
  const [hoveredBed, setHoveredBed] = useState<string | null>(null)

  // Infinite canvas state
  const [viewBox, setViewBox] = useState<ViewBox>({ x: -100, y: -100, width: 800, height: 600 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [internalZoom, setInternalZoom] = useState(100)
  const [spacePressed, setSpacePressed] = useState(false)

  // Use internal zoom if external not provided
  const zoom = externalZoom ?? internalZoom

  const [compatibilityAlerts, setCompatibilityAlerts] = useState<Array<{
    plant1: string
    plant2: string
    type: 'good' | 'bad' | 'info'
    message?: string
  }>>([])

  // Convert screen coordinates to SVG world coordinates
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current || !containerRef.current) return { x: 0, y: 0 }
    const rect = containerRef.current.getBoundingClientRect()
    const x = viewBox.x + ((clientX - rect.left) / rect.width) * viewBox.width
    const y = viewBox.y + ((clientY - rect.top) / rect.height) * viewBox.height
    return { x, y }
  }, [viewBox])

  // Snap to grid if enabled
  const snapToGrid = (point: { x: number; y: number }, gridSize: number = 10) => {
    if (!showGrid) return point
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    }
  }

  // Handle keyboard events for pan (spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        setSpacePressed(true)
      }
      // Zoom with Ctrl/Cmd + Plus/Minus
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault()
          handleZoomIn()
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault()
          handleZoomOut()
        } else if (e.key === '0') {
          e.preventDefault()
          handleResetView()
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false)
        setIsPanning(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Handle mouse wheel for zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(25, Math.min(400, zoom * delta))

      // Zoom toward mouse position
      const mouseWorld = screenToWorld(e.clientX, e.clientY)
      const scale = newZoom / zoom

      setViewBox(prev => ({
        x: mouseWorld.x - (mouseWorld.x - prev.x) / scale,
        y: mouseWorld.y - (mouseWorld.y - prev.y) / scale,
        width: prev.width / scale,
        height: prev.height / scale
      }))

      setInternalZoom(newZoom)
    }
  }

  // Pan handlers
  const handlePanStart = (e: React.MouseEvent) => {
    if (spacePressed || selectedTool === 'pan') {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = (e.clientX - panStart.x) * (viewBox.width / (containerRef.current?.clientWidth || 800))
      const dy = (e.clientY - panStart.y) * (viewBox.height / (containerRef.current?.clientHeight || 600))

      setViewBox(prev => ({
        ...prev,
        x: prev.x - dx,
        y: prev.y - dy
      }))

      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handlePanEnd = () => {
    setIsPanning(false)
  }

  // Zoom controls
  const handleZoomIn = () => {
    const newZoom = Math.min(400, zoom * 1.2)
    const scale = newZoom / zoom
    setViewBox(prev => ({
      x: prev.x + prev.width * (1 - 1/scale) / 2,
      y: prev.y + prev.height * (1 - 1/scale) / 2,
      width: prev.width / scale,
      height: prev.height / scale
    }))
    setInternalZoom(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(25, zoom * 0.8)
    const scale = newZoom / zoom
    setViewBox(prev => ({
      x: prev.x + prev.width * (1 - 1/scale) / 2,
      y: prev.y + prev.height * (1 - 1/scale) / 2,
      width: prev.width / scale,
      height: prev.height / scale
    }))
    setInternalZoom(newZoom)
  }

  const handleResetView = () => {
    setViewBox({ x: -100, y: -100, width: 800, height: 600 })
    setInternalZoom(100)
  }

  const handleFitToContent = () => {
    if (beds.length === 0) {
      handleResetView()
      return
    }

    // Find bounds of all content
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    beds.forEach(bed => {
      bed.points.forEach(point => {
        minX = Math.min(minX, point.x)
        minY = Math.min(minY, point.y)
        maxX = Math.max(maxX, point.x)
        maxY = Math.max(maxY, point.y)
      })
      bed.plants.forEach(plant => {
        minX = Math.min(minX, plant.x - 20)
        minY = Math.min(minY, plant.y - 20)
        maxX = Math.max(maxX, plant.x + 20)
        maxY = Math.max(maxY, plant.y + 20)
      })
    })

    const padding = 50
    const contentWidth = maxX - minX + padding * 2
    const contentHeight = maxY - minY + padding * 2

    setViewBox({
      x: minX - padding,
      y: minY - padding,
      width: contentWidth,
      height: contentHeight
    })

    // Adjust zoom to fit
    const containerWidth = containerRef.current?.clientWidth || 800
    const containerHeight = containerRef.current?.clientHeight || 600
    const scaleX = containerWidth / contentWidth
    const scaleY = containerHeight / contentHeight
    const scale = Math.min(scaleX, scaleY, 2) // Max 200% zoom
    setInternalZoom(scale * 100)
  }

  // Handle custom bed drawing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPanning) return

    const point = snapToGrid(screenToWorld(e.clientX, e.clientY))

    if (spacePressed || selectedTool === 'pan') {
      handlePanStart(e)
    } else if (selectedTool === 'draw') {
      setIsDrawing(true)
      setCurrentPoints([point])
    } else if (selectedTool === 'rect') {
      setIsDrawing(true)
      setCurrentPoints([point])
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      handlePanMove(e)
      return
    }

    if (!isDrawing) return

    const point = snapToGrid(screenToWorld(e.clientX, e.clientY))

    if (selectedTool === 'draw') {
      // Freehand drawing - add point if moved enough
      const lastPoint = currentPoints[currentPoints.length - 1]
      const distance = Math.sqrt(
        Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)
      )
      if (distance > 5) {
        setCurrentPoints([...currentPoints, point])
      }
    } else if (selectedTool === 'rect' && currentPoints.length === 1) {
      // Rectangle preview
      const start = currentPoints[0]
      setCurrentPoints([
        start,
        { x: point.x, y: start.y },
        point,
        { x: start.x, y: point.y }
      ])
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isPanning) {
      handlePanEnd()
      return
    }

    if (!isDrawing || currentPoints.length < 3) {
      setIsDrawing(false)
      setCurrentPoints([])
      return
    }

    // Create new bed
    const newBed: GardenBed = {
      id: `bed-${Date.now()}`,
      name: `Bed ${beds.length + 1}`,
      points: selectedTool === 'draw' ? simplifyPath(currentPoints) : currentPoints,
      fill: '#d4f4dd',
      stroke: '#22c55e',
      plants: []
    }

    onBedsChange([...beds, newBed])
    setIsDrawing(false)
    setCurrentPoints([])
  }

  // Simplify freehand path to reduce points
  const simplifyPath = (points: { x: number; y: number }[]) => {
    if (points.length < 3) return points

    const simplified = [points[0]]
    let prevPoint = points[0]

    for (let i = 1; i < points.length - 1; i++) {
      const point = points[i]
      const distance = Math.sqrt(
        Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
      )
      if (distance > 15) {
        simplified.push(point)
        prevPoint = point
      }
    }

    simplified.push(points[points.length - 1])
    return simplified
  }

  // Handle plant placement and deletion
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isPanning || isDrawing) return

    const point = snapToGrid(screenToWorld(e.clientX, e.clientY))

    // Handle delete tool
    if (selectedTool === 'delete') {
      // Check for plant to delete first
      for (const bed of beds) {
        const plantToDelete = bed.plants.find(plant => {
          const distance = Math.sqrt(
            Math.pow(plant.x - point.x, 2) + Math.pow(plant.y - point.y, 2)
          )
          return distance < 15
        })

        if (plantToDelete) {
          const updatedBeds = beds.map(b =>
            b.id === bed.id
              ? { ...b, plants: b.plants.filter(p => p.id !== plantToDelete.id) }
              : b
          )
          onBedsChange(updatedBeds)
          return
        }
      }

      // Check for bed to delete
      const bedToDelete = beds.find(bed => isPointInPolygon(point, bed.points))
      if (bedToDelete) {
        if (confirm(`Delete ${bedToDelete.name} with ${bedToDelete.plants.length} plants?`)) {
          onBedsChange(beds.filter(bed => bed.id !== bedToDelete.id))
        }
      }
      return
    }

    // Handle plant placement
    if (selectedTool === 'plant' && selectedPlant) {
      // Find which bed was clicked
      const clickedBed = beds.find(bed => isPointInPolygon(point, bed.points))

      if (clickedBed) {
        // Check compatibility with existing plants
        const warnings: typeof compatibilityAlerts = []
        clickedBed.plants.forEach(existingPlant => {
          const plant = getPlantById(existingPlant.plantId)
          if (plant) {
            const compatibility = checkCompatibility(selectedPlant.id, plant.id)
            if (compatibility.type !== 'neutral') {
              warnings.push({
                plant1: selectedPlant.name,
                plant2: plant.name,
                type: compatibility.type === 'companion' ? 'good' : 'bad',
                message: compatibility.reason
              })
            }
          }
        })
        setCompatibilityAlerts(warnings)

        // Add plant to bed
        const newPlant: PlantedItem = {
          id: `plant-${Date.now()}`,
          plantId: selectedPlant.id,
          x: point.x,
          y: point.y,
          plantedDate: new Date()
        }

        const updatedBeds = beds.map(bed =>
          bed.id === clickedBed.id
            ? { ...bed, plants: [...bed.plants, newPlant] }
            : bed
        )

        onBedsChange(updatedBeds)
      }
    }
  }

  // Check if point is inside polygon
  const isPointInPolygon = (point: { x: number; y: number }, polygon: { x: number; y: number }[]) => {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y
      const xj = polygon[j].x, yj = polygon[j].y
      const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }
    return inside
  }

  // Convert polygon points to SVG path
  const pointsToPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return ''
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  }

  // Generate infinite grid
  const generateGrid = () => {
    const gridSize = 20
    const lines = []

    // Extend grid beyond viewbox for infinite feel
    const startX = Math.floor((viewBox.x - 100) / gridSize) * gridSize
    const endX = Math.ceil((viewBox.x + viewBox.width + 100) / gridSize) * gridSize
    const startY = Math.floor((viewBox.y - 100) / gridSize) * gridSize
    const endY = Math.ceil((viewBox.y + viewBox.height + 100) / gridSize) * gridSize

    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      const isMajor = x % 100 === 0
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={startY}
          x2={x}
          y2={endY}
          stroke={isMajor ? '#cbd5e1' : '#e2e8f0'}
          strokeWidth={isMajor ? 0.5 : 0.25}
        />
      )
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      const isMajor = y % 100 === 0
      lines.push(
        <line
          key={`h-${y}`}
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke={isMajor ? '#cbd5e1' : '#e2e8f0'}
          strokeWidth={isMajor ? 0.5 : 0.25}
        />
      )
    }

    // Origin lines
    if (viewBox.x <= 0 && viewBox.x + viewBox.width >= 0) {
      lines.push(
        <line
          key="origin-y"
          x1={0}
          y1={startY}
          x2={0}
          y2={endY}
          stroke="#94a3b8"
          strokeWidth={1}
        />
      )
    }
    if (viewBox.y <= 0 && viewBox.y + viewBox.height >= 0) {
      lines.push(
        <line
          key="origin-x"
          x1={startX}
          y1={0}
          x2={endX}
          y2={0}
          stroke="#94a3b8"
          strokeWidth={1}
        />
      )
    }

    return lines
  }

  return (
    <div className={cn("relative w-full h-full bg-white rounded-lg overflow-hidden", className)}>
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomIn}
          title="Zoom In (Ctrl +)"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomOut}
          title="Zoom Out (Ctrl -)"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleFitToContent}
          title="Fit to Content"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleResetView}
          title="Reset View (Ctrl 0)"
        >
          <Home className="h-4 w-4" />
        </Button>
        <div className="px-2 py-1 bg-white/90 rounded text-sm font-mono">
          {Math.round(zoom)}%
        </div>
      </div>

      {/* Pan Mode Indicator */}
      {(spacePressed || selectedTool === 'pan') && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded">
          <Move className="h-4 w-4" />
          <span className="text-sm">Pan Mode (hold Space)</span>
        </div>
      )}

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ cursor: isPanning ? 'grabbing' : (spacePressed || selectedTool === 'pan') ? 'grab' : 'crosshair' }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          onWheel={handleWheel}
        >
          {/* Grid */}
          {showGrid && (
            <g className="grid-layer" opacity={0.5}>
              {generateGrid()}
            </g>
          )}

          {/* Garden Beds */}
          <g className="beds-layer">
            {beds.map(bed => (
              <g key={bed.id}>
                <path
                  d={pointsToPath(bed.points)}
                  fill={bed.fill}
                  stroke={bed.stroke}
                  strokeWidth={hoveredBed === bed.id ? 3 : 2}
                  opacity={hoveredBed === bed.id ? 1 : 0.8}
                  onMouseEnter={() => setHoveredBed(bed.id)}
                  onMouseLeave={() => setHoveredBed(null)}
                />

                {/* Bed label */}
                {showLabels && bed.points.length > 0 && (
                  <text
                    x={bed.points[0].x + 10}
                    y={bed.points[0].y + 20}
                    fill="#065f46"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {bed.name}
                  </text>
                )}

                {/* Plants in bed */}
                {bed.plants.map(plant => {
                  const plantInfo = getPlantById(plant.plantId)
                  if (!plantInfo) return null

                  return (
                    <g key={plant.id}>
                      <circle
                        cx={plant.x}
                        cy={plant.y}
                        r={15}
                        fill="white"
                        stroke={hoveredPlant === plant.id ? '#22c55e' : '#94a3b8'}
                        strokeWidth={hoveredPlant === plant.id ? 2 : 1}
                        onMouseEnter={() => setHoveredPlant(plant.id)}
                        onMouseLeave={() => setHoveredPlant(null)}
                      />
                      <text
                        x={plant.x}
                        y={plant.y + 5}
                        textAnchor="middle"
                        fontSize="20"
                        style={{ pointerEvents: 'none' }}
                      >
                        {plantInfo.icon}
                      </text>

                      {/* Plant spacing guide */}
                      {showSpacing && hoveredPlant === plant.id && (
                        <circle
                          cx={plant.x}
                          cy={plant.y}
                          r={plantInfo.spacing * 2}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                          opacity={0.5}
                        />
                      )}
                    </g>
                  )
                })}
              </g>
            ))}
          </g>

          {/* Current drawing */}
          {isDrawing && currentPoints.length > 1 && (
            <path
              d={pointsToPath(currentPoints)}
              fill="rgba(34, 197, 94, 0.2)"
              stroke="#22c55e"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
          )}

          {/* Ruler/Scale indicator */}
          <g className="scale-indicator" transform={`translate(${viewBox.x + 20}, ${viewBox.y + viewBox.height - 40})`}>
            <line x1={0} y1={0} x2={100} y2={0} stroke="#64748b" strokeWidth={2} />
            <line x1={0} y1={-5} x2={0} y2={5} stroke="#64748b" strokeWidth={2} />
            <line x1={100} y1={-5} x2={100} y2={5} stroke="#64748b" strokeWidth={2} />
            <text x={50} y={20} textAnchor="middle" fill="#64748b" fontSize="12">
              100 units ({Math.round(100 / (zoom / 100))} px)
            </text>
          </g>
        </svg>
      </div>

      {/* Compatibility Alerts */}
      {compatibilityAlerts.length > 0 && (
        <div className="absolute bottom-4 left-4 space-y-2 max-w-sm">
          {compatibilityAlerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'good' ? 'default' : 'destructive'}>
              {alert.type === 'good' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {alert.plant1} & {alert.plant2}: {alert.message || (alert.type === 'good' ? 'Good companions!' : 'Not compatible')}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  )
}