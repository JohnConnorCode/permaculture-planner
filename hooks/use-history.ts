import { useState, useCallback } from 'react'

interface UseHistoryOptions<T> {
  maxHistory?: number
}

export function useHistory<T>(
  initialState: T,
  options: UseHistoryOptions<T> = {}
) {
  const { maxHistory = 50 } = options
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setHistory(prev => {
      const actualNewState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(prev[currentIndex])
        : newState

      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1)

      // Add new state
      newHistory.push(actualNewState)

      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift()
      }

      return newHistory
    })

    // Update index separately to avoid dependency issues
    setCurrentIndex(prev => {
      const newLength = Math.min(prev + 2, maxHistory)
      return newLength > maxHistory ? maxHistory - 1 : newLength - 1
    })
  }, [currentIndex, maxHistory])

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, history.length])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1
  const current = history[currentIndex]

  const reset = useCallback(() => {
    setHistory([initialState])
    setCurrentIndex(0)
  }, [initialState])

  return {
    state: current,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historyLength: history.length,
    currentIndex
  }
}