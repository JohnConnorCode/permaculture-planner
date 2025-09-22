export type CropFamily = 
  | 'Solanaceae'
  | 'Brassicaceae'
  | 'Cucurbitaceae'
  | 'Fabaceae'
  | 'Allium'
  | 'Apiaceae'
  | 'Asteraceae'
  | 'Amaranthaceae'
  | 'Poaceae'
  | 'Other'

export type Season = 'spring' | 'summer' | 'fall' | 'winter'

export type SunRequirement = 'full' | 'partial' | 'shade'

export interface Crop {
  id: string
  name: string
  family: CropFamily
  sun: SunRequirement
  spacing_in: number
  days_to_maturity: number
  seasons: Season[]
  row_cover_suitable: boolean
  needs_pollination: boolean
  companion_plants?: string[]
  antagonistic_plants?: string[]
  water_needs: 'low' | 'medium' | 'high'
  soil_preference?: string
  notes?: string
}

export const crops: Crop[] = [
  // Solanaceae (Nightshades)
  {
    id: 'tomato',
    name: 'Tomato',
    family: 'Solanaceae',
    sun: 'full',
    spacing_in: 24,
    days_to_maturity: 75,
    seasons: ['summer'],
    row_cover_suitable: false,
    needs_pollination: true,
    companion_plants: ['basil', 'carrot', 'marigold'],
    antagonistic_plants: ['brassicas', 'fennel'],
    water_needs: 'high',
    notes: 'Needs consistent watering, prone to blossom end rot with calcium deficiency'
  },
  {
    id: 'pepper',
    name: 'Pepper',
    family: 'Solanaceae',
    sun: 'full',
    spacing_in: 18,
    days_to_maturity: 65,
    seasons: ['summer'],
    row_cover_suitable: false,
    needs_pollination: true,
    water_needs: 'medium'
  },
  {
    id: 'eggplant',
    name: 'Eggplant',
    family: 'Solanaceae',
    sun: 'full',
    spacing_in: 24,
    days_to_maturity: 80,
    seasons: ['summer'],
    row_cover_suitable: false,
    needs_pollination: true,
    water_needs: 'high'
  },
  
  // Brassicaceae (Cruciferous)
  {
    id: 'broccoli',
    name: 'Broccoli',
    family: 'Brassicaceae',
    sun: 'partial',
    spacing_in: 18,
    days_to_maturity: 65,
    seasons: ['spring', 'fall'],
    row_cover_suitable: true,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Use row covers for pest protection, remove at flowering if saving seeds'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    family: 'Brassicaceae',
    sun: 'partial',
    spacing_in: 18,
    days_to_maturity: 80,
    seasons: ['spring', 'fall'],
    row_cover_suitable: true,
    needs_pollination: false,
    water_needs: 'medium'
  },
  {
    id: 'kale',
    name: 'Kale',
    family: 'Brassicaceae',
    sun: 'partial',
    spacing_in: 12,
    days_to_maturity: 55,
    seasons: ['spring', 'fall', 'winter'],
    row_cover_suitable: true,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Frost improves flavor'
  },
  {
    id: 'radish',
    name: 'Radish',
    family: 'Brassicaceae',
    sun: 'partial',
    spacing_in: 2,
    days_to_maturity: 25,
    seasons: ['spring', 'fall'],
    row_cover_suitable: true,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Quick growing, good for succession planting'
  },
  
  // Cucurbitaceae (Cucurbits)
  {
    id: 'cucumber',
    name: 'Cucumber',
    family: 'Cucurbitaceae',
    sun: 'full',
    spacing_in: 12,
    days_to_maturity: 55,
    seasons: ['summer'],
    row_cover_suitable: true,
    needs_pollination: true,
    water_needs: 'high',
    notes: 'Remove row covers at flowering for pollination'
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    family: 'Cucurbitaceae',
    sun: 'full',
    spacing_in: 36,
    days_to_maturity: 50,
    seasons: ['summer'],
    row_cover_suitable: true,
    needs_pollination: true,
    water_needs: 'high',
    notes: 'Heavy feeder, benefits from compost'
  },
  {
    id: 'winter_squash',
    name: 'Winter Squash',
    family: 'Cucurbitaceae',
    sun: 'full',
    spacing_in: 48,
    days_to_maturity: 100,
    seasons: ['summer'],
    row_cover_suitable: true,
    needs_pollination: true,
    water_needs: 'medium',
    notes: 'Needs lots of space, can train vertically'
  },
  
  // Fabaceae (Legumes)
  {
    id: 'bush_bean',
    name: 'Bush Bean',
    family: 'Fabaceae',
    sun: 'full',
    spacing_in: 6,
    days_to_maturity: 55,
    seasons: ['summer'],
    row_cover_suitable: false,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Nitrogen fixer, improves soil'
  },
  {
    id: 'pole_bean',
    name: 'Pole Bean',
    family: 'Fabaceae',
    sun: 'full',
    spacing_in: 8,
    days_to_maturity: 65,
    seasons: ['summer'],
    row_cover_suitable: false,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Needs trellis support, nitrogen fixer'
  },
  {
    id: 'pea',
    name: 'Pea',
    family: 'Fabaceae',
    sun: 'partial',
    spacing_in: 4,
    days_to_maturity: 60,
    seasons: ['spring', 'fall'],
    row_cover_suitable: false,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Cool season crop, nitrogen fixer'
  },
  
  // Apiaceae (Carrots/Celery)
  {
    id: 'carrot',
    name: 'Carrot',
    family: 'Apiaceae',
    sun: 'full',
    spacing_in: 3,
    days_to_maturity: 70,
    seasons: ['spring', 'fall'],
    row_cover_suitable: true,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Deep, loose soil preferred'
  },
  {
    id: 'parsley',
    name: 'Parsley',
    family: 'Apiaceae',
    sun: 'partial',
    spacing_in: 6,
    days_to_maturity: 75,
    seasons: ['spring', 'summer', 'fall'],
    row_cover_suitable: false,
    needs_pollination: false,
    water_needs: 'medium'
  },
  {
    id: 'celery',
    name: 'Celery',
    family: 'Apiaceae',
    sun: 'partial',
    spacing_in: 8,
    days_to_maturity: 120,
    seasons: ['spring', 'fall'],
    row_cover_suitable: false,
    needs_pollination: false,
    water_needs: 'high',
    notes: 'Heavy feeder, needs consistent moisture'
  },
  
  // Asteraceae (Lettuce/Sunflowers)
  {
    id: 'lettuce',
    name: 'Lettuce',
    family: 'Asteraceae',
    sun: 'partial',
    spacing_in: 8,
    days_to_maturity: 50,
    seasons: ['spring', 'fall'],
    row_cover_suitable: true,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Cool season crop, bolts in heat'
  },
  {
    id: 'spinach',
    name: 'Spinach',
    family: 'Amaranthaceae',
    sun: 'partial',
    spacing_in: 4,
    days_to_maturity: 45,
    seasons: ['spring', 'fall'],
    row_cover_suitable: true,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Very cold hardy'
  },
  
  // Allium
  {
    id: 'onion',
    name: 'Onion',
    family: 'Allium',
    sun: 'full',
    spacing_in: 4,
    days_to_maturity: 100,
    seasons: ['spring', 'summer'],
    row_cover_suitable: false,
    needs_pollination: false,
    water_needs: 'medium'
  },
  {
    id: 'garlic',
    name: 'Garlic',
    family: 'Allium',
    sun: 'full',
    spacing_in: 4,
    days_to_maturity: 240,
    seasons: ['fall'],
    row_cover_suitable: false,
    needs_pollination: false,
    water_needs: 'low',
    notes: 'Plant in fall for summer harvest'
  },
  
  // Amaranthaceae
  {
    id: 'beet',
    name: 'Beet',
    family: 'Amaranthaceae',
    sun: 'full',
    spacing_in: 4,
    days_to_maturity: 60,
    seasons: ['spring', 'fall'],
    row_cover_suitable: true,
    needs_pollination: false,
    water_needs: 'medium'
  },
  {
    id: 'swiss_chard',
    name: 'Swiss Chard',
    family: 'Amaranthaceae',
    sun: 'partial',
    spacing_in: 8,
    days_to_maturity: 55,
    seasons: ['spring', 'summer', 'fall'],
    row_cover_suitable: true,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Heat tolerant leafy green'
  },
  
  // Herbs and companions
  {
    id: 'basil',
    name: 'Basil',
    family: 'Other',
    sun: 'full',
    spacing_in: 12,
    days_to_maturity: 60,
    seasons: ['summer'],
    row_cover_suitable: false,
    needs_pollination: false,
    water_needs: 'medium',
    notes: 'Good companion for tomatoes'
  },
  {
    id: 'marigold',
    name: 'Marigold',
    family: 'Asteraceae',
    sun: 'full',
    spacing_in: 8,
    days_to_maturity: 50,
    seasons: ['spring', 'summer', 'fall'],
    row_cover_suitable: false,
    needs_pollination: false,
    water_needs: 'low',
    notes: 'Pest deterrent, attracts beneficial insects'
  }
]

export function getCropById(id: string): Crop | undefined {
  return crops.find(crop => crop.id === id)
}

export function getCropsByFamily(family: CropFamily): Crop[] {
  return crops.filter(crop => crop.family === family)
}

export function getCropsBySeason(season: Season): Crop[] {
  return crops.filter(crop => crop.seasons.includes(season))
}

export function getCropsBySunRequirement(sun: SunRequirement): Crop[] {
  return crops.filter(crop => crop.sun === sun)
}