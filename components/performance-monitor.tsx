'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Activity, Zap, HardDrive, Gauge } from 'lucide-react'

interface PerformanceMonitorProps {
  show?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}

export function PerformanceMonitor({
  show = true,
  position = 'bottom-right',
  className
}: PerformanceMonitorProps) {
  const [fps, setFps] = useState(60)
  const [memory, setMemory] = useState(0)
  const [renderTime, setRenderTime] = useState(0)
  const [operations, setOperations] = useState(0)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(performance.now())
  const fpsHistoryRef = useRef<number[]>([])

  useEffect(() => {
    if (!show) return

    let frameId: number
    const fpsHistory: number[] = []
    let frameCount = 0
    let lastFpsUpdate = performance.now()

    const measureFPS = () => {
      const now = performance.now()
      frameCount++

      // Update FPS every second
      if (now - lastFpsUpdate >= 1000) {
        const currentFps = Math.round(frameCount * 1000 / (now - lastFpsUpdate))
        setFps(currentFps)

        // Keep history for sparkline
        fpsHistory.push(currentFps)
        if (fpsHistory.length > 30) fpsHistory.shift()
        fpsHistoryRef.current = [...fpsHistory]

        frameCount = 0
        lastFpsUpdate = now
      }

      // Measure render time
      const renderStart = performance.now()
      requestAnimationFrame(() => {
        const renderEnd = performance.now()
        setRenderTime(Math.round((renderEnd - renderStart) * 100) / 100)
      })

      // Update memory usage if available
      if ('memory' in performance) {
        const memInfo = (performance as any).memory
        const usedMB = Math.round(memInfo.usedJSHeapSize / 1048576)
        setMemory(usedMB)
      }

      frameId = requestAnimationFrame(measureFPS)
    }

    frameId = requestAnimationFrame(measureFPS)

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [show])

  // Track operations per second
  useEffect(() => {
    const handleOperation = () => {
      setOperations(prev => prev + 1)
    }

    // Listen for custom events that indicate operations
    window.addEventListener('garden-operation', handleOperation)

    // Reset counter every second
    const interval = setInterval(() => {
      setOperations(0)
    }, 1000)

    return () => {
      window.removeEventListener('garden-operation', handleOperation)
      clearInterval(interval)
    }
  }, [])

  if (!show) return null

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-right': 'bottom-20 right-4'
  }

  const getFpsColor = (fps: number) => {
    if (fps >= 50) return 'text-green-500'
    if (fps >= 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getFpsBgColor = (fps: number) => {
    if (fps >= 50) return 'bg-green-500/10'
    if (fps >= 30) return 'bg-yellow-500/10'
    return 'bg-red-500/10'
  }

  return (
    <div
      className={cn(
        'fixed z-50 bg-black/90 backdrop-blur-md text-white rounded-lg p-3 shadow-2xl',
        'font-mono text-xs select-none pointer-events-none',
        'border border-white/10',
        positionClasses[position],
        className
      )}
      style={{ minWidth: '200px' }}
    >
      {/* FPS Display */}
      <div className={cn('flex items-center justify-between mb-2 pb-2 border-b border-white/10')}>
        <div className="flex items-center gap-2">
          <Activity className={cn('h-3 w-3', getFpsColor(fps))} />
          <span className="text-gray-400">FPS</span>
        </div>
        <div className={cn('text-lg font-bold', getFpsColor(fps))}>
          {fps}
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-8 mb-2">
        <svg width="100%" height="32" className="opacity-50">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            points={fpsHistoryRef.current
              .map((val, i) => `${(i / (fpsHistoryRef.current.length - 1)) * 176},${32 - (val / 60) * 30}`)
              .join(' ')}
            className={getFpsColor(fps)}
          />
        </svg>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        {/* Render Time */}
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-blue-400" />
          <span className="text-gray-500">Render</span>
          <span className="ml-auto text-blue-400">{renderTime}ms</span>
        </div>

        {/* Memory */}
        <div className="flex items-center gap-1">
          <HardDrive className="h-3 w-3 text-purple-400" />
          <span className="text-gray-500">Memory</span>
          <span className="ml-auto text-purple-400">{memory}MB</span>
        </div>

        {/* Operations */}
        <div className="flex items-center gap-1">
          <Gauge className="h-3 w-3 text-orange-400" />
          <span className="text-gray-500">Ops/s</span>
          <span className="ml-auto text-orange-400">{operations}</span>
        </div>

        {/* Performance Score */}
        <div className="flex items-center gap-1">
          <div className={cn('h-3 w-3 rounded-full', getFpsBgColor(fps))}>
            <div className={cn('h-full w-full rounded-full', fps >= 50 ? 'bg-green-500' : fps >= 30 ? 'bg-yellow-500' : 'bg-red-500')} />
          </div>
          <span className="text-gray-500">Score</span>
          <span className="ml-auto">{Math.round((fps / 60) * 100)}%</span>
        </div>
      </div>

      {/* Performance Tips */}
      {fps < 30 && (
        <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-yellow-400">
          ⚠️ Low performance detected
        </div>
      )}
    </div>
  )
}

// Hook for tracking performance
export function usePerformance() {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    renderTime: 0,
    loadTime: 0
  })

  useEffect(() => {
    // Track initial load time
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (perfData) {
        setMetrics(prev => ({
          ...prev,
          loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
        }))
      }
    }
  }, [])

  const trackOperation = () => {
    window.dispatchEvent(new CustomEvent('garden-operation'))
  }

  return { metrics, trackOperation }
}