'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { PlantInfo, getPlantById, checkCompatibility } from '@/lib/data/plant-library'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export interface GardenBed {
  id: string
  name: string
  points: { x: number; y: number }[]
  fill: string
  stroke: string
  plants: PlantedItem[]
}

export interface PlantedItem {
  id: string
  plantId: string
  x: number
  y: number
  plantedDate?: Date
}

interface GardenDesignerCanvasProps {
  beds: GardenBed[]
  onBedsChange: (beds: GardenBed[]) => void
  selectedPlant: PlantInfo | null
  selectedTool: string
  zoom: number
  showGrid: boolean
  showLabels: boolean
  showSpacing: boolean
  showSunRequirements?: boolean
  showWaterRequirements?: boolean
  className?: string
}

export function GardenDesignerCanvas({
  beds,
  onBedsChange,
  selectedPlant,
  selectedTool,
  zoom = 100,
  showGrid = true,
  showLabels = true,
  showSpacing = false,
  showSunRequirements = false,
  showWaterRequirements = false,
  className
}: GardenDesignerCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([])
  const [selectedBed, setSelectedBed] = useState<string | null>(null)
  const [hoveredPlant, setHoveredPlant] = useState<string | null>(null)
  const [hoveredBed, setHoveredBed] = useState<string | null>(null)
  const [compatibilityAlerts, setCompatibilityAlerts] = useState<Array<{
    plant1: string
    plant2: string
    type: 'good' | 'bad' | 'info'
    message?: string
  }>>([])

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    const rect = svgRef.current.getBoundingClientRect()
    const scale = zoom / 100
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale
    }
  }, [zoom])

  // Snap to grid if enabled
  const snapToGrid = (point: { x: number; y: number }, gridSize: number = 10) => {
    if (!showGrid) return point
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    }
  }

  // Handle custom bed drawing
  const handleMouseDown = (e: React.MouseEvent) => {
    const point = snapToGrid(screenToSVG(e.clientX, e.clientY))

    if (selectedTool === 'draw') {
      setIsDrawing(true)
      setCurrentPoints([point])
    } else if (selectedTool === 'rect') {
      setIsDrawing(true)
      setCurrentPoints([point])
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return

    const point = snapToGrid(screenToSVG(e.clientX, e.clientY))

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
    const point = snapToGrid(screenToSVG(e.clientX, e.clientY))

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
    if (selectedTool !== 'plant' || !selectedPlant) return

    // Find which bed was clicked
    const clickedBed = beds.find(bed => isPointInPolygon(point, bed.points))
    if (!clickedBed) {
      setCompatibilityAlerts([{
        plant1: 'info',
        plant2: 'info',
        type: 'info',
        message: 'Click inside a garden bed to place plants'
      }])
      setTimeout(() => setCompatibilityAlerts([]), 3000)
      return
    }

    // Check spacing requirements
    const minSpacing = selectedPlant.size.spacing
    const tooClose = clickedBed.plants.some(plant => {
      const distance = Math.sqrt(
        Math.pow(plant.x - point.x, 2) + Math.pow(plant.y - point.y, 2)
      )
      return distance < minSpacing
    })

    if (tooClose) {
      setCompatibilityAlerts([{
        plant1: selectedPlant.id,
        plant2: 'spacing',
        type: 'info',
        message: `${selectedPlant.name} needs at least ${minSpacing}" spacing`
      }])
      setTimeout(() => setCompatibilityAlerts([]), 3000)
      return
    }

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

    // Check compatibility with nearby plants
    checkPlantCompatibility(clickedBed, newPlant)
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

  // Check plant compatibility
  const checkPlantCompatibility = (bed: GardenBed, newPlant: PlantedItem) => {
    const alerts: typeof compatibilityAlerts = []

    bed.plants.forEach(existingPlant => {
      const compatibility = checkCompatibility(newPlant.plantId, existingPlant.plantId)
      if (compatibility !== 'neutral') {
        alerts.push({
          plant1: newPlant.plantId,
          plant2: existingPlant.plantId,
          type: compatibility as 'good' | 'bad' | 'info'
        })
      }
    })

    setCompatibilityAlerts(alerts)
    setTimeout(() => setCompatibilityAlerts([]), 5000) // Clear after 5 seconds
  }

  // Calculate bed area (in square feet)
  const calculateBedArea = (points: { x: number; y: number }[]) => {
    if (points.length < 3) return 0

    let area = 0
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length
      area += points[i].x * points[j].y
      area -= points[j].x * points[i].y
    }

    return Math.abs(area / 2) / 144 // Convert to square feet (assuming 1 unit = 1 inch)
  }

  return (
    <div className="relative">
      {/* Compatibility Alerts */}
      {compatibilityAlerts.length > 0 && (
        <div className="absolute top-4 right-4 z-20 space-y-2 max-w-xs">
          {compatibilityAlerts.map((alert, i) => {
            if (alert.message) {
              return (
                <Alert key={i} className={alert.type === 'info' ? 'border-blue-500' : 'border-orange-500'}>
                  <AlertCircle className={`h-4 w-4 ${
                    alert.type === 'info' ? 'text-blue-500' : 'text-orange-500'
                  }`} />
                  <AlertDescription className="text-xs">
                    {alert.message}
                  </AlertDescription>
                </Alert>
              )
            }
            const plant1 = getPlantById(alert.plant1)
            const plant2 = getPlantById(alert.plant2)
            return (
              <Alert key={i} className={alert.type === 'good' ? 'border-green-500' : 'border-red-500'}>
                {alert.type === 'good' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription className="text-xs">
                  <strong>{plant1?.name}</strong> and <strong>{plant2?.name}</strong>
                  {alert.type === 'good' ? ' grow well together!' : ' should be separated'}
                </AlertDescription>
              </Alert>
            )
          })}
        </div>
      )}

      {/* Layer Legends */}
      {(showSunRequirements || showWaterRequirements) && (
        <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-lg p-3 space-y-2">
          {showSunRequirements && (
            <div>
              <div className="text-xs font-semibold mb-1">☀️ Sun Requirements</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-yellow-400 rounded-full"></div>
                  <span className="text-xs">Full sun</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-orange-400 rounded-full"></div>
                  <span className="text-xs">Partial sun</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-500 rounded-full"></div>
                  <span className="text-xs">Shade</span>
                </div>
              </div>
            </div>
          )}
          {showWaterRequirements && (
            <div>
              <div className="text-xs font-semibold mb-1">💧 Water Requirements</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 rounded-full"></div>
                  <span className="text-xs">High water</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-400 rounded-full"></div>
                  <span className="text-xs">Medium water</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-xs">Low water</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Canvas */}
      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className={cn("w-full h-full cursor-crosshair", className)}
        style={{ transform: `scale(${zoom / 100})` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDrawing(false)
          setCurrentPoints([])
        }}
        onClick={handleCanvasClick}
      >
        {/* Grid */}
        {showGrid && (
          <>
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="none" stroke="#d1d5db" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#grid)" />
            <rect width="800" height="600" fill="url(#grid-major)" />

            {/* Grid measurements */}
            <g className="text-[10px] fill-gray-400">
              {[0, 100, 200, 300, 400, 500, 600, 700].map(x => (
                <text key={x} x={x} y={595} textAnchor="middle">{x/12}"</text>
              ))}
              {[0, 100, 200, 300, 400, 500].map(y => (
                <text key={y} x={5} y={y} textAnchor="start">{y/12}"</text>
              ))}
            </g>
          </>
        )}

        {/* Existing beds */}
        {beds.map(bed => (
          <g key={bed.id}>
            <polygon
              points={bed.points.map(p => `${p.x},${p.y}`).join(' ')}
              fill={bed.fill}
              stroke={bed.stroke}
              strokeWidth={hoveredBed === bed.id ? 3 : bed.id === selectedBed ? 2.5 : 2}
              opacity={hoveredBed === bed.id ? 0.95 : 0.85}
              className="transition-all duration-200"
              style={{
                cursor: selectedTool === 'delete' ? 'pointer' :
                        selectedTool === 'plant' && selectedPlant ? 'crosshair' :
                        'default',
                filter: hoveredBed === bed.id ? 'brightness(1.05)' : 'none'
              }}
              onMouseEnter={() => setHoveredBed(bed.id)}
              onMouseLeave={() => setHoveredBed(null)}
              onClick={() => selectedTool === 'select' && setSelectedBed(bed.id)}
            />

            {/* Bed label */}
            {showLabels && bed.points.length > 0 && (
              <text
                x={bed.points.reduce((sum, p) => sum + p.x, 0) / bed.points.length}
                y={bed.points.reduce((sum, p) => sum + p.y, 0) / bed.points.length}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {bed.name}
                <tspan x={bed.points.reduce((sum, p) => sum + p.x, 0) / bed.points.length} dy="12">
                  {calculateBedArea(bed.points).toFixed(1)} sq ft
                </tspan>
              </text>
            )}

            {/* Plants in bed */}
            {bed.plants.map(plant => {
              const plantInfo = getPlantById(plant.plantId)
              if (!plantInfo) return null

              return (
                <g key={plant.id}>
                  {/* Plant spacing circle (if enabled) */}
                  {showSpacing && (
                    <circle
                      cx={plant.x}
                      cy={plant.y}
                      r={plantInfo.size.spacing / 2}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      opacity="0.3"
                    />
                  )}

                  {/* Sun requirement indicator */}
                  {showSunRequirements && (
                    <circle
                      cx={plant.x}
                      cy={plant.y}
                      r={plantInfo.size.mature_width / 3}
                      fill="none"
                      stroke={
                        plantInfo.requirements.sun === 'full' ? '#fbbf24' :
                        plantInfo.requirements.sun === 'partial' ? '#fb923c' :
                        '#6b7280'
                      }
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      opacity="0.5"
                      className="pointer-events-none"
                    />
                  )}

                  {/* Water requirement indicator */}
                  {showWaterRequirements && (
                    <circle
                      cx={plant.x}
                      cy={plant.y}
                      r={plantInfo.size.mature_width / 2.5}
                      fill="none"
                      stroke={
                        plantInfo.requirements.water === 'high' ? '#3b82f6' :
                        plantInfo.requirements.water === 'medium' ? '#60a5fa' :
                        '#cbd5e1'
                      }
                      strokeWidth="1.5"
                      strokeDasharray="2,3"
                      opacity="0.6"
                      className="pointer-events-none"
                    />
                  )}

                  {/* Plant icon */}
                  <circle
                    cx={plant.x}
                    cy={plant.y}
                    r={plantInfo.size.mature_width / 4}
                    fill={plantInfo.color}
                    stroke={hoveredPlant === plant.id ? '#000' : plantInfo.color}
                    strokeWidth={hoveredPlant === plant.id ? 2 : 1}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPlant(plant.id)}
                    onMouseLeave={() => setHoveredPlant(null)}
                  />

                  {/* Plant emoji/icon */}
                  <text
                    x={plant.x}
                    y={plant.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={plantInfo.size.mature_width / 3}
                    className="pointer-events-none select-none"
                  >
                    {plantInfo.icon}
                  </text>

                  {/* Plant label (on hover) */}
                  {hoveredPlant === plant.id && (
                    <g>
                      <rect
                        x={plant.x - 30}
                        y={plant.y - plantInfo.size.mature_width / 2 - 20}
                        width="60"
                        height="16"
                        fill="white"
                        stroke="black"
                        strokeWidth="1"
                        rx="2"
                      />
                      <text
                        x={plant.x}
                        y={plant.y - plantInfo.size.mature_width / 2 - 8}
                        textAnchor="middle"
                        className="text-[10px] font-medium fill-black"
                      >
                        {plantInfo.name}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </g>
        ))}

        {/* Current drawing */}
        {isDrawing && currentPoints.length > 1 && (
          <polygon
            points={currentPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="#d4f4dd"
            fillOpacity="0.5"
            stroke="#22c55e"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}

        {/* Drawing instructions */}
        {selectedTool === 'draw' && !isDrawing && (
          <text x="400" y="20" textAnchor="middle" className="text-sm fill-gray-500">
            Click and drag to draw a custom garden bed shape
          </text>
        )}
        {selectedTool === 'rect' && !isDrawing && (
          <text x="400" y="20" textAnchor="middle" className="text-sm fill-gray-500">
            Click and drag to create a rectangular bed
          </text>
        )}
        {selectedTool === 'plant' && selectedPlant && (
          <text x="400" y="20" textAnchor="middle" className="text-sm fill-gray-500">
            Click inside a bed to plant {selectedPlant.name} (needs {selectedPlant.size.spacing}" spacing)
          </text>
        )}
      </svg>
    </div>
  )
}