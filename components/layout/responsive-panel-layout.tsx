/**
 * Responsive Panel Layout
 *
 * Adapts editor layout for mobile, tablet, and desktop
 * Mobile: Stack panels, show one at a time
 * Tablet: Collapsible side panels
 * Desktop: Full three-column layout
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { useResponsive } from '@/hooks/use-responsive'
import { cn } from '@/lib/utils'

interface ResponsivePanelLayoutProps {
  /** Left panel content */
  leftPanel: React.ReactNode
  /** Left panel title (for mobile) */
  leftPanelTitle?: string
  /** Right panel content */
  rightPanel: React.ReactNode
  /** Right panel title (for mobile) */
  rightPanelTitle?: string
  /** Canvas/main content */
  canvas: React.ReactNode
  /** Whether left panel is open (desktop only) */
  leftPanelOpen?: boolean
  /** Whether right panel is open (desktop only) */
  rightPanelOpen?: boolean
  /** Callback when left panel open state changes */
  onLeftPanelOpenChange?: (open: boolean) => void
  /** Callback when right panel open state changes */
  onRightPanelOpenChange?: (open: boolean) => void
}

export function ResponsivePanelLayout({
  leftPanel,
  leftPanelTitle = 'Library',
  rightPanel,
  rightPanelTitle = 'Analysis',
  canvas,
  leftPanelOpen = true,
  rightPanelOpen = true,
  onLeftPanelOpenChange,
  onRightPanelOpenChange,
}: ResponsivePanelLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false)
  const [mobileRightOpen, setMobileRightOpen] = useState(false)

  // Mobile layout: Dialogs for panels
  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        {/* Mobile header with panel toggles */}
        <div className="flex items-center justify-between p-2 border-b bg-background">
          <Dialog open={mobileLeftOpen} onOpenChange={setMobileLeftOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4 mr-2" />
                {leftPanelTitle}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-full h-full max-h-full m-0 p-0 rounded-none">
              <DialogHeader className="p-4 border-b">
                <DialogTitle>{leftPanelTitle}</DialogTitle>
              </DialogHeader>
              <div className="h-[calc(100vh-5rem)] overflow-auto">{leftPanel}</div>
            </DialogContent>
          </Dialog>

          <Dialog open={mobileRightOpen} onOpenChange={setMobileRightOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                {rightPanelTitle}
                <Menu className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-full h-full max-h-full m-0 p-0 rounded-none">
              <DialogHeader className="p-4 border-b">
                <DialogTitle>{rightPanelTitle}</DialogTitle>
              </DialogHeader>
              <div className="h-[calc(100vh-5rem)] overflow-auto">{rightPanel}</div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Canvas takes full space */}
        <div className="flex-1 relative">{canvas}</div>
      </div>
    )
  }

  // Tablet layout: Collapsible panels with overlay option
  if (isTablet) {
    return (
      <div className="flex h-full relative">
        {/* Left panel - collapsible */}
        <div
          className={cn(
            'border-r bg-background transition-all duration-300 relative',
            leftPanelOpen ? 'w-64' : 'w-0'
          )}
        >
          {leftPanelOpen && <div className="h-full overflow-auto">{leftPanel}</div>}

          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-20 w-6 rounded-r-none"
            onClick={() => onLeftPanelOpenChange?.(!leftPanelOpen)}
          >
            {leftPanelOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">{canvas}</div>

        {/* Right panel - collapsible */}
        <div
          className={cn(
            'border-l bg-background transition-all duration-300 relative',
            rightPanelOpen ? 'w-64' : 'w-0'
          )}
        >
          {rightPanelOpen && <div className="h-full overflow-auto">{rightPanel}</div>}

          <Button
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-20 w-6 rounded-l-none"
            onClick={() => onRightPanelOpenChange?.(!rightPanelOpen)}
          >
            {rightPanelOpen ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    )
  }

  // Desktop layout: Full three-column with collapsible panels
  return (
    <div className="flex h-full relative">
      {/* Left panel */}
      <div
        className={cn(
          'border-r bg-background transition-all duration-300 relative',
          leftPanelOpen ? 'w-80' : 'w-0'
        )}
      >
        {leftPanelOpen && <div className="h-full overflow-auto">{leftPanel}</div>}

        <Button
          variant="outline"
          size="sm"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-20 w-6 rounded-r-none"
          onClick={() => onLeftPanelOpenChange?.(!leftPanelOpen)}
        >
          {leftPanelOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">{canvas}</div>

      {/* Right panel */}
      <div
        className={cn(
          'border-l bg-background transition-all duration-300 relative',
          rightPanelOpen ? 'w-80' : 'w-0'
        )}
      >
        {rightPanelOpen && <div className="h-full overflow-auto">{rightPanel}</div>}

        <Button
          variant="outline"
          size="sm"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-20 w-6 rounded-l-none"
          onClick={() => onRightPanelOpenChange?.(!rightPanelOpen)}
        >
          {rightPanelOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
