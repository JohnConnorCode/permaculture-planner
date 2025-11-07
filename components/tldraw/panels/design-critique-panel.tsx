/**
 * Design Critique Panel - AI-powered design review and recommendations
 *
 * KILLER FEATURE: Like having a permaculture expert review your design
 * Provides actionable feedback, catches mistakes, suggests improvements
 *
 * Features:
 * - Overall design score
 * - Critical issues, warnings, suggestions
 * - Design strengths
 * - Quick wins (easy improvements)
 * - Long-term improvements
 * - Categorized by concern area
 */

'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Award,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { analyzeDesign, getSeverityColor, getCategoryIcon } from '@/lib/analysis/design-critique'
import { cn } from '@/lib/utils'

interface DesignCritiquePanelProps {
  gardenBeds: GardenBed[]
}

/**
 * Design Critique Panel
 */
export function DesignCritiquePanel({ gardenBeds }: DesignCritiquePanelProps) {
  const critique = useMemo(() => analyzeDesign(gardenBeds), [gardenBeds])

  const hasElements = gardenBeds.length > 0
  const criticalIssues = critique.issues.filter((i) => i.severity === 'critical')
  const warnings = critique.issues.filter((i) => i.severity === 'warning')
  const suggestions = critique.issues.filter((i) => i.severity === 'suggestion')

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            Design Critique
          </h2>
          <Badge
            variant="outline"
            className={cn(
              'font-mono text-xs',
              critique.overallScore >= 80 && 'bg-green-100 text-green-800',
              critique.overallScore >= 60 &&
                critique.overallScore < 80 &&
                'bg-yellow-100 text-yellow-800',
              critique.overallScore < 60 && 'bg-red-100 text-red-800'
            )}
          >
            {critique.overallScore}/100
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Professional analysis of your permaculture design
        </p>
      </div>

      {!hasElements && (
        <div className="p-4">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6 text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-2">No design to critique</p>
              <p className="text-xs text-muted-foreground">
                Add beds and plants to get professional design feedback
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {hasElements && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Overall Score */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                  <Award className="h-5 w-5" />
                  Overall Design Score
                </CardTitle>
                <CardDescription className="text-indigo-700 dark:text-indigo-300 text-xs">
                  Based on permaculture principles and best practices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-700 dark:text-indigo-300">Score</span>
                  <Badge variant="secondary" className="font-mono text-2xl px-4 py-2">
                    {critique.overallScore}
                  </Badge>
                </div>
                <Progress value={critique.overallScore} className="h-4" />
                <div className="text-xs text-indigo-600 dark:text-indigo-400">
                  {critique.overallScore >= 90 && '🌟 Exceptional design!'}
                  {critique.overallScore >= 80 &&
                    critique.overallScore < 90 &&
                    '✨ Excellent design with minor improvements possible'}
                  {critique.overallScore >= 70 &&
                    critique.overallScore < 80 &&
                    '👍 Solid design, some optimization opportunities'}
                  {critique.overallScore >= 60 &&
                    critique.overallScore < 70 &&
                    '⚠️ Good foundation, needs refinement'}
                  {critique.overallScore < 60 &&
                    '🔧 Needs significant improvements for success'}
                </div>
              </CardContent>
            </Card>

            {/* Issue Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Issue Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                    <AlertCircle className="h-5 w-5 mx-auto mb-1 text-red-600" />
                    <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {criticalIssues.length}
                    </div>
                    <div className="text-[10px] text-red-600">Critical</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                    <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                      {warnings.length}
                    </div>
                    <div className="text-[10px] text-amber-600">Warnings</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                    <Info className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {suggestions.length}
                    </div>
                    <div className="text-[10px] text-blue-600">Suggestions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Issues */}
            {criticalIssues.length > 0 && (
              <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-red-900 dark:text-red-100">
                    <AlertCircle className="h-4 w-4" />
                    Critical Issues ({criticalIssues.length})
                  </CardTitle>
                  <CardDescription className="text-red-700 dark:text-red-300 text-xs">
                    Address these first - they may prevent success
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {criticalIssues.map((issue, idx) => (
                    <IssueCard key={idx} issue={issue} />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-amber-900 dark:text-amber-100">
                    <AlertTriangle className="h-4 w-4" />
                    Warnings ({warnings.length})
                  </CardTitle>
                  <CardDescription className="text-amber-700 dark:text-amber-300 text-xs">
                    Important improvements for better results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {warnings.map((issue, idx) => (
                    <IssueCard key={idx} issue={issue} />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Info className="h-4 w-4" />
                    Suggestions ({suggestions.length})
                  </CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300 text-xs">
                    Optimization opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions.map((issue, idx) => (
                    <IssueCard key={idx} issue={issue} />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Strengths */}
            {critique.strengths.length > 0 && (
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-green-900 dark:text-green-100">
                    <CheckCircle2 className="h-4 w-4" />
                    Design Strengths
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300 text-xs">
                    What you're doing well
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {critique.strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-green-900 dark:text-green-100">{strength}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Wins */}
            {critique.quickWins.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-600" />
                    Quick Wins
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Easy improvements you can make today
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {critique.quickWins.map((win, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 border rounded text-xs">
                      <Zap className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{win}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Long-term Improvements */}
            {critique.longTermImprovements.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    Long-term Improvements
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Strategic enhancements over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {critique.longTermImprovements.map((improvement, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 border rounded text-xs">
                      <TrendingUp className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{improvement}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Perfect Design Message */}
            {critique.issues.length === 0 && (
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200">
                <CardContent className="pt-6 text-center">
                  <Award className="h-16 w-16 mx-auto mb-4 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    Excellent Design!
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                    No critical issues detected. Your design follows permaculture principles well.
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    Continue refining based on on-site observations and results.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

// Helper Components

interface IssueCardProps {
  issue: {
    severity: 'critical' | 'warning' | 'suggestion'
    category: string
    title: string
    description: string
    recommendation: string
  }
}

function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="p-3 border rounded-lg bg-white dark:bg-gray-900">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCategoryIcon(issue.category as any)}</span>
          <h4 className="font-semibold text-sm">{issue.title}</h4>
        </div>
        <Badge variant="outline" className="text-xs capitalize">
          {issue.category}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{issue.description}</p>
      <div className="flex items-start gap-2 p-2 bg-muted rounded text-xs">
        <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-medium">Recommendation: </span>
          <span className="text-muted-foreground">{issue.recommendation}</span>
        </div>
      </div>
    </div>
  )
}
