'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, ChevronDown, Clock, Crown, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PANEL_REGISTRY,
  PANEL_CATEGORIES,
  PanelDefinition,
  getPanelById,
  searchPanels,
  getPanelsByCategory
} from './panel-registry'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PanelSelectorProps {
  currentPanel: string
  onPanelChange: (panelId: string) => void
  recentPanels?: string[]
  onUpdateRecents?: (panelId: string) => void
}

export function PanelSelector({
  currentPanel,
  onPanelChange,
  recentPanels = [],
  onUpdateRecents
}: PanelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const currentPanelDef = getPanelById(currentPanel)
  const CurrentIcon = currentPanelDef?.icon

  // Search results
  const searchResults = useMemo(() => {
    return searchPanels(searchQuery)
  }, [searchQuery])

  // Get recent panel definitions (max 5)
  const recentPanelDefs = useMemo(() => {
    return recentPanels
      .slice(0, 5)
      .map(id => getPanelById(id))
      .filter(Boolean) as PanelDefinition[]
  }, [recentPanels])

  const handleSelectPanel = (panelId: string) => {
    onPanelChange(panelId)
    onUpdateRecents?.(panelId)
    setIsOpen(false)
    setSearchQuery('')
  }

  const getTierBadge = (tier: PanelDefinition['tier']) => {
    if (tier === 'free') return null

    return (
      <Badge
        variant="outline"
        className={cn(
          "text-xs ml-auto",
          tier === 'premium' && "bg-purple-50 text-purple-700 border-purple-200",
          tier === 'pro' && "bg-amber-50 text-amber-700 border-amber-200"
        )}
      >
        {tier === 'premium' && <Crown className="h-3 w-3 mr-1" />}
        {tier === 'pro' && <Sparkles className="h-3 w-3 mr-1" />}
        {tier.toUpperCase()}
      </Badge>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-12 px-4 border-b hover:bg-accent/50"
        >
          <div className="flex items-center gap-3">
            {CurrentIcon && <CurrentIcon className="h-5 w-5 text-muted-foreground" />}
            <div className="text-left">
              <div className="font-semibold text-sm">{currentPanelDef?.name || 'Select Panel'}</div>
              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                {currentPanelDef?.description}
              </div>
            </div>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "transform rotate-180"
          )} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-96 p-0"
        align="start"
        sideOffset={0}
      >
        {/* Search Bar */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search panels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="p-2">
            {/* Recent Panels */}
            {!searchQuery && recentPanelDefs.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Recent
                </div>
                <div className="space-y-1">
                  {recentPanelDefs.map((panel) => {
                    const Icon = panel.icon
                    return (
                      <button
                        key={panel.id}
                        onClick={() => handleSelectPanel(panel.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          "hover:bg-accent",
                          currentPanel === panel.id && "bg-accent"
                        )}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{panel.name}</div>
                        </div>
                        {getTierBadge(panel.tier)}
                      </button>
                    )
                  })}
                </div>
                <Separator className="my-3" />
              </div>
            )}

            {/* Search Results or Categories */}
            {searchQuery ? (
              // Search Results
              <div className="space-y-1">
                {searchResults.length > 0 ? (
                  searchResults.map((panel) => {
                    const Icon = panel.icon
                    const category = PANEL_CATEGORIES[panel.category]
                    return (
                      <button
                        key={panel.id}
                        onClick={() => handleSelectPanel(panel.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                          "hover:bg-accent",
                          currentPanel === panel.id && "bg-accent"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" style={{ color: category.color.replace('text-', '#') }} />
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium truncate">{panel.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{panel.description}</div>
                        </div>
                        {getTierBadge(panel.tier)}
                      </button>
                    )
                  })
                ) : (
                  <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No panels found for "{searchQuery}"
                  </div>
                )}
              </div>
            ) : (
              // Categorized Panels
              <div className="space-y-4">
                {(Object.keys(PANEL_CATEGORIES) as Array<keyof typeof PANEL_CATEGORIES>).map((categoryKey) => {
                  const category = PANEL_CATEGORIES[categoryKey]
                  const panels = getPanelsByCategory(categoryKey)

                  if (panels.length === 0) return null

                  return (
                    <div key={categoryKey}>
                      <div className={cn(
                        "px-2 py-1.5 mb-1 rounded-md",
                        category.bgColor
                      )}>
                        <div className={cn("text-xs font-semibold", category.color)}>
                          {category.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {category.description}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {panels.map((panel) => {
                          const Icon = panel.icon
                          return (
                            <button
                              key={panel.id}
                              onClick={() => handleSelectPanel(panel.id)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                                "hover:bg-accent",
                                currentPanel === panel.id && "bg-accent"
                              )}
                            >
                              <Icon className={cn("h-4 w-4 flex-shrink-0", category.color)} />
                              <div className="flex-1 text-left min-w-0">
                                <div className="font-medium truncate">{panel.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {panel.description}
                                </div>
                              </div>
                              {getTierBadge(panel.tier)}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-2 bg-muted/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
            <span>{PANEL_REGISTRY.length} panels available</span>
            <Separator orientation="vertical" className="h-3" />
            <kbd className="px-1.5 py-0.5 bg-background rounded font-mono text-xs">⌘K</kbd>
            <span>to search</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
