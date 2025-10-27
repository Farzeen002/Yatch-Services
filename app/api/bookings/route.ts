import { createClient } from "@/utils/supabase/server"
import { checkYachtAvailability, createBooking, calculateBookingPrice } from "@/lib/booking-utils"

export async function POST(request: Request) {
  try {
    const { yachtId, startDate, endDate, guests, specialRequests } = await request.json()
    
    // Validate input
    if (!yachtId || !startDate || !endDate || !guests) {
      return Response.json(
        { success: false, error: 'Missing required booking information' },
        { status: 400 }
      )
    }
    
    // Check if user is authenticated
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json(
        { success: false, error: 'Please log in to make a booking', requiresAuth: true },
        { status: 401 }
      )
    }
    
    // Get yacht details for pricing
    const { data: yacht, error: yachtError } = await supabase
      .from('yachts')
      .select('*')
      .eq('id', yachtId)
      .single()
    
    if (yachtError || !yacht) {
      return Response.json(
        { success: false, error: 'Yacht not found' },
        { status: 404 }
      )
    }
    
    // Calculate pricing
    const pricing = calculateBookingPrice(yacht.price, startDate, endDate, guests)
    
    // Check availability
    const availability = await checkYachtAvailability(yachtId, startDate, endDate, guests)
    
    if (!availability.available) {
      return Response.json(
        { success: false, error: availability.error },
        { status: 400 }
      )
    }
    
    // Create booking
    const bookingResult = await createBooking({
      yachtId,
      userId: user.id,
      startDate,
      endDate,
      guests,
      totalPrice: pricing.totalPrice,
      specialRequests
    })
    
    if (!bookingResult.success) {
      return Response.json(
        { success: false, error: bookingResult.error },
        { status: 400 }
      )
    }
    
    return Response.json({
      success: true,
      booking: bookingResult.booking,
      pricing,
      availability: {
        totalBookedGuests: availability.totalBookedGuests,
        remainingCapacity: availability.remainingCapacity
      }
    })
    
  } catch (error) {
    console.error('Booking API error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json(
        { success: false, error: 'Please log in to view bookings' },
        { status: 401 }
      )
    }
    
    // Get user bookings
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        yachts(name, type, location, images),
        payments(status, amount, created_at)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching bookings:', error)
      return Response.json(
        { success: false, error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }
    
    return Response.json({
      success: true,
      bookings: bookings || []
    })
    
  } catch (error) {
    console.error('Get bookings API error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
    }
}



