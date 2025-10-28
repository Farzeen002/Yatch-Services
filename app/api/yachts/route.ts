import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'

// GET /api/yachts - Fetch all yachts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const limit = searchParams.get('limit')
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    let query = supabase
      .from('yachts')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (type && type !== 'all') {
      query = query.eq('type', type)
    }
    
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }
    
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }
    
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: yachts, error } = await query

    if (error) {
      console.error('Error fetching yachts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch yachts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ yachts })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/yachts - Create a new yacht (Admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated and is admin
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

    if (profile?.role_type !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'price', 'location', 'guests', 'length']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const yachtData = {
      name: body.name,
      type: body.type,
      price: parseFloat(body.price),
      rating: parseFloat(body.rating) || 0.00,
      reviews: parseInt(body.reviews) || 0,
      location: body.location,
      guests: parseInt(body.guests),
      length: parseFloat(body.length),
      amenities: body.amenities || [],
      unavailable_dates: body.unavailable_dates || [],
      images: body.images || [],
      videos: body.videos || [],
      description: body.description || '',
      user_id: user.id
    }

    const { data: yacht, error } = await supabase
      .from('yachts')
      .insert(yachtData)
      .select()
      .single()

    if (error) {
      console.error('Error creating yacht:', error)
      return NextResponse.json(
        { error: 'Failed to create yacht' },
        { status: 500 }
      )
    }

    return NextResponse.json({ yacht }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
