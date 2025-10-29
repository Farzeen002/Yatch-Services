// import { NextRequest, NextResponse } from "next/server"
// import { razorpayConfig } from "@/lib/razorpay"
// import { createServerSupabaseClient } from "@/utils/supabase/server"
// import crypto from "crypto"

// // Optional imports for email/PDF (won't block if they fail)
// let emailService: any
// let generatePaymentConfirmationEmail: any
// let generateBookingConfirmationEmail: any
// let generatePaymentReceipt: any
// let generateBookingSummary: any

// try {
//   const emailModule = require("@/lib/email-service")
//   emailService = emailModule.emailService

//   const templatesModule = require("@/lib/email-templates")
//   generatePaymentConfirmationEmail = templatesModule.generatePaymentConfirmationEmail
//   generateBookingConfirmationEmail = templatesModule.generateBookingConfirmationEmail

//   const pdfModule = require("@/lib/pdf-generator")
//   generatePaymentReceipt = pdfModule.generatePaymentReceipt
//   generateBookingSummary = pdfModule.generateBookingSummary
// } catch (e) {
//   console.warn("⚠️ Email/PDF modules not available - emails will be skipped")
// }

// // POST /api/payments/verify - Verify Razorpay payment
// export async function POST(request: NextRequest) {
//   try {
//     console.log("🔍 Payment verification started...")
//     const supabase = await createServerSupabaseClient()

//     // Ensure user is authenticated
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser()

//     if (authError || !user) {
//       console.error("❌ Auth error:", authError)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     console.log(" User authenticated:", user.id)

//     // Parse payment verification data
//     const body = await request.json()
//     console.log("📦 Received body:", { ...body, amount: body.amount })

//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
//       console.error("❌ Missing data:", { 
//         hasOrderId: !!razorpay_order_id, 
//         hasPaymentId: !!razorpay_payment_id, 
//         hasSignature: !!razorpay_signature, 
//         hasBookingId: !!bookingId 
//       })
//       return NextResponse.json(
//         { error: "Missing required payment verification data" },
//         { status: 400 }
//       )
//     }

//     // Verify signature using Razorpay secret from .env
//     const text = `${razorpay_order_id}|${razorpay_payment_id}`
//     const expectedSignature = crypto
//       .createHmac("sha256", razorpayConfig.keySecret)
//       .update(text)
//       .digest("hex")

//     const isValidSignature = expectedSignature === razorpay_signature

//     if (!isValidSignature) {
//       console.error("Invalid Razorpay signature verification")
//       return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
//     }

//     // First, fetch the current booking to preserve all fields
//     const { data: currentBooking, error: fetchError } = await supabase
//       .from("bookings")
//       .select("*")
//       .eq("id", bookingId)
//       .eq("user_id", user.id)
//       .single()

//     if (fetchError || !currentBooking) {
//       console.error("⚠️ Error fetching booking:", fetchError)
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 })
//     }

//     console.log("📊 Current booking before update:", {
//       id: currentBooking.id,
//       total_price: currentBooking.total_price,
//       guests: currentBooking.guests,
//       status: currentBooking.status
//     })

//     // Update booking record in Supabase - preserving total_price
//     const { data: booking, error: bookingError } = await supabase
//       .from("bookings")
//       .update({
//         status: "confirmed",
//         payment_id: razorpay_payment_id,
//         payment_status: "completed",
//         // Explicitly preserve total_price and other important fields
//         total_price: currentBooking.total_price,
//         guests: currentBooking.guests,
//         start_date: currentBooking.start_date,
//         end_date: currentBooking.end_date,
//       })
//       .eq("id", bookingId)
//       .eq("user_id", user.id)
//       .select()
//       .single()

//     if (bookingError) {
//       console.error("⚠️ Error updating booking:", bookingError)
//       return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 })
//     }

//     console.log(" Booking updated successfully:", {
//       id: booking.id,
//       total_price: booking.total_price,
//       status: booking.status,
//       payment_status: booking.payment_status,
//       payment_id: booking.payment_id
//     })

//     //  Return success IMMEDIATELY - don't wait for emails
//     const successResponse = NextResponse.json({
//       success: true,
//       paymentId: razorpay_payment_id,
//       orderId: razorpay_order_id,
//       booking,
//     })

//     // Send emails asynchronously in background (don't block the response)
//     setImmediate(async () => {
//       try {
//         // Skip if email/PDF modules not available
//         if (!emailService || !generatePaymentConfirmationEmail || !generateBookingConfirmationEmail || 
//             !generatePaymentReceipt || !generateBookingSummary) {
//           console.log('⚠️ Email/PDF modules not available - skipping email send')
//           return
//         }

//         console.log('📧 Starting email send process...')

//         // Get booking details with yacht info
//         const { data: bookingData, error: bookingFetchError } = await supabase
//           .from('bookings')
//           .select(`
//             id,
//             booking_reference,
//             start_date,
//             end_date,
//             guests,
//             total_price,
//             status,
//             payment_status,
//             created_at,
//             yachts (
//               name,
//               location,
//               images
//             )
//           `)
//           .eq('id', bookingId)
//           .eq('user_id', user.id)
//           .single()

//         if (bookingFetchError || !bookingData) {
//           console.error('Failed to fetch booking for email:', bookingFetchError)
//           return
//         }

//         console.log(' Booking data fetched for email')

//         // Get user profile
//         const { data: profile } = await supabase
//           .from('profiles')
//           .select('full_name, email, phone')
//           .eq('id', user.id)
//           .single()

//         const userName = profile?.full_name || 'Valued Customer'
//         const userEmail = profile?.email || user.email || ''
//         const userPhone = profile?.phone || ''
//         const yacht = bookingData.yachts as any
//         const yachtName = yacht?.name || 'Unknown Yacht'
//         const yachtLocation = yacht?.location || 'Location TBD'
//         const yachtImage = yacht?.images?.[0] || undefined

//         // Format dates
//         const startDate = new Date(bookingData.start_date).toLocaleDateString('en-US', {
//           weekday: 'long',
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric',
//         })
//         const endDate = new Date(bookingData.end_date).toLocaleDateString('en-US', {
//           weekday: 'long',
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric',
//         })
//         const transactionDate = new Date().toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric',
//           hour: '2-digit',
//           minute: '2-digit',
//         })
//         const createdAt = new Date(bookingData.created_at).toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric',
//           hour: '2-digit',
//           minute: '2-digit',
//         })

//         // Send Payment Confirmation Email
//         const paymentReceiptPdf = generatePaymentReceipt({
//           paymentId: razorpay_payment_id,
//           userName,
//           userEmail,
//           yachtName,
//           bookingReference: bookingData.booking_reference || bookingData.id,
//           paymentMethod: 'Online Payment',
//           amount: Number(bookingData.total_price),
//           transactionDate: new Date().toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//           }),
//         })

//         const paymentEmailHtml = generatePaymentConfirmationEmail({
//           userName,
//           paymentId: razorpay_payment_id,
//           paymentMethod: 'Online Payment',
//           amount: Number(bookingData.total_price),
//           transactionDate,
//           yachtName,
//           bookingReference: bookingData.booking_reference || bookingData.id,
//         })

//         await emailService.sendEmail({
//           to: userEmail,
//           subject: ` Payment Confirmed - ${yachtName} Booking`,
//           html: paymentEmailHtml,
//           attachments: [
//             {
//               filename: `receipt-${razorpay_payment_id}.pdf`,
//               content: paymentReceiptPdf,
//               contentType: 'application/pdf',
//             },
//           ],
//         })

//         console.log(' Payment confirmation email sent')

//         // Send Booking Confirmation Email
//         const bookingSummaryPdf = generateBookingSummary({
//           bookingId: bookingData.id,
//           bookingReference: bookingData.booking_reference || bookingData.id,
//           userName,
//           userEmail,
//           userPhone,
//           yachtName,
//           location: yachtLocation,
//           startDate,
//           endDate,
//           guests: bookingData.guests,
//           totalPrice: Number(bookingData.total_price),
//           status: bookingData.status || 'confirmed',
//           paymentStatus: bookingData.payment_status || 'completed',
//           paymentId: razorpay_payment_id,
//           createdAt,
//         })

//         const bookingEmailHtml = generateBookingConfirmationEmail({
//           userName,
//           yachtName,
//           yachtImage,
//           bookingReference: bookingData.booking_reference || bookingData.id,
//           startDate,
//           endDate,
//           guests: bookingData.guests,
//           totalPrice: Number(bookingData.total_price),
//           status: bookingData.status || 'confirmed',
//           location: yachtLocation,
//           bookingId: bookingData.id,
//         })

//         await emailService.sendEmail({
//           to: userEmail,
//           subject: `🎉 Booking Confirmed - ${yachtName}`,
//           html: bookingEmailHtml,
//           attachments: [
//             {
//               filename: `booking-${bookingData.booking_reference || bookingData.id}.pdf`,
//               content: bookingSummaryPdf,
//               contentType: 'application/pdf',
//             },
//           ],
//         })

//         console.log(' Booking confirmation email sent')
//       } catch (emailError) {
//         console.error('❌ Error sending confirmation emails:', emailError)
//         // Don't throw - emails are not critical for payment verification
//       }
//     })()

//     //  Return the success response (already created above)
//     return successResponse
//   } catch (error: any) {
//     console.error("❌ Error verifying payment:", error)
//     console.error("❌ Error stack:", error.stack)
//     console.error("❌ Error details:", JSON.stringify(error, null, 2))

//     return NextResponse.json(
//       { 
//         error: error.message || "Payment verification failed",
//         details: error.toString()
//       },
//       { status: 500 }
//     )
//   }
// }


import { NextRequest, NextResponse } from "next/server"
import { razorpayConfig } from "@/lib/razorpay"
import { createServerSupabaseClient } from "@/utils/supabase/server"
import crypto from "crypto"

// Optional email/PDF modules — won't block if missing
let emailService: any
let generatePaymentConfirmationEmail: any
let generateBookingConfirmationEmail: any
let generatePaymentReceipt: any
let generateBookingSummary: any

try {
  const emailModule = require("@/lib/email-service")
  emailService = emailModule.emailService

  const templates = require("@/lib/email-templates")
  generatePaymentConfirmationEmail = templates.generatePaymentConfirmationEmail
  generateBookingConfirmationEmail = templates.generateBookingConfirmationEmail

  const pdf = require("@/lib/pdf-generator")
  generatePaymentReceipt = pdf.generatePaymentReceipt
  generateBookingSummary = pdf.generateBookingSummary
} catch {
  console.warn("⚠️ Email/PDF modules not available — skipping email send")
}

//  Polyfill for environments missing setImmediate (Next.js 15)
if (typeof global.setImmediate === "undefined") {
  (global as any).setImmediate = (fn: (...args: any[]) => void, ...args: any[]) =>
    setTimeout(fn, 0, ...args)
}

export async function POST(request: NextRequest) {
  try {
    console.log("Payment verification started…")
    const supabase = await createServerSupabaseClient()

    // --- Auth check ----------------------------------------------------------
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User authenticated:", user.id)

    // --- Parse request body --------------------------------------------------
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, amount } = body
    console.log("Received body:", { ...body, hasAmount: !!amount })

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      console.error("Missing required fields")
      return NextResponse.json(
        { error: "Missing required payment verification data" },
        { status: 400 }
      )
    }

    // --- Verify Razorpay signature ------------------------------------------
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", razorpayConfig.keySecret)
      .update(text)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      console.error("Invalid payment signature")
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    console.log("Payment signature verified")

    // --- Fetch current booking ----------------------------------------------
    const { data: currentBooking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !currentBooking) {
      console.error("Booking not found:", fetchError)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    console.log("Current booking:", {
      id: currentBooking.id,
      total_price: currentBooking.total_price,
      status: currentBooking.status
    })

    // --- Update booking ------------------------------------------------------
    //  Determine the correct total_price
    let finalTotalPrice = currentBooking.total_price

    // If total_price is missing, null, or 0, use the amount from request
    if (!finalTotalPrice || finalTotalPrice <= 0) {
      if (amount && amount > 0) {
        finalTotalPrice = amount
        console.log("Using amount from request:", amount)
      } else {
        console.error("No valid total_price found")
        return NextResponse.json(
          { error: "Invalid booking amount" },
          { status: 400 }
        )
      }
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        payment_status: "completed",
        payment_id: razorpay_payment_id,
        total_price: finalTotalPrice,
        // Preserve other important fields
        guests: currentBooking.guests,
        start_date: currentBooking.start_date,
        end_date: currentBooking.end_date,
      })
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (bookingError) {
      console.error("Failed to update booking:", bookingError)
      return NextResponse.json(
        { error: "Failed to update booking status" },
        { status: 500 }
      )
    }

    console.log("Booking updated successfully:", {
      id: booking.id,
      total_price: booking.total_price,
      status: booking.status,
      payment_status: booking.payment_status
    })

    // --- Respond immediately -------------------------------------------------
    const successResponse = NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      booking,
    })

    // --- Fire-and-forget email/pdf notifications -----------------------------
    setImmediate(async () => {
      try {
        if (
          !emailService ||
          !generatePaymentConfirmationEmail ||
          !generateBookingConfirmationEmail ||
          !generatePaymentReceipt ||
          !generateBookingSummary
        ) {
          console.log("Email/PDF modules missing — skipping emails")
          return
        }

        console.log("Preparing confirmation emails…")

        const { data: bookingData, error: bookingFetchError } = await supabase
          .from("bookings")
          .select(
            `
            id, booking_reference, start_date, end_date, guests,
            total_price, status, payment_status, created_at,
            yachts ( name, location, images )
          `
          )
          .eq("id", bookingId)
          .eq("user_id", user.id)
          .single()

        if (bookingFetchError || !bookingData) {
          console.error("Could not fetch booking for email:", bookingFetchError)
          return
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email, phone")
          .eq("id", user.id)
          .single()

        const userName = profile?.full_name || "Valued Customer"
        const userEmail = profile?.email || user.email || ""
        const userPhone = profile?.phone || ""
        
        //  Type-safe yacht data access
        const yacht = bookingData.yachts as any
        const yachtName = yacht?.name || "Unknown Yacht"
        const yachtLocation = yacht?.location || "Location TBD"
        const yachtImage = yacht?.images?.[0] || undefined

        //  Format dates safely
        const formatDate = (dateString: string) => {
          try {
            return new Date(dateString).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          } catch {
            return dateString
          }
        }

        const formatDateTime = (dateString: string) => {
          try {
            return new Date(dateString).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          } catch {
            return dateString
          }
        }

        const startDate = formatDate(bookingData.start_date)
        const endDate = formatDate(bookingData.end_date)
        const transactionDate = formatDateTime(new Date().toISOString())
        const createdAt = formatDateTime(bookingData.created_at)

        // --- Payment receipt email ------------------------------------------
        const paymentPdf = generatePaymentReceipt({
          paymentId: razorpay_payment_id,
          userName,
          userEmail,
          yachtName,
          bookingReference: bookingData.booking_reference || bookingData.id,
          paymentMethod: "Online Payment",
          amount: Number(bookingData.total_price),
          transactionDate: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        })

        const paymentEmailHtml = generatePaymentConfirmationEmail({
          userName,
          paymentId: razorpay_payment_id,
          paymentMethod: "Online Payment",
          amount: Number(bookingData.total_price),
          transactionDate,
          yachtName,
          bookingReference: bookingData.booking_reference || bookingData.id,
        })

        await emailService.sendEmail({
          to: userEmail,
          subject: `Payment Confirmed – ${yachtName}`,
          html: paymentEmailHtml,
          attachments: [
            {
              filename: `receipt-${razorpay_payment_id}.pdf`,
              content: paymentPdf,
              contentType: "application/pdf",
            },
          ],
        })

        console.log("Payment confirmation email sent")

        // --- Booking confirmation email -------------------------------------
        const bookingPdf = generateBookingSummary({
          bookingId: bookingData.id,
          bookingReference: bookingData.booking_reference || bookingData.id,
          userName,
          userEmail,
          userPhone,
          yachtName,
          location: yachtLocation,
          startDate,
          endDate,
          guests: bookingData.guests,
          totalPrice: Number(bookingData.total_price),
          paymentId: razorpay_payment_id,
          status: "confirmed",
          paymentStatus: "completed",
          createdAt,
        })

        const bookingEmailHtml = generateBookingConfirmationEmail({
          userName,
          yachtName,
          yachtImage,
          bookingReference: bookingData.booking_reference || bookingData.id,
          startDate,
          endDate,
          guests: bookingData.guests,
          totalPrice: Number(bookingData.total_price),
          status: "confirmed",
          location: yachtLocation,
          bookingId: bookingData.id,
        })

        await emailService.sendEmail({
          to: userEmail,
          subject: `Booking Confirmed – ${yachtName}`,
          html: bookingEmailHtml,
          attachments: [
            {
              filename: `booking-${bookingData.booking_reference || bookingData.id}.pdf`,
              content: bookingPdf,
              contentType: "application/pdf",
            },
          ],
        })

        console.log("Booking confirmation email sent")
      } catch (err) {
        console.error("Email/PDF background error:", err)
        // Don't throw - emails are non-critical
      }
    })

    return successResponse
  } catch (error: any) {
    console.error("Payment verification error:", error)
    console.error("Error stack:", error.stack)
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    )
  }
}
