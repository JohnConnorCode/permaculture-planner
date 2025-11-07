'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Check, Sparkles, Crown, Zap } from 'lucide-react'
import { PLANS, PlanTier } from '@/lib/subscription/plans'
import { useSubscription } from '@/lib/subscription/subscription-context'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annually'>('monthly')
  const { subscription, updateSubscription } = useSubscription()

  const handleSelectPlan = (tier: PlanTier) => {
    if (tier === subscription.planTier) {
      toast.info('You are already on this plan')
      return
    }

    if (tier === 'free') {
      // Downgrade flow
      if (
        confirm(
          'Are you sure you want to downgrade to the Free plan? You will lose access to premium features.'
        )
      ) {
        updateSubscription(tier)
        toast.success('Successfully downgraded to Free plan')
      }
      return
    }

    // In a real app, this would redirect to Stripe/payment processor
    // For now, we'll simulate the upgrade
    updateSubscription(tier)
    toast.success(`Successfully upgraded to ${PLANS[tier].name} plan!`)
  }

  const getPlanIcon = (tier: PlanTier) => {
    switch (tier) {
      case 'free':
        return Zap
      case 'premium':
        return Sparkles
      case 'pro':
        return Crown
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choose Your Permaculture Journey
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free and upgrade as your garden grows. All plans include our core design tools.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <Label htmlFor="billing" className={cn(!billingInterval ? 'font-semibold' : '')}>
            Monthly
          </Label>
          <Switch
            id="billing"
            checked={billingInterval === 'annually'}
            onCheckedChange={(checked) => setBillingInterval(checked ? 'annually' : 'monthly')}
          />
          <Label htmlFor="billing" className={cn(billingInterval ? 'font-semibold' : '')}>
            Annually
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </Label>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {(Object.keys(PLANS) as PlanTier[]).map((tier) => {
          const plan = PLANS[tier]
          const Icon = getPlanIcon(tier)
          const isCurrentPlan = subscription.planTier === tier
          const price =
            billingInterval === 'monthly' ? plan.price.monthly : plan.price.annually / 12

          return (
            <Card
              key={tier}
              className={cn(
                'relative',
                plan.highlighted && 'border-primary border-2 shadow-lg',
                isCurrentPlan && 'ring-2 ring-primary'
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-lg',
                      tier === 'free' && 'bg-gray-100 dark:bg-gray-800',
                      tier === 'premium' && 'bg-blue-100 dark:bg-blue-950/20',
                      tier === 'pro' && 'bg-purple-100 dark:bg-purple-950/20'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6',
                        tier === 'free' && 'text-gray-600',
                        tier === 'premium' && 'text-blue-600',
                        tier === 'pro' && 'text-purple-600'
                      )}
                    />
                  </div>
                  {isCurrentPlan && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                      Current Plan
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>

                <div className="mt-4">
                  {tier === 'free' ? (
                    <div className="text-4xl font-bold">Free</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold">
                        ${price}
                        <span className="text-lg font-normal text-muted-foreground">/mo</span>
                      </div>
                      {billingInterval === 'annually' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          ${plan.price.annually} billed annually
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleSelectPlan(tier)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Plan' : tier === 'free' ? 'Start Free' : 'Upgrade Now'}
                </Button>

                <div className="space-y-3">
                  <p className="text-sm font-semibold">Features:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ section */}
      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
            <p className="text-muted-foreground">
              Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you'll be
              charged the prorated difference. If you downgrade, the change takes effect at the end
              of your current billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What happens to my data if I downgrade?</h3>
            <p className="text-muted-foreground">
              Your data is never deleted. If you exceed the limits of a lower tier (e.g., more than
              1 plan on Free), you'll have read-only access to extra plans until you upgrade again
              or delete some plans.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is there a free trial for paid plans?</h3>
            <p className="text-muted-foreground">
              Yes! All paid plans come with a 14-day free trial. No credit card required to start.
              Cancel anytime during the trial period with no charges.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you offer educational discounts?</h3>
            <p className="text-muted-foreground">
              Yes! We offer 50% off for students, teachers, and non-profit organizations. Contact
              us with proof of eligibility to receive your discount code.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
