import { NextRequest, NextResponse } from 'next/server'
import { createServerClientWithWrite } from '@/lib/supabase/server'
import { LayoutGenerator } from '@/lib/algorithms/layout-generator'
import { MaterialsCalculator } from '@/lib/algorithms/materials-calculator'
import { CropRotationEngine } from '@/lib/algorithms/crop-rotation'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClientWithWrite()
    const wizardData = await request.json()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    
    // Create site
    const { data: site, error: siteError } = await (supabase
      .from('sites') as any)
      .insert({
        user_id: userId,
        name: `Garden Site - ${new Date().toLocaleDateString()}`,
        lat: wizardData.location.lat,
        lng: wizardData.location.lng,
        country_code: 'US',
        usda_zone: wizardData.location.usda_zone,
        last_frost: wizardData.location.last_frost,
        first_frost: wizardData.location.first_frost,
        surface_type: wizardData.surface.type,
        slope_pct: wizardData.surface.slope,
        shade_notes: `${wizardData.surface.sun_hours} hours sun`,
        water_source: wizardData.water.source,
        constraints_json: wizardData,
      })
      .select()
      .single()
    
    if (siteError) throw siteError
    
    // Create plan
    const { data: plan, error: planError } = await (supabase
      .from('plans') as any)
      .insert({
        site_id: site.id,
        name: `Plan v1 - ${new Date().toLocaleDateString()}`,
        version: 1,
        status: 'draft',
      })
      .select()
      .single()
    
    if (planError) throw planError
    
    // Generate layout
    const layoutGenerator = new LayoutGenerator()
    const layout = layoutGenerator.generate({
      totalArea: wizardData.area.total_sqft,
      usableFraction: wizardData.area.usable_fraction,
      shape: wizardData.area.shape,
      surface: wizardData.surface.type,
      waterAccess: wizardData.water.source,
      sunExposure: wizardData.surface.sun_hours >= 6 ? 'full' : 'partial',
      slope: wizardData.surface.slope,
      accessibilityNeeds: wizardData.surface.accessibility_needs,
    })
    
    // Save beds
    if (layout.beds.length > 0) {
      const bedsToInsert = layout.beds.map((bed, index) => ({
        plan_id: plan.id,
        name: bed.name,
        shape: 'rect' as const,
        length_ft: bed.length,
        width_ft: bed.width,
        height_in: bed.height,
        orientation: bed.orientation,
        surface: wizardData.surface.type,
        wicking: bed.isWicking,
        trellis: bed.hasTrellis,
        path_clearance_in: bed.pathWidth,
        order_index: index,
      }))
      
      const { error: bedsError } = await (supabase
        .from('beds') as any)
        .insert(bedsToInsert)
      
      if (bedsError) throw bedsError
    }
    
    // Calculate materials
    const materialsCalculator = new MaterialsCalculator()
    const materials = materialsCalculator.calculate(
      layout.beds,
      wizardData.surface.type,
      wizardData.water.drip_allowed
    )
    
    // Save materials estimate
    const { error: materialsError } = await (supabase
      .from('materials_estimates') as any)
      .insert({
        plan_id: plan.id,
        soil_cuft: materials.soil.cubicFeet,
        compost_cuft: materials.compost.cubicFeet,
        mulch_cuft: materials.mulch.cubicFeet,
        lumber_boardfeet: materials.lumber.boards2x10x8 * 8 + 
                         materials.lumber.boards2x10x10 * 10 + 
                         materials.lumber.boards2x10x12 * 12,
        screws_count: materials.lumber.screws,
        drip_line_ft: materials.irrigation.dripLineFt,
        emitters_count: materials.irrigation.emitters,
        row_cover_sqft: materials.rowCover.coverSqFt,
        cost_estimate_cents: materials.estimated_cost.low * 100,
      })
    
    if (materialsError) throw materialsError
    
    // Generate initial crop rotation
    const rotationEngine = new CropRotationEngine()
    const currentSeason = getCurrentSeason()
    const currentYear = new Date().getFullYear()
    
    const rotation = rotationEngine.generateRotation({
      beds: layout.beds,
      startSeason: currentSeason,
      startYear: currentYear,
      seasonsToplan: 3,
      preferredCrops: wizardData.crops.focus,
      avoidFamilies: wizardData.crops.avoid_families as any,
      sunExposure: wizardData.surface.sun_hours >= 6 ? 'full' : 'partial',
      lastFrostDate: wizardData.location.last_frost ? new Date(wizardData.location.last_frost) : undefined,
      firstFrostDate: wizardData.location.first_frost ? new Date(wizardData.location.first_frost) : undefined,
    })
    
    // Save initial plantings (if any)
    if (rotation.plantings.length > 0) {
      const { data: beds } = await (supabase
        .from('beds') as any)
        .select('id, name')
        .eq('plan_id', plan.id)
      
      if (beds) {
        const bedMap = new Map(beds.map((b: any) => [b.name, b.id]))
        
        const plantingsToInsert = rotation.plantings
          .slice(0, 10) // Limit initial plantings
          .map(planting => {
            const bedId = bedMap.get(`Bed ${planting.bedId.split('-')[1]}`)
            if (!bedId) return null
            
            return {
              bed_id: bedId,
              season: planting.season,
              year: planting.year,
              crop_id: planting.crops[0]?.id,
              variety: planting.crops[0]?.name,
              spacing_in: planting.spacing,
              family: planting.family,
              target_days_to_maturity: planting.crops[0]?.days_to_maturity,
              sowing_method: 'direct' as const,
            }
          })
          .filter(Boolean)
        
        if (plantingsToInsert.length > 0) {
          await (supabase.from('plantings') as any).insert(plantingsToInsert)
        }
      }
    }
    
    // Create initial tasks
    const tasks = generateInitialTasks(plan.id)
    if (tasks.length > 0) {
      await (supabase.from('tasks') as any).insert(tasks)
    }
    
    return NextResponse.json({
      id: plan.id,
      success: true,
      summary: {
        beds: layout.beds.length,
        totalArea: layout.totalBedArea,
        estimatedCost: materials.estimated_cost,
        warnings: layout.warnings,
        suggestions: layout.suggestions,
      }
    })
    
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    )
  }
}

function getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'fall'
  return 'winter'
}

function generateInitialTasks(planId: string) {
  const today = new Date()
  const tasks = []
  
  // Build tasks
  tasks.push({
    plan_id: planId,
    title: 'Purchase lumber and hardware',
    due_on: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'build' as const,
    completed: false,
  })
  
  tasks.push({
    plan_id: planId,
    title: 'Assemble raised beds',
    due_on: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'build' as const,
    completed: false,
  })
  
  tasks.push({
    plan_id: planId,
    title: 'Fill beds with soil mix',
    due_on: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'build' as const,
    completed: false,
  })
  
  tasks.push({
    plan_id: planId,
    title: 'Install drip irrigation',
    due_on: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'build' as const,
    completed: false,
  })
  
  tasks.push({
    plan_id: planId,
    title: 'Plant first crops',
    due_on: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'plant' as const,
    completed: false,
  })
  
  return tasks
}