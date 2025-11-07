'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { PlanTier, PLANS, PlanLimits } from './plans'

interface SubscriptionState {
  planTier: PlanTier
  isActive: boolean
  renewalDate?: Date
  canceledAt?: Date
}

interface SubscriptionContextType {
  subscription: SubscriptionState
  limits: PlanLimits
  updateSubscription: (tier: PlanTier) => void
  isFeatureAvailable: (feature: keyof PlanLimits) => boolean
  isPanelAvailable: (panelId: string) => boolean
  getUpgradeUrl: () => string
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  // In a real app, this would come from your backend/auth system
  const [subscription, setSubscription] = useState<SubscriptionState>({
    planTier: 'free',
    isActive: true,
  })

  // Load subscription from localStorage (temporary - replace with API call)
  useEffect(() => {
    const stored = localStorage.getItem('subscription')
    if (stored) {
      try {
        setSubscription(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse subscription:', e)
      }
    }
  }, [])

  const updateSubscription = (tier: PlanTier) => {
    const updated = {
      planTier: tier,
      isActive: true,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }
    setSubscription(updated)
    localStorage.setItem('subscription', JSON.stringify(updated))
  }

  const isFeatureAvailable = (feature: keyof PlanLimits): boolean => {
    const limits = PLANS[subscription.planTier].limits
    return limits[feature] as boolean
  }

  const isPanelAvailable = (panelId: string): boolean => {
    const limits = PLANS[subscription.planTier].limits
    return limits.availablePanels.includes(panelId)
  }

  const getUpgradeUrl = (): string => {
    return '/pricing'
  }

  const value: SubscriptionContextType = {
    subscription,
    limits: PLANS[subscription.planTier].limits,
    updateSubscription,
    isFeatureAvailable,
    isPanelAvailable,
    getUpgradeUrl,
  }

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

// Convenience hook for checking feature access
export function useFeatureAccess(feature: keyof PlanLimits): {
  hasAccess: boolean
  upgradeUrl: string
  planTier: PlanTier
} {
  const { subscription, isFeatureAvailable, getUpgradeUrl } = useSubscription()
  return {
    hasAccess: isFeatureAvailable(feature),
    upgradeUrl: getUpgradeUrl(),
    planTier: subscription.planTier,
  }
}

// Hook for checking panel access
export function usePanelAccess(panelId: string): {
  hasAccess: boolean
  upgradeUrl: string
  planTier: PlanTier
} {
  const { subscription, isPanelAvailable, getUpgradeUrl } = useSubscription()
  return {
    hasAccess: isPanelAvailable(panelId),
    upgradeUrl: getUpgradeUrl(),
    planTier: subscription.planTier,
  }
}
