/**
 * WhosYEP AI - Chat API Endpoint
 * Handles conversation requests using LangGraph + OpenAI
 */

import { NextRequest, NextResponse } from 'next/server'
import { processMessage, clearSessionState } from '@/lib/ai/conversation-graph'
import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId, action } = body
    
    // Handle clear chat action first (before validation)
    if (action === 'clear') {
      if (!sessionId) {
        return NextResponse.json(
          { error: 'SessionId is required' },
          { status: 400 }
        )
      }
      clearSessionState(sessionId)
      return NextResponse.json({
        response: "Chat history cleared! How can I help you today?",
        type: 'text',
        nextAction: 'await_input'
      })
    }
    
    // Validate input for normal messages
    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      )
    }
    
    // Get user authentication status
    let userId: string | undefined
    try {
      const supabase = await createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id
    } catch (error) {
      // User not authenticated - that's okay
      console.log('User not authenticated')
    }
    
    // Get base URL from request
    const baseUrl = request.headers.get('origin') || 'http://localhost:3000'
    
    // Process the message through LangGraph
    const result = await processMessage(
      {
        message,
        sessionId,
        userId
      },
      baseUrl
    )
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('WhosYEP AI Error:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'WhosYEP AI',
    version: '1.0.0',
    powered_by: 'LangGraph + OpenAI GPT-4'
  })
}


