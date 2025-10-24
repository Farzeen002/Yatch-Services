import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getAuthenticatedUser, isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // 1. AUTHENTICATION CHECK
    const user = await getAuthenticatedUser()
    if (!isAuthenticated(user)) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to view booking status.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('booking_id')

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return [] },
          setAll() { /* no-op for API routes */ },
        },
      }
    )

    let query = supabase
      .from('bookings')
      .select(`
        *,
        yachts (
          name,
          type,
          location,
          price
        ),
        payments (
          id,
          status,
          amount,
          currency,
          razorpay_order_id,
          razorpay_payment_id,
          created_at
        ),
        receipts (
          id,
          receipt_number,
          amount,
          currency,
          status,
          created_at
        )
      `)
      .eq('user_id', user.id)

    if (bookingId) {
      query = query.eq('id', bookingId)
    }

    const { data: bookings, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch booking status' },
        { status: 500 }
      )
    }

    // Format response
    const formattedBookings = bookings?.map(booking => ({
      id: booking.id,
      status: booking.status,
      start_date: booking.start_date,
      end_date: booking.end_date,
      guests: booking.guests,
      total_price: booking.total_price,
      created_at: booking.created_at,
      yacht: booking.yachts,
      payment: booking.payments?.[0] || null,
      receipt: booking.receipts?.[0] || null
    })) || []

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
      count: formattedBookings.length
    })

  } catch (error) {
    console.error('Booking status error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch booking status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}


