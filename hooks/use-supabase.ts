import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function useSupabase() {
  const supabase = createClient()
  return supabase
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUser(user)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase])

  return { user, loading, error }
}

export function useSupabaseQuery<T = any>(
  table: string,
  query?: {
    select?: string
    filters?: Array<{ column: string; operator: string; value: any }>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
    single?: boolean
  }
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = useSupabase()

  const fetchData = async () => {
    try {
      let q = (supabase as any).from(table).select(query?.select || '*')

      // Apply filters
      if (query?.filters) {
        query.filters.forEach(filter => {
          q = q[filter.operator](filter.column, filter.value)
        })
      }

      // Apply ordering
      if (query?.orderBy) {
        q = q.order(query.orderBy.column, {
          ascending: query.orderBy.ascending ?? true
        })
      }

      // Apply limit
      if (query?.limit) {
        q = q.limit(query.limit)
      }

      // Get single or multiple
      const result = query?.single ? await q.single() : await q

      if (result.error) throw result.error
      setData(result.data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [table, JSON.stringify(query)])

  const refetch = async () => {
    setLoading(true)
    await fetchData()
  }

  return { data, loading, error, refetch }
}

export function useSupabaseMutation<T = any>(
  table: string,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const supabase = useSupabase()

  const insert = async (data: Partial<T>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await (supabase as any).from(table).insert(data).select().single()
      if (result.error) throw result.error
      options?.onSuccess?.(result.data)
      return result.data
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const update = async (id: string | number, data: Partial<T>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await (supabase as any).from(table).update(data).eq('id', id).select().single()
      if (result.error) throw result.error
      options?.onSuccess?.(result.data)
      return result.data
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string | number) => {
    setLoading(true)
    setError(null)
    try {
      const result = await (supabase as any).from(table).delete().eq('id', id)
      if (result.error) throw result.error
      options?.onSuccess?.(null as any)
      return true
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { insert, update, remove, loading, error }
}