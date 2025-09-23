import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  color?: string
  bgColor?: string
  stat?: string
  progress?: number
  className?: string
  delay?: string
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  color = 'text-green-500',
  bgColor = 'bg-green-50',
  stat,
  progress,
  className,
  delay = '0ms'
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "hover-lift border-0 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in",
        className
      )}
      style={{ animationDelay: delay, animationFillMode: 'forwards', opacity: 0 }}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className={cn("p-3 rounded-lg", bgColor)}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
          {stat && <Badge variant="secondary">{stat}</Badge>}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        {progress !== undefined && (
          <Progress value={progress} className="h-2" />
        )}
      </CardContent>
    </Card>
  )
}