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

// Helper function to generate short receipt ID (max 40 chars)
function generateReceiptId(bookingId: string): string {
  // Take first 8 chars of UUID + timestamp for uniqueness
  const shortId = bookingId.substring(0, 8)
  const timestamp = Date.now().toString().slice(-8)
  return `BK_${shortId}_${timestamp}` // Format: BK_12345678_12345678 (23 chars)
}

export async function POST(request: Request) {
  try {
    const { yachtName, yachtId, duration, totalPrice, guestCount, startDate, userId } = await request.json()

    if (!yachtName || !totalPrice || !userId) {
      return Response.json(
        { error: 'Missing required fields' },
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

    // Create Supabase admin client (bypasses RLS for server-side operations)
    const supabase = createAdminClient()

    // Create booking in database first
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        yacht_id: yachtId,
        start_date: startDate,
        end_date: new Date(new Date(startDate).getTime() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        guests: guestCount || 2,
        total_price: totalPrice,
        status: 'pending',
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking creation error:', bookingError)
      return Response.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // Generate short receipt ID (CRITICAL FIX)
    const receiptId = generateReceiptId(booking.id)
    
    // Validate receipt length (safety check)
    if (receiptId.length > 40) {
      console.error('Receipt ID too long:', receiptId.length)
      return Response.json(
        { error: 'Internal error: Receipt ID generation failed' },
        { status: 500 }
      )
    }

    // Create Razorpay order with SHORT receipt ID
    const orderOptions = {
      amount: Math.round(totalPrice * 100), // Convert to paise (INR) or smallest currency unit
      currency: 'INR', // Change to 'USD' if needed
      receipt: receiptId, // SHORT receipt ID (max 40 chars)
      notes: {
        booking_id: booking.id, // Full UUID stored in notes
        yacht_name: yachtName,
        duration: duration,
        guests: guestCount || 2,
        start_date: startDate,
      },
    }

    console.log('Creating Razorpay order with receipt:', receiptId)
    
    // Get Razorpay instance (lazy initialization)
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create(orderOptions)

    // Update booking with order ID
    await supabase
      .from('bookings')
      .update({ razorpay_order_id: order.id })
      .eq('id', booking.id)

    return Response.json({
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      booking: {
        id: booking.id,
        status: booking.status,
      },
      razorpayKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error('Payment order creation error:', error)
    return Response.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    )
  }
}