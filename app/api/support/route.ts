import { createServerSupabaseClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { bookingId, yachtName, issueType, issueDetails, userEmail, userName } = await request.json()

    // Validate input
    if (!bookingId || !issueType || !issueDetails) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user is authenticated
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Please log in to submit a support request' },
        { status: 401 }
      )
    }

    // Verify the booking belongs to the user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, user_id')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or access denied' },
        { status: 404 }
      )
    }

    // Insert support request into database
    const { data: supportRequest, error: insertError } = await supabase
      .from('support_requests')
      .insert({
        user_id: user.id,
        booking_id: bookingId,
        yacht_name: yachtName,
        issue_type: issueType,
        issue_details: issueDetails,
        user_email: userEmail,
        user_name: userName,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting support request:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to submit support request' },
        { status: 500 }
      )
    }

    // TODO: Send email notification to support team
    // You can integrate an email service like SendGrid, Resend, or Nodemailer here

    return NextResponse.json({
      success: true,
      message: 'Support request submitted successfully',
      supportRequest
    })

  } catch (error) {
    console.error('Support API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve support requests for the authenticated user
export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Please log in to view support requests' },
        { status: 401 }
      )
    }

    const { data: supportRequests, error } = await supabase
      .from('support_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching support requests:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch support requests' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      supportRequests: supportRequests || []
    })

  } catch (error) {
    console.error('Support GET API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

