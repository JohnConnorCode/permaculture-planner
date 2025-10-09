import { NextResponse } from 'next/server'
import { createServerClientWithWrite } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin
    const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString()

    // Check for error from OAuth provider
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    if (error) {
      console.error('OAuth error:', error, errorDescription)
      const loginUrl = new URL('/auth/login', origin)
      loginUrl.searchParams.set('error', errorDescription || error)
      return NextResponse.redirect(loginUrl)
    }

    if (!code) {
      console.error('No authorization code provided')
      const loginUrl = new URL('/auth/login', origin)
      loginUrl.searchParams.set('error', 'No authorization code provided')
      return NextResponse.redirect(loginUrl)
    }

    // Exchange code for session
    const supabase = await createServerClientWithWrite()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      const loginUrl = new URL('/auth/login', origin)
      loginUrl.searchParams.set('error', 'Authentication failed. Please try again.')
      return NextResponse.redirect(loginUrl)
    }

    if (!data.session) {
      console.error('No session created after code exchange')
      const loginUrl = new URL('/auth/login', origin)
      loginUrl.searchParams.set('error', 'Failed to create session. Please try again.')
      return NextResponse.redirect(loginUrl)
    }

    // Success - redirect to intended destination or dashboard
    if (redirectTo) {
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }

    return NextResponse.redirect(`${origin}/dashboard`)
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    const origin = new URL(request.url).origin
    const loginUrl = new URL('/auth/login', origin)
    loginUrl.searchParams.set('error', 'An unexpected error occurred. Please try again.')
    return NextResponse.redirect(loginUrl)
  }
}