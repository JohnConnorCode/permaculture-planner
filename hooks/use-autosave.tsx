'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Check, Cloud, CloudOff, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AutosaveOptions {
  key: string
  interval?: number // in milliseconds
  debounce?: number // in milliseconds
  onSave?: (data: any) => Promise<void>
  onSuccess?: () => void
  onError?: (error: Error) => void
  enabled?: boolean
}

interface AutosaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: Date | null
  message?: string
}

export function useAutosave<T>(
  data: T,
  options: AutosaveOptions
) {
  const {
    key,
    interval = 30000, // 30 seconds default
    debounce = 2000, // 2 seconds default
    onSave,
    onSuccess,
    onError,
    enabled = true
  } = options

  const [status, setStatus] = useState<AutosaveStatus>({
    status: 'idle',
    lastSaved: null
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataRef = useRef<T>(data)
  const isFirstRender = useRef(true)

  const save = useCallback(async () => {
    if (!enabled) return

    setStatus(prev => ({ ...prev, status: 'saving' }))

    try {
      if (onSave) {
        await onSave(data)
      } else {
        // Default to localStorage
        localStorage.setItem(key, JSON.stringify(data))
      }

      const now = new Date()
      setStatus({
        status: 'saved',
        lastSaved: now,
        message: `Saved at ${now.toLocaleTimeString()}`
      })

      onSuccess?.()

      // Reset to idle after showing saved status
      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          status: 'idle'
        }))
      }, 3000)
    } catch (error) {
      setStatus({
        status: 'error',
        lastSaved: status.lastSaved,
        message: error instanceof Error ? error.message : 'Save failed'
      })

      onError?.(error as Error)
    }
  }, [data, enabled, key, onSave, onSuccess, onError, status.lastSaved])

  // Debounced save on data change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Check if data actually changed
    const hasChanged = JSON.stringify(data) !== JSON.stringify(lastDataRef.current)
    if (!hasChanged) return

    lastDataRef.current = data

    // Set new debounced save
    timeoutRef.current = setTimeout(() => {
      save()
    }, debounce)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, debounce, enabled, save])

  // Periodic autosave
  useEffect(() => {
    if (!enabled || !interval) return

    intervalRef.current = setInterval(() => {
      save()
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval, save])

  // Save on page unload
  useEffect(() => {
    if (!enabled) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status.status === 'saving' || JSON.stringify(data) !== JSON.stringify(lastDataRef.current)) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        save()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [data, enabled, save, status.status])

  const manualSave = useCallback(() => {
    save()
  }, [save])

  return {
    ...status,
    save: manualSave
  }
}

// Visual indicator component
interface AutosaveIndicatorProps {
  status: AutosaveStatus['status']
  lastSaved: Date | null
  className?: string
  showTime?: boolean
}

export function AutosaveIndicator({
  status,
  lastSaved,
  className,
  showTime = true
}: AutosaveIndicatorProps) {
  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'saved':
        return <Check className="h-4 w-4" />
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Cloud className="h-4 w-4" />
    }
  }

  const getColor = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'saved':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getMessage = () => {
    switch (status) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return showTime && lastSaved
          ? `Saved ${getRelativeTime(lastSaved)}`
          : 'Saved'
      case 'error':
        return 'Save failed'
      default:
        return lastSaved && showTime
          ? `Last saved ${getRelativeTime(lastSaved)}`
          : 'Not saved'
    }
  }

  const getRelativeTime = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 5) return 'just now'
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
        'border transition-all duration-300',
        getColor(),
        status === 'saving' && 'animate-pulse',
        status === 'saved' && 'animate-fade-in',
        className
      )}
    >
      {getIcon()}
      <span>{getMessage()}</span>
    </div>
  )
}

// Floating autosave indicator
export function FloatingAutosaveIndicator({
  status,
  lastSaved,
  position = 'bottom-left'
}: AutosaveIndicatorProps & { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-right': 'bottom-20 right-4'
  }

  return (
    <div className={cn('fixed z-40', positionClasses[position])}>
      <AutosaveIndicator
        status={status}
        lastSaved={lastSaved}
        className="shadow-lg"
      />
    </div>
  )
}