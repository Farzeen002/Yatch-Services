import Razorpay from 'razorpay'
import { createAdminClient } from '@/utils/supabase/server'
import crypto from 'crypto'

// Lazy initialization of Razorpay (only when needed)
function getRazorpayInstance() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.')
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

export async function POST(request: Request) {
  try {
    const { bookingId, amount, currency = 'INR' } = await request.json()

    if (!bookingId || !amount) {
      return Response.json(
        { error: 'Booking ID and amount are required' },
        { status: 400 }
      )
    }
    
    // Check if Razorpay is configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return Response.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 503 }
      )
    }

    // Create Supabase admin client (bypasses RLS)
    const supabase = createAdminClient()

    // Verify booking exists and get details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        yachts(name, type),
        users(full_name, email)
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return Response.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `booking_${bookingId}`,
      notes: {
        booking_id: bookingId,
        yacht_name: booking.yachts.name,
        customer_name: booking.users.full_name,
        customer_email: booking.users.email,
      },
    }

    // Get Razorpay instance (lazy initialization)
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create(orderOptions)

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Payment order creation error:', error)
    return Response.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}

