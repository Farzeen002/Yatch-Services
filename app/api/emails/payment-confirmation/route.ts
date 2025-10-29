import { createServerSupabaseClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"
import { generatePaymentConfirmationEmail } from "@/lib/email-templates"
import { generatePaymentReceipt } from "@/lib/pdf-generator"

export async function POST(request: Request) {
  try {
    const { bookingId, paymentId } = await request.json()

    if (!bookingId || !paymentId) {
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

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_reference,
        total_price,
        payment_id,
        razorpay_payment_id,
        created_at,
        yachts (name)
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
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    const userName = profile?.full_name || 'Valued Customer'
    const userEmail = profile?.email || user.email || ''
    const yachtName = (booking.yachts as any)?.name || 'Unknown Yacht'

    // Generate payment receipt PDF
    const pdfBuffer = generatePaymentReceipt({
      paymentId: paymentId,
      userName,
      userEmail,
      yachtName,
      bookingReference: booking.booking_reference || booking.id,
      paymentMethod: 'Online Payment',
      amount: Number(booking.total_price),
      transactionDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    })

    // Generate email
    const emailHtml = generatePaymentConfirmationEmail({
      userName,
      paymentId,
      paymentMethod: 'Online Payment',
      amount: Number(booking.total_price),
      transactionDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      yachtName,
      bookingReference: booking.booking_reference || booking.id,
    })

    // Send email with PDF attachment
    const result = await emailService.sendEmail({
      to: userEmail,
      subject: ` Payment Confirmed - ${yachtName} Booking`,
      html: emailHtml,
      attachments: [
        {
          filename: `receipt-${paymentId}.pdf`,
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
      message: 'Payment confirmation email sent successfully',
    })

  } catch (error) {
    console.error('Payment confirmation email error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


