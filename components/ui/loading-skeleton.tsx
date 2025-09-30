/**
 * Loading Skeleton Components
 * Provides consistent loading states across the application
 */

import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  animation?: 'pulse' | 'wave' | 'none'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height,
  ...props
}: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    rounded: 'rounded-lg',
  }

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  return (
    <div
      className={cn(
        'bg-gray-200',
        variants[variant],
        animations[animation],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <Skeleton variant="rectangular" height={120} className="w-full" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  )
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton variant="text" className="w-full" />
        </td>
      ))}
    </tr>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
  )
}

export function GardenBedSkeleton() {
  return (
    <div className="relative rounded-lg border-2 border-dashed border-gray-300 p-4">
      <Skeleton variant="rectangular" height={200} className="w-full" />
      <div className="absolute top-2 left-2">
        <Skeleton variant="text" width={80} />
      </div>
    </div>
  )
}

export function PlantCardSkeleton() {
  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={60} />
      </div>
      <Skeleton variant="text" className="w-full" />
      <div className="flex gap-2">
        <Skeleton variant="rounded" width={50} height={20} />
        <Skeleton variant="rounded" width={50} height={20} />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Chart Area */}
      <div className="rounded-lg border p-6">
        <Skeleton variant="text" width={200} height={24} className="mb-4" />
        <Skeleton variant="rectangular" height={300} className="w-full" />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <div className="p-4 border-b">
          <Skeleton variant="text" width={150} height={20} />
        </div>
        <table className="w-full">
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} columns={5} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width={100} height={16} />
          <Skeleton variant="rectangular" height={40} className="w-full" />
        </div>
      ))}
      <Skeleton variant="rectangular" width={120} height={40} className="mt-6" />
    </div>
  )
}