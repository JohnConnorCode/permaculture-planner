'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  X, CheckCircle, AlertCircle, Info, AlertTriangle,
  Loader2, Bell, BellOff, Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'loading'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number // in milliseconds, 0 for persistent
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  icon?: React.ComponentType<any>
  timestamp: Date
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      dismissible: notification.dismissible ?? true,
      duration: notification.duration ?? 5000
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()
  const [muted, setMuted] = useState(false)

  const getIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon

    switch (notification.type) {
      case 'success': return CheckCircle
      case 'error': return AlertCircle
      case 'warning': return AlertTriangle
      case 'info': return Info
      case 'loading': return Loader2
    }
  }

  const getColor = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'loading': return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <>
      {/* Notification Stack */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <AnimatePresence mode="sync">
          {notifications.slice(-5).map((notification) => {
            const Icon = getIcon(notification)

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="pointer-events-auto mb-3"
              >
                <div
                  className={cn(
                    'min-w-[320px] max-w-[420px] rounded-lg shadow-2xl border p-4',
                    'backdrop-blur-md bg-white/95',
                    'transform transition-all duration-300 hover:scale-[1.02]'
                  )}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={cn('shrink-0 mt-0.5', getColor(notification.type))}>
                      <Icon className={cn(
                        'h-5 w-5',
                        notification.type === 'loading' && 'animate-spin'
                      )} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      )}
                      {notification.action && (
                        <button
                          onClick={notification.action.onClick}
                          className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          {notification.action.label} →
                        </button>
                      )}
                    </div>

                    {/* Dismiss */}
                    {notification.dismissible && (
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Progress bar for timed notifications */}
                  {notification.duration && notification.duration > 0 && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600"
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: notification.duration / 1000, ease: 'linear' }}
                    />
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Notification Center Button */}
      <button
        onClick={() => setMuted(!muted)}
        className={cn(
          'fixed bottom-4 right-4 z-40 p-3 rounded-full shadow-lg',
          'bg-white border border-gray-200 hover:bg-gray-50 transition-all',
          notifications.length > 0 && 'animate-bounce'
        )}
      >
        {muted ? (
          <BellOff className="h-5 w-5 text-gray-400" />
        ) : (
          <Bell className="h-5 w-5 text-gray-600" />
        )}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
    </>
  )
}

// Quick notification functions
export const notify = {
  success: (title: string, message?: string) => {
    const { addNotification } = useNotifications()
    return addNotification({ type: 'success', title, message })
  },
  error: (title: string, message?: string) => {
    const { addNotification } = useNotifications()
    return addNotification({ type: 'error', title, message })
  },
  info: (title: string, message?: string) => {
    const { addNotification } = useNotifications()
    return addNotification({ type: 'info', title, message })
  },
  warning: (title: string, message?: string) => {
    const { addNotification } = useNotifications()
    return addNotification({ type: 'warning', title, message })
  },
  loading: (title: string, message?: string) => {
    const { addNotification } = useNotifications()
    return addNotification({ type: 'loading', title, message, duration: 0 })
  },
  promise: async <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((err: any) => string)
    }
  ) => {
    const { addNotification, removeNotification } = useNotifications()

    const loadingId = addNotification({
      type: 'loading',
      title: loading,
      duration: 0
    })

    try {
      const result = await promise
      removeNotification(loadingId)
      addNotification({
        type: 'success',
        title: typeof success === 'function' ? success(result) : success
      })
      return result
    } catch (err) {
      removeNotification(loadingId)
      addNotification({
        type: 'error',
        title: typeof error === 'function' ? error(err) : error
      })
      throw err
    }
  }
}

// Achievement notification
export function AchievementNotification({
  title,
  description,
  icon = Sparkles
}: {
  title: string
  description: string
  icon?: React.ComponentType<any>
}) {
  const Icon = icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-2xl p-6 min-w-[300px]">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}