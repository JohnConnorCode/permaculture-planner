'use client'

import { useEffect, useState } from 'react'
import {
  Info,
  MousePointer2,
  Grid3x3,
  Layers,
  Save,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Command,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusBarProps {
  zoom?: number
  selectedTool?: string
  gridEnabled?: boolean
  layersCount?: number
  saved?: boolean
  online?: boolean
  coordinates?: { x: number; y: number }
  itemsCount?: { beds: number; plants: number }
  className?: string
}

export function StatusBar({
  zoom = 100,
  selectedTool = 'Select',
  gridEnabled = false,
  layersCount = 1,
  saved = true,
  online = true,
  coordinates = { x: 0, y: 0 },
  itemsCount = { beds: 0, plants: 0 },
  className
}: StatusBarProps) {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState(new Date())
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate auto-save status
  useEffect(() => {
    if (!saved) {
      setSaveStatus('saving')
      const timer = setTimeout(() => {
        setSaveStatus('saved')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [saved])

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 h-8 bg-gray-900/95 backdrop-blur-md border-t border-gray-800',
      'flex items-center justify-between px-4 text-xs text-gray-400',
      'z-40 select-none',
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo/Branding */}
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-green-500" />
          <span className="font-medium text-gray-300">Permaculture Planner Pro</span>
        </div>

        <div className="h-4 w-px bg-gray-700" />

        {/* Tool Status */}
        <div className="flex items-center gap-1.5">
          <MousePointer2 className="h-3 w-3" />
          <span>{selectedTool}</span>
        </div>

        {/* Coordinates */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">X:</span>
          <span className="font-mono">{coordinates.x.toFixed(0)}</span>
          <span className="text-gray-500 ml-2">Y:</span>
          <span className="font-mono">{coordinates.y.toFixed(0)}</span>
        </div>

        <div className="h-4 w-px bg-gray-700" />

        {/* Items Count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Beds:</span>
            <span className="font-medium text-gray-300">{itemsCount.beds}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Plants:</span>
            <span className="font-medium text-gray-300">{itemsCount.plants}</span>
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-4">
        {/* Quick Tips */}
        <div className="flex items-center gap-1.5 text-gray-500">
          <Command className="h-3 w-3" />
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-[10px]">⌘K</kbd>
          <span>for commands</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Feature Toggles */}
        <div className="flex items-center gap-2">
          <button
            className={cn(
              'p-1 rounded transition-colors',
              gridEnabled ? 'text-green-500 bg-green-500/10' : 'text-gray-500 hover:text-gray-300'
            )}
            title="Toggle Grid"
          >
            <Grid3x3 className="h-3 w-3" />
          </button>
          <button
            className={cn(
              'p-1 rounded transition-colors flex items-center gap-1',
              'text-gray-500 hover:text-gray-300'
            )}
            title="Layers"
          >
            <Layers className="h-3 w-3" />
            <span className="text-[10px]">{layersCount}</span>
          </button>
        </div>

        <div className="h-4 w-px bg-gray-700" />

        {/* Save Status */}
        <div className="flex items-center gap-1.5">
          {saveStatus === 'saving' ? (
            <>
              <div className="h-3 w-3 border-2 border-gray-600 border-t-green-500 rounded-full animate-spin" />
              <span className="text-gray-400">Saving...</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Cloud className="h-3 w-3 text-green-500" />
              <span className="text-green-500">Saved</span>
            </>
          ) : (
            <>
              <CloudOff className="h-3 w-3 text-red-500" />
              <span className="text-red-500">Error</span>
            </>
          )}
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-1.5">
          {online ? (
            <Wifi className="h-3 w-3 text-green-500" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
        </div>

        <div className="h-4 w-px bg-gray-700" />

        {/* Zoom */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Zoom:</span>
          <span className="font-mono font-medium text-gray-300">{zoom}%</span>
        </div>

        <div className="h-4 w-px bg-gray-700" />

        {/* Time */}
        <div className="font-mono text-gray-400">
          {mounted ? time.toLocaleTimeString('en-US', { hour12: false }) : '--:--:--'}
        </div>
      </div>
    </div>
  )
}