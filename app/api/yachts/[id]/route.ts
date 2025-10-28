import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/utils/supabase/server"
import { createSlug } from "@/lib/slug-utils"

// Helper to check if string is a UUID
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// GET /api/yachts/[id] - Fetch a specific yacht (supports both UUID and slug)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const resolvedParams = await params
    const identifier = resolvedParams.id

    let yacht
    let error

    // Check if identifier is a UUID or a slug
    if (isUUID(identifier)) {
      // Query by ID
      const result = await supabase
        .from("yachts")
        .select("*")
        .eq("id", identifier)
        .single()
      yacht = result.data
      error = result.error
    } else {
      // Query by slug - get all yachts and match by slug
      const result = await supabase
        .from("yachts")
        .select("*")
      
      if (result.error) {
        error = result.error
      } else {
        // Find yacht that matches the slug
        yacht = result.data?.find(y => createSlug(y.name) === identifier.toLowerCase())
        if (!yacht) {
          error = { message: "Yacht not found" }
        }
      }
    }

    if (error || !yacht) {
      console.error("Error fetching yacht:", error)
      return NextResponse.json({ error: "Yacht not found" }, { status: 404 })
    }

    return NextResponse.json({ yacht })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/yachts/[id] - Update a specific yacht (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()

    // Safely get authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser()
    const user = authData?.user

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role_type")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    if (profile?.role_type !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const resolvedParams = await params
    const yachtId = resolvedParams.id
    const body = await request.json()

    const yachtData = {
      name: body.name,
      type: body.type,
      price: isNaN(parseFloat(body.price)) ? null : parseFloat(body.price),
      rating: isNaN(parseFloat(body.rating)) ? 0.0 : parseFloat(body.rating),
      reviews: isNaN(parseInt(body.reviews)) ? 0 : parseInt(body.reviews),
      location: body.location,
      guests: isNaN(parseInt(body.guests)) ? null : parseInt(body.guests),
      length: isNaN(parseFloat(body.length)) ? null : parseFloat(body.length),
      amenities: body.amenities || [],
      unavailable_dates: body.unavailable_dates || [],
      images: body.images || [],
      videos: body.videos || [],
      description: body.description || ""
    }

    const { data: yacht, error } = await supabase
      .from("yachts")
      .update(yachtData)
      .eq("id", yachtId)
      .select()
      .single()

    if (error) {
      console.error("Error updating yacht:", error)
      return NextResponse.json({ error: "Failed to update yacht" }, { status: 500 })
    }

    return NextResponse.json({ yacht })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/yachts/[id] - Delete a specific yacht (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()

    // Safely get authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser()
    const user = authData?.user

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role_type")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    if (profile?.role_type !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const resolvedParams = await params
    const yachtId = resolvedParams.id

    const { error } = await supabase.from("yachts").delete().eq("id", yachtId)

    if (error) {
      console.error("Error deleting yacht:", error)
      return NextResponse.json({ error: "Failed to delete yacht" }, { status: 500 })
    }

    return NextResponse.json({ message: "Yacht deleted successfully" })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}