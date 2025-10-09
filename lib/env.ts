/**
 * Environment variable validation and type-safe access
 * Validates required environment variables on app startup
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL',
] as const

type RequiredEnvVar = typeof requiredEnvVars[number]
type OptionalEnvVar = typeof optionalEnvVars[number]

/**
 * Validate required environment variables
 * Call this during app initialization
 */
export function validateEnv() {
  const missing: string[] = []
  const warnings: string[] = []

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  // Check optional but recommended variables
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(envVar)
    }
  }

  // Throw error if required vars are missing
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      `Please add these to your .env.local file.`
    )
  }

  // Log warnings for optional vars
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(
      `⚠️  Optional environment variables not set:\n${warnings.map(v => `  - ${v}`).join('\n')}\n` +
      `Some features may not work correctly.`
    )
  }

  // Validate URL format
  try {
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!)
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n` +
      `Must be a valid URL.`
    )
  }

  // Check for placeholder values
  if (process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key') {
    console.error(
      '🚨 SUPABASE_SERVICE_ROLE_KEY is set to placeholder value!\n' +
      'Server-side admin operations will fail. Get the real key from:\n' +
      'https://supabase.com/dashboard/project/_/settings/api'
    )
  }
}

/**
 * Type-safe environment variable getter
 */
export function getEnv(key: RequiredEnvVar): string
export function getEnv(key: OptionalEnvVar): string | undefined
export function getEnv(key: RequiredEnvVar | OptionalEnvVar): string | undefined {
  return process.env[key]
}

/**
 * Get environment with fallback
 */
export function getEnvOrDefault<T extends string>(
  key: OptionalEnvVar,
  defaultValue: T
): string {
  return process.env[key] || defaultValue
}

/**
 * Check if running in production
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production'
}

/**
 * Check if running in development
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}

/**
 * Get app URL (with fallback to localhost in development)
 */
export function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (isDevelopment()) {
    return 'http://localhost:3000'
  }

  throw new Error('NEXT_PUBLIC_APP_URL must be set in production')
}
