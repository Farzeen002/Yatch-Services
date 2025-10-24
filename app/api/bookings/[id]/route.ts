import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'

// GET /api/bookings/[id] - Fetch a specific booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params
    const bookingId = resolvedParams.id

    const { data: booking, error } = await supabase
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
      .eq('id', bookingId)
      .single()

    if (error) {
      console.error('Error fetching booking:', error)
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user owns this booking or is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role_type')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role_type === 'admin'
    
    if (!isAdmin && booking.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to view this booking' },
        { status: 403 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/bookings/[id] - Update booking status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params
    const bookingId = resolvedParams.id
    const body = await request.json()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role_type')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role_type === 'admin'

    // Get current booking
    const { data: currentBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (!isAdmin && currentBooking.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this booking' },
        { status: 403 }
      )
    }

    // Validate status update
    const validStatuses = ['pending', 'confirmed', 'cancelled']
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    
    if (body.status) {
      updateData.status = body.status
    }
    
    if (body.start_date) {
      updateData.start_date = body.start_date
    }
    
    if (body.end_date) {
      updateData.end_date = body.end_date
    }
    
    if (body.guests) {
      updateData.guests = parseInt(body.guests)
    }
    
    if (body.total_price) {
      updateData.total_price = parseFloat(body.total_price)
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
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
      console.error('Error updating booking:', error)
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[id] - Cancel a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params
    const bookingId = resolvedParams.id

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role_type')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role_type === 'admin'

    // Get current booking
    const { data: currentBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (!isAdmin && currentBooking.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to cancel this booking' },
        { status: 403 }
      )
    }

    // Update booking status to cancelled instead of deleting
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) {
      console.error('Error cancelling booking:', error)
      return NextResponse.json(
        { error: 'Failed to cancel booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
