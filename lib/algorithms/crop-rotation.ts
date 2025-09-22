import { Crop, CropFamily, Season, crops } from '@/lib/data/crops'
import { BedLayout } from './layout-generator'

export interface PlantingPlan {
  bedId: string
  season: Season
  year: number
  crops: Crop[]
  family: CropFamily
  spacing: number
  notes?: string
}

export interface RotationPlan {
  plantings: PlantingPlan[]
  warnings: string[]
  suggestions: string[]
}

export interface RotationConstraints {
  beds: BedLayout[]
  startSeason: Season
  startYear: number
  seasonsToplan: number
  preferredCrops?: string[]
  avoidFamilies?: CropFamily[]
  sunExposure: 'full' | 'partial' | 'shade'
  lastFrostDate?: Date
  firstFrostDate?: Date
}

export class CropRotationEngine {
  private familyHistory: Map<string, Map<number, CropFamily>> = new Map()
  
  generateRotation(constraints: RotationConstraints): RotationPlan {
    const plantings: PlantingPlan[] = []
    const warnings: string[] = []
    const suggestions: string[] = []
    
    const seasons = this.getSeasonSequence(constraints.startSeason, constraints.seasonsToplan)
    const availableCrops = this.filterCropsBySun(crops, constraints.sunExposure)
    
    // Initialize family history tracking
    constraints.beds.forEach(bed => {
      this.familyHistory.set(bed.id, new Map())
    })
    
    // Generate plantings for each season
    seasons.forEach((season, seasonIndex) => {
      const year = constraints.startYear + Math.floor((this.getSeasonIndex(constraints.startSeason) + seasonIndex) / 4)
      
      constraints.beds.forEach(bed => {
        const suitableCrops = this.selectCropsForBed(
          bed,
          season,
          year,
          availableCrops,
          constraints.preferredCrops,
          constraints.avoidFamilies
        )
        
        if (suitableCrops.length > 0) {
          const selectedCrops = this.optimizeCropSelection(suitableCrops, bed)
          const family = selectedCrops[0].family
          
          plantings.push({
            bedId: bed.id,
            season,
            year,
            crops: selectedCrops,
            family,
            spacing: Math.max(...selectedCrops.map(c => c.spacing_in)),
            notes: this.generatePlantingNotes(selectedCrops, bed, season)
          })
          
          // Track family history
          const bedHistory = this.familyHistory.get(bed.id)!
          bedHistory.set(year * 10 + this.getSeasonIndex(season), family)
        } else {
          warnings.push(`No suitable crops for ${bed.name} in ${season} ${year}`)
        }
      })
    })
    
    // Generate suggestions
    if (constraints.beds.some(b => b.hasTrellis)) {
      suggestions.push('Beds with trellises are ideal for pole beans, peas, and vining crops')
    }
    
    if (constraints.beds.some(b => b.isWicking)) {
      suggestions.push('Wicking beds are excellent for water-hungry crops like tomatoes and squash')
    }
    
    if (constraints.sunExposure === 'partial') {
      suggestions.push('Focus on leafy greens, herbs, and root vegetables for partial shade')
    }
    
    // Check for rotation violations
    const violations = this.checkRotationViolations(plantings)
    warnings.push(...violations)
    
    return { plantings, warnings, suggestions }
  }
  
  private filterCropsBySun(allCrops: Crop[], sunExposure: 'full' | 'partial' | 'shade'): Crop[] {
    switch (sunExposure) {
      case 'full':
        return allCrops.filter(c => c.sun === 'full')
      case 'partial':
        return allCrops.filter(c => c.sun === 'partial' || c.sun === 'full')
      case 'shade':
        return allCrops.filter(c => c.sun === 'shade' || c.sun === 'partial')
      default:
        return allCrops
    }
  }
  
  private selectCropsForBed(
    bed: BedLayout,
    season: Season,
    year: number,
    availableCrops: Crop[],
    preferredCrops?: string[],
    avoidFamilies?: CropFamily[]
  ): Crop[] {
    // Filter by season
    let suitable = availableCrops.filter(c => c.seasons.includes(season))
    
    // Filter out families to avoid
    if (avoidFamilies) {
      suitable = suitable.filter(c => !avoidFamilies.includes(c.family))
    }
    
    // Check rotation history
    const bedHistory = this.familyHistory.get(bed.id)!
    const recentFamilies = this.getRecentFamilies(bedHistory, year, season)
    suitable = suitable.filter(c => !recentFamilies.includes(c.family))
    
    // Prioritize preferred crops
    if (preferredCrops && preferredCrops.length > 0) {
      const preferred = suitable.filter(c => preferredCrops.includes(c.id))
      if (preferred.length > 0) {
        suitable = preferred
      }
    }
    
    // Special considerations for bed features
    if (bed.hasTrellis) {
      // Prioritize vining crops for trellised beds
      const vining = suitable.filter(c => 
        c.id.includes('pole') || c.id.includes('pea') || 
        c.id === 'cucumber' || c.id.includes('squash')
      )
      if (vining.length > 0) {
        suitable = vining
      }
    }
    
    if (bed.isWicking) {
      // Prioritize water-loving crops for wicking beds
      const waterLoving = suitable.filter(c => c.water_needs === 'high')
      if (waterLoving.length > 0) {
        suitable = waterLoving
      }
    }
    
    return suitable
  }
  
  private optimizeCropSelection(suitableCrops: Crop[], bed: BedLayout): Crop[] {
    // For now, select compatible crops that can be grown together
    // Start with the first crop and find companions
    if (suitableCrops.length === 0) return []
    
    const primary = suitableCrops[0]
    const selected = [primary]
    
    // Add companion plants if available
    if (primary.companion_plants) {
      const companions = suitableCrops.filter(c => 
        primary.companion_plants?.includes(c.id) &&
        c.family === primary.family // Keep same family for simplicity
      )
      selected.push(...companions.slice(0, 2)) // Max 3 crops per bed
    }
    
    return selected
  }
  
  private getRecentFamilies(
    bedHistory: Map<number, CropFamily>,
    currentYear: number,
    currentSeason: Season
  ): CropFamily[] {
    const recentFamilies: CropFamily[] = []
    const currentKey = currentYear * 10 + this.getSeasonIndex(currentSeason)
    
    // Check last 2 years (8 seasons)
    for (let i = 1; i <= 8; i++) {
      const family = bedHistory.get(currentKey - i)
      if (family && !recentFamilies.includes(family)) {
        recentFamilies.push(family)
      }
    }
    
    return recentFamilies
  }
  
  private generatePlantingNotes(crops: Crop[], bed: BedLayout, season: Season): string {
    const notes: string[] = []
    
    // Add succession planting notes
    const quickCrops = crops.filter(c => c.days_to_maturity < 30)
    if (quickCrops.length > 0) {
      notes.push(`Consider succession planting ${quickCrops[0].name} every 2 weeks`)
    }
    
    // Add row cover notes
    const rowCoverCrops = crops.filter(c => c.row_cover_suitable)
    if (rowCoverCrops.length > 0) {
      notes.push(`Use row covers for pest protection`)
      const needsPollination = rowCoverCrops.filter(c => c.needs_pollination)
      if (needsPollination.length > 0) {
        notes.push(`Remove covers at flowering for pollination`)
      }
    }
    
    // Add trellis notes
    if (bed.hasTrellis) {
      const viningCrops = crops.filter(c => 
        c.id.includes('pole') || c.id === 'cucumber' || c.id.includes('pea')
      )
      if (viningCrops.length > 0) {
        notes.push(`Train ${viningCrops[0].name} up trellis`)
      }
    }
    
    return notes.join('. ')
  }
  
  private checkRotationViolations(plantings: PlantingPlan[]): string[] {
    const violations: string[] = []
    const bedFamilyHistory = new Map<string, Array<{year: number, season: Season, family: CropFamily}>>()
    
    // Build history
    plantings.forEach(p => {
      if (!bedFamilyHistory.has(p.bedId)) {
        bedFamilyHistory.set(p.bedId, [])
      }
      bedFamilyHistory.get(p.bedId)!.push({
        year: p.year,
        season: p.season,
        family: p.family
      })
    })
    
    // Check for violations
    bedFamilyHistory.forEach((history, bedId) => {
      for (let i = 0; i < history.length - 1; i++) {
        for (let j = i + 1; j < history.length; j++) {
          const timeDiff = (history[j].year - history[i].year) * 4 + 
            (this.getSeasonIndex(history[j].season) - this.getSeasonIndex(history[i].season))
          
          if (timeDiff < 8 && history[i].family === history[j].family) {
            violations.push(
              `Warning: ${history[i].family} repeated in bed ${bedId} within 2 years`
            )
            break
          }
        }
      }
    })
    
    return violations
  }
  
  private getSeasonSequence(startSeason: Season, count: number): Season[] {
    const allSeasons: Season[] = ['spring', 'summer', 'fall', 'winter']
    const startIndex = this.getSeasonIndex(startSeason)
    const result: Season[] = []
    
    for (let i = 0; i < count; i++) {
      result.push(allSeasons[(startIndex + i) % 4])
    }
    
    return result
  }
  
  private getSeasonIndex(season: Season): number {
    const seasonMap = { spring: 0, summer: 1, fall: 2, winter: 3 }
    return seasonMap[season]
  }
  
  generateSuccessionPlanting(
    crop: Crop,
    startDate: Date,
    endDate: Date,
    intervalDays: number = 14
  ): Date[] {
    const plantingDates: Date[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      // Check if harvest will complete before end date
      const harvestDate = new Date(currentDate)
      harvestDate.setDate(harvestDate.getDate() + crop.days_to_maturity)
      
      if (harvestDate <= endDate) {
        plantingDates.push(new Date(currentDate))
      }
      
      currentDate.setDate(currentDate.getDate() + intervalDays)
    }
    
    return plantingDates
  }
}