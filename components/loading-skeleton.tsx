'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'button' | 'text' | 'avatar'
  animate?: boolean
}

export function Skeleton({ className, variant = 'default', animate = true }: SkeletonProps) {
  const variantClasses = {
    default: 'h-4 w-full',
    card: 'h-32 w-full',
    button: 'h-10 w-24',
    text: 'h-3 w-3/4',
    avatar: 'h-10 w-10 rounded-full'
  }

  return (
    <div
      className={cn(
        'bg-gray-200 rounded-md',
        animate && 'animate-shimmer',
        variantClasses[variant],
        className
      )}
      style={{
        background: animate
          ? 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%, #f0f0f0 100%)'
          : undefined,
        backgroundSize: animate ? '200% 100%' : undefined
      }}
    />
  )
}

export function CanvasSkeleton() {
  return (
    <div className="w-full h-full bg-gray-50 relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slow" />

      {/* Mock grid */}
      <svg className="w-full h-full">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e5e5" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Mock beds */}
      <div className="absolute top-20 left-20">
        <div className="w-32 h-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="absolute top-20 right-40">
        <div className="w-40 h-32 bg-gray-200 rounded animate-pulse animation-delay-200" />
      </div>
      <div className="absolute bottom-32 left-32">
        <div className="w-36 h-36 bg-gray-200 rounded-full animate-pulse animation-delay-400" />
      </div>

      {/* Loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-gray-300 rounded-full animate-pulse" />
            <div className="absolute top-0 left-0 h-16 w-16 border-4 border-green-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-500 animate-pulse">Loading garden designer...</p>
        </div>
      </div>
    </div>
  )
}

export function PlantLibrarySkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <Skeleton variant="avatar" className="shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2 opacity-60" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ToolbarSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} variant="button" className="w-full" />
      ))}
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="flex gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-6 w-20 rounded-full" />
      ))}
    </div>
  )
}

// Premium loading overlay
export function LoadingOverlay({
  message = 'Loading...',
  progress,
  className
}: {
  message?: string
  progress?: number
  className?: string
}) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
      className
    )}>
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="space-y-6">
          {/* Animated icon */}
          <div className="relative h-24 w-24 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-2 border-4 border-gray-200 rounded-full" />
            <div className="absolute inset-2 border-4 border-green-400 rounded-full border-t-transparent animate-spin-slow" />
            <div className="absolute inset-4 border-4 border-gray-200 rounded-full" />
            <div className="absolute inset-4 border-4 border-green-300 rounded-full border-t-transparent animate-spin-reverse" />
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-gray-900 font-medium">{message}</p>
            {progress !== undefined && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
              </div>
            )}
          </div>

          {/* Animated dots */}
          <div className="flex justify-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Add custom animations to global CSS
export const skeletonStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes shimmer-slow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }

  .animate-shimmer {
    animation: shimmer 1.5s ease-in-out infinite;
  }

  .animate-shimmer-slow {
    animation: shimmer-slow 3s ease-in-out infinite;
  }

  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }

  .animate-spin-reverse {
    animation: spin-reverse 2s linear infinite;
  }

  .animation-delay-200 {
    animation-delay: 200ms;
  }

  .animation-delay-400 {
    animation-delay: 400ms;
  }
`