import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

/**
 * Get the authenticated user from Supabase
 * Works in Server Components and API Routes (Next.js 15+)
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    // Await cookies() to get the actual cookie store
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Auth error:', error.message)
      return null
    }

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    }
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

/**
 * Check if a user object is authenticated (not null)
 */
export function isAuthenticated(user: User | null): user is User {
  return user !== null && !!user.id
}

/**
 * Get user session (alternative method)
 */
export async function getUserSession() {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              // Ignore cookie setting errors in Server Components
            }
          },
        },
      }
    )

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Session error:', error.message)
      return null
    }

    return session
  } catch (error) {
    console.error('Error getting user session:', error)
    return null
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              // Ignore cookie setting errors
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out error:', error.message)
      return false
    }

    return true
  } catch (error) {
    console.error('Error signing out:', error)
    return false
  }
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in API routes that must have an authenticated user
 */
export async function requireAuth(): Promise<User> {
  const user = await getAuthenticatedUser()
  
  if (!isAuthenticated(user)) {
    throw new Error('Authentication required')
  }
  
  return user
}

/**
 * Create a Supabase client for API routes (simpler helper)
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Ignore errors    
          }
        },
      },
    }
  )
}