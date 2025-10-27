import { NextRequest, NextResponse } from 'next/server'
import { razorpay, convertToPaise } from '@/lib/razorpay'
import { createServerSupabaseClient } from '@/utils/supabase/server'

// POST /api/payments/create-order - Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    console.log("Creating Razorpay order...")
    const supabase = await createServerSupabaseClient()

    // ✅ Ensure user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.log("User not authenticated for payment:", authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log("Payment order data received:", body)
    const { amount, currency = 'INR', bookingId, yachtName } = body

    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: 'Amount and booking ID are required' },
        { status: 400 }
      )
    }

    // ✅ Do NOT double-multiply; convert only once
    const amountInPaise = convertToPaise(amount)
    console.log("Amount in paise:", amountInPaise)

    // ✅ Create Razorpay order
    const orderOptions = {
      amount: amountInPaise,
      currency,
      receipt: `bk_${bookingId.substring(0, 8)}`,
      notes: {
        booking_id: bookingId,
        yacht_name: yachtName,
        user_id: user.id
      }
    }
    console.log("Razorpay order options:", orderOptions)

    const order = await razorpay.orders.create(orderOptions)
    console.log("Razorpay order created:", order)

    // ✅ Return consistent response keys
    return NextResponse.json({
      id: order.id,              // <-- renamed from orderId
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
