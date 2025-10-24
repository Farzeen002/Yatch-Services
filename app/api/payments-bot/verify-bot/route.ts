import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      bookingId 
    } = await request.json()

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return Response.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      )
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    const isValidSignature = expectedSignature === razorpay_signature

    if (!isValidSignature) {
      console.error('Invalid Razorpay signature')
      return Response.json(
        { 
          success: false,
          error: 'Invalid payment signature. Payment verification failed.' 
        },
        { status: 400 }
      )
    }

    // Signature is valid, update booking in database
    const supabase = createClient()
    
    // Update booking status (removed payment_status for compatibility)
    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        razorpay_payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (updateError) {
      console.error('Booking update error:', updateError)
      return Response.json(
        { 
          success: false,
          error: 'Failed to update booking status' 
        },
        { status: 500 }
      )
    }

    // Optional: Send confirmation email here
    // await sendBookingConfirmationEmail(booking)

    console.log('Payment verified successfully for booking:', bookingId)

    return Response.json({
      success: true,
      verified: true,
      booking: {
        id: booking.id,
        status: booking.status,
        payment_status: booking.payment_status
      },
      message: 'Payment verified and booking confirmed'
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return Response.json(
      { 
        success: false,
        error: 'Payment verification failed due to server error' 
      },
      { status: 500 }
    )
  }
}