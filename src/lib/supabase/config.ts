// Supabase configuration constants
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  
  // Table names
  tables: {
    users: 'users',
    fines: 'fines',
    credits: 'credits',
  },
  
  // Default pagination
  pagination: {
    defaultLimit: 50,
    maxLimit: 100,
  },
  
  // Auth configuration
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
} as const

// Validate required environment variables
export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all Supabase variables are set.'
    )
  }
}

// Initialize configuration validation
if (typeof window === 'undefined') {
  // Only validate on server side to avoid issues with client-side rendering
  validateEnvironment()
}