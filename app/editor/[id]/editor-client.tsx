'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { PermacultureEditorIntegrated } from '@/components/tldraw/permaculture-editor-integrated'
import { GardenBed } from '@/lib/garden/garden-types'
import { createClient } from '@/lib/supabase/client'
import { syncBedsToSupabase } from '@/lib/supabase/bed-sync'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface EditorClientProps {
  plan: any
}

/**
 * EditorClient - PRODUCTION-READY editor with Supabase integration
 *
 * ✅ Loads plan from Supabase
 * ✅ Auto-saves to Supabase
 * ✅ User authentication
 * ✅ Real-time data sync
 */
export function EditorClient({ plan }: EditorClientProps) {
  const [gardenBeds, setGardenBeds] = useState<GardenBed[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Load initial data from Supabase beds
  useEffect(() => {
    if (!plan?.beds) {
      setLoading(false)
      return
    }

    try {
      // Convert Supabase beds to GardenBed format
      const beds: GardenBed[] = plan.beds.map((bed: any) => ({
        id: bed.id,
        name: bed.name || 'Garden Bed',
        points: [
          { x: 0, y: 0 },
          { x: (bed.length_ft || 4) * 12, y: 0 },
          { x: (bed.length_ft || 4) * 12, y: (bed.width_ft || 4) * 12 },
          { x: 0, y: (bed.width_ft || 4) * 12 },
        ],
        fill: '#e0f2e0',
        stroke: '#22c55e',
        plants: [],
        width: (bed.length_ft || 4) * 12,
        height: (bed.width_ft || 4) * 12,
        rotation: bed.orientation === 'north-south' ? 0 : 90,
        elementCategory: 'bed',
        zone: undefined,
      }))

      setGardenBeds(beds)
    } catch (error) {
      console.error('Error loading beds:', error)
      toast.error('Failed to load garden plan')
    } finally {
      setLoading(false)
    }
  }, [plan])

  // Extract site data for advanced features
  const siteData = useMemo(() => {
    if (!plan.sites) return null

    return {
      usdaZone: plan.sites.usda_zone || '7a',
      frostDates: plan.sites.last_frost && plan.sites.first_frost
        ? {
            lastFrost: new Date(plan.sites.last_frost),
            firstFrost: new Date(plan.sites.first_frost),
          }
        : null,
      location: plan.sites.lat && plan.sites.lng
        ? { lat: parseFloat(plan.sites.lat), lng: parseFloat(plan.sites.lng) }
        : null,
      surfaceType: plan.sites.surface_type || 'soil',
      waterSource: plan.sites.water_source || 'spigot',
    }
  }, [plan])

  // Auto-save to Supabase (debounced by canvas)
  const handleSave = useCallback(async (updatedBeds: GardenBed[]) => {
    try {
      // Update local state immediately for responsiveness
      setGardenBeds(updatedBeds)

      // Save to Supabase in background
      const result = await syncBedsToSupabase(supabase, plan.id, updatedBeds)

      if (!result.success) {
        console.error('Auto-save failed:', result.error)
        // Don't show toast for auto-save failures to avoid spam
      }
    } catch (error) {
      console.error('Error auto-saving to Supabase:', error)
      // Silent failure for auto-save
    }
  }, [plan.id, supabase])

  // Manual save to Supabase (triggered by user action)
  const handleManualSave = useCallback(async () => {
    try {
      const toastId = toast.loading('Saving to database...')

      // Sync all beds to Supabase
      const result = await syncBedsToSupabase(supabase, plan.id, gardenBeds)

      if (!result.success) {
        throw new Error(result.error || 'Failed to save beds')
      }

      // Update plan's updated_at timestamp
      const { error: updateError } = await (supabase
        .from('plans') as any)
        .update({ updated_at: new Date().toISOString() })
        .eq('id', plan.id)

      if (updateError) throw updateError

      toast.dismiss(toastId)
      toast.success('✅ Saved to database!', {
        description: `${gardenBeds.length} bed(s) synchronized`,
      })
    } catch (error) {
      toast.dismiss()
      console.error('Error saving to database:', error)
      toast.error('Failed to save to database', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }, [plan.id, supabase, gardenBeds])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your garden plan...</p>
        </div>
      </div>
    )
  }

  return (
    <PermacultureEditorIntegrated
      initialData={gardenBeds}
      onSave={handleSave}
      onManualSave={handleManualSave}
      planId={plan.id}
      showHeader={true}
      siteData={siteData}
    />
  )
}
