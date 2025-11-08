# Tools vs Demo: Quick Summary

## The Core Problem

Two separate user-facing features exist with **confusing separation** and **overlapping components**:

```
/tools  → Design tools page (PermacultureDesigner + calculators)
/demo   → Interactive editor (PermacultureEditorIntegrated + 32 panels)
```

Both navigate to different pages but share underlying components, creating confusion about what each is for.

---

## Key Findings

### 1. What "Tools" Are
- **Route**: `/tools/page.tsx` (120 lines)
- **Components**:
  - `PermacultureDesigner` - Legacy canvas (400+ lines, no tldraw)
  - `WaterWasteModule` - Water/composting calculator
  - `ExportPanel` - PDF/JSON export
- **Data**: Mock data only (not persistent)
- **Purpose**: Unclear - tools + calculators mixed together

### 2. What "Demo" Is
- **Route**: `/demo/page.tsx` (220 lines)
- **Components**:
  - `PermacultureEditorIntegrated` - Full editor with 32 analysis panels
  - `PermacultureCanvasIntegrated` - tldraw-based professional canvas
  - `useDemoPersistence` - localStorage persistence hook (360 lines)
- **Data**: STARTER_GARDEN (persistent via localStorage)
- **Purpose**: Free interactive garden planner with persistence

### 3. Dual Tool Systems (Dead Code)
```
/modules/tools/              ← UNUSED (legacy system)
├── BaseTool.ts
├── DrawBedTool.ts
└── ~500 lines of dead code

/components/tldraw/tools/   ← ACTIVE (modern system)
├── BedTool.ts
├── PlantTool.ts
└── ElementTool.ts
```

Both tool systems exist. Only tldraw version is used.

---

## Critical Issues

### 1. Confusing User Experience
- **Why would users use /tools?** It's inferior to /demo in every way:
  - No persistence (data lost on refresh)
  - No advanced features
  - Outdated canvas (legacy HTML5 vs modern tldraw)
  - No obvious save buttons
  
- **Users don't know the difference** between pages
  - Both are "design tools"
  - Both have overlapping components
  - Different look and feel

### 2. Architectural Mixing
```
Shared Components:
├── PermacultureEditorIntegrated (716 lines, does too much)
├── PermacultureCanvasIntegrated
├── tldraw tools (BedTool, PlantTool, ElementTool)
└── All shapes and panels

Used by:
├── /demo (demo-only persistence + editor)
├── /wizard (wizard logic + editor)
├── /plans (authenticated + editor)
└── /tools (incomplete subset + legacy canvas)

Problem: Same editor used for completely different purposes
```

### 3. State Management Chaos
```
gardenData state exists in:
1. /app/demo/page.tsx (useState)
2. useDemoPersistence hook
3. PermacultureEditorIntegrated
4. PermacultureCanvasIntegrated
5. Browser localStorage

hasUnsavedChanges tracked in:
1. useDemoPersistence hook
2. PermacultureEditorIntegrated

→ Which is source of truth?
→ Are they synchronized?
→ What if they disagree?
```

### 4. Callback Spaghetti
Data flow for single canvas change:
```
Canvas change 
  → dataAdapter 
    → handleSave (debounce 1s)
      → onSave callback (canvas)
        → onSave callback (editor)
          → onSave callback (demo page)
            → setGardenData + persistence.autoSave()

5 levels of indirection for one state change
```

### 5. Testing Nightmare
- No clear test boundaries
- Demo tests mix "editor" concerns with "demo persistence" concerns
- Two canvas implementations but only one set of tests
- No isolated tests for /tools functionality
- Branch name says "refactor-tools-demo-separation" but work hasn't started

---

## File Organization

### Demo-Only Files (360 + 220 = 580 lines)
```
/hooks/use-demo-persistence.ts        ← Demo persistence (360 lines)
/app/demo/page.tsx                    ← Demo page (220 lines)
```

### Tools-Only Files (500+ lines)
```
/app/tools/page.tsx                   ← Tools page (120 lines)
/components/permaculture-designer.tsx ← Legacy canvas (400+ lines)
/components/water-waste-module.tsx    ← Water calculator
```

### Dead Code (500+ lines)
```
/modules/tools/
├── BaseTool.ts
├── DrawBedTool.ts
├── DrawPathTool.ts
├── SelectTool.ts
├── MeasureTool.ts
└── DrawCurvedBedTool.ts
```

### Shared Components (2000+ lines)
```
/components/tldraw/permaculture-editor-integrated.tsx     (716 lines)
/components/tldraw/permaculture-canvas-integrated.tsx     (250+ lines)
/components/tldraw/tools/
  ├── bed-tool.ts
  ├── plant-tool.ts
  └── element-tool.ts
/components/tldraw/shapes/
  ├── bed-shape.tsx
  ├── plant-shape.tsx
  ├── element-shape.tsx
  └── companion-line-shape.tsx
/components/tldraw/panels/
  └── (32 panel files)
```

---

## User Experience Comparison

| Feature | /tools | /demo |
|---------|--------|-------|
| **Visual Canvas** | Legacy HTML5 | Modern tldraw |
| **Plant Tool** | ✗ | ✓ |
| **Element Tool** | ✗ | ✓ |
| **Save Button** | ✗ Not visible | ✓ Top right |
| **Auto-save** | ✗ | ✓ 3s debounce |
| **Export** | In tab | Top right |
| **Analysis Panels** | None | 32 panels |
| **Persistence** | None | localStorage |
| **Purpose** | ? | Free demo |

---

## Data Flow

### /tools
```
mockPlan (hardcoded)
    ↓
PermacultureDesigner
    ↓
Changes lost on refresh
```

### /demo
```
planId (from URL)? → Load from database
    ↓ NO
localStorage      → Load from storage
    ↓ NO
STARTER_GARDEN    → Use default
    ↓
PermacultureEditorIntegrated
    ↓
auto-save to localStorage (3s debounce)
```

---

## The Current Branch

**Branch**: `claude/refactor-tools-demo-separation`

**What It Says**: Intent to separate tools and demo
**What It Does**: Adds test coverage and metrics (unrelated to separation)

**Status**: Separation work has NOT started yet

---

## Recommended Action

### Option A (Recommended): Remove /tools Entirely
- Delete `/app/tools/page.tsx`
- Move `/components/water-waste-module.tsx` to demo as "advanced tools" tab
- Delete `/components/permaculture-designer.tsx` (deprecated by PermacultureEditorIntegrated)
- Delete `/modules/tools/*` (dead code)
- Result: One unified interface, clearer purpose

### Option B: Redefine Separation
- `/tools` = Specialized calculators (water, compost, soil - no visual design)
- `/demo` = Full visual garden designer with persistence
- Completely different purposes and UX

### Option C: Feature Flags
- Single page `/editor`
- Toggle between "Demo Mode" and "Calculator Tools" mode
- Unified state management

### Option D: Clean Architecture
```
/demo   → Free trial editor (localStorage, 7-day persistence)
/editor → User's plans (authenticated, database)
/tools  → Utility calculators (no visual design)
/wizard → Guided setup
```

---

## Next Steps for Refactoring

1. **Decide which approach** (A, B, C, or D)
2. **Consolidate tool systems**
   - Delete `/modules/tools/*` (dead code)
   - Clarify tldraw tools as canonical
3. **Separate concerns**
   - Extract persistence layer
   - Create persistence service interface
   - Implement for localStorage, database, etc.
4. **Simplify state**
   - Single source of truth per feature
   - Clear data flow
5. **Test comprehensively**
   - Unit tests for each concern
   - E2E tests per user flow
   - Component tests for integration
6. **Document clearly**
   - When to use /tools vs /demo
   - How to add new tools
   - How to add new tools to editor

---

## Files Generated

- `TOOLS_DEMO_ANALYSIS.md` - Full 646-line detailed analysis
- `TOOLS_DEMO_QUICK_SUMMARY.md` - This file (quick reference)

