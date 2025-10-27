import { NextRequest, NextResponse } from "next/server"
import { razorpayConfig } from "@/lib/razorpay"
import { createServerSupabaseClient } from "@/utils/supabase/server"
import crypto from "crypto"

// POST /api/payments/verify - Verify Razorpay payment
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Ensure user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse payment verification data
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json(
        { error: "Missing required payment verification data" },
        { status: 400 }
      )
    }

    // Verify signature using Razorpay secret from .env
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", razorpayConfig.keySecret)
      .update(text)
      .digest("hex")

    const isValidSignature = expectedSignature === razorpay_signature

    if (!isValidSignature) {
      console.error("Invalid Razorpay signature verification")
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Update booking record in Supabase
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        payment_id: razorpay_payment_id,
        payment_status: "completed",
      })
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (bookingError) {
      console.error("⚠️ Error updating booking:", bookingError)
      return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 })
    }

    // ✅ All good — return success response
    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      booking,
    })
  } catch (error: any) {
    console.error("❌ Error verifying payment:", error)
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    )
  }
}
