import { createClient } from "@/utils/supabase/server"

// Function to check yacht availability and capacity
export async function checkYachtAvailability(yachtId: string, startDate: string, endDate: string, requestedGuests: number) {
  try {
    const supabase = createClient()
    
    // Get yacht details
    const { data: yacht, error: yachtError } = await supabase
      .from('yachts')
      .select('*')
      .eq('id', yachtId)
      .single()
    
    if (yachtError || !yacht) {
      return { available: false, error: 'Yacht not found' }
    }
    
    // Check if requested guests exceed capacity
    if (requestedGuests > yacht.guests) {
      return { 
        available: false, 
        error: `This yacht can only accommodate ${yacht.guests} guests, but you requested ${requestedGuests}` 
      }
    }
    
    // Check for existing bookings in the date range
    const { data: existingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('guests, status')
      .eq('yacht_id', yachtId)
      .eq('status', 'confirmed')
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
    
    if (bookingsError) {
      console.error('Error checking bookings:', bookingsError)
      return { available: false, error: 'Unable to check availability' }
    }
    
    // Calculate total guests already booked
    const totalBookedGuests = existingBookings?.reduce((sum, booking) => sum + booking.guests, 0) || 0
    
    // Check if adding this booking would exceed capacity
    if (totalBookedGuests + requestedGuests > yacht.guests) {
      return { 
        available: false, 
        error: `Only ${yacht.guests - totalBookedGuests} guests can be accommodated on these dates` 
      }
    }
    
    return { 
      available: true, 
      yacht, 
      totalBookedGuests,
      remainingCapacity: yacht.guests - totalBookedGuests
    }
    
  } catch (error) {
    console.error('Availability check error:', error)
    return { available: false, error: 'System error checking availability' }
  }
}

// Function to create a booking
export async function createBooking(bookingData: {
  yachtId: string
  userId: string
  startDate: string
  endDate: string
  guests: number
  totalPrice: number
  specialRequests?: string
}) {
  try {
    const supabase = createClient()
    
    // First check availability
    const availability = await checkYachtAvailability(
      bookingData.yachtId,
      bookingData.startDate,
      bookingData.endDate,
      bookingData.guests
    )
    
    if (!availability.available) {
      return { success: false, error: availability.error }
    }
    
    // Create the booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        yacht_id: bookingData.yachtId,
        user_id: bookingData.userId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        guests: bookingData.guests,
        total_price: bookingData.totalPrice,
        status: 'pending',
        special_requests: bookingData.specialRequests
      })
      .select(`
        *,
        yachts(name, type, location)
      `)
      .single()
    
    if (error) {
      console.error('Booking creation error:', error)
      return { success: false, error: 'Failed to create booking' }
    }
    
    return { success: true, booking }
    
  } catch (error) {
    console.error('Create booking error:', error)
    return { success: false, error: 'System error creating booking' }
  }
}

// Function to get user bookings
export async function getUserBookings(userId: string) {
  try {
    const supabase = createClient()
    
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        yachts(name, type, location, images),
        payments(status, amount, created_at)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user bookings:', error)
      return []
    }
    
    return bookings || []
    
  } catch (error) {
    console.error('Get user bookings error:', error)
    return []
  }
}

// Function to calculate booking price
export function calculateBookingPrice(yachtPrice: number, startDate: string, endDate: string, guests: number) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  
  const basePrice = yachtPrice * days
  
  // Add service charges
  const serviceCharge = basePrice * 0.1 // 10% service charge
  const tax = (basePrice + serviceCharge) * 0.15 // 15% tax
  
  const totalPrice = basePrice + serviceCharge + tax
  
  return {
    basePrice,
    serviceCharge,
    tax,
    totalPrice,
    days,
    pricePerDay: yachtPrice
  }
}


