import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'

// GET /api/bookings - Fetch bookings (with filters)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const yachtId = searchParams.get('yachtId')

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role_type')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role_type === 'admin'

    let query = supabase
      .from('bookings')
      .select(`
        *,
        yachts (
          name,
          type,
          location,
          images
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    if (yachtId) {
      query = query.eq('yacht_id', yachtId)
    }

    // If not admin, only show user's own bookings
    if (!isAdmin) {
      query = query.eq('user_id', user.id)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    console.log("Creating new booking...")
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log("User not authenticated:", authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("Booking data received:", body)
    
    // Validate required fields
    const requiredFields = ['yacht_id', 'start_date', 'end_date', 'guests', 'total_price']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate dates
    const startDate = new Date(body.start_date)
    const endDate = new Date(body.end_date)
    
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    if (startDate < new Date()) {
      return NextResponse.json(
        { error: 'Start date cannot be in the past' },
        { status: 400 }
      )
    }

    // Check yacht availability
    const { data: yacht, error: yachtError } = await supabase
      .from('yachts')
      .select('unavailable_dates, guests')
      .eq('id', body.yacht_id)
      .single()

    if (yachtError) {
      return NextResponse.json(
        { error: 'Yacht not found' },
        { status: 404 }
      )
    }

    // Check if yacht has enough capacity
    if (body.guests > yacht.guests) {
      return NextResponse.json(
        { error: 'Number of guests exceeds yacht capacity' },
        { status: 400 }
      )
    }

    // Check for date conflicts
    const unavailableDates = yacht.unavailable_dates || []
    const bookingStart = new Date(body.start_date)
    const bookingEnd = new Date(body.end_date)
    
    for (const unavailableDate of unavailableDates) {
      const conflictDate = new Date(unavailableDate)
      if (conflictDate >= bookingStart && conflictDate <= bookingEnd) {
        return NextResponse.json(
          { error: 'Selected dates are not available' },
          { status: 400 }
        )
      }
    }

    const bookingData = {
      yacht_id: body.yacht_id,
      user_id: user.id,
      start_date: body.start_date,
      end_date: body.end_date,
      guests: parseInt(body.guests),
      total_price: parseFloat(body.total_price),
      status: 'pending'
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select(`
        *,
        yachts (
          name,
          type,
          location
        )
      `)
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
