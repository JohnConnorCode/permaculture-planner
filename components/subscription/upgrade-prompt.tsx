'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, Sparkles, Zap, Crown } from 'lucide-react'
import { PlanTier } from '@/lib/subscription/plans'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface UpgradePromptProps {
  feature: string
  description: string
  currentTier: PlanTier
  requiredTier: 'premium' | 'pro'
  className?: string
}

export function UpgradePrompt({
  feature,
  description,
  currentTier,
  requiredTier,
  className,
}: UpgradePromptProps) {
  const router = useRouter()

  const config = {
    premium: {
      icon: Sparkles,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    pro: {
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
    },
  }

  const { icon: Icon, color, bgColor, borderColor, badge } = config[requiredTier]

  return (
    <Card className={cn('border-2', borderColor, bgColor, className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn('flex items-center justify-center w-12 h-12 rounded-lg', bgColor)}>
              <Lock className={cn('h-6 w-6', color)} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {feature}
                <Badge variant="outline" className={badge}>
                  {requiredTier === 'premium' ? 'Premium' : 'Professional'}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-2">{description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className={cn('h-4 w-4', color)} />
          <span>
            Available with {requiredTier === 'premium' ? 'Premium' : 'Professional'} plan
          </span>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={() => router.push('/pricing')}
        >
          <Zap className="h-4 w-4 mr-2" />
          Upgrade to {requiredTier === 'premium' ? 'Premium' : 'Professional'}
        </Button>
      </CardContent>
    </Card>
  )
}

// Inline compact version for smaller spaces
export function UpgradePromptInline({
  feature,
  requiredTier,
  className,
}: {
  feature: string
  requiredTier: 'premium' | 'pro'
  className?: string
}) {
  const router = useRouter()

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-2 rounded-lg',
        requiredTier === 'premium'
          ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200'
          : 'bg-purple-50 dark:bg-purple-950/20 border-purple-200',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Lock
          className={cn(
            'h-5 w-5',
            requiredTier === 'premium' ? 'text-blue-600' : 'text-purple-600'
          )}
        />
        <div>
          <p className="text-sm font-medium">{feature}</p>
          <p className="text-xs text-muted-foreground">
            {requiredTier === 'premium' ? 'Premium' : 'Professional'} feature
          </p>
        </div>
      </div>
      <Button size="sm" onClick={() => router.push('/pricing')}>
        Upgrade
      </Button>
    </div>
  )
}

// Banner version for top of locked panels
export function UpgradeBanner({
  feature,
  requiredTier,
  className,
}: {
  feature: string
  requiredTier: 'premium' | 'pro'
  className?: string
}) {
  const router = useRouter()

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 border-b',
        requiredTier === 'premium'
          ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200'
          : 'bg-purple-50 dark:bg-purple-950/20 border-purple-200',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Lock
          className={cn(
            'h-4 w-4',
            requiredTier === 'premium' ? 'text-blue-600' : 'text-purple-600'
          )}
        />
        <span className="text-sm font-medium">
          {feature} is a {requiredTier === 'premium' ? 'Premium' : 'Professional'} feature
        </span>
      </div>
      <Button size="sm" variant="outline" onClick={() => router.push('/pricing')}>
        <Sparkles className="h-3 w-3 mr-1" />
        Upgrade
      </Button>
    </div>
  )
}
