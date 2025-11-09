'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  PenTool,
  Leaf,
  BookOpen,
  Play,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WelcomeScreenProps {
  open: boolean
  onClose: () => void
  onStartFromScratch: () => void
  onUseTemplate: () => void
  onShowTutorial: () => void
}

const QUICK_TEMPLATES = [
  {
    id: 'keyhole-garden',
    name: 'Keyhole Garden',
    icon: '🔑',
    description: 'Perfect for small spaces',
    difficulty: 'Beginner',
  },
  {
    id: 'three-sisters',
    name: 'Three Sisters',
    icon: '🌽',
    description: 'Traditional companion planting',
    difficulty: 'Beginner',
  },
  {
    id: 'small-urban',
    name: 'Small Urban Garden',
    icon: '🏡',
    description: 'Maximum productivity, minimal space',
    difficulty: 'Beginner',
  },
]

export function WelcomeScreen({
  open,
  onClose,
  onStartFromScratch,
  onUseTemplate,
  onShowTutorial,
}: WelcomeScreenProps) {
  const [step, setStep] = useState<'welcome' | 'quick-start'>('welcome')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === 'welcome' ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">Welcome to Permaculture Planner!</DialogTitle>
                  <DialogDescription>
                    Design beautiful, productive gardens using permaculture principles
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Quick Start Options */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card
                  className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                  onClick={onUseTemplate}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Use a Template</CardTitle>
                        <CardDescription>Start with a proven design</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Choose from 8+ professional permaculture designs optimized for different
                        spaces, climates, and goals.
                      </p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Recommended for beginners
                      </Badge>
                      <div className="flex gap-2 pt-2">
                        {QUICK_TEMPLATES.map((t) => (
                          <div
                            key={t.id}
                            className="text-2xl"
                            title={t.name}
                          >
                            {t.icon}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                  onClick={onStartFromScratch}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <PenTool className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Start from Scratch</CardTitle>
                        <CardDescription>Design your own layout</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Create a custom design from the ground up. Drag plants and elements onto
                        your canvas to build your perfect garden.
                      </p>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Full creative control</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>30+ plants & 27 elements</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Features Highlight */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
                <CardHeader>
                  <CardTitle className="text-base">What You Can Do</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        Design
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Drag & drop plants, beds, water features, and structures
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                        Analyze
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Get AI-powered companion planting, zone planning, and timing analysis
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        Learn
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Access permaculture knowledge base and design principles
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tutorial Option */}
              <Button
                variant="outline"
                className="w-full"
                onClick={onShowTutorial}
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Quick Tutorial (2 min)
              </Button>

              {/* Skip */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-muted-foreground"
                >
                  Skip for now
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
