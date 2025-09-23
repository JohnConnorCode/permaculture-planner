import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { Loader2, Leaf, Sprout, TreePine, Flower2 } from 'lucide-react'

export function LoadingSpinner({
  size = 'default',
  message,
  variant = 'spinner'
}: {
  size?: 'small' | 'default' | 'large'
  message?: string
  variant?: 'spinner' | 'nature'
}) {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  if (variant === 'nature') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="relative">
          <Leaf className={`${sizeClasses[size]} text-green-600 animate-sway`} />
          <Sprout className={`${sizeClasses[size]} text-green-500 absolute top-0 left-0 animate-grow opacity-50`} />
          <div className="absolute -inset-4 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full animate-pulse" />
        </div>
        {message && (
          <p className="text-sm text-gray-600 animate-fade-in">
            🌱 {message}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-green-600`} />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white nature-pattern">
      <LoadingSpinner size="large" variant="nature" message="Growing your garden..." />
    </div>
  )
}

export function LoadingCard() {
  return (
    <Card className="p-6 card-nature border-organic">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full bg-green-100" />
          <Skeleton className="h-6 w-1/3 bg-green-50" />
        </div>
        <Skeleton className="h-4 w-full bg-gradient-to-r from-green-50 to-transparent" />
        <Skeleton className="h-4 w-5/6 bg-gradient-to-r from-green-50 to-transparent" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 border-organic bg-green-50" />
          <Skeleton className="h-10 w-24 border-organic bg-green-50" />
        </div>
      </div>
    </Card>
  )
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-t-lg">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b">
          {[...Array(4)].map((_, j) => (
            <Skeleton key={j} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function LoadingDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
      <LoadingTable />
    </div>
  )
}

export function LoadingEditor() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="h-14 border-b bg-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex items-center space-x-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Toolbar */}
        <div className="w-16 border-r bg-white p-2">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center nature-pattern">
          <LoadingSpinner size="large" variant="nature" message="Preparing your garden canvas..." />
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-white p-4">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Lazy loading wrapper with suspense
export function LazyLoad({
  children,
  fallback = <LoadingSpinner />
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  )
}