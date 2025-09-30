// IndexedDB wrapper for offline storage and state persistence

const DB_NAME = 'PermaculturePlannerDB'
const DB_VERSION = 1

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

class IndexedDBManager {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB not available')
      return
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Plans store
        if (!db.objectStoreNames.contains('plans')) {
          const plansStore = db.createObjectStore('plans', { keyPath: 'id' })
          plansStore.createIndex('timestamp', 'timestamp', { unique: false })
          plansStore.createIndex('synced', 'synced', { unique: false })
        }

        // Pending changes store for offline sync
        if (!db.objectStoreNames.contains('pendingChanges')) {
          const changesStore = db.createObjectStore('pendingChanges', {
            keyPath: 'id',
            autoIncrement: true
          })
          changesStore.createIndex('timestamp', 'timestamp', { unique: false })
          changesStore.createIndex('synced', 'synced', { unique: false })
        }

        // User preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' })
        }

        // Draft plans store (for wizard progress)
        if (!db.objectStoreNames.contains('drafts')) {
          const draftsStore = db.createObjectStore('drafts', { keyPath: 'id' })
          draftsStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Cache store for API responses
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' })
          cacheStore.createIndex('expiry', 'expiry', { unique: false })
        }
      }
    })
  }

  // Plans operations
  async savePlan(plan: StoredPlan): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['plans'], 'readwrite')
      const store = transaction.objectStore('plans')
      const request = store.put({
        ...plan,
        timestamp: Date.now(),
        synced: false
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getPlan(id: string): Promise<StoredPlan | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['plans'], 'readonly')
      const store = transaction.objectStore('plans')
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllPlans(): Promise<StoredPlan[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['plans'], 'readonly')
      const store = transaction.objectStore('plans')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async deletePlan(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['plans'], 'readwrite')
      const store = transaction.objectStore('plans')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Pending changes for offline sync
  async addPendingChange(change: Omit<PendingChange, 'id' | 'timestamp' | 'synced'>): Promise<number> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingChanges'], 'readwrite')
      const store = transaction.objectStore('pendingChanges')
      const request = store.add({
        ...change,
        timestamp: Date.now(),
        synced: 0
      })

      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingChanges(): Promise<PendingChange[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingChanges'], 'readonly')
      const store = transaction.objectStore('pendingChanges')
      const index = store.index('synced')
      const request = index.getAll(IDBKeyRange.only(0))

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async markChangeAsSynced(id: number): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingChanges'], 'readwrite')
      const store = transaction.objectStore('pendingChanges')
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const change = getRequest.result
        if (change) {
          change.synced = 1
          const putRequest = store.put(change)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          resolve()
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  // Preferences
  async savePreference(key: string, value: any): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['preferences'], 'readwrite')
      const store = transaction.objectStore('preferences')
      const request = store.put({ key, value, timestamp: Date.now() })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getPreference(key: string): Promise<any> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['preferences'], 'readonly')
      const store = transaction.objectStore('preferences')
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result?.value || null)
      request.onerror = () => reject(request.error)
    })
  }

  // Draft plans
  async saveDraft(id: string, data: any): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readwrite')
      const store = transaction.objectStore('drafts')
      const request = store.put({
        id,
        data,
        timestamp: Date.now()
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getDraft(id: string): Promise<any> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readonly')
      const store = transaction.objectStore('drafts')
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result?.data || null)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteDraft(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readwrite')
      const store = transaction.objectStore('drafts')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Cache for API responses
  async cacheData(key: string, data: any, ttlMinutes = 60): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.put({
        key,
        data,
        expiry: Date.now() + (ttlMinutes * 60 * 1000)
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getCachedData(key: string): Promise<any> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')
      const request = store.get(key)

      request.onsuccess = () => {
        const result = request.result
        if (result && result.expiry > Date.now()) {
          resolve(result.data)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Clean up expired cache entries
  async cleanupCache(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const index = store.index('expiry')
      const request = index.openCursor(IDBKeyRange.upperBound(Date.now()))

      request.onsuccess = () => {
        const cursor = request.result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Clear all data (for development/testing)
  async clearAll(): Promise<void> {
    if (!this.db) await this.init()

    const storeNames = ['plans', 'pendingChanges', 'preferences', 'drafts', 'cache']
    const promises = storeNames.map(storeName => {
      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    })

    await Promise.all(promises)
  }
}

// Singleton instance
export const db = new IndexedDBManager()

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  db.init().catch(console.error)
}