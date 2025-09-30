// @ts-nocheck
'use client'

import { createClient } from '@/lib/supabase/client'
import { authService } from '@/lib/auth/auth-service'
import { showError, showSuccess, showLoading, showWarning } from '@/components/ui/action-feedback'
import {
  GardenData,
  GardenBed,
  SaveGardenResult,
  LoadGardenResult,
  GardenListItem,
  GardenDataTransformer,
  Site,
  Plan,
  Bed,
  Planting,
  SiteInsert,
  PlanInsert,
  CanvasMetadata
} from './garden-types'

export class GardenService {
  private client = createClient()

  /**
   * Save a complete garden design to the database
   */
  async saveGarden(
    beds: GardenBed[],
    metadata: CanvasMetadata,
    siteData?: Partial<SiteInsert>,
    planData?: Partial<PlanInsert>
  ): Promise<SaveGardenResult> {
    const loadingId = showLoading('Saving garden design...')

    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        showError('Please sign in to save your garden')
        return { success: false, error: 'Not authenticated' }
      }

      // Start transaction-like operations
      let siteId: string
      let planId: string

      // 1. Create or update site
      if (siteData?.id) {
        // Update existing site
        // @ts-ignore - Supabase types not properly configured yet
        const { error: siteError } = await this.client
          .from('sites')
          .update({
            name: siteData.name,
            surface_type: siteData.surface_type,
            water_source: siteData.water_source,
            ...siteData
          })
          .eq('id', siteData.id)
          .eq('user_id', user.id)

        if (siteError) {
          showError('Failed to update site')
          return { success: false, error: siteError.message }
        }
        siteId = siteData.id
      } else {
        // Create new site
        const newSite: SiteInsert = {
          user_id: user.id,
          name: siteData?.name || `Garden Site - ${new Date().toLocaleDateString()}`,
          surface_type: siteData?.surface_type || 'soil',
          water_source: siteData?.water_source || 'spigot',
          constraints_json: {
            canvas: metadata,
            timestamp: new Date().toISOString()
          },
          ...siteData
        }

        const { data: site, error: siteError } = await this.client
          .from('sites')
          .insert(newSite)
          .select()
          .single()

        if (siteError || !site) {
          showError('Failed to create site')
          return { success: false, error: siteError?.message || 'Site creation failed' }
        }
        siteId = site.id
      }

      // 2. Create or update plan
      if (planData?.id) {
        // Update existing plan
        const { error: planError } = await this.client
          .from('plans')
          .update({
            name: planData.name,
            status: planData.status,
            version: planData.version
          })
          .eq('id', planData.id)
          .eq('site_id', siteId)

        if (planError) {
          showError('Failed to update plan')
          return { success: false, error: planError.message }
        }
        planId = planData.id
      } else {
        // Create new plan
        const newPlan: PlanInsert = {
          site_id: siteId,
          name: planData?.name || `Garden Plan - ${new Date().toLocaleDateString()}`,
          version: 1,
          status: 'draft'
        }

        const { data: plan, error: planError } = await this.client
          .from('plans')
          .insert(newPlan)
          .select()
          .single()

        if (planError || !plan) {
          showError('Failed to create plan')
          return { success: false, error: planError?.message || 'Plan creation failed' }
        }
        planId = plan.id
      }

      // 3. Delete existing beds for this plan (if updating)
      if (planData?.id) {
        const { error: deleteBedsError } = await this.client
          .from('beds')
          .delete()
          .eq('plan_id', planId)

        if (deleteBedsError) {
          console.warn('Warning: Could not delete existing beds:', deleteBedsError)
        }
      }

      // 4. Save beds
      const dbBeds = GardenDataTransformer.canvasBedsToDbBeds(beds, planId)
      if (dbBeds.length > 0) {
        const { error: bedsError } = await this.client
          .from('beds')
          .insert(dbBeds)

        if (bedsError) {
          showError('Failed to save garden beds')
          return { success: false, error: bedsError.message }
        }
      }

      // 5. Save plantings
      const plantings = GardenDataTransformer.canvasPlantsToDbPlantings(beds)
      if (plantings.length > 0) {
        const { error: plantingsError } = await this.client
          .from('plantings')
          .insert(plantings)

        if (plantingsError) {
          console.warn('Warning: Could not save all plantings:', plantingsError)
          showWarning('Garden saved, but some plants could not be saved')
        }
      }

      showSuccess('Garden saved successfully!')
      return {
        success: true,
        gardenId: planId,
        siteId,
        planId
      }

    } catch (error) {
      console.error('Error saving garden:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save garden'
      showError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Load a garden design from the database
   */
  async loadGarden(planId: string): Promise<LoadGardenResult> {
    const loadingId = showLoading('Loading garden design...')

    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        showError('Please sign in to load gardens')
        return { success: false, error: 'Not authenticated' }
      }

      // Get plan with site data
      const { data: plan, error: planError } = await this.client
        .from('plans')
        .select(`
          *,
          sites (*)
        `)
        .eq('id', planId)
        .single()

      if (planError || !plan) {
        showError('Garden not found')
        return { success: false, error: planError?.message || 'Plan not found' }
      }

      // Check ownership
      if ((plan.sites as any)?.user_id !== user.id) {
        showError('You do not have permission to access this garden')
        return { success: false, error: 'Access denied' }
      }

      // Get beds
      const { data: beds, error: bedsError } = await this.client
        .from('beds')
        .select('*')
        .eq('plan_id', planId)
        .order('order_index')

      if (bedsError) {
        showError('Failed to load garden beds')
        return { success: false, error: bedsError.message }
      }

      // Get plantings
      const { data: plantings, error: plantingsError } = await this.client
        .from('plantings')
        .select('*')
        .in('bed_id', (beds || []).map(b => b.id))

      if (plantingsError) {
        console.warn('Warning: Could not load plantings:', plantingsError)
      }

      // Transform data back to canvas format
      const canvasBeds = GardenDataTransformer.dbBedsToCanvasBeds(beds || [], plantings || [])

      const site = plan.sites as Site
      const gardenData: GardenData = {
        site: {
          id: site.id,
          name: site.name,
          lat: site.lat || undefined,
          lng: site.lng || undefined,
          country_code: site.country_code || undefined,
          usda_zone: site.usda_zone || undefined,
          last_frost: site.last_frost || undefined,
          first_frost: site.first_frost || undefined,
          surface_type: site.surface_type,
          slope_pct: site.slope_pct || undefined,
          shade_notes: site.shade_notes || undefined,
          water_source: site.water_source,
          constraints_json: site.constraints_json as Record<string, any> || undefined
        },
        plan: {
          id: plan.id,
          site_id: plan.site_id,
          name: plan.name,
          version: plan.version,
          status: plan.status
        },
        beds: canvasBeds,
        canvas: (site.constraints_json as any)?.canvas || {
          zoom: 100,
          viewBox: { x: 0, y: 0, width: 800, height: 600 },
          showGrid: true,
          showLabels: true,
          showSpacing: false,
          showSunRequirements: false,
          showWaterRequirements: false
        }
      }

      showSuccess('Garden loaded successfully!')
      return { success: true, garden: gardenData }

    } catch (error) {
      console.error('Error loading garden:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load garden'
      showError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Update an existing garden
   */
  async updateGarden(
    planId: string,
    beds: GardenBed[],
    metadata: CanvasMetadata
  ): Promise<SaveGardenResult> {
    const loadingId = showLoading('Updating garden...')

    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        showError('Please sign in to update gardens')
        return { success: false, error: 'Not authenticated' }
      }

      // Verify ownership
      const { data: plan, error: planError } = await this.client
        .from('plans')
        .select(`
          *,
          sites!inner (user_id)
        `)
        .eq('id', planId)
        .single()

      if (planError || !plan) {
        showError('Garden not found')
        return { success: false, error: 'Plan not found' }
      }

      if ((plan.sites as any).user_id !== user.id) {
        showError('You do not have permission to update this garden')
        return { success: false, error: 'Access denied' }
      }

      // Update plan metadata
      const { error: updatePlanError } = await this.client
        .from('plans')
        .update({
          name: plan.name,
          version: plan.version + 1
        })
        .eq('id', planId)

      if (updatePlanError) {
        showError('Failed to update plan')
        return { success: false, error: updatePlanError.message }
      }

      // Update site with canvas metadata
      const { error: updateSiteError } = await this.client
        .from('sites')
        .update({
          constraints_json: {
            ...(plan.sites as any).constraints_json,
            canvas: metadata,
            updated_at: new Date().toISOString()
          }
        })
        .eq('id', plan.site_id)

      if (updateSiteError) {
        console.warn('Warning: Could not update site metadata:', updateSiteError)
      }

      // Delete existing beds and plantings
      const { error: deleteBedsError } = await this.client
        .from('beds')
        .delete()
        .eq('plan_id', planId)

      if (deleteBedsError) {
        showError('Failed to update garden beds')
        return { success: false, error: deleteBedsError.message }
      }

      // Insert new beds
      const dbBeds = GardenDataTransformer.canvasBedsToDbBeds(beds, planId)
      if (dbBeds.length > 0) {
        const { error: bedsError } = await this.client
          .from('beds')
          .insert(dbBeds)

        if (bedsError) {
          showError('Failed to save updated beds')
          return { success: false, error: bedsError.message }
        }

        // Insert new plantings
        const plantings = GardenDataTransformer.canvasPlantsToDbPlantings(beds)
        if (plantings.length > 0) {
          const { error: plantingsError } = await this.client
            .from('plantings')
            .insert(plantings)

          if (plantingsError) {
            console.warn('Warning: Could not save all plantings:', plantingsError)
          }
        }
      }

      showSuccess('Garden updated successfully!')
      return { success: true, gardenId: planId, planId }

    } catch (error) {
      console.error('Error updating garden:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update garden'
      showError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Delete a garden
   */
  async deleteGarden(planId: string): Promise<{ success: boolean; error?: string }> {
    const loadingId = showLoading('Deleting garden...')

    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        showError('Please sign in to delete gardens')
        return { success: false, error: 'Not authenticated' }
      }

      // Verify ownership
      const { data: plan, error: planError } = await this.client
        .from('plans')
        .select(`
          *,
          sites!inner (user_id)
        `)
        .eq('id', planId)
        .single()

      if (planError || !plan) {
        showError('Garden not found')
        return { success: false, error: 'Plan not found' }
      }

      if ((plan.sites as any).user_id !== user.id) {
        showError('You do not have permission to delete this garden')
        return { success: false, error: 'Access denied' }
      }

      // Delete plan (cascades to beds and plantings)
      const { error: deleteError } = await this.client
        .from('plans')
        .delete()
        .eq('id', planId)

      if (deleteError) {
        showError('Failed to delete garden')
        return { success: false, error: deleteError.message }
      }

      showSuccess('Garden deleted successfully')
      return { success: true }

    } catch (error) {
      console.error('Error deleting garden:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete garden'
      showError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * List all gardens for the current user
   */
  async listUserGardens(): Promise<GardenListItem[]> {
    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        return []
      }

      const { data: plans, error } = await this.client
        .from('plans')
        .select(`
          id,
          name,
          status,
          created_at,
          version,
          sites (
            name
          ),
          beds (
            id,
            name
          ),
          plantings (
            id
          )
        `)
        .eq('sites.user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading user gardens:', error)
        return []
      }

      return (plans || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        site_name: (plan.sites as any)?.name || 'Unknown Site',
        status: plan.status,
        created_at: plan.created_at,
        updated_at: plan.created_at, // Could be enhanced with actual update tracking
        bed_count: (plan.beds as any)?.length || 0,
        plant_count: (plan.plantings as any)?.length || 0
      }))

    } catch (error) {
      console.error('Error in listUserGardens:', error)
      return []
    }
  }

  /**
   * Create a quick save of the current canvas state
   */
  async quickSave(
    beds: GardenBed[],
    metadata: CanvasMetadata,
    existingPlanId?: string
  ): Promise<SaveGardenResult> {
    if (existingPlanId) {
      return this.updateGarden(existingPlanId, beds, metadata)
    } else {
      return this.saveGarden(beds, metadata)
    }
  }

  /**
   * Auto-save with conflict detection
   */
  async autoSave(
    beds: GardenBed[],
    metadata: CanvasMetadata,
    planId?: string,
    lastSaveTimestamp?: number
  ): Promise<SaveGardenResult> {
    try {
      // If we have a plan ID, check for conflicts
      if (planId && lastSaveTimestamp) {
        const { data: plan, error } = await this.client
          .from('plans')
          .select('version, created_at')
          .eq('id', planId)
          .single()

        if (plan && new Date(plan.created_at).getTime() > lastSaveTimestamp) {
          // Conflict detected - newer version exists
          showWarning('Newer version detected. Auto-save skipped to prevent conflicts.')
          return { success: false, error: 'Conflict detected' }
        }
      }

      return this.quickSave(beds, metadata, planId)

    } catch (error) {
      console.error('Auto-save failed:', error)
      return { success: false, error: 'Auto-save failed' }
    }
  }
}

// Export singleton instance
export const gardenService = new GardenService()