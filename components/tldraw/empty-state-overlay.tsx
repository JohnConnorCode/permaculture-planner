'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, PenTool, BookOpen, MousePointer2, Hand } from 'lucide-react'

interface EmptyStateOverlayProps {
  onUseTemplate: () => void
  onDismiss: () => void
}

export function EmptyStateOverlay({ onUseTemplate, onDismiss }: EmptyStateOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Your Canvas Awaits!
            </h2>
            <p className="text-muted-foreground text-lg">
              Start designing your permaculture garden in 3 easy steps
            </p>
          </div>

          {/* Steps */}
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1 flex items-center gap-2">
                  <Hand className="h-4 w-4" />
                  Drag or Click Plants/Elements
                </div>
                <p className="text-sm text-muted-foreground">
                  Open the left panel and drag plants or elements onto your canvas, or click them and then click on the canvas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1 flex items-center gap-2">
                  <MousePointer2 className="h-4 w-4" />
                  Customize Your Design
                </div>
                <p className="text-sm text-muted-foreground">
                  Click any item to edit its properties in the right panel. Resize, move, and customize colors
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Get AI-Powered Insights
                </div>
                <p className="text-sm text-muted-foreground">
                  Use the right panel to analyze companion planting, plan successions, and optimize your design
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={onUseTemplate}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start with a Template
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              size="lg"
              onClick={onDismiss}
            >
              <PenTool className="h-5 w-5 mr-2" />
              Start from Scratch
            </Button>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground mb-2">Quick Tips:</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">⌘K</kbd>
                <span className="text-muted-foreground">Search panels</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">⌘S</kbd>
                <span className="text-muted-foreground">Save</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">ESC</kbd>
                <span className="text-muted-foreground">Cancel selection</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
