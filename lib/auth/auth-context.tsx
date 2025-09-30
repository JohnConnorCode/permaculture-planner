'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService, AuthUser } from './auth-service'
import { showError } from '@/components/ui/action-feedback'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: string | null }>
  signUp: (email: string, password: string, name?: string) => Promise<{ user: AuthUser | null; error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Check for existing session
        const session = await authService.getSession()

        if (session?.user && mounted) {
          const currentUser = await authService.getCurrentUser()
          if (currentUser && mounted) {
            setUser(currentUser)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          showError('Failed to initialize authentication')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Auto-refresh session every 30 minutes
  useEffect(() => {
    if (!user) return

    const refreshInterval = setInterval(async () => {
      try {
        const session = await authService.refreshSession()
        if (!session) {
          // Session expired, sign out
          setUser(null)
          showError('Your session has expired. Please sign in again.')
        }
      } catch (error) {
        console.error('Error refreshing session:', error)
      }
    }, 30 * 60 * 1000) // 30 minutes

    return () => clearInterval(refreshInterval)
  }, [user])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await authService.signIn({ email, password })
      if (result.user) {
        setUser(result.user)
      }
      return result
    } catch (error) {
      console.error('Error in signIn:', error)
      return { user: null, error: 'Sign in failed' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true)
    try {
      const result = await authService.signUp({ email, password, name })
      if (result.user) {
        setUser(result.user)
      }
      return result
    } catch (error) {
      console.error('Error in signUp:', error)
      return { user: null, error: 'Sign up failed' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const result = await authService.signOut()
      if (!result.error) {
        setUser(null)
      }
      return result
    } catch (error) {
      console.error('Error in signOut:', error)
      return { error: 'Sign out failed' }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      return await authService.resetPassword(email)
    } catch (error) {
      console.error('Error in resetPassword:', error)
      return { error: 'Password reset failed' }
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error refreshing user:', error)
      showError('Failed to refresh user data')
    }
  }

  const contextValue: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login or show login modal
      showError('Please sign in to access this feature')
    }
  }, [user, loading])

  return { user, loading, isAuthenticated: !!user }
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Authentication Required</h3>
            <p className="text-gray-600">Please sign in to access this feature.</p>
          </div>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }
}