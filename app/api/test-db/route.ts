import { createClient } from "@/utils/supabase/server"

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing')
    console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing')
    
    const supabase = createClient()
    
    // Test basic connection
    const { data, error } = await supabase
      .from('yachts')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database error:', error)
      return Response.json({ 
        success: false, 
        error: error.message,
        details: error
      })
    }
    
    // Try to get yacht data
    const { data: yachts, error: yachtError } = await supabase
      .from('yachts')
      .select('*')
      .limit(5)
    
    if (yachtError) {
      console.error('Yacht fetch error:', yachtError)
      return Response.json({ 
        success: false, 
        error: yachtError.message,
        yachtCount: 0
      })
    }
    
    console.log('Successfully connected to database')
    console.log('Yacht count:', yachts?.length || 0)
    
    return Response.json({ 
      success: true, 
      yachtCount: yachts?.length || 0,
      yachts: yachts || []
    })
    
  } catch (error) {
    console.error('Test error:', error)
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}



