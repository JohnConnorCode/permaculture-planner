#!/usr/bin/env node

/**
 * Script to make a user an admin
 * Usage: node scripts/make-admin.js <user-email>
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const userEmail = process.argv[2]

if (!userEmail) {
  console.error('Usage: node scripts/make-admin.js <user-email>')
  process.exit(1)
}

async function makeAdmin() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Find user by email
    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('id, email, is_admin')
      .eq('email', userEmail)
      .single()

    if (findError) {
      console.error('Error finding user:', findError.message)
      process.exit(1)
    }

    if (!profile) {
      console.error(`User not found: ${userEmail}`)
      process.exit(1)
    }

    if (profile.is_admin) {
      console.log(`User ${userEmail} is already an admin`)
      process.exit(0)
    }

    // Update user to admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', profile.id)

    if (updateError) {
      console.error('Error updating user:', updateError.message)
      process.exit(1)
    }

    console.log(`✓ Successfully made ${userEmail} an admin`)
    console.log(`They can now access the admin dashboard at /admin`)
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

makeAdmin()