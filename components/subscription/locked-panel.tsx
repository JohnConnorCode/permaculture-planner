'use client'

import React from 'react'
import { usePanelAccess } from '@/lib/subscription/subscription-context'
import { UpgradePrompt } from './upgrade-prompt'
import { PlanTier } from '@/lib/subscription/plans'

interface LockedPanelProps {
  panelId: string
  featureName: string
  featureDescription: string
  requiredTier: 'premium' | 'pro'
  children: React.ReactNode
  showPreview?: boolean
}

export function LockedPanel({
  panelId,
  featureName,
  featureDescription,
  requiredTier,
  children,
  showPreview = false,
}: LockedPanelProps) {
  const { hasAccess, planTier } = usePanelAccess(panelId)

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <UpgradePrompt
          feature={featureName}
          description={featureDescription}
          currentTier={planTier}
          requiredTier={requiredTier}
        />

        {showPreview && (
          <div className="mt-6 relative">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-semibold">Preview Mode</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to unlock full functionality
                </p>
              </div>
            </div>
            <div className="pointer-events-none opacity-50">{children}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Inline feature gate for smaller UI elements
export function FeatureGate({
  feature,
  requiredTier,
  children,
  fallback,
}: {
  feature: string
  requiredTier: PlanTier
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { hasAccess } = usePanelAccess(feature)

  if (hasAccess) {
    return <>{children}</>
  }

  return <>{fallback || null}</>
}
