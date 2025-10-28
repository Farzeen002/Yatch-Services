/**
 * WhosYEP AI - LangGraph Conversation Nodes
 * Handles different conversation flows and intents
 */

import { ChatOpenAI } from '@langchain/openai'
import { ConversationState, GraphOutput, addMessage, updateContext } from './conversation-state'
import { createSlug } from '../slug-utils'

// Initialize OpenAI model
function getOpenAIModel() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  
  // Use gpt-4o-mini for cost efficiency or gpt-4o for better quality
  // gpt-4-turbo-preview is deprecated
  const modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  
  return new ChatOpenAI({
    modelName: modelName,
    temperature: 0.7,
    openAIApiKey: apiKey
  })
}

// Helper to fetch all yachts from the API
async function fetchAllYachts(baseUrl: string): Promise<any[]> {
  try {
    const response = await fetch(`${baseUrl}/api/yachts`)
    const data = await response.json()
    return data.yachts || []
  } catch (error) {
    console.error('Error fetching yachts:', error)
    return []
  }
}

// Helper to find yacht by name (fuzzy matching)
function findYachtByName(yachts: any[], searchName: string): any | null {
  const normalizedSearch = searchName.toLowerCase().trim()
  
  // Exact match first
  let found = yachts.find(y => 
    y.name.toLowerCase() === normalizedSearch
  )
  
  if (found) return found
  
  // Partial match
  found = yachts.find(y => 
    y.name.toLowerCase().includes(normalizedSearch) ||
    normalizedSearch.includes(y.name.toLowerCase())
  )
  
  return found || null
}

/**
 * Node 1: Intent Detection
 * Analyzes user message to determine intent
 */
export async function detectIntentNode(state: ConversationState): Promise<ConversationState> {
  const lastMessage = state.messages[state.messages.length - 1]
  
  if (lastMessage.role !== 'user') {
    return state
  }
  
  const message = lastMessage.content.toLowerCase()
  
  // Check for booking intent (highest priority)
  if (message.match(/book|booking|reserve|reservation|rent|charter|i want to book/i)) {
    return updateContext(state, { 
      currentIntent: 'booking',
      awaitingInput: state.context.selectedYacht ? 'guest_count' : null
    })
  }
  
  // Check for guest count response (when in booking flow)
  if (state.context.awaitingInput === 'guest_count' && message.match(/\d+/)) {
    return updateContext(state, { currentIntent: 'booking' })
  }
  
  // Check for duration response (when in booking flow)
  if (state.context.awaitingInput === 'duration' && message.match(/\d+/)) {
    return updateContext(state, { currentIntent: 'booking' })
  }
  
  // Check for search/list intent
  if (message.match(/show|find|search|available|list|view|see|display|all yachts|yachts available/i)) {
    return updateContext(state, { currentIntent: 'search' })
  }
  
  // Check for specific yacht name mention (look for yacht keywords)
  if (message.match(/yacht|boat|vessel|ship/i) || message.match(/the\s+\w+\s+(yacht|dream|paradise|escape|explorer)/i)) {
    return updateContext(state, { currentIntent: 'details' })
  }
  
  // Check for support intent
  if (message.match(/support|help|agent|contact|sales|team|human|speak|call/i)) {
    return updateContext(state, { currentIntent: 'support' })
  }
  
  // If we're in a booking flow, maintain that context
  if (state.context.bookingIntent || state.context.selectedYacht) {
    return updateContext(state, { currentIntent: 'booking' })
  }
  
  // Default to browse
  return updateContext(state, { currentIntent: 'browse' })
}

/**
 * Node 2: Fetch Yachts from Backend
 * Queries the database for available yachts
 */
export async function fetchYachtsNode(
  state: ConversationState,
  baseUrl: string
): Promise<ConversationState> {
  try {
    const response = await fetch(`${baseUrl}/api/yachts`)
    const data = await response.json()
    
    if (data.yachts && Array.isArray(data.yachts)) {
      // Store yachts in context (for reference)
      return updateContext(state, {
        // We can add yachts to context if needed
      })
    }
    
    return state
  } catch (error) {
    console.error('Error fetching yachts:', error)
    return state
  }
}

/**
 * Node 3: Search for Specific Yacht
 * Searches for a yacht by name mentioned in conversation or fetches all yachts for listing
 */
export async function searchYachtNode(
  state: ConversationState,
  baseUrl: string
): Promise<ConversationState> {
  const lastMessage = state.messages[state.messages.length - 1]
  const message = lastMessage.content
  
  try {
    // Fetch all yachts from API
    const yachts = await fetchAllYachts(baseUrl)
    
    if (!yachts || yachts.length === 0) {
      return updateContext(state, {
        availableYachts: [],
        yachtsNotFound: true
      })
    }
    
    // Store all available yachts in context
    const updates: any = {
      availableYachts: yachts.map((y: any) => ({
        id: y.id,
        name: y.name,
        slug: createSlug(y.name),
        price: y.price,
        guests: y.guests,
        location: y.location,
        type: y.type,
        images: y.images || [],
        description: y.description
      }))
    }
    
    // If user is searching for a specific yacht or mentioned a yacht name
    if (state.context.currentIntent === 'details' || state.context.currentIntent === 'booking') {
      // Try to extract yacht name from message
      // Remove common words and look for potential yacht names
      const words = message.toLowerCase()
        .replace(/book|the|yacht|a|an|i want to|please|can you|show me/gi, '')
        .trim()
      
      // Try to find yacht by name
      if (words) {
        const foundYacht = findYachtByName(yachts, words)
        
        if (foundYacht) {
          updates.selectedYacht = {
            id: foundYacht.id,
            name: foundYacht.name,
            slug: createSlug(foundYacht.name),
            price: foundYacht.price,
            guests: foundYacht.guests,
            location: foundYacht.location,
            type: foundYacht.type,
            images: foundYacht.images || [],
            description: foundYacht.description
          }
          updates.yachtFound = true
        } else {
          // Yacht name mentioned but not found
          updates.yachtFound = false
          updates.searchedYachtName = words
        }
      }
    }
    
    return updateContext(state, updates)
  } catch (error) {
    console.error('Error searching yacht:', error)
    return updateContext(state, {
      availableYachts: [],
      yachtsNotFound: true
    })
  }
}

/**
 * Node 4: Extract Booking Details
 * Extracts guest count and duration from user message
 */
export async function extractBookingDetailsNode(
  state: ConversationState
): Promise<ConversationState> {
  const lastMessage = state.messages[state.messages.length - 1]
  const message = lastMessage.content
  
  const updates: any = {}
  let bookingIntent = { ...state.context.bookingIntent }
  
  // Extract guest count
  const guestMatch = message.match(/(\d+)\s*(guest|people|person|pax)/i)
  // Or just a number when we're awaiting guest count
  const numberMatch = message.match(/^(\d+)$/)
  
  if (guestMatch) {
    bookingIntent.guestCount = parseInt(guestMatch[1])
    updates.awaitingInput = 'duration'
  } else if (numberMatch && state.context.awaitingInput === 'guest_count') {
    bookingIntent.guestCount = parseInt(numberMatch[1])
    updates.awaitingInput = 'duration'
  }
  
  // Extract duration
  const durationMatch = message.match(/(\d+)\s*(day|night|week|month)/i)
  if (durationMatch) {
    let duration = parseInt(durationMatch[1])
    const unit = durationMatch[2].toLowerCase()
    
    if (unit.includes('week')) {
      duration *= 7
    } else if (unit.includes('month')) {
      duration *= 30
    }
    
    bookingIntent.duration = duration
    updates.awaitingInput = 'confirmation'
  } else if (numberMatch && state.context.awaitingInput === 'duration') {
    bookingIntent.duration = parseInt(numberMatch[1])
    updates.awaitingInput = 'confirmation'
  }
  
  // If there's a selected yacht, add it to booking intent
  if (state.context.selectedYacht) {
    bookingIntent.yachtId = state.context.selectedYacht.id
    bookingIntent.yachtName = state.context.selectedYacht.name
  }
  
  // Update the booking intent if we have any changes
  if (Object.keys(bookingIntent).length > 0) {
    updates.bookingIntent = bookingIntent
  }
  
  // Determine what we're awaiting next
  if (state.context.selectedYacht && !bookingIntent.guestCount && state.context.currentIntent === 'booking') {
    updates.awaitingInput = 'guest_count'
  } else if (bookingIntent.guestCount && !bookingIntent.duration && state.context.currentIntent === 'booking') {
    updates.awaitingInput = 'duration'
  } else if (bookingIntent.yachtId && bookingIntent.guestCount && bookingIntent.duration) {
    updates.awaitingInput = 'confirmation'
  }
  
  if (Object.keys(updates).length > 0) {
    return updateContext(state, updates)
  }
  
  return state
}

/**
 * Node 5: Generate AI Response
 * Uses OpenAI to generate contextual responses
 */
export async function generateResponseNode(
  state: ConversationState
): Promise<{ state: ConversationState; output: GraphOutput }> {
  const model = getOpenAIModel()
  
  // Build context for AI
  const systemPrompt = buildSystemPrompt(state)
  const recentHistory = state.messages
    .slice(-10)
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role,
      content: m.content
    }))
  
  // Generate response
  try {
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...recentHistory
    ]
    
    const response = await model.invoke(messages as any)
    const responseText = response.content as string
    
    // Add assistant message to state
    const updatedState = addMessage(state, 'assistant', responseText)
    
    // Determine output type and data
    const output = buildGraphOutput(updatedState, responseText)
    
    return {
      state: updatedState,
      output
    }
  } catch (error) {
    console.error('Error generating AI response:', error)
    
    // Fallback response
    const fallbackResponse = "I apologize, but I'm having trouble processing your request. Could you please rephrase?"
    const updatedState = addMessage(state, 'assistant', fallbackResponse)
    
    return {
      state: updatedState,
      output: {
        response: fallbackResponse,
        type: 'text',
        nextAction: 'await_input'
      }
    }
  }
}

/**
 * Build system prompt based on current state
 */
function buildSystemPrompt(state: ConversationState): string {
  let prompt = `You are WhosYEP AI, a luxury yacht booking concierge assistant.

CORE CAPABILITIES:
- Help users browse and search luxury yachts
- Guide through the booking process step-by-step
- Provide detailed yacht information
- Connect users to support when needed

CURRENT CONTEXT:
`

  // Available yachts
  if (state.context.availableYachts && state.context.availableYachts.length > 0) {
    prompt += `\nAvailable Yachts in Database:\n`
    state.context.availableYachts.forEach((yacht: any, index: number) => {
      prompt += `${index + 1}. ${yacht.name} - ${yacht.location} - ${yacht.guests} guests - $${yacht.price}/day\n`
    })
  }

  // Selected yacht
  if (state.context.selectedYacht) {
    prompt += `\nSelected Yacht: ${state.context.selectedYacht.name}
- Location: ${state.context.selectedYacht.location}
- Type: ${state.context.selectedYacht.type}
- Capacity: ${state.context.selectedYacht.guests} guests
- Price: $${state.context.selectedYacht.price}/day
- Dynamic Link: http://localhost:3000/yachts/${state.context.selectedYacht.slug}
`
  }
  
  // Yacht not found scenario
  if (state.context.yachtFound === false && state.context.searchedYachtName) {
    prompt += `\nYacht Search Result: The yacht "${state.context.searchedYachtName}" was NOT found in our database.
You should apologize and suggest alternative yachts from the available list above.
`
  }
  
  // Booking in progress
  if (state.context.bookingIntent) {
    const booking = state.context.bookingIntent
    prompt += `\nBooking in Progress:`
    if (booking.yachtName) prompt += `\n- Yacht: ${booking.yachtName}`
    if (booking.guestCount) prompt += `\n- Guests: ${booking.guestCount}`
    if (booking.duration) prompt += `\n- Duration: ${booking.duration} days`
  }
  
  prompt += `\n
CONVERSATION RULES:
1. Be conversational, friendly, and natural - like a real concierge
2. Keep responses concise (2-3 sentences max unless providing yacht details)
3. Do NOT use emojis or overly casual language
4. When asked to show/list yachts, format them as a numbered list with key details
5. When a yacht is selected, DO NOT include links in your text - the system will automatically show a button
6. If a yacht name is mentioned but doesn't exist, politely say it's not available and suggest alternatives
7. NEVER generate fake payment links, booking IDs, confirmation numbers, or markdown links
8. For support requests, direct to contact information
9. IMPORTANT: Do NOT write markdown links like [text](url) - buttons are auto-generated

BOOKING FLOW STEP-BY-STEP:
`

  if (state.context.awaitingInput === 'guest_count') {
    prompt += `\nCurrent Step: Asking for number of guests
- The yacht ${state.context.selectedYacht?.name} is selected
- Ask: "How many guests will be joining you?"
- Wait for their response with a number
`
  } else if (state.context.awaitingInput === 'duration') {
    prompt += `\nCurrent Step: Asking for trip duration
- The yacht is selected: ${state.context.selectedYacht?.name}
- Guest count provided: ${state.context.bookingIntent?.guestCount}
- Ask: "How many days would you like to book the yacht for?"
- Wait for their response with a number
`
  } else if (state.context.awaitingInput === 'confirmation') {
    prompt += `\nCurrent Step: Confirm booking details and prepare for checkout
- All details collected
- Summarize: yacht name, guest count, duration, estimated price
- Inform them they need to be logged in to complete the booking
`
  } else if (state.context.currentIntent === 'booking' && !state.context.selectedYacht) {
    prompt += `\nCurrent Step: User wants to book but hasn't selected a yacht
- Ask them to specify which yacht they'd like to book
- Or offer to show them the available yachts
`
  }

  prompt += `\nCurrent Intent: ${state.context.currentIntent}
Awaiting: ${state.context.awaitingInput || 'user message'}
`

  return prompt
}

/**
 * Build graph output from state and response
 */
function buildGraphOutput(state: ConversationState, responseText: string): GraphOutput {
  const context = state.context
  
  // Check if we have complete booking details
  if (
    context.bookingIntent?.yachtId &&
    context.bookingIntent?.guestCount &&
    context.bookingIntent?.duration
  ) {
    const totalPrice = context.selectedYacht 
      ? context.selectedYacht.price * context.bookingIntent.duration 
      : 0
    
    return {
      response: responseText,
      type: 'booking_confirmation',
      data: {
        bookingDetails: {
          ...context.bookingIntent,
          totalPrice
        },
        yacht: context.selectedYacht
      },
      nextAction: 'redirect'
    }
  }
  
  // Check if yacht not found - suggest alternatives
  if (context.yachtFound === false && context.availableYachts && context.availableYachts.length > 0) {
    return {
      response: responseText,
      type: 'yacht_list',
      data: {
        yachts: context.availableYachts,
        searchedName: context.searchedYachtName,
        notFound: true
      },
      nextAction: 'await_input'
    }
  }
  
  // PRIORITY: Check if we're showing yacht details with link
  // This should be BEFORE checking booking intent to show yacht details first
  if (context.selectedYacht && !context.bookingIntent?.guestCount) {
    return {
      response: responseText,
      type: 'yacht_details',
      data: {
        yacht: context.selectedYacht,
        dynamicLink: `http://localhost:3000/yachts/${context.selectedYacht.slug}`
      },
      nextAction: 'await_input'
    }
  }
  
  // Check if showing yacht list
  if ((context.currentIntent === 'search' || context.currentIntent === 'browse') && context.availableYachts) {
    return {
      response: responseText,
      type: 'yacht_list',
      data: {
        yachts: context.availableYachts
      },
      nextAction: 'await_input'
    }
  }
  
  // Support request
  if (context.currentIntent === 'support') {
    return {
      response: responseText,
      type: 'support',
      nextAction: 'complete'
    }
  }
  
  // Default text response
  return {
    response: responseText,
    type: 'text',
    nextAction: 'await_input'
  }
}


