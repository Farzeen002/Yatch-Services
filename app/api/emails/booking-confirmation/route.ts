import { createServerSupabaseClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"
import { generateBookingConfirmationEmail } from "@/lib/email-templates"
import { generateBookingSummary } from "@/lib/pdf-generator"

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
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

    // Get booking details with yacht info
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_reference,
        start_date,
        end_date,
        guests,
        total_price,
        status,
        payment_status,
        payment_id,
        razorpay_payment_id,
        created_at,
        yachts (
          name,
          location,
          images
        )
      `)
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', user.id)
      .single()

    const userName = profile?.full_name || 'Valued Customer'
    const userEmail = profile?.email || user.email || ''
    const userPhone = profile?.phone || ''
    const yacht = booking.yachts as any
    const yachtName = yacht?.name || 'Unknown Yacht'
    const yachtLocation = yacht?.location || 'Location TBD'
    const yachtImage = yacht?.images?.[0] || undefined

    // Format dates
    const startDate = new Date(booking.start_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const endDate = new Date(booking.end_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const createdAt = new Date(booking.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    // Generate booking summary PDF
    const pdfBuffer = generateBookingSummary({
      bookingId: booking.id,
      bookingReference: booking.booking_reference || booking.id,
      userName,
      userEmail,
      userPhone,
      yachtName,
      location: yachtLocation,
      startDate,
      endDate,
      guests: booking.guests,
      totalPrice: Number(booking.total_price),
      status: booking.status || 'confirmed',
      paymentStatus: booking.payment_status || 'pending',
      paymentId: booking.payment_id || booking.razorpay_payment_id || 'Pending',
      createdAt,
    })

    // Generate email
    const emailHtml = generateBookingConfirmationEmail({
      userName,
      yachtName,
      yachtImage,
      bookingReference: booking.booking_reference || booking.id,
      startDate,
      endDate,
      guests: booking.guests,
      totalPrice: Number(booking.total_price),
      status: booking.status || 'confirmed',
      location: yachtLocation,
      bookingId: booking.id,
    })

    // Send email with PDF attachment
    const result = await emailService.sendEmail({
      to: userEmail,
      subject: `🎉 Booking Confirmed - ${yachtName}`,
      html: emailHtml,
      attachments: [
        {
          filename: `booking-${booking.booking_reference || booking.id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Booking confirmation email sent successfully',
    })

  } catch (error) {
    console.error('Booking confirmation email error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


