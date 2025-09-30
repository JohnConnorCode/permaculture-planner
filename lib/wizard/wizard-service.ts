'use client'

import { createClient } from '@/lib/supabase/client'
import { authService } from '@/lib/auth/auth-service'
import { gardenService } from '@/lib/garden/garden-service'
import { showError, showSuccess, showLoading } from '@/components/ui/action-feedback'
import {
  GardenDataTransformer,
  GardenBed,
  CanvasMetadata,
  SiteInsert,
  PlanInsert
} from '@/lib/garden/garden-types'

export interface WizardData {
  location: {
    lat?: number
    lng?: number
    city?: string
    usda_zone?: string
    last_frost?: string
    first_frost?: string
  }
  area: {
    total_sqft: number
    usable_fraction: number
    shape: 'rectangular' | 'L-shaped' | 'scattered'
  }
  surface: {
    type: 'soil' | 'hard'
    sun_hours: number
    slope: number
    accessibility_needs: boolean
  }
  water: {
    source: 'spigot' | 'none' | 'rain'
    drip_allowed: boolean
    sip_interest: boolean
  }
  crops: {
    focus: string[]
    avoid_families?: string[]
    time_weekly_minutes: number
  }
  materials: {
    lumber_type?: 'cedar' | 'pine' | 'treated'
    budget_tier?: 'budget' | 'standard' | 'premium'
  }
  template?: any
  name?: string
}

export interface WizardResult {
  success: boolean
  planId?: string
  siteId?: string
  gardenBeds?: GardenBed[]
  error?: string
}

export class WizardService {
  private client = createClient()

  /**
   * Save wizard data and create initial garden plan
   */
  async saveWizardData(data: WizardData): Promise<WizardResult> {
    const loadingId = showLoading('Creating your garden plan...')

    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        showError('Please sign in to save your garden plan')
        return { success: false, error: 'Not authenticated' }
      }

      // Transform wizard data to site and plan data
      const siteData: SiteInsert = GardenDataTransformer.wizardDataToSite(data, user.id)
      siteData.name = data.name || `Garden Site - ${new Date().toLocaleDateString()}`

      const planData: PlanInsert = {
        site_id: '', // Will be set after site creation
        name: `${data.name || 'Garden Plan'} - ${new Date().toLocaleDateString()}`,
        version: 1,
        status: 'draft'
      }

      // Generate garden beds from wizard data
      const gardenBeds = this.generateGardenFromWizard(data)

      // Create canvas metadata
      const canvasMetadata: CanvasMetadata = {
        zoom: 100,
        viewBox: { x: 0, y: 0, width: 800, height: 600 },
        showGrid: true,
        showLabels: true,
        showSpacing: false,
        showSunRequirements: false,
        showWaterRequirements: false,
        created_at: new Date().toISOString()
      }

      // Save to database using garden service
      const result = await gardenService.saveGarden(
        gardenBeds,
        canvasMetadata,
        siteData,
        planData
      )

      if (result.success) {
        showSuccess('Garden plan created successfully!')
        return {
          success: true,
          planId: result.planId,
          siteId: result.siteId,
          gardenBeds
        }
      } else {
        return { success: false, error: result.error }
      }

    } catch (error) {
      console.error('Error saving wizard data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create garden plan'
      showError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Generate garden beds from wizard selections
   */
  generateGardenFromWizard(data: WizardData): GardenBed[] {
    const beds: GardenBed[] = []

    // Use template if provided
    if (data.template) {
      return this.applyTemplate(data.template, data)
    }

    // Generate beds based on area and preferences
    const totalUsableArea = data.area.total_sqft * data.area.usable_fraction
    const bedSizes = this.calculateOptimalBedSizes(totalUsableArea, data)

    let currentX = 50
    let currentY = 50
    const bedSpacing = 30 // pixels between beds

    bedSizes.forEach((bedSize, index) => {
      const bed: GardenBed = {
        id: `wizard-bed-${index + 1}`,
        name: this.generateBedName(index, data.crops.focus),
        points: [
          { x: currentX, y: currentY },
          { x: currentX + bedSize.width, y: currentY },
          { x: currentX + bedSize.width, y: currentY + bedSize.height },
          { x: currentX, y: currentY + bedSize.height }
        ],
        fill: this.getBedColor(data.crops.focus[index % data.crops.focus.length]),
        stroke: '#22c55e',
        plants: this.generatePlantsForBed(bedSize, data.crops.focus, index),
        width: bedSize.width,
        height: bedSize.height,
        rotation: 0,
        elementType: 'raised_bed',
        elementCategory: 'bed',
        zone: this.determineZone(data.crops.focus[index % data.crops.focus.length])
      }

      beds.push(bed)

      // Position next bed
      if (data.area.shape === 'rectangular') {
        currentX += bedSize.width + bedSpacing
        if (currentX > 400) { // Wrap to next row
          currentX = 50
          currentY += bedSize.height + bedSpacing
        }
      } else if (data.area.shape === 'L-shaped') {
        // L-shaped layout
        if (index % 2 === 0) {
          currentX += bedSize.width + bedSpacing
        } else {
          currentY += bedSize.height + bedSpacing
          currentX = 50
        }
      } else {
        // Scattered layout - more random positioning
        currentX += bedSize.width + bedSpacing + Math.random() * 20
        currentY += Math.random() * 40 - 20
        if (currentX > 350) {
          currentX = 50 + Math.random() * 50
          currentY += bedSize.height + bedSpacing
        }
      }
    })

    return beds
  }

  /**
   * Apply a template to wizard data
   */
  private applyTemplate(template: any, data: WizardData): GardenBed[] {
    // Transform template beds to match wizard preferences
    return template.beds.map((bed: any, index: number) => ({
      ...bed,
      id: `wizard-template-${index + 1}`,
      plants: this.filterPlantsForCrops(bed.plants, data.crops.focus)
    }))
  }

  /**
   * Calculate optimal bed sizes based on area and preferences
   */
  private calculateOptimalBedSizes(totalArea: number, data: WizardData) {
    const standardBedArea = 32 // 4x8 feet in square feet
    const pixelsPerFoot = 12 // Rough conversion

    let numBeds = Math.max(1, Math.floor(totalArea / standardBedArea))

    // Adjust based on maintenance time
    if (data.crops.time_weekly_minutes < 60) {
      numBeds = Math.min(numBeds, 3) // Limit for low maintenance
    } else if (data.crops.time_weekly_minutes > 180) {
      numBeds = Math.min(numBeds, 8) // Even enthusiasts have limits
    }

    // Adjust based on accessibility needs
    const bedWidth = data.surface.accessibility_needs ? 3 : 4 // feet
    const bedLength = data.surface.accessibility_needs ? 6 : 8 // feet

    return Array(numBeds).fill(null).map((_, index) => {
      // Vary sizes slightly for visual interest
      const widthVariation = 0.8 + (Math.random() * 0.4) // 0.8 to 1.2 multiplier
      const lengthVariation = 0.9 + (Math.random() * 0.2) // 0.9 to 1.1 multiplier

      return {
        width: Math.round(bedWidth * pixelsPerFoot * widthVariation),
        height: Math.round(bedLength * pixelsPerFoot * lengthVariation)
      }
    })
  }

  /**
   * Generate appropriate bed name based on crops
   */
  private generateBedName(index: number, cropFocus: string[]): string {
    const bedNames = {
      'vegetables': ['Salad Greens', 'Root Vegetables', 'Brassicas', 'Nightshades'],
      'herbs': ['Culinary Herbs', 'Medicinal Herbs', 'Tea Garden', 'Aromatic Herbs'],
      'fruits': ['Berry Patch', 'Fruit Trees', 'Climbing Fruits', 'Ground Fruits'],
      'flowers': ['Cutting Garden', 'Pollinator Paradise', 'Annual Flowers', 'Perennial Border'],
      'grains': ['Grain Plot', 'Ancient Grains', 'Cover Crops', 'Seed Production']
    }

    const primaryFocus = cropFocus[0] || 'vegetables'
    const names = bedNames[primaryFocus as keyof typeof bedNames] || bedNames.vegetables

    return names[index % names.length] || `Garden Bed ${index + 1}`
  }

  /**
   * Get appropriate color for bed based on crop type
   */
  private getBedColor(cropType: string): string {
    const colors = {
      'vegetables': '#e0f2e0',
      'herbs': '#f0f7ff',
      'fruits': '#fff4e0',
      'flowers': '#fdf2f8',
      'grains': '#fefce8'
    }

    return colors[cropType as keyof typeof colors] || colors.vegetables
  }

  /**
   * Generate plants for a bed based on size and crop focus
   */
  private generatePlantsForBed(bedSize: { width: number; height: number }, cropFocus: string[], bedIndex: number) {
    const plants = []
    const plantsPerBed = Math.floor((bedSize.width * bedSize.height) / 1400) // Rough spacing calculation

    const plantOptions = this.getPlantOptionsForCrop(cropFocus[bedIndex % cropFocus.length])

    for (let i = 0; i < Math.min(plantsPerBed, 12); i++) {
      const plant = plantOptions[i % plantOptions.length]
      plants.push({
        id: `wizard-plant-${bedIndex}-${i}`,
        plantId: plant,
        x: 30 + (i % 4) * (bedSize.width / 4),
        y: 30 + Math.floor(i / 4) * (bedSize.height / 4),
        plantedDate: new Date()
      })
    }

    return plants
  }

  /**
   * Get plant options for a crop category
   */
  private getPlantOptionsForCrop(cropType: string): string[] {
    const plantsByType = {
      'vegetables': ['lettuce', 'tomato', 'carrot', 'beans', 'broccoli', 'spinach'],
      'herbs': ['basil', 'thyme', 'rosemary', 'parsley', 'mint', 'oregano'],
      'fruits': ['strawberry', 'blueberry', 'raspberry', 'grape', 'apple', 'pear'],
      'flowers': ['marigold', 'sunflower', 'zinnias', 'cosmos', 'nasturtium', 'lavender'],
      'grains': ['corn', 'wheat', 'quinoa', 'amaranth', 'buckwheat', 'barley']
    }

    return plantsByType[cropType as keyof typeof plantsByType] || plantsByType.vegetables
  }

  /**
   * Determine permaculture zone for plants
   */
  private determineZone(cropType: string): 0 | 1 | 2 | 3 | 4 | 5 {
    const zoneMap = {
      'herbs': 1, // Close to house, frequent harvest
      'vegetables': 2, // Regular maintenance
      'fruits': 3, // Less frequent maintenance
      'flowers': 2, // Regular care
      'grains': 4  // Seasonal care
    }

    return (zoneMap[cropType as keyof typeof zoneMap] || 2) as 0 | 1 | 2 | 3 | 4 | 5
  }

  /**
   * Filter plants in template to match selected crops
   */
  private filterPlantsForCrops(plants: any[], cropFocus: string[]) {
    // This would ideally use a plant database to match plants to crop categories
    // For now, return as-is or filter based on simple rules
    return plants.filter((plant, index) => {
      // Keep every nth plant based on crop focus diversity
      return index % Math.max(1, 6 - cropFocus.length) === 0
    })
  }

  /**
   * Create a minimal garden for users who want to start simple
   */
  generateStarterGarden(data: WizardData): GardenBed[] {
    const starterBed: GardenBed = {
      id: 'starter-bed-1',
      name: 'Starter Garden',
      points: [
        { x: 100, y: 100 },
        { x: 196, y: 100 }, // 4x8 feet at 12px/foot
        { x: 196, y: 196 },
        { x: 100, y: 196 }
      ],
      fill: '#e0f2e0',
      stroke: '#22c55e',
      plants: [
        { id: 'starter-1', plantId: 'lettuce', x: 120, y: 120, plantedDate: new Date() },
        { id: 'starter-2', plantId: 'tomato', x: 150, y: 120, plantedDate: new Date() },
        { id: 'starter-3', plantId: 'basil', x: 180, y: 120, plantedDate: new Date() },
        { id: 'starter-4', plantId: 'carrot', x: 120, y: 150, plantedDate: new Date() },
        { id: 'starter-5', plantId: 'beans', x: 150, y: 150, plantedDate: new Date() },
        { id: 'starter-6', plantId: 'spinach', x: 180, y: 150, plantedDate: new Date() }
      ],
      width: 96,
      height: 96,
      rotation: 0,
      elementType: 'raised_bed',
      elementCategory: 'bed',
      zone: 2
    }

    return [starterBed]
  }

  /**
   * Get saved wizard data from localStorage (for partial completion)
   */
  getSavedWizardData(): Partial<WizardData> | null {
    try {
      const saved = localStorage.getItem('wizard_progress')
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.warn('Could not load saved wizard data:', error)
      return null
    }
  }

  /**
   * Save wizard progress to localStorage
   */
  saveWizardProgress(data: Partial<WizardData>): void {
    try {
      localStorage.setItem('wizard_progress', JSON.stringify(data))
    } catch (error) {
      console.warn('Could not save wizard progress:', error)
    }
  }

  /**
   * Clear saved wizard data
   */
  clearWizardProgress(): void {
    try {
      localStorage.removeItem('wizard_progress')
    } catch (error) {
      console.warn('Could not clear wizard progress:', error)
    }
  }
}

// Export singleton instance
export const wizardService = new WizardService()