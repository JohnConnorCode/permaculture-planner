# Permaculture Planner: Tools vs Demo Analysis

## Executive Summary

The current codebase has **tools** and **demo** functionality that are architecturally separate but tightly entangled through shared components, state management patterns, and data flow. The separation is incomplete and creates confusion about intended usage, testing complexity, and future maintenance challenges.

---

## 1. WHAT ARE "TOOLS"?

### Definition
"Tools" are interactive utilities for permaculture garden planning available at `/tools` route.

### Location & Structure
- **Route**: `/app/tools/page.tsx` (120 lines)
- **Navigation Label**: "Tools" with Settings icon
- **UI Pattern**: Tab-based interface with multiple planning modules

### Tools Components
```
/app/tools/page.tsx contains:
├── PermacultureDesigner (legacy canvas component)
│   ├── Manual canvas drawing with HTML5/SVG
│   ├── Tool palette: select, draw, plant, structure, delete
│   ├── No tldraw integration
│   └── ~400+ lines
│
├── WaterWasteModule
│   ├── Rainwater harvesting calculator
│   ├── Greywater system planning
│   ├── Composting system design
│   └── Interactive sliders/inputs
│
└── ExportPanel
    └── PDF/JSON export functionality
```

### Tool System Architecture
**Two Parallel Tool Systems Exist**:

1. **Legacy `/modules/tools/` System**:
   - Location: `/modules/tools/`
   - Classes: BaseTool, DrawBedTool, DrawPathTool, MeasureTool, SelectTool, etc.
   - Type: Abstract class-based architecture
   - State: Own scene management (ToolContext, Node system)
   - Status: **Unused in current codebase**

2. **Modern tldraw Tools** (Active):
   - Location: `/components/tldraw/tools/`
   - Classes: BedTool, PlantTool, ElementTool
   - Type: StateNode extension (tldraw framework)
   - Integration: Used in PermacultureCanvasIntegrated
   - Status: **Actively used in demo and plans**

### Key Issue #1: Dual Tool Systems
```
The codebase maintains TWO completely separate tool implementations:
- /modules/tools/ → Orphaned legacy system
- /components/tldraw/tools/ → Active modern system

This creates:
- Code duplication
- Maintenance confusion
- Testing complexity
- Unclear API surface
```

---

## 2. WHAT IS "DEMO"?

### Definition
"Demo" is a free, browser-based interactive garden planner with localStorage persistence at `/demo` route.

### Location & Structure
- **Route**: `/app/demo/page.tsx` (220 lines)
- **Navigation Label**: "Demo" with Layers icon
- **Persistence**: localStorage-based
- **Data**: STARTER_GARDEN (example herb + veggie beds)

### Demo Architecture
```typescript
Demo Page Structure:
├── Suspense wrapper for SSR safety
├── DemoPageContent (main component)
│   ├── State Management
│   │   ├── gardenData (useState)
│   │   ├── isLoading (useState)
│   │   ├── loadError (useState)
│   │   └── useDemoPersistence hook
│   │
│   ├── Data Loading Logic
│   │   ├── Priority 1: Load from planId (wizard/saved plans)
│   │   ├── Priority 2: Load from localStorage (demo mode)
│   │   └── Fallback: STARTER_GARDEN
│   │
│   ├── Handlers
│   │   ├── handleCanvasChange (auto-save)
│   │   ├── handleSave (explicit save)
│   │   ├── handleExport (JSON download)
│   │   ├── handleImport (JSON upload)
│   │   └── handleClear (reset design)
│   │
│   └── UI
│       ├── Error alert banner
│       └── PermacultureEditorIntegrated (full editor)
```

### Demo Persistence
- **Hook**: `useDemoPersistence` (360 lines)
- **Features**:
  - Debounced auto-save (3s delay)
  - localStorage quota management
  - Data validation on load
  - JSON import/export
  - Metadata tracking (lastSaved, name)
- **Storage Keys**:
  - `permaculture_demo_plan` (garden data)
  - `permaculture_demo_metadata` (metadata)

### Key Issue #2: Demo-Specific Infrastructure
```
Demo has specialized persistence infrastructure that is:
- Only used for /demo route
- Named specifically "demo" (not reusable for saved plans)
- Tightly coupled to localStorage patterns
- Has error handling specific to browser limitations
```

---

## 3. HOW TOOLS AND DEMO ARE MIXED

### 3.1 Shared Component Infrastructure

```typescript
Both /tools and /demo use these components:
┌─────────────────────────────────────┐
│ PermacultureEditorIntegrated        │ ← SHARED
│ (Full featured editor with 32 panels)│
└─────────────────────────────────────┘
           ↑                    ↑
      Used by /demo        Used by wizard/plans
           ↓                    ↓
    PermacultureCanvasIntegrated
         (tldraw canvas)
           ↓
    tldraw tools & shapes
    (BedTool, PlantTool, ElementTool)
```

### 3.2 State Management Entanglement

**Demo Page State**:
```typescript
// /app/demo/page.tsx
const [gardenData, setGardenData] = useState<GardenBed[]>(STARTER_GARDEN)
const persistence = useDemoPersistence(STARTER_GARDEN)

// Handlers both update local state AND persistence
const handleCanvasChange = (updatedData) => {
  setGardenData(updatedData)                 // Local state
  persistence.autoSave(updatedData)          // localStorage
}
```

**Editor Component**:
```typescript
// /components/tldraw/permaculture-editor-integrated.tsx
const [gardenData, setGardenData] = useState<GardenBed[]>(initialData)

const handleCanvasChange = useCallback((updatedData: GardenBed[]) => {
  setGardenData(updatedData)
  setHasUnsavedChanges(true)
  if (onSave) onSave(updatedData)           // Parent callback
}, [onSave])
```

**Issue**: No clear separation of concerns. Same component is used for:
- Free demo with localStorage
- Paid plans with database persistence
- Wizard with temporary state

### 3.3 Data Flow Diagram

```
┌─── Navigation ───┐
│                  │
v                  v
/tools/page.tsx    /demo/page.tsx
    │              │
    │              ├─ Load from wizard (planId)
    │              ├─ Load from localStorage (demo)
    │              └─ Show STARTER_GARDEN fallback
    │
    ├─ Mock data    ├─ useDemoPersistence
    │  (mockPlan,   │  ├─ Debounced auto-save
    │   mockClimate)│  ├─ JSON export
    │              │  └─ Error handling
    │              │
    ├─ Tab UI      └─ PermacultureEditorIntegrated
    │  (Designer        │
    │   Water           ├─ 32 analysis panels
    │   Export)         ├─ Tool activation
    │                   ├─ Canvas integration
    └─ PermacultureDesigner
       (Legacy canvas)
```

---

## 4. FILES & COMPONENTS BREAKDOWN

### Demo-Specific Components
```
/hooks/use-demo-persistence.ts         ← DEMO ONLY (360 lines)
  - localStorage-specific logic
  - Named "Demo" persistence
  - Cannot be reused for other storage backends
  - Features: auto-save, quota check, validation
  
/app/demo/page.tsx                     ← DEMO ONLY (220 lines)
  - STARTER_GARDEN constant
  - Demo-specific data loading logic
  - Priority: planId > localStorage > fallback
  - Export/import handlers
```

### Tools-Specific Components
```
/app/tools/page.tsx                    ← TOOLS ONLY (120 lines)
  - mockPlan (inline mock data)
  - mockClimate (inline mock data)
  - Tab switcher UI
  - Imports:
    - PermacultureDesigner (legacy)
    - WaterWasteModule
    - ExportPanel

/components/permaculture-designer.tsx  ← TOOLS ONLY (400+ lines)
  - Legacy canvas implementation
  - HTML5/SVG drawing
  - Tool palette
  - No tldraw integration
  - Manual state management

/components/water-waste-module.tsx     ← TOOLS ONLY
  - Water calculations
  - Composting system design
  - Interactive sliders
```

### Shared Components
```
/components/tldraw/
├── permaculture-editor-integrated.tsx     ← SHARED (716 lines)
│   - Full editor with 32 panels
│   - Tool activation logic
│   - Canvas management
│   - Used by: /demo, /wizard, /plans, /dashboard
│
├── permaculture-canvas-integrated.tsx     ← SHARED (250+ lines)
│   - tldraw editor wrapper
│   - Shape management
│   - Auto-save debouncing
│   - Data adapter
│
├── tools/
│   ├── bed-tool.ts                        ← SHARED (78 lines)
│   ├── plant-tool.ts                      ← SHARED (72 lines)
│   └── element-tool.ts                    ← SHARED (65 lines)
│
└── shapes/
    ├── bed-shape.tsx                      ← SHARED
    ├── plant-shape.tsx                    ← SHARED
    ├── element-shape.tsx                  ← SHARED
    └── companion-line-shape.tsx           ← SHARED
```

---

## 5. UI/UX ISSUES FROM MIXING

### Issue 1: Confusing Navigation
```
Navigation Menu:
├── /tools        → Design tools page (PermacultureDesigner + tabs)
└── /demo         → Interactive editor (PermacultureEditorIntegrated)

User Problem: What's the difference?
- /tools has mock data and is static
- /demo has persistence and is "real"
- But both use overlapping components
- Unclear which to use for what purpose
```

### Issue 2: Duplicate Functionality
```
/tools page offers:
├── PermacultureDesigner (canvas)
├── WaterWasteModule (calculator)
└── ExportPanel

/demo page offers:
├── PermacultureEditorIntegrated (better canvas)
├── 32 analysis panels
├── All tools integrated
└── Persistence

User Problem: Why would anyone use /tools?
- /demo does everything /tools does, better
- /demo has persistence
- /demo has more features
- /tools feels like incomplete, outdated interface
```

### Issue 3: Inconsistent Canvas
```
/tools uses:
└── PermacultureDesigner
    ├── Manual drawing
    ├── Basic tools
    └── No advanced features

/demo uses:
└── PermacultureEditorIntegrated
    └── PermacultureCanvasIntegrated
        └── tldraw canvas
            ├── Advanced tools
            ├── Better performance
            └── Professional UI

User Problem: Two different drawing experiences
- Different UI paradigms
- Different feature sets
- Different performance characteristics
- Can't seamlessly switch between modes
```

### Issue 4: Data Isolation Confusion
```
/tools:
└── Uses mockPlan + mockClimate (hardcoded)
    └── Changes only in memory
    └── No persistence
    └── Resets on refresh

/demo:
├── Uses STARTER_GARDEN (hardcoded fallback)
├── Can load from wizard (planId)
├── Can load from localStorage
└── Auto-saves to localStorage
└── Persists across sessions

User Problem: 
- Unclear when data is saved vs lost
- Unclear what's demo vs production
- Tool changes disappear on refresh
- Demo changes persist mysteriously
```

### Issue 5: Button/Action Placement
```
/demo page shows:
- Save button (top right)
- Export button (top right)
- Interactive editor below

/tools page shows:
- No obvious save location
- No obvious persistence
- Export buried in tab
- Uses legacy PermacultureDesigner

User Problem:
- How do I save my /tools design?
- Where's the save button?
- Why doesn't it persist?
- These actions aren't even UI-discoverable
```

### Issue 6: Feature Parity Confusion
```
/demo has access to:
- 32 integrated analysis panels
- PlantTool, ElementTool, BedTool
- Properties panel
- Companion planting analysis
- All analytics and permaculture analysis

/tools has access to:
- PermacultureDesigner (legacy)
- WaterWasteModule (tab)
- ExportPanel (tab)
- No advanced analytics
- No plant tool
- No properties panel

User Problem:
- Why are advanced features only in /demo?
- Why not in /tools where "tools" should be?
- Mixed message about what "tools" means
```

---

## 6. ARCHITECTURAL PROBLEMS

### Problem 1: Semantic Confusion
```
"Tools" means:
a) Design tools (brushes, pencils, shapes) ← Current /tools
b) Utility calculators (water, compost) ← Current /tools
c) The application itself ← PermacultureEditorIntegrated

Same word means different things in different contexts.
```

### Problem 2: Component Responsibility
```
PermacultureEditorIntegrated handles:
├── Tool activation (conflates with component)
├── Panel management (19+ tabs)
├── State management
├── Persistence (via parent callback)
├── UI layout (left/right panels)
└── Keyboard shortcuts

→ 716 lines doing too much
```

### Problem 3: Persistence Abstraction
```
Current approach:
┌─ /demo/page.tsx (demo logic)
│  └─ useDemoPersistence (localStorage)
│     └─ PermacultureEditorIntegrated (editor)
│        └─ callback: onSave (parent handles persistence)
│
└─ /wizard/page.tsx (wizard logic)
   └─ wizardService (API)
      └─ PermacultureEditorIntegrated (editor)
         └─ callback: onSave (parent handles persistence)

Problems:
- Persistence is parent's responsibility
- Editor doesn't know where data goes
- Each parent must implement own persistence logic
- No unified interface for different backends
```

### Problem 4: Tool System Duplication
```
/modules/tools/
├── BaseTool.ts (abstract class)
├── DrawBedTool.ts
├── DrawPathTool.ts
├── MeasureTool.ts
├── SelectTool.ts
└── DrawCurvedBedTool.ts
→ NOT USED ANYWHERE

/components/tldraw/tools/
├── BedTool.ts (StateNode)
├── PlantTool.ts (StateNode)
└── ElementTool.ts (StateNode)
→ ACTIVELY USED

Consequence:
- ~500 lines of dead code
- Unclear which tool system is canonical
- Maintenance burden
- New developers confused about which to extend
```

---

## 7. STATE MANAGEMENT ISSUES

### Issue 1: Scattered State
```
Demo state lives in:
1. /app/demo/page.tsx
   └─ gardenData, isLoading, loadError

2. useDemoPersistence hook
   └─ hasUnsavedChanges, lastSaved, planName, error

3. PermacultureEditorIntegrated
   └─ gardenData, selectedPlant, selectedElement, hasUnsavedChanges

4. PermacultureCanvasIntegrated
   └─ editor, isInitialized, saveTimeout

5. Browser localStorage
   └─ permaculture_demo_plan, permaculture_demo_metadata

State is scattered across:
- Page component
- Custom hook
- Shared editor component
- Canvas component
- Browser storage

→ Single source of truth is unclear
→ Synchronization complexity
→ Difficult to test
```

### Issue 2: Duplicate State
```
hasUnsavedChanges tracked in:
- useDemoPersistence hook
- PermacultureEditorIntegrated component
→ Could be out of sync
→ Unclear which is source of truth

lastSaved tracked in:
- useDemoPersistence hook
→ Separate from editor's last modification time

planName tracked in:
- useDemoPersistence hook
→ Not in PermacultureEditorIntegrated
```

### Issue 3: Callback Spaghetti
```
Data flow for canvas changes:
1. Canvas detects change
   └─ calls dataAdapter.shapesToGardenBeds()
   └─ triggers handleSave()
   
2. handleSave debounces 1000ms
   └─ calls onSave callback

3. onSave callback in PermacultureCanvasIntegrated
   └─ calls parent's onSave (PermacultureEditorIntegrated)

4. PermacultureEditorIntegrated's onSave
   └─ calls parent's onSave (demo/page.tsx)

5. Demo's onSave
   └─ calls setGardenData()
   └─ calls persistence.autoSave()

Total: 5 levels of indirection for one state change
```

---

## 8. TESTING COMPLEXITY

Current test organization:
```
/e2e/
├── demo-editor-interactions.spec.ts    ← Demo-specific tests
├── canvas-interactions.spec.ts         ← Canvas tests (used by demo)
├── permaculture-metrics.spec.ts        ← Metrics tests
└── tests/
    ├── app.test.ts                     ← App-level tests
    └── garden-designer.spec.ts         ← Designer tests (tools)

Problems:
1. No clear test boundaries
2. Demo tests don't separate "demo" concerns from "editor" concerns
3. Canvas tests used by demo don't test /tools canvas
4. Two canvas implementations but only one set of tests
5. No tests for /tools page specifically
```

---

## 9. CURRENT BRANCH PURPOSE

Branch: `claude/refactor-tools-demo-separation`

Recent commits suggest:
```
203bae0 test: Add comprehensive test suite (editor, canvas, metrics)
5f457bd Fix build errors from PR #2 merge
ca97af7 Merge PR #2: Permaculture metrics and analysis system
845e28c feat: Replace elemental balance with science-based metrics
de1bcbc feat: Add comprehensive holistic permaculture integration system
```

This branch is working toward:
- Comprehensive test coverage
- Metric-based analysis integration
- Holistic system approach

**But**: The actual tools/demo separation hasn't started yet.
**The branch name indicates intent but the work hasn't been done.**

---

## 10. SUMMARY TABLE

| Aspect | /tools | /demo | Issues |
|--------|--------|-------|--------|
| **Canvas** | PermacultureDesigner (legacy) | tldraw-based | Different implementations |
| **Persistence** | None (mock data) | localStorage | Confusing to users |
| **Features** | Designer + Water + Export | 32 panels + tools | Feature parity missing |
| **Data** | mockPlan (hardcoded) | STARTER_GARDEN + wizard + localStorage | Inconsistent loading |
| **UI** | Tab switcher | Integrated panels | Different UX paradigms |
| **Use Case** | ? | Free demo | Unclear purpose |
| **Status** | Maintained? | Active | Tools feel abandoned |

---

## 11. RECOMMENDED SEPARATION STRATEGY

### Option A: Remove /tools (Merge into /demo)
```
Move all /tools functionality into /demo as optional "tutorials"
Delete /tools page
Rename /demo to /editor or /designer
Keep single, unified interface
```

### Option B: Redefine /tools Purpose
```
/tools = specialized calculators (water, compost, soil)
/demo = full visual garden designer
Keep separate and distinct purposes
Different UX for each purpose
```

### Option C: Create Feature Flags
```
/demo shows both:
- "Demo Mode" (with localStorage persistence)
- "Tools Mode" (calculators without persistence)
Toggle between modes within single page
```

### Option D: Clean Separation
```
/demo → Free trial with 7-day persistence
/editor → User's persistent plans (authenticated)
/tools → Utility calculators (no visual design)
/wizard → Guided setup (creates initial plan)

Each has single responsibility
```

