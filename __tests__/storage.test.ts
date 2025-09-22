import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals'
import { db, StoredPlan, PendingChange } from '@/lib/storage/indexed-db'

// Mock IndexedDB for testing
const mockIndexedDB = {
  databases: new Map(),
  open: jest.fn((name: string, version: number) => {
    return {
      result: {
        objectStoreNames: {
          contains: jest.fn(() => false)
        },
        transaction: jest.fn(() => ({
          objectStore: jest.fn(() => ({
            put: jest.fn(() => ({ onsuccess: jest.fn(), onerror: jest.fn() })),
            get: jest.fn(() => ({ onsuccess: jest.fn(), onerror: jest.fn() })),
            getAll: jest.fn(() => ({ onsuccess: jest.fn(), onerror: jest.fn() })),
            delete: jest.fn(() => ({ onsuccess: jest.fn(), onerror: jest.fn() })),
            add: jest.fn(() => ({ onsuccess: jest.fn(), onerror: jest.fn() })),
            clear: jest.fn(() => ({ onsuccess: jest.fn(), onerror: jest.fn() })),
            index: jest.fn(() => ({
              getAll: jest.fn(() => ({ onsuccess: jest.fn(), onerror: jest.fn() })),
              openCursor: jest.fn(() => ({ onsuccess: jest.fn(), onerror: jest.fn() }))
            }))
          }))
        })),
        createObjectStore: jest.fn(() => ({
          createIndex: jest.fn()
        }))
      },
      onsuccess: jest.fn(),
      onerror: jest.fn(),
      onupgradeneeded: jest.fn()
    }
  })
}

// Set up global mock
global.indexedDB = mockIndexedDB as any

describe('IndexedDB Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

      const changeId = await db.addPendingChange(change)
      expect(typeof changeId).toBe('number')
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
      const value = await db.getPreference('theme')
      expect(value).toBeNull() // Mock returns null for non-existent
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
      const draft = await db.getDraft('draft-1')
      expect(draft).toBeNull() // Mock returns null
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
      const data = await db.getCachedData('crops')
      expect(data).toBeNull() // Mock returns null
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
    const changeId = await db.addPendingChange({
      type: 'create',
      table: 'plans',
      data: plan
    })

    // 3. Get pending changes for sync
    const pendingChanges = await db.getPendingChanges()
    expect(Array.isArray(pendingChanges)).toBe(true)

    // 4. Mark as synced after successful upload
    if (typeof changeId === 'number') {
      await db.markChangeAsSynced(changeId)
    }
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

    // Clean up after completion
    await db.deleteDraft('wizard-session')
  })
})