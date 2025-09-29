'use client'

import React from 'react'
import { Tool } from '@/contexts/garden-designer-context'
import {
  MousePointer, Square, Circle, Triangle, Hexagon, Pencil, Trash2,
  Leaf, Package, Move, Hand
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Tool definition interface
export interface ToolDefinition {
  id: Tool
  name: string
  icon: React.ComponentType<{ className?: string }>
  hotkey?: string
  category: 'selection' | 'drawing' | 'placement' | 'utility'
  description: string
}

// Tool registry
export const TOOLS: ToolDefinition[] = [
  {
    id: 'select',
    name: 'Select',
    icon: MousePointer,
    hotkey: 'V',
    category: 'selection',
    description: 'Select and move items'
  },
  {
    id: 'pan',
    name: 'Pan',
    icon: Hand,
    hotkey: 'H',
    category: 'selection',
    description: 'Pan the canvas view'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    icon: Square,
    hotkey: 'R',
    category: 'drawing',
    description: 'Draw rectangular beds'
  },
  {
    id: 'circle',
    name: 'Circle',
    icon: Circle,
    hotkey: 'C',
    category: 'drawing',
    description: 'Draw circular beds'
  },
  {
    id: 'triangle',
    name: 'Triangle',
    icon: Triangle,
    hotkey: 'T',
    category: 'drawing',
    description: 'Draw triangular beds'
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    icon: Hexagon,
    hotkey: 'G',
    category: 'drawing',
    description: 'Draw hexagonal beds'
  },
  {
    id: 'pencil',
    name: 'Draw',
    icon: Pencil,
    hotkey: 'D',
    category: 'drawing',
    description: 'Draw custom shapes'
  },
  {
    id: 'plant',
    name: 'Plant',
    icon: Leaf,
    category: 'placement',
    description: 'Place plants in beds'
  },
  {
    id: 'element',
    name: 'Element',
    icon: Package,
    category: 'placement',
    description: 'Place garden elements'
  },
  {
    id: 'delete',
    name: 'Delete',
    icon: Trash2,
    hotkey: 'Del',
    category: 'utility',
    description: 'Delete selected items'
  }
]

// Tool palette component
interface ToolPaletteProps {
  selectedTool: Tool
  onSelectTool: (tool: Tool) => void
  orientation?: 'horizontal' | 'vertical'
  showLabels?: boolean
  compact?: boolean
}

export function ToolPalette({
  selectedTool,
  onSelectTool,
  orientation = 'vertical',
  showLabels = true,
  compact = false
}: ToolPaletteProps) {
  const toolsByCategory = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = []
    acc[tool.category].push(tool)
    return acc
  }, {} as Record<string, ToolDefinition[]>)

  const buttonSize = compact ? 'h-8 w-8' : 'h-10 w-10'

  return (
    <div
      className={cn(
        'flex gap-2',
        orientation === 'vertical' ? 'flex-col' : 'flex-row'
      )}
    >
      {Object.entries(toolsByCategory).map(([category, tools]) => (
        <div
          key={category}
          className={cn(
            'flex gap-1 p-1 bg-white rounded-lg border',
            orientation === 'vertical' ? 'flex-col' : 'flex-row'
          )}
        >
          {tools.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              isSelected={selectedTool === tool.id}
              onClick={() => onSelectTool(tool.id)}
              showLabel={showLabels}
              size={buttonSize}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Individual tool button
interface ToolButtonProps {
  tool: ToolDefinition
  isSelected: boolean
  onClick: () => void
  showLabel?: boolean
  size?: string
}

function ToolButton({
  tool,
  isSelected,
  onClick,
  showLabel = true,
  size = 'h-10 w-10'
}: ToolButtonProps) {
  const Icon = tool.icon

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          size,
          'flex items-center justify-center rounded-lg transition-all',
          isSelected
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
        title={`${tool.name}${tool.hotkey ? ` (${tool.hotkey})` : ''}`}
      >
        <Icon className="h-5 w-5" />
      </button>

      {/* Tooltip */}
      {showLabel && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-50">
          <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
            <div className="font-medium">{tool.name}</div>
            {tool.hotkey && (
              <div className="text-gray-400">Hotkey: {tool.hotkey}</div>
            )}
            <div className="text-gray-300 mt-1">{tool.description}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Tool handler hook
export function useToolHandlers() {
  const handleToolAction = (tool: Tool, context: any) => {
    // Tool-specific logic can be added here
    switch (tool) {
      case 'select':
        return handleSelectTool(context)
      case 'rectangle':
      case 'circle':
      case 'triangle':
      case 'hexagon':
        return handleShapeTool(tool, context)
      case 'pencil':
        return handlePencilTool(context)
      case 'plant':
        return handlePlantTool(context)
      case 'element':
        return handleElementTool(context)
      case 'delete':
        return handleDeleteTool(context)
      default:
        return null
    }
  }

  return { handleToolAction }
}

// Tool-specific handlers
function handleSelectTool(context: any) {
  // Selection logic
}

function handleShapeTool(shape: string, context: any) {
  // Shape creation logic
}

function handlePencilTool(context: any) {
  // Freehand drawing logic
}

function handlePlantTool(context: any) {
  // Plant placement logic
}

function handleElementTool(context: any) {
  // Element placement logic
}

function handleDeleteTool(context: any) {
  // Deletion logic
}