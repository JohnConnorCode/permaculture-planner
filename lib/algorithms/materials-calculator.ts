import { BedLayout } from './layout-generator'

export interface MaterialsEstimate {
  soil: {
    cubicFeet: number
    cubicYards: number
    bags40lb: number
  }
  compost: {
    cubicFeet: number
    cubicYards: number
    bags40lb: number
  }
  mulch: {
    cubicFeet: number
    cubicYards: number
    bags: number
  }
  lumber: {
    boards2x10x8: number
    boards2x10x10: number
    boards2x10x12: number
    cornerBrackets: number
    screws: number
  }
  sheetMulch: {
    cardboardSqFt: number
    newspaperSqFt: number
  }
  irrigation: {
    dripLineFt: number
    emitters: number
    mainLineFt: number
    timer: boolean
    fittings: number
  }
  wickingBed: {
    pvcPipe4in: number // feet
    geotextileSqFt: number
    gravelCubicFt: number
    overflowFitting: number
  }
  rowCover: {
    coverSqFt: number
    hoops: number
    clips: number
  }
  estimated_cost: {
    low: number
    high: number
  }
}

export class MaterialsCalculator {
  calculate(beds: BedLayout[], surface: 'soil' | 'hard', enableDrip: boolean = true): MaterialsEstimate {
    let soilCuFt = 0
    let compostCuFt = 0
    let mulchCuFt = 0
    let cardboardSqFt = 0
    let lumberBoardFeet = 0
    let dripLineFt = 0
    let emitterCount = 0
    let rowCoverSqFt = 0
    let wickingMaterials = {
      pvcPipe: 0,
      geotextile: 0,
      gravel: 0,
      overflowCount: 0
    }
    
    beds.forEach(bed => {
      const bedAreaSqFt = bed.width * bed.length
      const bedVolumeCuFt = bedAreaSqFt * (bed.height / 12)
      
      // Soil calculations
      if (bed.isWicking) {
        // Wicking bed: 1/3 gravel reservoir, 2/3 soil
        wickingMaterials.gravel += bedVolumeCuFt * 0.33
        soilCuFt += bedVolumeCuFt * 0.67
        
        // Wicking bed materials
        wickingMaterials.pvcPipe += bed.length // Perforated pipe length
        wickingMaterials.geotextile += bedAreaSqFt // Separator fabric
        wickingMaterials.overflowCount += 1 // One overflow per bed
      } else {
        // Regular raised bed
        if (surface === 'soil') {
          // For on-ground beds: 70% soil, 30% compost
          soilCuFt += bedVolumeCuFt * 0.7
          compostCuFt += bedVolumeCuFt * 0.3
        } else {
          // For hard surface: 50% soil, 30% compost, 20% perlite (counted as soil)
          soilCuFt += bedVolumeCuFt * 0.7
          compostCuFt += bedVolumeCuFt * 0.3
        }
      }
      
      // Sheet mulching for on-ground beds
      if (surface === 'soil') {
        cardboardSqFt += bedAreaSqFt * 1.1 // 10% overlap
        mulchCuFt += bedAreaSqFt * (3/12) // 3 inches of mulch
      }
      
      // Path mulching
      const pathAreaSqFt = bed.length * (bed.pathWidth / 12)
      if (surface === 'soil') {
        mulchCuFt += pathAreaSqFt * (4/12) // 4 inches for paths
      }
      
      // Lumber calculation
      const perimeter = (bed.width + bed.length) * 2
      lumberBoardFeet += perimeter // Simplified: 1 board foot per linear foot
      
      // Drip irrigation
      if (enableDrip) {
        // Two lines per bed for beds wider than 2 feet
        const lines = bed.width > 2 ? 2 : 1
        dripLineFt += bed.length * lines
        // Emitters every 12 inches
        emitterCount += Math.ceil(bed.length) * lines
      }
      
      // Row cover for suitable beds
      // Assume 50% of beds need row covers
      if (beds.indexOf(bed) % 2 === 0) {
        rowCoverSqFt += bedAreaSqFt * 1.2 // 20% extra for draping
      }
    })
    
    // Convert to standard units and packages
    const lumber = this.calculateLumber(lumberBoardFeet, beds.length)
    
    // Cost estimates (rough)
    const costLow = 
      (soilCuFt * 2) + // $2/cu ft soil
      (compostCuFt * 3) + // $3/cu ft compost  
      (mulchCuFt * 1.5) + // $1.50/cu ft mulch
      (lumber.boards2x10x8 * 25) + // $25 per 8ft board
      (lumber.boards2x10x10 * 32) + // $32 per 10ft board
      (lumber.boards2x10x12 * 38) + // $38 per 12ft board
      (enableDrip ? dripLineFt * 0.5 + emitterCount * 0.25 + 50 : 0) + // Irrigation
      (rowCoverSqFt * 0.15) // Row cover
    
    const costHigh = costLow * 1.5 // 50% higher for premium materials
    
    return {
      soil: {
        cubicFeet: Math.ceil(soilCuFt),
        cubicYards: Math.ceil(soilCuFt / 27),
        bags40lb: Math.ceil(soilCuFt * 1.5) // Approx 1.5 bags per cu ft
      },
      compost: {
        cubicFeet: Math.ceil(compostCuFt),
        cubicYards: Math.ceil(compostCuFt / 27),
        bags40lb: Math.ceil(compostCuFt * 1.5)
      },
      mulch: {
        cubicFeet: Math.ceil(mulchCuFt),
        cubicYards: Math.ceil(mulchCuFt / 27),
        bags: Math.ceil(mulchCuFt / 2) // 2 cu ft bags
      },
      lumber,
      sheetMulch: {
        cardboardSqFt: Math.ceil(cardboardSqFt),
        newspaperSqFt: 0 // Alternative to cardboard
      },
      irrigation: {
        dripLineFt: Math.ceil(dripLineFt),
        emitters: emitterCount,
        mainLineFt: Math.ceil(dripLineFt * 0.2), // Estimate 20% for main lines
        timer: enableDrip,
        fittings: Math.ceil(beds.length * 3) // Rough estimate
      },
      wickingBed: {
        pvcPipe4in: Math.ceil(wickingMaterials.pvcPipe),
        geotextileSqFt: Math.ceil(wickingMaterials.geotextile),
        gravelCubicFt: Math.ceil(wickingMaterials.gravel),
        overflowFitting: wickingMaterials.overflowCount
      },
      rowCover: {
        coverSqFt: Math.ceil(rowCoverSqFt),
        hoops: Math.ceil(rowCoverSqFt / 20), // One hoop per 20 sq ft
        clips: Math.ceil(rowCoverSqFt / 5) // Clips every 5 sq ft
      },
      estimated_cost: {
        low: Math.round(costLow),
        high: Math.round(costHigh)
      }
    }
  }
  
  private calculateLumber(
    totalBoardFeet: number,
    bedCount: number
  ): MaterialsEstimate['lumber'] {
    // Optimize lumber cuts
    // Assuming 2x10 boards for raised beds
    let remaining = totalBoardFeet
    let boards8 = 0
    let boards10 = 0
    let boards12 = 0
    
    // Try to use 12ft boards first (most efficient)
    boards12 = Math.floor(remaining / 12)
    remaining = remaining % 12
    
    // Then 10ft boards
    if (remaining >= 10) {
      boards10 = 1
      remaining -= 10
    }
    
    // Finally 8ft boards
    if (remaining > 0) {
      boards8 = Math.ceil(remaining / 8)
    }
    
    return {
      boards2x10x8: boards8,
      boards2x10x10: boards10,
      boards2x10x12: boards12,
      cornerBrackets: bedCount * 4,
      screws: bedCount * 24 // 6 screws per corner
    }
  }
  
  generateShoppingList(estimate: MaterialsEstimate): string[] {
    const items: string[] = []
    
    // Soil and amendments
    if (estimate.soil.cubicYards > 2) {
      items.push(`${estimate.soil.cubicYards} cubic yards raised bed soil mix (bulk delivery)`)
    } else {
      items.push(`${estimate.soil.bags40lb} bags (40 lb) raised bed soil`)
    }
    
    if (estimate.compost.cubicYards > 1) {
      items.push(`${estimate.compost.cubicYards} cubic yards compost (bulk delivery)`)
    } else {
      items.push(`${estimate.compost.bags40lb} bags (40 lb) compost`)
    }
    
    if (estimate.mulch.cubicYards > 2) {
      items.push(`${estimate.mulch.cubicYards} cubic yards wood mulch (bulk delivery)`)
    } else {
      items.push(`${estimate.mulch.bags} bags (2 cu ft) wood mulch`)
    }
    
    // Lumber
    if (estimate.lumber.boards2x10x8 > 0) {
      items.push(`${estimate.lumber.boards2x10x8} - 2x10x8' cedar or pine boards`)
    }
    if (estimate.lumber.boards2x10x10 > 0) {
      items.push(`${estimate.lumber.boards2x10x10} - 2x10x10' cedar or pine boards`)
    }
    if (estimate.lumber.boards2x10x12 > 0) {
      items.push(`${estimate.lumber.boards2x10x12} - 2x10x12' cedar or pine boards`)
    }
    items.push(`${estimate.lumber.cornerBrackets} corner brackets`)
    items.push(`${estimate.lumber.screws} exterior wood screws (2.5")`)
    
    // Irrigation
    if (estimate.irrigation.timer) {
      items.push(`${estimate.irrigation.dripLineFt} ft - 1/4" drip line`)
      items.push(`${estimate.irrigation.emitters} - 0.5 GPH drip emitters`)
      items.push(`${estimate.irrigation.mainLineFt} ft - 1/2" main irrigation line`)
      items.push(`1 - Hose timer (2 zone recommended)`)
      items.push(`${estimate.irrigation.fittings} - Assorted drip fittings`)
    }
    
    // Wicking bed materials
    if (estimate.wickingBed.pvcPipe4in > 0) {
      items.push(`${estimate.wickingBed.pvcPipe4in} ft - 4" perforated PVC pipe`)
      items.push(`${estimate.wickingBed.geotextileSqFt} sq ft - Landscape fabric/geotextile`)
      items.push(`${estimate.wickingBed.gravelCubicFt} cu ft - Pea gravel`)
      items.push(`${estimate.wickingBed.overflowFitting} - Overflow bulkhead fittings`)
    }
    
    // Row covers
    if (estimate.rowCover.coverSqFt > 0) {
      items.push(`${estimate.rowCover.coverSqFt} sq ft - Floating row cover (0.5 oz)`)
      items.push(`${estimate.rowCover.hoops} - Row cover hoops`)
      items.push(`${estimate.rowCover.clips} - Row cover clips`)
    }
    
    // Sheet mulch
    if (estimate.sheetMulch.cardboardSqFt > 0) {
      items.push(`${Math.ceil(estimate.sheetMulch.cardboardSqFt / 20)} - Large cardboard sheets`)
    }
    
    return items
  }
}