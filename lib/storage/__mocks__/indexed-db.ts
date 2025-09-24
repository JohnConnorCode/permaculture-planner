// Mock IndexedDB implementation for testing

export interface StoredPlan {
  id: string
  name: string
  data: any
  timestamp: number
  synced: boolean
}

export interface PendingChange {
  id: string
  type: 'create' | 'update' | 'delete'
  table: string
  data: any
  timestamp: number
  synced: boolean
}

class MockIndexedDBManager {
  private mockData = {
    plans: new Map<string, StoredPlan>(),
    pendingChanges: new Map<number, PendingChange>(),
    preferences: new Map<string, any>(),
    drafts: new Map<string, any>(),
    cache: new Map<string, any>()
  }

  async init(): Promise<void> {
    // Mock initialization - immediately resolve
    return Promise.resolve()
  }

  async savePlan(plan: StoredPlan): Promise<void> {
    this.mockData.plans.set(plan.id, plan)
    return Promise.resolve()
  }

  async getPlan(id: string): Promise<StoredPlan | null> {
    return Promise.resolve(this.mockData.plans.get(id) || null)
  }

  async getAllPlans(): Promise<StoredPlan[]> {
    return Promise.resolve(Array.from(this.mockData.plans.values()))
  }

  async deletePlan(id: string): Promise<void> {
    this.mockData.plans.delete(id)
    return Promise.resolve()
  }

  async addPendingChange(change: Omit<PendingChange, 'id' | 'timestamp' | 'synced'>): Promise<void> {
    const id = Date.now()
    const pendingChange: PendingChange = {
      ...change,
      id: String(id),
      timestamp: Date.now(),
      synced: false
    }
    this.mockData.pendingChanges.set(id, pendingChange)
    return Promise.resolve()
  }

  async getPendingChanges(): Promise<PendingChange[]> {
    return Promise.resolve(Array.from(this.mockData.pendingChanges.values()))
  }

  async markChangeAsSynced(id: number): Promise<void> {
    const change = this.mockData.pendingChanges.get(id)
    if (change) {
      change.synced = true
    }
    return Promise.resolve()
  }

  async savePreference(key: string, value: any): Promise<void> {
    this.mockData.preferences.set(key, value)
    return Promise.resolve()
  }

  async getPreference(key: string): Promise<any> {
    return Promise.resolve(this.mockData.preferences.get(key) || null)
  }

  async saveDraft(id: string, data: any): Promise<void> {
    this.mockData.drafts.set(id, {
      id,
      data,
      timestamp: Date.now()
    })
    return Promise.resolve()
  }

  async getDraft(id: string): Promise<any> {
    const draft = this.mockData.drafts.get(id)
    return Promise.resolve(draft ? draft.data : null)
  }

  async deleteDraft(id: string): Promise<void> {
    this.mockData.drafts.delete(id)
    return Promise.resolve()
  }

  async cacheData(key: string, data: any, ttlMinutes: number): Promise<void> {
    this.mockData.cache.set(key, {
      data,
      expires: Date.now() + ttlMinutes * 60 * 1000
    })
    return Promise.resolve()
  }

  async getCachedData(key: string): Promise<any> {
    const cached = this.mockData.cache.get(key)
    if (!cached) return Promise.resolve(null)

    if (Date.now() > cached.expires) {
      this.mockData.cache.delete(key)
      return Promise.resolve(null)
    }

    return Promise.resolve(cached.data)
  }

  async cleanupCache(): Promise<void> {
    const now = Date.now()
    for (const [key, value] of this.mockData.cache.entries()) {
      if (now > value.expires) {
        this.mockData.cache.delete(key)
      }
    }
    return Promise.resolve()
  }

  async clearAll(): Promise<void> {
    this.mockData.plans.clear()
    this.mockData.pendingChanges.clear()
    this.mockData.preferences.clear()
    this.mockData.drafts.clear()
    this.mockData.cache.clear()
    return Promise.resolve()
  }
}

export const db = new MockIndexedDBManager()