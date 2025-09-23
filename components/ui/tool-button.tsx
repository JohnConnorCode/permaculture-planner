'use client'

import { useState } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ToolButtonProps {
  id: string
  icon: LucideIcon
  name: string
  description?: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function ToolButton({
  id,
  icon: Icon,
  name,
  description,
  selected = false,
  onClick,
  className
}: ToolButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={cn(
              "p-3 rounded-lg transition-all duration-200 relative",
              selected
                ? "bg-green-600 text-white shadow-lg scale-110"
                : "hover:bg-gray-200 text-gray-700 hover:scale-105",
              className
            )}
            aria-label={name}
            aria-pressed={selected}
          >
            <Icon className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="font-medium">{name}</div>
          {description && (
            <div className="text-xs text-gray-500 mt-1">{description}</div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}