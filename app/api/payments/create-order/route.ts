import { NextRequest, NextResponse } from "next/server"
import { razorpay, razorpayConfig, convertToPaise } from "@/lib/razorpay"
import { createServerSupabaseClient } from "@/utils/supabase/server"

// POST /api/payments/create-order - Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    console.log("Creating Razorpay order...")

    // Ensure Razorpay is enabled
    if (!razorpayConfig.enabled || !razorpay) {
      console.warn("Razorpay is disabled or not initialized.")
      return NextResponse.json(
        { error: "Razorpay is disabled in environment settings" },
        { status: 400 }
      )
    }

    //upabase authentication
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log(" User not authenticated:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    //  Parse incoming data
    const body = await request.json()
    const { amount, currency = "INR", bookingId, yachtName } = body
    console.log("🧾 Payment order data received:", body)

    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: "Amount and booking ID are required" },
        { status: 400 }
      )
    }

    // Convert to paise (single conversion)
    const amountInPaise = convertToPaise(amount)
    console.log("Amount in paise:", amountInPaise)

    // Prepare Razorpay order details
    const orderOptions = {
      amount: amountInPaise,
      currency,
      receipt: `bk_${bookingId.substring(0, 8)}`,
      notes: {
        booking_id: bookingId,
        yacht_name: yachtName,
        user_id: user.id,
      },
    }
    console.log("Razorpay order options:", orderOptions)

    // Create Razorpay order
    const order = await razorpay.orders.create(orderOptions)
    console.log("Razorpay order created:", order)

    // Send consistent response
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    })
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create payment order" },
      { status: 500 }
    )
  }
}
