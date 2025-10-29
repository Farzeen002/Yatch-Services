import { createServerSupabaseClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"
import { generateWelcomeEmail } from "@/lib/email-templates"

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get user profile for full name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    const userName = profile?.full_name || user.email?.split('@')[0] || 'Valued Customer'
    const userEmail = profile?.email || user.email || ''

    // Generate welcome email
    const emailHtml = generateWelcomeEmail({
      userName,
      userEmail,
    })

    // Send email
    const result = await emailService.sendEmail({
      to: userEmail,
      subject: '🎉 Welcome to Yacht Services - Your Maritime Adventure Begins!',
      html: emailHtml,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
    })

  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


