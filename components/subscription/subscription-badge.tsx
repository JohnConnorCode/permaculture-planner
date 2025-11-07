'use client'

import React from 'react'
import { useSubscription } from '@/lib/subscription/subscription-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Crown, Sparkles, Zap, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PLANS } from '@/lib/subscription/plans'
import { cn } from '@/lib/utils'

export function SubscriptionBadge() {
  const { subscription, updateSubscription } = useSubscription()
  const router = useRouter()
  const currentPlan = PLANS[subscription.planTier]

  const Icon = {
    free: Zap,
    premium: Sparkles,
    pro: Crown,
  }[subscription.planTier]

  const colors = {
    free: 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200',
    premium: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
    pro: 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200',
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('gap-2', colors[subscription.planTier])}
        >
          <Icon className="h-3 w-3" />
          <span className="font-semibold">{currentPlan.name}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {currentPlan.name} Plan
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {subscription.planTier !== 'pro' && (
          <>
            <DropdownMenuItem onClick={() => router.push('/pricing')} className="cursor-pointer">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Upgrade Plan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={() => router.push('/pricing')} className="cursor-pointer">
          View All Plans
        </DropdownMenuItem>

        {/* Development: Quick tier switching */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Dev: Quick Switch
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => updateSubscription('free')} className="text-xs">
              Switch to Free
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateSubscription('premium')} className="text-xs">
              Switch to Premium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateSubscription('pro')} className="text-xs">
              Switch to Pro
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
