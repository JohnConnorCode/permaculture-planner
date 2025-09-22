# Permaculture Planner v1.1 - Algorithm Specifications

## 1. Layout Generation Algorithm

### 1.1 Core Algorithm

```typescript
interface LayoutConstraints {
  totalArea: number         // sq ft
  usableFraction: number   // 0.0-1.0
  shape: 'rectangular' | 'L-shaped' | 'scattered'
  surface: 'soil' | 'hard'
  sunHours: number         // 0-14
  slope: number           // 0-100%
  waterAccess: 'spigot' | 'rain' | 'none'
  accessibility: boolean
  seed?: number          // For deterministic generation
}

interface BedDimensions {
  width: number   // feet
  length: number  // feet  
  height: number  // inches
  pathWidth: number // inches
}

function generateLayout(constraints: LayoutConstraints): Layout {
  const rng = seedRandom(constraints.seed || Date.now())
  const usableArea = constraints.totalArea * constraints.usableFraction
  
  // Step 1: Determine bed dimensions
  const bedDims = calculateBedDimensions(constraints)
  
  // Step 2: Calculate grid dimensions
  const grid = calculateGrid(usableArea, bedDims, constraints.shape)
  
  // Step 3: Pack beds using greedy algorithm
  const beds = packBeds(grid, bedDims, constraints, rng)
  
  // Step 4: Optimize orientation and placement
  optimizePlacement(beds, constraints)
  
  // Step 5: Add features (trellises, wicking)
  addFeatures(beds, constraints)
  
  // Step 6: Calculate metrics
  const metrics = calculateMetrics(beds, usableArea)
  
  return { beds, metrics, seed: constraints.seed }
}
```

### 1.2 Bed Dimension Rules

```typescript
function calculateBedDimensions(constraints: LayoutConstraints): BedDimensions {
  // Width rules
  let width = 4.0 // Default 4 feet
  if (constraints.accessibility) {
    width = 3.0 // Narrower for wheelchair access
  }
  if (constraints.totalArea < 100) {
    width = Math.min(width, 3.0) // Narrower for tiny spaces
  }
  
  // Height rules  
  let height = 12 // Default 12 inches
  if (constraints.surface === 'hard') {
    height = Math.max(height, 12) // Minimum 12" for hard surfaces
  }
  if (constraints.accessibility) {
    height = 24 // Higher for seated access
  }
  
  // Path width rules
  let pathWidth = 24 // Default 24 inches
  if (constraints.accessibility) {
    pathWidth = 36 // Wider for wheelchairs
  }
  if (constraints.totalArea < 200) {
    pathWidth = Math.min(pathWidth, 18) // Minimum viable path
  }
  
  // Length is determined during packing
  return { width, length: 0, height, pathWidth }
}
```

### 1.3 Bed Packing Algorithm

```typescript
function packBeds(grid: Grid, dims: BedDimensions, constraints: LayoutConstraints, rng: RNG): Bed[] {
  const beds: Bed[] = []
  const lengthOptions = [4, 6, 8, 10, 12] // Standard lumber sizes
  
  // Sort by preference based on space
  const preferredLengths = constraints.totalArea > 400 
    ? [8, 10, 12, 6, 4]
    : [4, 6, 8]
  
  let currentX = 0
  let currentY = 0
  let bedCount = 0
  
  while (currentY + dims.width <= grid.height) {
    currentX = 0
    let rowBeds: Bed[] = []
    
    while (currentX + dims.width <= grid.width) {
      // Select best fitting length
      const remainingWidth = grid.width - currentX
      const length = selectBestLength(preferredLengths, remainingWidth, dims.pathWidth)
      
      if (length > 0) {
        const bed: Bed = {
          id: `bed-${bedCount++}`,
          x: currentX,
          y: currentY,
          width: dims.width,
          length: length,
          height: dims.height,
          orientation: determineOrientation(constraints, currentY, grid.height)
        }
        rowBeds.push(bed)
        currentX += length + (dims.pathWidth / 12) // Convert to feet
      } else {
        break
      }
    }
    
    // Add row if it has beds
    if (rowBeds.length > 0) {
      beds.push(...rowBeds)
      currentY += dims.width + (dims.pathWidth / 12)
    } else {
      break
    }
  }
  
  return beds
}

function selectBestLength(
  options: number[], 
  available: number, 
  pathWidth: number
): number {
  const pathFeet = pathWidth / 12
  
  for (const length of options) {
    if (length + pathFeet <= available) {
      return length
    }
  }
  
  // Custom length if space allows
  const custom = Math.floor(available - pathFeet)
  return custom >= 3 ? custom : 0 // Minimum 3 feet
}
```

### 1.4 Orientation Optimization

```typescript
function determineOrientation(
  constraints: LayoutConstraints,
  yPosition: number,
  totalHeight: number
): 'NS' | 'EW' {
  // Default north-south for even sun exposure
  let orientation: 'NS' | 'EW' = 'NS'
  
  // Override for specific conditions
  if (constraints.slope > 5) {
    // East-west on slopes for erosion control
    orientation = 'EW'
  }
  
  // Place tall crops on north side
  const isNorthernBed = yPosition > totalHeight * 0.7
  if (isNorthernBed) {
    // Mark for trellis/tall crops
    return 'NS' // Keep NS but flag for trellis
  }
  
  return orientation
}
```

## 2. Materials Calculator Algorithm

### 2.1 Soil Volume Calculation

```typescript
interface MaterialsEstimate {
  soil: SoilEstimate
  lumber: LumberEstimate
  irrigation: IrrigationEstimate
  amendments: AmendmentsEstimate
  cost: CostEstimate
}

function calculateMaterials(beds: Bed[], constraints: LayoutConstraints): MaterialsEstimate {
  const soil = calculateSoil(beds, constraints)
  const lumber = calculateLumber(beds)
  const irrigation = calculateIrrigation(beds, constraints)
  const amendments = calculateAmendments(beds, constraints)
  const cost = calculateCost(soil, lumber, irrigation, amendments)
  
  return { soil, lumber, irrigation, amendments, cost }
}

function calculateSoil(beds: Bed[], constraints: LayoutConstraints): SoilEstimate {
  let totalVolume = 0
  let wickingGravel = 0
  
  for (const bed of beds) {
    const volumeCuFt = (bed.width * bed.length * bed.height) / 12
    
    if (bed.isWicking) {
      // Wicking beds: 1/3 gravel, 2/3 soil
      wickingGravel += volumeCuFt * 0.33
      totalVolume += volumeCuFt * 0.67
    } else {
      totalVolume += volumeCuFt
    }
  }
  
  // Add 10% safety margin
  totalVolume *= 1.1
  
  // Soil mix ratios
  let topsoil = 0
  let compost = 0
  let perlite = 0
  
  if (constraints.surface === 'soil') {
    // On-ground: 60% topsoil, 40% compost
    topsoil = totalVolume * 0.6
    compost = totalVolume * 0.4
  } else {
    // Hard surface: 40% topsoil, 40% compost, 20% perlite
    topsoil = totalVolume * 0.4
    compost = totalVolume * 0.4
    perlite = totalVolume * 0.2
  }
  
  // Sheet mulching for on-ground
  let cardboard = 0
  let mulch = 0
  
  if (constraints.surface === 'soil') {
    const bedArea = beds.reduce((sum, bed) => sum + bed.width * bed.length, 0)
    cardboard = bedArea * 1.15 // 15% overlap
    mulch = bedArea * (3/12) // 3 inches deep
    
    // Path mulching
    const pathArea = calculatePathArea(beds)
    mulch += pathArea * (4/12) // 4 inches for paths
  }
  
  return {
    topsoilCuFt: Math.ceil(topsoil),
    compostCuFt: Math.ceil(compost),
    perliteCuFt: Math.ceil(perlite),
    mulchCuFt: Math.ceil(mulch),
    cardboardSqFt: Math.ceil(cardboard),
    gravelCuFt: Math.ceil(wickingGravel),
    totalCuFt: Math.ceil(totalVolume),
    totalCuYd: Math.ceil(totalVolume / 27)
  }
}
```

### 2.2 Lumber Optimization

```typescript
function calculateLumber(beds: Bed[]): LumberEstimate {
  const cuts: Cut[] = []
  
  for (const bed of beds) {
    // Calculate perimeter
    const perimeter = (bed.width + bed.length) * 2
    
    // For 12" height, need 2 layers of 2x6 or 1 layer of 2x12
    const boardHeight = bed.height <= 6 ? 6 : 12
    const layers = Math.ceil(bed.height / boardHeight)
    
    // Generate cuts for each side
    cuts.push(
      { length: bed.length, quantity: 2 * layers },
      { length: bed.width, quantity: 2 * layers }
    )
  }
  
  // Optimize cuts from standard lumber
  const optimization = optimizeLumberCuts(cuts)
  
  return {
    boards: optimization.boards,
    totalBoardFeet: optimization.totalBoardFeet,
    waste: optimization.wastePercentage,
    screws: beds.length * 24, // 6 per corner
    cornerBrackets: beds.length * 4,
    cuts: optimization.cutList
  }
}

function optimizeLumberCuts(cuts: Cut[]): LumberOptimization {
  const availableLengths = [8, 10, 12, 16] // Standard lengths
  const boards: BoardCount = {}
  let totalWaste = 0
  
  // Sort cuts by length descending
  cuts.sort((a, b) => b.length - a.length)
  
  // Bin packing algorithm
  const bins: Bin[] = []
  
  for (const cut of cuts) {
    for (let i = 0; i < cut.quantity; i++) {
      let placed = false
      
      // Try to fit in existing bin
      for (const bin of bins) {
        if (bin.remaining >= cut.length) {
          bin.cuts.push(cut.length)
          bin.remaining -= cut.length
          placed = true
          break
        }
      }
      
      // Create new bin if needed
      if (!placed) {
        const binLength = selectBoardLength(cut.length, availableLengths)
        bins.push({
          length: binLength,
          cuts: [cut.length],
          remaining: binLength - cut.length
        })
        boards[binLength] = (boards[binLength] || 0) + 1
      }
    }
  }
  
  // Calculate waste
  for (const bin of bins) {
    totalWaste += bin.remaining
  }
  
  const totalLength = bins.reduce((sum, bin) => sum + bin.length, 0)
  const wastePercentage = (totalWaste / totalLength) * 100
  
  return {
    boards,
    totalBoardFeet: totalLength,
    wastePercentage,
    cutList: bins
  }
}
```

## 3. Crop Rotation Algorithm

### 3.1 Rotation State Machine

```typescript
interface RotationState {
  bedId: string
  history: PlantingHistory[]
  currentFamily?: PlantFamily
  blockedFamilies: Set<PlantFamily>
  lastPlantingDate?: Date
}

interface PlantingHistory {
  season: Season
  year: number
  family: PlantFamily
  crops: string[]
}

class RotationEngine {
  private states: Map<string, RotationState> = new Map()
  private readonly ROTATION_YEARS = 3
  private readonly FAMILY_COOLDOWN = 2 // years
  
  generateRotation(
    beds: Bed[],
    startSeason: Season,
    startYear: number,
    seasons: number,
    preferences: CropPreferences
  ): RotationPlan {
    // Initialize states
    for (const bed of beds) {
      this.states.set(bed.id, {
        bedId: bed.id,
        history: [],
        blockedFamilies: new Set()
      })
    }
    
    const plantings: Planting[] = []
    const conflicts: Conflict[] = []
    
    // Generate for each season
    for (let s = 0; s < seasons; s++) {
      const currentSeason = this.advanceSeason(startSeason, s)
      const currentYear = startYear + Math.floor((this.seasonIndex(startSeason) + s) / 4)
      
      for (const bed of beds) {
        const state = this.states.get(bed.id)!
        const planting = this.selectPlanting(
          bed,
          state,
          currentSeason,
          currentYear,
          preferences
        )
        
        if (planting) {
          plantings.push(planting)
          this.updateState(state, planting)
        } else {
          conflicts.push({
            bedId: bed.id,
            season: currentSeason,
            year: currentYear,
            reason: 'No valid crops available due to rotation constraints'
          })
        }
      }
    }
    
    return { plantings, conflicts }
  }
  
  private selectPlanting(
    bed: Bed,
    state: RotationState,
    season: Season,
    year: number,
    preferences: CropPreferences
  ): Planting | null {
    // Get available crops for season
    const seasonalCrops = this.getCropsForSeason(season, preferences)
    
    // Filter by rotation constraints
    const validCrops = seasonalCrops.filter(crop => 
      !state.blockedFamilies.has(crop.family)
    )
    
    if (validCrops.length === 0) {
      return null
    }
    
    // Score and rank crops
    const scored = validCrops.map(crop => ({
      crop,
      score: this.scoreCrop(crop, bed, state, preferences)
    }))
    
    scored.sort((a, b) => b.score - a.score)
    
    // Select top crop and companions
    const primary = scored[0].crop
    const companions = this.selectCompanions(primary, scored.slice(1))
    
    return {
      bedId: bed.id,
      season,
      year,
      family: primary.family,
      crops: [primary.id, ...companions.map(c => c.id)],
      spacing: primary.spacing,
      notes: this.generateNotes(primary, bed, season)
    }
  }
  
  private updateState(state: RotationState, planting: Planting): void {
    // Add to history
    state.history.push({
      season: planting.season,
      year: planting.year,
      family: planting.family,
      crops: planting.crops
    })
    
    // Update blocked families
    state.blockedFamilies.clear()
    
    // Block families from last FAMILY_COOLDOWN years
    const cutoffYear = planting.year - this.FAMILY_COOLDOWN
    for (const entry of state.history) {
      if (entry.year > cutoffYear) {
        state.blockedFamilies.add(entry.family)
      }
    }
    
    state.currentFamily = planting.family
  }
  
  private scoreCrop(
    crop: Crop,
    bed: Bed,
    state: RotationState,
    preferences: CropPreferences
  ): number {
    let score = 50 // Base score
    
    // Preference bonus
    if (preferences.preferred.includes(crop.id)) {
      score += 30
    }
    
    // Nitrogen fixing bonus after heavy feeders
    if (crop.family === 'Fabaceae' && state.currentFamily === 'Solanaceae') {
      score += 20
    }
    
    // Light feeder after heavy feeder
    if (crop.nutrientNeeds === 'light' && this.wasHeavyFeeder(state.currentFamily)) {
      score += 15
    }
    
    // Trellis crop for beds with trellis
    if (bed.hasTrellis && crop.needsTrellis) {
      score += 25
    }
    
    // Water-loving crops for wicking beds
    if (bed.isWicking && crop.waterNeeds === 'high') {
      score += 20
    }
    
    // Diversity bonus
    const recentFamilies = this.getRecentFamilies(state, 2)
    if (!recentFamilies.has(crop.family)) {
      score += 10
    }
    
    return score
  }
}
```

## 4. Irrigation Planning Algorithm

### 4.1 Zone Configuration

```typescript
function planIrrigation(
  beds: Bed[],
  constraints: LayoutConstraints
): IrrigationPlan {
  // Group beds into zones
  const zones = groupBedsIntoZones(beds, constraints)
  
  // Calculate water requirements
  for (const zone of zones) {
    zone.waterRequirements = calculateWaterNeeds(zone)
  }
  
  // Size components
  const components = sizeIrrigationComponents(zones, constraints)
  
  // Generate schedule
  const schedule = generateWateringSchedule(zones, constraints)
  
  return { zones, components, schedule }
}

function groupBedsIntoZones(
  beds: Bed[],
  constraints: LayoutConstraints
): IrrigationZone[] {
  const zones: IrrigationZone[] = []
  const maxBedsPerZone = 4
  
  // Group by proximity and type
  const regularBeds = beds.filter(b => !b.isWicking)
  const wickingBeds = beds.filter(b => b.isWicking)
  
  // Create zones for regular beds
  for (let i = 0; i < regularBeds.length; i += maxBedsPerZone) {
    zones.push({
      id: `zone-${zones.length + 1}`,
      method: 'drip',
      beds: regularBeds.slice(i, i + maxBedsPerZone),
      runtime: 0, // Calculated next
      frequency: 0
    })
  }
  
  // Wicking beds don't need zones (manual fill)
  if (wickingBeds.length > 0) {
    zones.push({
      id: `zone-wicking`,
      method: 'SIP',
      beds: wickingBeds,
      runtime: 0,
      frequency: 7 // Weekly fill
    })
  }
  
  return zones
}

function calculateWaterNeeds(zone: IrrigationZone): WaterRequirements {
  const ET_RATE = 0.25 // inches per day (simplified)
  const DRIP_EFFICIENCY = 0.90
  const MULCH_REDUCTION = 0.70
  
  let totalArea = 0
  for (const bed of zone.beds) {
    totalArea += bed.width * bed.length
  }
  
  // Daily water need in gallons
  const dailyInches = ET_RATE * MULCH_REDUCTION
  const dailyGallons = (totalArea * dailyInches * 0.623) / DRIP_EFFICIENCY
  
  // Runtime calculation
  const emitterGPH = 0.5
  const emitterSpacing = 12 // inches
  const emitterCount = Math.ceil(totalArea * 144 / (emitterSpacing * emitterSpacing))
  const totalGPH = emitterCount * emitterGPH
  
  const runtimeMinutes = (dailyGallons / totalGPH) * 60
  
  return {
    dailyGallons,
    weeklyGallons: dailyGallons * 7,
    runtimeMinutes: Math.ceil(runtimeMinutes),
    emitterCount,
    dripLineFeet: Math.ceil(totalArea * 2) // 2 lines per bed
  }
}
```

## 5. Plan Quality Score Algorithm

### 5.1 Scoring Rubric

```typescript
interface QualityScore {
  total: number // 0-100
  breakdown: ScoreBreakdown
  issues: QualityIssue[]
  improvements: Improvement[]
}

interface ScoreBreakdown {
  sunAlignment: number     // 0-20
  orientation: number      // 0-15
  rotationHealth: number   // 0-20
  waterEfficiency: number  // 0-15
  spaceUtilization: number // 0-15
  accessibility: number    // 0-10
  seasonCoverage: number   // 0-5
}

function calculateQualityScore(
  plan: Plan,
  constraints: LayoutConstraints
): QualityScore {
  const breakdown: ScoreBreakdown = {
    sunAlignment: scoreSunAlignment(plan, constraints),
    orientation: scoreOrientation(plan),
    rotationHealth: scoreRotation(plan),
    waterEfficiency: scoreWaterEfficiency(plan, constraints),
    spaceUtilization: scoreSpaceUtilization(plan, constraints),
    accessibility: scoreAccessibility(plan, constraints),
    seasonCoverage: scoreSeasonCoverage(plan)
  }
  
  const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0)
  
  const issues = identifyIssues(plan, breakdown, constraints)
  const improvements = suggestImprovements(plan, issues, constraints)
  
  return { total, breakdown, issues, improvements }
}

function scoreSunAlignment(
  plan: Plan,
  constraints: LayoutConstraints
): number {
  const maxScore = 20
  let score = maxScore
  
  // Check if sun-loving crops are in full sun
  for (const planting of plan.plantings) {
    const crop = getCrop(planting.cropId)
    
    if (crop.sun === 'full' && constraints.sunHours < 6) {
      score -= 5
    }
    if (crop.sun === 'partial' && constraints.sunHours > 10) {
      score -= 2 // Partial shade crops in full sun
    }
  }
  
  return Math.max(0, score)
}

function scoreRotation(plan: Plan): number {
  const maxScore = 20
  let violations = 0
  
  // Check for family repetitions
  const bedHistories = new Map<string, PlantingHistory[]>()
  
  for (const planting of plan.plantings) {
    const history = bedHistories.get(planting.bedId) || []
    
    // Check last 2 years
    const recentFamilies = history
      .filter(h => planting.year - h.year <= 2)
      .map(h => h.family)
    
    if (recentFamilies.includes(planting.family)) {
      violations++
    }
    
    history.push({
      year: planting.year,
      season: planting.season,
      family: planting.family
    })
    
    bedHistories.set(planting.bedId, history)
  }
  
  // Deduct 4 points per violation
  const score = maxScore - (violations * 4)
  return Math.max(0, score)
}

function identifyIssues(
  plan: Plan,
  breakdown: ScoreBreakdown,
  constraints: LayoutConstraints
): QualityIssue[] {
  const issues: QualityIssue[] = []
  
  if (breakdown.sunAlignment < 10) {
    issues.push({
      category: 'sun',
      severity: 'warning',
      message: 'Some sun-loving crops may not receive adequate light',
      fix: 'Consider moving tomatoes and peppers to sunnier location or choosing shade-tolerant alternatives'
    })
  }
  
  if (breakdown.rotationHealth < 10) {
    issues.push({
      category: 'rotation',
      severity: 'error',
      message: 'Crop rotation violations detected',
      fix: 'Avoid planting same family in beds within 2 years'
    })
  }
  
  if (breakdown.waterEfficiency < 8) {
    issues.push({
      category: 'water',
      severity: 'info',
      message: 'Water efficiency could be improved',
      fix: 'Consider drip irrigation or wicking beds for water conservation'
    })
  }
  
  if (breakdown.spaceUtilization < 8) {
    issues.push({
      category: 'space',
      severity: 'info',
      message: `Only using ${Math.round(breakdown.spaceUtilization * 5)}% of available space`,
      fix: 'Consider adding more beds or widening paths for accessibility'
    })
  }
  
  return issues
}
```

## 6. Deterministic Generation

### 6.1 Seeded Random Number Generator

```typescript
class SeededRandom {
  private seed: number
  
  constructor(seed: number) {
    this.seed = seed
  }
  
  // Park-Miller PRNG
  next(): number {
    this.seed = (this.seed * 16807) % 2147483647
    return (this.seed - 1) / 2147483646
  }
  
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }
  
  shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i)
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }
  
  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)]
  }
}

// Usage in layout generation
function generateDeterministicLayout(
  constraints: LayoutConstraints,
  seed: number
): Layout {
  const rng = new SeededRandom(seed)
  
  // All randomized decisions use rng
  const bedOrder = rng.shuffle(possibleBeds)
  const orientation = rng.choice(['NS', 'EW'])
  
  // Result is deterministic for same seed
  return generateLayout({ ...constraints, seed })
}
```

## 7. Conflict Resolution

### 7.1 Constraint Solver

```typescript
interface Constraint {
  type: 'hard' | 'soft'
  check: (plan: Plan) => boolean
  penalty: number
  fix?: (plan: Plan) => Plan
}

class ConstraintSolver {
  private constraints: Constraint[] = [
    {
      type: 'hard',
      check: (plan) => plan.beds.every(b => b.width <= 4),
      penalty: Infinity,
      fix: (plan) => {
        plan.beds.forEach(b => {
          if (b.width > 4) b.width = 4
        })
        return plan
      }
    },
    {
      type: 'soft',
      check: (plan) => plan.beds.every(b => b.orientation === 'NS'),
      penalty: 10
    },
    {
      type: 'hard',
      check: (plan) => !this.hasRotationViolations(plan),
      penalty: 100,
      fix: (plan) => this.fixRotationViolations(plan)
    }
  ]
  
  solve(plan: Plan, maxIterations: number = 100): Plan {
    let current = plan
    let iteration = 0
    
    while (iteration < maxIterations) {
      const violations = this.findViolations(current)
      
      if (violations.length === 0) {
        break
      }
      
      // Fix hard constraints first
      const hardViolations = violations.filter(v => v.type === 'hard')
      if (hardViolations.length > 0 && hardViolations[0].fix) {
        current = hardViolations[0].fix(current)
      } else {
        // Try to improve soft constraints
        current = this.improveplan(current, violations)
      }
      
      iteration++
    }
    
    return current
  }
  
  private findViolations(plan: Plan): Constraint[] {
    return this.constraints.filter(c => !c.check(plan))
  }
  
  private hasRotationViolations(plan: Plan): boolean {
    // Implementation from rotation algorithm
    return false
  }
  
  private fixRotationViolations(plan: Plan): Plan {
    // Swap crops between beds to resolve violations
    return plan
  }
}
```