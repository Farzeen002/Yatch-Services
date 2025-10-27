import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { createServerSupabaseClient } from '@/utils/supabase/server'
import crypto from 'crypto'

// POST /api/payments/verify - Verify Razorpay payment
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required payment verification data' },
        { status: 400 }
      )
    }

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const signature = crypto
      .createHmac('sha256', 'k6CJGD4jnACepn4Ic7dwUtWB')
      .update(text)
      .digest('hex')

    const isValidSignature = signature === razorpay_signature

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update booking status to confirmed
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .update({ 
        status: 'confirmed',
        payment_id: razorpay_payment_id,
        payment_status: 'completed'
      })
      .eq('id', bookingId)
      .eq('user_id', user.id) // Ensure user owns this booking
      .select()
      .single()

    if (bookingError) {
      console.error('Error updating booking:', bookingError)
      return NextResponse.json(
        { error: 'Failed to update booking status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      booking: booking
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
