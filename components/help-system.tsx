'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HelpCircle, Keyboard, Info, Video, Book, MessageCircle } from 'lucide-react'

interface HelpTooltipProps {
  title: string
  content: string
  children: React.ReactNode
  video?: string
}

export function HelpTooltip({ title, content, children, video }: HelpTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-sm text-gray-600">{content}</p>
          {video && (
            <Button variant="link" size="sm" className="p-0 h-auto">
              <Video className="h-3 w-3 mr-1" />
              Watch tutorial
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const KEYBOARD_SHORTCUTS = [
  { category: 'Tools', shortcuts: [
    { key: 'V', action: 'Select tool' },
    { key: 'B', action: 'Draw bed tool' },
    { key: 'C', action: 'Draw curved bed' },
    { key: 'P', action: 'Draw path tool' },
    { key: 'M', action: 'Measure tool' },
  ]},
  { category: 'Edit', shortcuts: [
    { key: 'Ctrl/Cmd + Z', action: 'Undo' },
    { key: 'Ctrl/Cmd + Y', action: 'Redo' },
    { key: 'Ctrl/Cmd + D', action: 'Duplicate' },
    { key: 'Delete', action: 'Delete selected' },
    { key: 'Escape', action: 'Cancel/Deselect' },
  ]},
  { category: 'View', shortcuts: [
    { key: 'Ctrl/Cmd + 0', action: 'Reset zoom' },
    { key: 'Ctrl/Cmd + =', action: 'Zoom in' },
    { key: 'Ctrl/Cmd + -', action: 'Zoom out' },
    { key: 'Space + Drag', action: 'Pan view' },
    { key: 'G', action: 'Toggle grid' },
  ]},
  { category: 'Selection', shortcuts: [
    { key: 'Ctrl/Cmd + A', action: 'Select all' },
    { key: 'Shift + Click', action: 'Add to selection' },
    { key: 'Alt + Drag', action: 'Duplicate and drag' },
    { key: 'R', action: 'Rotate 90°' },
    { key: 'Shift + R', action: 'Rotate -90°' },
  ]},
]

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Keyboard className="h-4 w-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick keys to speed up your garden design workflow
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {KEYBOARD_SHORTCUTS.map((category) => (
              <div key={category.category}>
                <h3 className="font-semibold text-sm mb-3 text-green-700">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-sm text-gray-600">
                        {shortcut.action}
                      </span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="text-xs text-gray-500 mt-4">
          Press <Badge variant="outline" className="text-xs">Ctrl/Cmd + ?</Badge> to toggle this help
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface TourStep {
  target: string
  title: string
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '.toolbar',
    title: 'Drawing Tools',
    content: 'Select tools here to draw beds, paths, and add features to your garden.',
    placement: 'right'
  },
  {
    target: '.canvas',
    title: 'Garden Canvas',
    content: 'This is where you design your garden. Click and drag to create elements.',
    placement: 'top'
  },
  {
    target: '.plant-library',
    title: 'Plant Library',
    content: 'Drag plants from here onto your beds. Filter by sun, water, and growing conditions.',
    placement: 'left'
  },
  {
    target: '.features-library',
    title: 'Garden Features',
    content: 'Add irrigation, structures, and compost systems to your design.',
    placement: 'left'
  },
  {
    target: '.properties-panel',
    title: 'Properties',
    content: 'Select any element to edit its properties, dimensions, and settings here.',
    placement: 'left'
  }
]

export function GuidedTour() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const startTour = () => {
    setIsActive(true)
    setCurrentStep(0)
    // Highlight first element
    highlightElement(TOUR_STEPS[0].target)
  }

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      highlightElement(TOUR_STEPS[currentStep + 1].target)
    } else {
      endTour()
    }
  }

  const endTour = () => {
    setIsActive(false)
    removeHighlights()
  }

  const highlightElement = (selector: string) => {
    removeHighlights()
    const element = document.querySelector(selector)
    if (element) {
      element.classList.add('tour-highlight')
    }
  }

  const removeHighlights = () => {
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight')
    })
  }

  if (!isActive) {
    return (
      <Button variant="outline" size="sm" onClick={startTour}>
        <Info className="h-4 w-4 mr-2" />
        Take a Tour
      </Button>
    )
  }

  const step = TOUR_STEPS[currentStep]

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={endTour} />
      <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {step.title}
            <Badge variant="secondary">
              {currentStep + 1} / {TOUR_STEPS.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{step.content}</p>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={endTour}>
              Skip Tour
            </Button>
            <Button onClick={nextStep}>
              {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function HelpButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg bg-white hover:bg-gray-50 z-40"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Help & Resources</DialogTitle>
          <DialogDescription>
            Everything you need to create your perfect garden plan
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Badge className="mt-0.5">1</Badge>
                  <div>
                    <strong>Set your space:</strong> Start by setting the dimensions of your garden area.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="mt-0.5">2</Badge>
                  <div>
                    <strong>Add beds:</strong> Use the bed tool (B) to draw your garden beds.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="mt-0.5">3</Badge>
                  <div>
                    <strong>Design paths:</strong> Add paths (P) between beds for access.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="mt-0.5">4</Badge>
                  <div>
                    <strong>Place plants:</strong> Drag plants from the library onto your beds.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="mt-0.5">5</Badge>
                  <div>
                    <strong>Add features:</strong> Include irrigation, structures, and compost areas.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <li>Hold Shift while clicking to select multiple elements</li>
                <li>Use the measure tool (M) to check distances</li>
                <li>Toggle dimensions to see exact sizes</li>
                <li>Enable textures for realistic visualization</li>
                <li>Group related beds with tags in properties</li>
                <li>Set sun exposure for each bed to match plant needs</li>
                <li>Use the notes tab to track planting dates</li>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Learn More</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  Read Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Watch Video Tutorials
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Join Community Forum
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// CSS for tour highlighting (add to global styles)
const tourStyles = `
  .tour-highlight {
    position: relative;
    z-index: 51;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.5);
    border-radius: 4px;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.5); }
    50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.3); }
    100% { box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.5); }
  }
`