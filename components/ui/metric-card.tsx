import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  icon: LucideIcon
  iconColor?: string
  valueColor?: string
  progress?: number
  trend?: 'up' | 'down' | 'stable'
  className?: string
}

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  iconColor = 'text-gray-500',
  valueColor = 'text-gray-900',
  progress,
  trend,
  className
}: MetricCardProps) {
  return (
    <Card className={cn("border-0 shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">{label}</span>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        <div className={cn("text-2xl font-bold", valueColor)}>
          {value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}
        </div>
        {trend && (
          <div className="text-xs text-gray-500 mt-1">
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trend === 'stable' && '→'}
          </div>
        )}
        {progress !== undefined && (
          <Progress value={progress} className="mt-2 h-1.5" />
        )}
      </CardContent>
    </Card>
  )
}