'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FeedbackType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface FeedbackMessage {
  id: string
  type: FeedbackType
  message: string
  duration?: number
}

// Global feedback store
class FeedbackStore {
  private listeners: Set<(messages: FeedbackMessage[]) => void> = new Set()
  private messages: FeedbackMessage[] = []

  subscribe(listener: (messages: FeedbackMessage[]) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.messages))
  }

  show(type: FeedbackType, message: string, duration = 3000) {
    const id = `feedback-${Date.now()}-${Math.random()}`
    const feedbackMessage: FeedbackMessage = { id, type, message, duration }

    this.messages = [...this.messages, feedbackMessage]
    this.notify()

    if (duration > 0 && type !== 'loading') {
      setTimeout(() => this.dismiss(id), duration)
    }

    return id
  }

  dismiss(id: string) {
    this.messages = this.messages.filter(m => m.id !== id)
    this.notify()
  }

  clear() {
    this.messages = []
    this.notify()
  }
}

// Singleton instance
export const feedbackStore = new FeedbackStore()

// Helper functions for easy usage
export const showSuccess = (message: string, duration?: number) =>
  feedbackStore.show('success', message, duration)

export const showError = (message: string, duration?: number) =>
  feedbackStore.show('error', message, duration)

export const showWarning = (message: string, duration?: number) =>
  feedbackStore.show('warning', message, duration)

export const showInfo = (message: string, duration?: number) =>
  feedbackStore.show('info', message, duration)

export const showLoading = (message: string) =>
  feedbackStore.show('loading', message, 0)

// Feedback component
export function ActionFeedback() {
  const [messages, setMessages] = useState<FeedbackMessage[]>([])

  useEffect(() => {
    const unsubscribe = feedbackStore.subscribe(setMessages)
    return unsubscribe
  }, [])

  if (messages.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {messages.map((message) => (
        <FeedbackItem
          key={message.id}
          message={message}
          onDismiss={() => feedbackStore.dismiss(message.id)}
        />
      ))}
    </div>
  )
}

interface FeedbackItemProps {
  message: FeedbackMessage
  onDismiss: () => void
}

function FeedbackItem({ message, onDismiss }: FeedbackItemProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
    loading: Loader2
  }

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    loading: 'bg-gray-50 text-gray-800 border-gray-200'
  }

  const Icon = icons[message.type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-sm',
        'animate-in slide-in-from-right fade-in duration-300',
        styles[message.type]
      )}
    >
      <Icon
        className={cn(
          'h-5 w-5 flex-shrink-0 mt-0.5',
          message.type === 'loading' && 'animate-spin'
        )}
      />
      <div className="flex-1 text-sm font-medium">
        {message.message}
      </div>
      {message.type !== 'loading' && (
        <button
          onClick={onDismiss}
          className="ml-2 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Hook for programmatic feedback
export function useFeedback() {
  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    dismiss: (id: string) => feedbackStore.dismiss(id),
    clear: () => feedbackStore.clear()
  }
}