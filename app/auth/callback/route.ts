import { createServerSupabaseClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
  }

  try {
    const supabase = await createServerSupabaseClient()
    const { data: sessionData, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError || !sessionData.user) {
      return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
    }

    const user = sessionData.user

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, role_type')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      // Insert new user with default role_type (admin by default, or user)
      await supabase.from('users').insert({
        id: user.id,
        user_email: user.email,
        username: user.user_metadata.full_name ?? '',
        profile_image: user.user_metadata.avatar_url ?? '',
        role_type: 'admin' // Only used if first-time login
      })
    }

    // Fetch the role_type for redirect
    const { data: userData } = await supabase
      .from('users')
      .select('role_type')
      .eq('id', user.id)
      .single()

    if (userData?.role_type === 'admin') {
      return NextResponse.redirect(`${origin}/admin`)
    }

    return NextResponse.redirect(`${origin}/`)
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
  }
}
