'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

interface PremiumTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  shortcut?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  className?: string
}

export function PremiumTooltip({
  children,
  content,
  shortcut,
  side = 'top',
  align = 'center',
  delayDuration = 400,
  className
}: PremiumTooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={5}
            className={cn(
              'z-50 overflow-hidden rounded-lg bg-gray-900/95 backdrop-blur-md px-3 py-2',
              'text-xs text-white animate-in fade-in-0 zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              'data-[side=bottom]:slide-in-from-top-2',
              'data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2',
              'data-[side=top]:slide-in-from-bottom-2',
              'shadow-xl border border-white/10',
              className
            )}
          >
            <div className="flex items-center gap-2">
              <span>{content}</span>
              {shortcut && (
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/80">
                  {shortcut}
                </kbd>
              )}
            </div>
            <TooltipPrimitive.Arrow className="fill-gray-900/95" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

// Rich tooltip with more content
interface RichTooltipProps extends Omit<PremiumTooltipProps, 'content'> {
  title: string
  description?: string
  image?: string
  stats?: { label: string; value: string }[]
}

export function RichTooltip({
  children,
  title,
  description,
  image,
  stats,
  shortcut,
  ...props
}: RichTooltipProps) {
  return (
    <PremiumTooltip
      {...props}
      children={children}
      content={
        <div className="space-y-2 max-w-xs">
          {image && (
            <img src={image} alt={title} className="w-full h-24 object-cover rounded-md" />
          )}
          <div>
            <h4 className="font-semibold text-white">{title}</h4>
            {description && (
              <p className="text-white/70 text-xs mt-1">{description}</p>
            )}
          </div>
          {stats && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-white/50 text-[10px]">{stat.label}</div>
                  <div className="text-white font-medium text-xs">{stat.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    />
  )
}