import { createServerSupabaseClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"
import { generateFollowUpEmail } from "@/lib/email-templates"

export async function POST(request: Request) {
  try {
    const { yachtId, yachtName } = await request.json()

    if (!yachtId || !yachtName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get yacht details
    const { data: yacht } = await supabase
      .from('yachts')
      .select('name, images')
      .eq('id', yachtId)
      .single()

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    const userName = profile?.full_name || 'Valued Customer'
    const userEmail = profile?.email || user.email || ''
    const yachtImage = yacht?.images?.[0] || undefined
    const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/yachts/${yachtId}`

    // Generate follow-up email
    const emailHtml = generateFollowUpEmail({
      userName,
      yachtName: yacht?.name || yachtName,
      yachtImage,
      bookingUrl,
    })

    // Send email
    const result = await emailService.sendEmail({
      to: userEmail,
      subject: `⏰ Complete Your Booking - ${yachtName} is Waiting!`,
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
      message: 'Follow-up email sent successfully',
    })

  } catch (error) {
    console.error('Follow-up email error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


