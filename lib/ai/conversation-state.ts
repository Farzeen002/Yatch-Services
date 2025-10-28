/**
 * WhosYEP AI - Conversation State Management
 * Defines the state structure for LangGraph conversation flow
 */

export interface ConversationState {
  // User message input
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: number
  }>
  
  // Current conversation context
  context: {
    // All available yachts from database
    availableYachts?: Array<{
      id: string
      name: string
      slug: string
      price: number
      guests: number
      location: string
      type: string
      images: string[]
      description?: string
    }>
    
    // Selected yacht information
    selectedYacht?: {
      id: string
      name: string
      slug: string
      price: number
      guests: number
      location: string
      type: string
      images: string[]
      description?: string
    }
    
    // Booking details being collected
    bookingIntent?: {
      yachtId?: string
      yachtName?: string
      guestCount?: number
      duration?: number // in days
      startDate?: string
      endDate?: string
      totalPrice?: number
    }
    
    // Current user intent
    currentIntent?: 'browse' | 'search' | 'booking' | 'details' | 'support' | 'general'
    
    // Yacht search tracking
    yachtFound?: boolean
    searchedYachtName?: string
    yachtsNotFound?: boolean
    
    // User authentication status
    isAuthenticated?: boolean
    userId?: string
    
    // Conversation flow state
    awaitingInput?: 'guest_count' | 'duration' | 'dates' | 'confirmation' | null
  }
  
  // Session metadata
  sessionId: string
  userId?: string
  createdAt: number
  lastUpdatedAt: number
}

export interface GraphInput {
  message: string
  sessionId: string
  userId?: string
}

export interface GraphOutput {
  response: string
  type: 'text' | 'yacht_list' | 'yacht_details' | 'booking_confirmation' | 'support'
  data?: {
    yachts?: any[]
    yacht?: any
    bookingDetails?: any
    dynamicLink?: string
    searchedName?: string
    notFound?: boolean
  }
  nextAction?: 'await_input' | 'redirect' | 'complete'
}

// Initial state factory
export function createInitialState(sessionId: string, userId?: string): ConversationState {
  return {
    messages: [
      {
        role: 'system',
        content: 'You are WhosYEP AI, a luxury yacht booking concierge assistant.',
        timestamp: Date.now()
      }
    ],
    context: {
      currentIntent: 'general',
      awaitingInput: null
    },
    sessionId,
    userId,
    createdAt: Date.now(),
    lastUpdatedAt: Date.now()
  }
}

// State update helpers
export function addMessage(
  state: ConversationState,
  role: 'user' | 'assistant',
  content: string
): ConversationState {
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        role,
        content,
        timestamp: Date.now()
      }
    ],
    lastUpdatedAt: Date.now()
  }
}

export function updateContext(
  state: ConversationState,
  updates: Partial<ConversationState['context']>
): ConversationState {
  return {
    ...state,
    context: {
      ...state.context,
      ...updates
    },
    lastUpdatedAt: Date.now()
  }
}

// Get recent conversation history for AI context
export function getRecentMessages(state: ConversationState, count: number = 10): string {
  const recentMessages = state.messages.slice(-count)
  return recentMessages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n')
}


