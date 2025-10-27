import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('booking_id')

    // Get authenticated Supabase client (reads cookies)
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to view booking status.' },
        { status: 401 }
      )
    }

    let query = supabase
      .from('bookings')
      .select(`
        *,
        yachts (
          name,
          type,
          location,
          price,
          images
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
      payment_status: booking.payment_status,
      start_date: booking.start_date,
      end_date: booking.end_date,
      guests: booking.guests,
      total_price: booking.total_price,
      created_at: booking.created_at,
      yacht: booking.yachts
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



