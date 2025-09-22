'use client'

import React, { useMemo } from 'react'
import { Node, PlantNode, isPlantNode } from '@/modules/scene/sceneTypes'
import { PLANTS } from '@/lib/data/plant-database'
import { AlertTriangle, CheckCircle, Info, Heart, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompanionPlantingOverlayProps {
  nodes: Node[]
  selectedNodeId?: string | null
  showAllWarnings?: boolean
}

interface PlantRelationship {
  plant1: PlantNode
  plant2: PlantNode
  type: 'beneficial' | 'antagonistic' | 'neutral'
  distance: number
}

export function CompanionPlantingOverlay({
  nodes,
  selectedNodeId,
  showAllWarnings = false
}: CompanionPlantingOverlayProps) {
  const plantNodes = useMemo(() => nodes.filter(isPlantNode), [nodes])

  // Calculate relationships between all plants
  const relationships = useMemo(() => {
    const rels: PlantRelationship[] = []

    for (let i = 0; i < plantNodes.length; i++) {
      for (let j = i + 1; j < plantNodes.length; j++) {
        const plant1 = plantNodes[i]
        const plant2 = plantNodes[j]

        // Calculate distance between plants
        const dx = plant1.transform.xIn - plant2.transform.xIn
        const dy = plant1.transform.yIn - plant2.transform.yIn
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Only consider relationships within 48 inches (4 feet)
        if (distance < 48) {
          const plant1Data = PLANTS.find(p => p.id === plant1.plant.plantId)
          const plant2Data = PLANTS.find(p => p.id === plant2.plant.plantId)

          if (plant1Data && plant2Data) {
            let type: 'beneficial' | 'antagonistic' | 'neutral' = 'neutral'

            if (
              plant1Data.companionship?.beneficial?.includes(plant2.plant.plantId) ||
              plant2Data.companionship?.beneficial?.includes(plant1.plant.plantId)
            ) {
              type = 'beneficial'
            } else if (
              plant1Data.companionship?.antagonistic?.includes(plant2.plant.plantId) ||
              plant2Data.companionship?.antagonistic?.includes(plant1.plant.plantId)
            ) {
              type = 'antagonistic'
            }

            if (type !== 'neutral') {
              rels.push({ plant1, plant2, type, distance })
            }
          }
        }
      }
    }

    return rels
  }, [plantNodes])

  // Filter relationships based on selection
  const relevantRelationships = useMemo(() => {
    if (!selectedNodeId && !showAllWarnings) return []

    if (selectedNodeId) {
      return relationships.filter(
        rel => rel.plant1.id === selectedNodeId || rel.plant2.id === selectedNodeId
      )
    }

    // Show all warnings/benefits
    return relationships
  }, [relationships, selectedNodeId, showAllWarnings])

  // Group relationships by type for display
  const { beneficial, antagonistic } = useMemo(() => {
    const ben: PlantRelationship[] = []
    const ant: PlantRelationship[] = []

    relevantRelationships.forEach(rel => {
      if (rel.type === 'beneficial') {
        ben.push(rel)
      } else if (rel.type === 'antagonistic') {
        ant.push(rel)
      }
    })

    return { beneficial: ben, antagonistic: ant }
  }, [relevantRelationships])

  if (relevantRelationships.length === 0) {
    return null
  }

  return (
    <div className="absolute top-4 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl border p-4 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Heart className="h-4 w-4 text-pink-500" />
          Companion Planting Analysis
        </h3>

        {/* Antagonistic warnings */}
        {antagonistic.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Conflicting Plants</span>
            </div>
            {antagonistic.map((rel, i) => {
              const plant1Data = PLANTS.find(p => p.id === rel.plant1.plant.plantId)
              const plant2Data = PLANTS.find(p => p.id === rel.plant2.plant.plantId)
              return (
                <div
                  key={i}
                  className="bg-red-50 border border-red-200 rounded-md p-2"
                >
                  <div className="text-xs">
                    <span className="font-medium">{plant1Data?.commonName}</span>
                    {' and '}
                    <span className="font-medium">{plant2Data?.commonName}</span>
                    {' should not be planted together'}
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    Distance: {Math.round(rel.distance)}" apart
                    {rel.distance < 24 && ' (too close!)'}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Beneficial relationships */}
        {beneficial.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Companion Plants</span>
            </div>
            {beneficial.map((rel, i) => {
              const plant1Data = PLANTS.find(p => p.id === rel.plant1.plant.plantId)
              const plant2Data = PLANTS.find(p => p.id === rel.plant2.plant.plantId)
              return (
                <div
                  key={i}
                  className="bg-green-50 border border-green-200 rounded-md p-2"
                >
                  <div className="text-xs">
                    <span className="font-medium">{plant1Data?.commonName}</span>
                    {' grows well with '}
                    <span className="font-medium">{plant2Data?.commonName}</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Distance: {Math.round(rel.distance)}" apart
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Summary stats */}
        <div className="pt-2 border-t flex justify-between text-xs text-gray-500">
          <span>{beneficial.length} companion pairs</span>
          <span>{antagonistic.length} conflicts</span>
        </div>
      </div>
    </div>
  )
}

// Visual connection lines for the garden view
export function CompanionConnectionLines({
  nodes,
  selectedNodeId,
  svgRef
}: {
  nodes: Node[]
  selectedNodeId?: string | null
  svgRef?: React.RefObject<SVGSVGElement>
}) {
  const plantNodes = useMemo(() => nodes.filter(isPlantNode), [nodes])

  const connections = useMemo(() => {
    if (!selectedNodeId) return []

    const selectedPlant = plantNodes.find(p => p.id === selectedNodeId)
    if (!selectedPlant) return []

    const selectedPlantData = PLANTS.find(p => p.id === selectedPlant.plant.plantId)
    if (!selectedPlantData) return []

    return plantNodes
      .filter(p => p.id !== selectedNodeId)
      .map(otherPlant => {
        const otherPlantData = PLANTS.find(p => p.id === otherPlant.plant.plantId)
        if (!otherPlantData) return null

        let type: 'beneficial' | 'antagonistic' | null = null

        if (
          selectedPlantData.companionship?.beneficial?.includes(otherPlant.plant.plantId) ||
          otherPlantData.companionship?.beneficial?.includes(selectedPlant.plant.plantId)
        ) {
          type = 'beneficial'
        } else if (
          selectedPlantData.companionship?.antagonistic?.includes(otherPlant.plant.plantId) ||
          otherPlantData.companionship?.antagonistic?.includes(selectedPlant.plant.plantId)
        ) {
          type = 'antagonistic'
        }

        if (!type) return null

        return {
          from: selectedPlant,
          to: otherPlant,
          type
        }
      })
      .filter(Boolean)
  }, [plantNodes, selectedNodeId])

  if (connections.length === 0) return null

  return (
    <g className="companion-connections pointer-events-none">
      {connections.map((conn, i) => {
        if (!conn) return null

        const color = conn.type === 'beneficial' ? '#10b981' : '#ef4444'
        const opacity = conn.type === 'beneficial' ? 0.3 : 0.5
        const strokeWidth = conn.type === 'beneficial' ? 2 : 3
        const dashArray = conn.type === 'antagonistic' ? '5,5' : 'none'

        return (
          <line
            key={i}
            x1={conn.from.transform.xIn}
            y1={conn.from.transform.yIn}
            x2={conn.to.transform.xIn}
            y2={conn.to.transform.yIn}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            opacity={opacity}
            className="companion-connection-line"
          />
        )
      })}
    </g>
  )
}