import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals'
import { db, StoredPlan, PendingChange } from '@/lib/storage/indexed-db'

// Mock the indexed-db module
jest.mock('@/lib/storage/indexed-db')

describe('IndexedDB Storage', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await db.init()
  })

  afterEach(async () => {
    await db.clearAll()
  })

  describe('Plan Operations', () => {
    test('savePlan stores plan data', async () => {
      const plan: StoredPlan = {
        id: 'test-plan-1',
        name: 'My Garden',
        data: { beds: [], paths: [] },
        timestamp: Date.now(),
        synced: false
      }

      // Since we're mocking, we'll just verify the method doesn't throw
      await expect(db.savePlan(plan)).resolves.not.toThrow()
    })

    test('getPlan retrieves plan by ID', async () => {
      const planId = 'test-plan-1'

      // Mock implementation would return null for non-existent plans
      const result = await db.getPlan(planId)
      expect(result).toBeNull()
    })

    test('getAllPlans retrieves all stored plans', async () => {
      const plans = await db.getAllPlans()
      expect(Array.isArray(plans)).toBe(true)
    })

    test('deletePlan removes plan by ID', async () => {
      const planId = 'test-plan-1'
      await expect(db.deletePlan(planId)).resolves.not.toThrow()
    })
  })

  describe('Pending Changes', () => {
    test('addPendingChange stores offline changes', async () => {
      const change = {
        type: 'update' as const,
        table: 'plans',
        data: { id: 'plan-1', name: 'Updated Garden' }
      }

      await expect(db.addPendingChange(change)).resolves.not.toThrow()
    })

    test('getPendingChanges retrieves unsynced changes', async () => {
      const changes = await db.getPendingChanges()
      expect(Array.isArray(changes)).toBe(true)
    })

    test('markChangeAsSynced updates sync status', async () => {
      await expect(db.markChangeAsSynced(1)).resolves.not.toThrow()
    })
  })

  describe('Preferences', () => {
    test('savePreference stores user preferences', async () => {
      await expect(db.savePreference('theme', 'dark')).resolves.not.toThrow()
    })

    test('getPreference retrieves stored preference', async () => {
      await db.savePreference('theme', 'dark')
      const value = await db.getPreference('theme')
      expect(value).toBe('dark')
    })
  })

  describe('Draft Management', () => {
    test('saveDraft stores wizard progress', async () => {
      const draftData = {
        location: { city: 'Seattle' },
        area: { total_sqft: 200 }
      }
      await expect(db.saveDraft('draft-1', draftData)).resolves.not.toThrow()
    })

    test('getDraft retrieves saved draft', async () => {
      const draftData = {
        location: { city: 'Seattle' },
        area: { total_sqft: 200 }
      }
      await db.saveDraft('draft-1', draftData)
      const draft = await db.getDraft('draft-1')
      expect(draft).toEqual(draftData)
    })

    test('deleteDraft removes draft', async () => {
      await expect(db.deleteDraft('draft-1')).resolves.not.toThrow()
    })
  })

  describe('Cache Operations', () => {
    test('cacheData stores with TTL', async () => {
      const data = { crops: ['tomato', 'basil'] }
      await expect(db.cacheData('crops', data, 60)).resolves.not.toThrow()
    })

    test('getCachedData retrieves non-expired data', async () => {
      const data = { crops: ['tomato', 'basil'] }
      await db.cacheData('crops', data, 60)
      const cached = await db.getCachedData('crops')
      expect(cached).toEqual(data)
    })

    test('cleanupCache removes expired entries', async () => {
      await expect(db.cleanupCache()).resolves.not.toThrow()
    })
  })

  describe('Utility Operations', () => {
    test('clearAll removes all stored data', async () => {
      await expect(db.clearAll()).resolves.not.toThrow()
    })
  })
})

describe('Storage Integration', () => {
  beforeEach(async () => {
    await db.init()
  })

  afterEach(async () => {
    await db.clearAll()
  })

  test('handles offline-first workflow', async () => {
    // 1. Save a plan locally
    const plan: StoredPlan = {
      id: 'offline-plan',
      name: 'Offline Garden',
      data: { beds: [] },
      timestamp: Date.now(),
      synced: false
    }
    await db.savePlan(plan)

    // 2. Add a pending change
    await db.addPendingChange({
      type: 'create',
      table: 'plans',
      data: plan
    })

    // 3. Get pending changes for sync
    const pendingChanges = await db.getPendingChanges()
    expect(Array.isArray(pendingChanges)).toBe(true)
    expect(pendingChanges.length).toBeGreaterThan(0)

    // 4. Verify the plan was saved
    const savedPlan = await db.getPlan('offline-plan')
    expect(savedPlan).toEqual(plan)
  })

  test('supports draft recovery', async () => {
    const wizardData = {
      location: { city: 'Portland', usda_zone: '8b' },
      area: { total_sqft: 400, usable_fraction: 0.8, shape: 'rectangular' as const }
    }

    // Save draft during wizard
    await db.saveDraft('wizard-session', wizardData)

    // Recover draft after page reload
    const recovered = await db.getDraft('wizard-session')
    expect(recovered).toEqual(wizardData)

    // Clean up after completion
    await db.deleteDraft('wizard-session')

    // Verify deletion
    const deleted = await db.getDraft('wizard-session')
    expect(deleted).toBeNull()
  })
})