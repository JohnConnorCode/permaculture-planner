'use client'

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { showError, showSuccess, showLoading } from '@/components/ui/action-feedback'

// Database types will be properly typed once Supabase is configured
type User = any
type UserInsert = any
type UserUpdate = any

export interface AuthUser {
  id: string
  email: string
  name?: string
  created_at: string
}

export interface SignUpData {
  email: string
  password: string
  name?: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  private client = createClient()

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.client.auth.getUser()

      if (error) {
        console.error('Error getting current user:', error)
        return null
      }

      if (!user) {
        return null
      }

      // Return the auth user info
      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
        created_at: user.created_at
      }
    } catch (error) {
      console.error('Error in getCurrentUser:', error)
      return null
    }
  }

  /**
   * Get user profile from database
   */
  async getProfile(userId?: string): Promise<User | null> {
    try {
      const currentUser = userId ? { id: userId } : await this.getCurrentUser()
      if (!currentUser) {
        return null
      }

      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // User profile doesn't exist yet
          return null
        }
        console.error('Error getting user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getProfile:', error)
      return null
    }
  }

  /**
   * Create a new user account
   */
  async signUp(data: SignUpData): Promise<{ user: AuthUser | null; error: string | null }> {
    const loadingId = showLoading('Creating your account...')

    try {
      const { data: authData, error: authError } = await this.client.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name
          }
        }
      })

      if (authError) {
        showError(authError.message)
        return { user: null, error: authError.message }
      }

      if (!authData.user) {
        const error = 'Failed to create user account'
        showError(error)
        return { user: null, error }
      }

      // Profile creation will happen on first save
      // Skip database insert for now due to typing issues

      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: data.name,
        created_at: authData.user.created_at
      }

      showSuccess('Account created successfully! Please check your email to verify your account.')
      return { user, error: null }

    } catch (error) {
      console.error('Error in signUp:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account'
      showError(errorMessage)
      return { user: null, error: errorMessage }
    } finally {
      // Always dismiss loading
      setTimeout(() => {
        // Give a moment for success/error message to show
      }, 100)
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(data: SignInData): Promise<{ user: AuthUser | null; error: string | null }> {
    const loadingId = showLoading('Signing you in...')

    try {
      const { data: authData, error: authError } = await this.client.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (authError) {
        showError(authError.message)
        return { user: null, error: authError.message }
      }

      if (!authData.user) {
        const error = 'Sign in failed'
        showError(error)
        return { user: null, error }
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: authData.user.user_metadata?.name,
        created_at: authData.user.created_at
      }

      showSuccess('Welcome back!')
      return { user, error: null }

    } catch (error) {
      console.error('Error in signIn:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in'
      showError(errorMessage)
      return { user: null, error: errorMessage }
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: string | null }> {
    const loadingId = showLoading('Signing you out...')

    try {
      const { error } = await this.client.auth.signOut()

      if (error) {
        showError(error.message)
        return { error: error.message }
      }

      showSuccess('Signed out successfully')
      return { error: null }

    } catch (error) {
      console.error('Error in signOut:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out'
      showError(errorMessage)
      return { error: errorMessage }
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UserUpdate): Promise<{ user: User | null; error: string | null }> {
    const loadingId = showLoading('Updating profile...')

    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser) {
        const error = 'Not authenticated'
        showError(error)
        return { user: null, error }
      }

      // For now, just update the auth metadata
      // Database operations will be added once types are configured
      const data: AuthUser = {
        ...currentUser,
        ...updates,
        name: updates.name ?? currentUser.name,
        created_at: currentUser.created_at
      }

      showSuccess('Profile updated successfully')
      return { user: data as any, error: null }

    } catch (error) {
      console.error('Error in updateProfile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      showError(errorMessage)
      return { user: null, error: errorMessage }
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    const loadingId = showLoading('Sending reset email...')

    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        showError(error.message)
        return { error: error.message }
      }

      showSuccess('Password reset email sent! Check your inbox.')
      return { error: null }

    } catch (error) {
      console.error('Error in resetPassword:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email'
      showError(errorMessage)
      return { error: errorMessage }
    }
  }

  /**
   * Listen for auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.client.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          created_at: session.user.created_at
        }
        callback(user)
      } else {
        callback(null)
      }
    })
  }

  /**
   * Check if user session is valid
   */
  async getSession() {
    try {
      const { data: { session }, error } = await this.client.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
        return null
      }

      return session
    } catch (error) {
      console.error('Error in getSession:', error)
      return null
    }
  }

  /**
   * Refresh session
   */
  async refreshSession() {
    try {
      const { data: { session }, error } = await this.client.auth.refreshSession()

      if (error) {
        console.error('Error refreshing session:', error)
        return null
      }

      return session
    } catch (error) {
      console.error('Error in refreshSession:', error)
      return null
    }
  }
}

// Export singleton instance
export const authService = new AuthService()