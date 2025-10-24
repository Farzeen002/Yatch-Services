import { GoogleGenerativeAI } from "@google/generative-ai"
import { getAuthenticatedUser, isAuthenticated } from "@/lib/auth"
import { ChatMemoryManager, ChatMessage } from "@/lib/chat-memory"
import { createServerClient } from "@supabase/ssr"
import { checkRateLimit } from "@/lib/rate-limiter"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Initialize Chat Memory Manager (will be updated with authenticated client)
let chatMemory: ChatMemoryManager

// Fallback yacht data
const fallbackYachts = [
  { id: 1, name: "Ocean Dream", price: 8500, guests: 12, length: "85ft", type: "Motor Yacht", location: "Monaco Marina" },
  { id: 2, name: "Sea Breeze", price: 4200, guests: 8, length: "65ft", type: "Sailing Yacht", location: "Cannes Port" },
  { id: 3, name: "Royal Wave", price: 6800, guests: 16, length: "78ft", type: "Catamaran", location: "St. Tropez Harbor" },
  { id: 4, name: "Marina Star", price: 3200, guests: 6, length: "45ft", type: "Motor Yacht", location: "Nice Port" },
  { id: 5, name: "Azure Explorer", price: 5500, guests: 10, length: "72ft", type: "Sailing Yacht", location: "Antibes Marina" },
  { id: 6, name: "Eclipse", price: 1200, guests: 12, length: "50ft", type: "Superyacht", location: "London" },
]

// Function to update context from message
function updateContextFromMessage(message: string, currentContext: any) {
  const messageLower = message.toLowerCase()
  const updatedContext = { ...currentContext }
  
  // Check for yacht selection (improved matching)
  const yachtNames = fallbackYachts.map(y => y.name.toLowerCase())
  const selectedYacht = yachtNames.find(name => {
    // Check for exact match first
    if (messageLower.includes(name)) {
      return true
    }
    // Check for partial match
    return name.split(' ').some(word => messageLower.includes(word)) ||
           messageLower.split(' ').some(word => name.includes(word))
  })
  
  if (selectedYacht) {
    const yacht = fallbackYachts.find(y => y.name.toLowerCase() === selectedYacht)
    if (yacht) {
      updatedContext.selectedYacht = yacht.name
      console.log('Yacht selected:', yacht.name)
    }
  }
  
  // Also check for partial yacht name matches
  if (!updatedContext.selectedYacht) {
    for (const yacht of fallbackYachts) {
      const yachtWords = yacht.name.toLowerCase().split(' ')
      const messageWords = messageLower.split(' ')
      
      // Check if any yacht word appears in the message
      const hasYachtWord = yachtWords.some(yachtWord => 
        messageWords.some(msgWord => 
          yachtWord.includes(msgWord) || msgWord.includes(yachtWord)
        )
      )
      
      if (hasYachtWord) {
        updatedContext.selectedYacht = yacht.name
        console.log('Yacht selected by partial match:', yacht.name)
        break
      }
    }
  }
  
  // Check for guest count
  const guestPatterns = [
    /(\d+)\s*(?:people?|guests?|ppl|person)/i,
    /for\s+(\d+)\s*(?:people?|guests?|ppl)/i,
    /(\d+)\s*(?:people?|guests?|ppl)\s+for/i,
    /accommodate\s+(\d+)/i,
    /up\s+to\s+(\d+)/i
  ]
  
  for (const pattern of guestPatterns) {
    const match = message.match(pattern)
    if (match) {
      updatedContext.guestCount = parseInt(match[1])
      break
    }
  }
  
  // Check for dates (improved patterns)
  const datePatterns = [
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/i,
    /(\d{1,2})-(\d{1,2})-(\d{4})/i,
    /(\d{4})-(\d{1,2})-(\d{1,2})/i,
    /(today|tomorrow|next\s+week|this\s+weekend)/i,
    /(january|february|march|april|may|june|july|august|september|october|november|december)/i,
    // Specific patterns for the user's case
    /from\s+(\d{1,2})(?:st|nd|rd|th)?\s+(october|november|december|january|february|march|april|may|june|july|august|september)/i,
    /(\d{1,2})(?:st|nd|rd|th)?\s+(october|november|december|january|february|march|april|may|june|july|august|september)\s+(\d{4})/i
  ]
  
  for (const pattern of datePatterns) {
    if (pattern.test(messageLower)) {
      updatedContext.bookingIntent = true
      console.log('Date pattern matched, setting booking intent to true')
      break
    }
  }
  
  // Also check for specific booking phrases
  const bookingPhrases = [
    'want it', 'want to book', 'want to reserve', 'want to rent',
    'book it', 'reserve it', 'rent it', 'hire it',
    'from', 'to', 'for', 'days', 'nights'
  ]
  
  const hasBookingPhrase = bookingPhrases.some(phrase => messageLower.includes(phrase))
  if (hasBookingPhrase) {
    updatedContext.bookingIntent = true
    console.log('Booking phrase detected, setting booking intent to true')
  }
  
  // Check for booking intent
  const bookingKeywords = [
    'book', 'booking', 'check', 'available', 'reserve', 'reservation',
    'rent', 'hire', 'charter', 'confirm', 'proceed', 'next', 'step',
    'generate bill', 'payment', 'pay', 'bill', 'invoice', 'link', 'pay'
  ]
  
  if (bookingKeywords.some(keyword => messageLower.includes(keyword))) {
    updatedContext.bookingIntent = true
  }
  
  // Special case: If user is asking for payment link after booking
  if (messageLower.includes('link') && messageLower.includes('pay')) {
    updatedContext.bookingIntent = true
    updatedContext.needPaymentLink = true
  }
  
  return updatedContext
}

// Function to get yacht data from Supabase
async function getYachtsFromDatabase() {
  try {
    console.log('Fetching yachts from database...')
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return [] },
          setAll() { /* no-op for API routes */ },
        },
      }
    )

    const { data: yachts, error } = await supabase
      .from('yachts')
      .select('*')
      .order('price', { ascending: true })

    if (error) {
      console.error('Error fetching yachts:', error)
      return fallbackYachts
    }

    // Filter out invalid/test yachts
    const validYachts = (yachts || []).filter(y =>
      y.name &&
      y.name.length > 2 &&
      y.price > 100 &&
      y.guests > 0 &&
      y.guests < 100 &&
      !y.name.toLowerCase().includes('test') &&
      !y.name.toLowerCase().includes('dfd') &&
      !y.name.toLowerCase().includes('ds')
    )

    return validYachts.length > 0 ? validYachts : fallbackYachts
  } catch (error) {
    console.error('Database error:', error)
    return fallbackYachts
  }
}

// Function to check if query is yacht-related
function isYachtRelated(query: string): boolean {
  const yachtKeywords = [
    // Direct yacht terms
    'yacht', 'yachts', 'boat', 'boats', 'vessel', 'vessels', 'ship', 'ships',
    'charter', 'charters', 'marina', 'marinas', 'sailing', 'cruise', 'cruises',
    
    // Booking and service terms
    'book', 'booking', 'bookings', 'reserve', 'reservation', 'reservations',
    'rent', 'rental', 'rentals', 'hire', 'hiring', 'check', 'available',
    'ticket', 'tickets', 'want', 'need', 'looking', 'interested',
    
    // Pricing terms
    'price', 'prices', 'pricing', 'cost', 'costs', 'expensive', 'cheap', 'affordable',
    'budget', 'luxury', 'premium', 'estimate', 'quotation', 'quote',
    
    // Service terms
    'service', 'services', 'amenities', 'amenity', 'crew', 'captain', 'staff',
    'catering', 'food', 'dining', 'meal', 'meals',
    'diving', 'fishing', 'snorkeling', 'watersports', 'water sports', 'equipment',
    'gear', 'activities', 'activity', 'fun', 'entertainment',
    
    // Event terms
    'event', 'events', 'party', 'parties', 'wedding', 'weddings', 'corporate',
    'business', 'meeting', 'meetings', 'celebration', 'celebrations',
    
    // Capacity terms
    'group', 'groups', 'guests', 'guest', 'people', 'person', 'family', 'families',
    'couple', 'couples', 'romantic', 'intimate', 'private',
    
    // Location terms
    'location', 'locations', 'port', 'ports', 'harbor', 'harbors', 'harbour',
    'water', 'sea', 'ocean', 'coast', 'coastal', 'beach', 'beaches',
    
    // Time terms (more specific to avoid false positives)
    'available', 'availability', 'schedule', 'schedules', 'calendar', 'date', 'dates',
    'tomorrow', 'weekend', 'week', 'month', 'season', 'seasons',
    'october', 'november', 'december', 'january', 'february', 'march', 'april',
    'may', 'june', 'july', 'august', 'september',
    'days', 'nights', 'weekend', 'weekends',
    
    // Inquiry terms (more specific to yacht context)
    'which yacht', 'what yacht', 'how to book', 'when available', 'where located', 'why choose',
    'suggest', 'recommend', 'recommendation', 'recommendations', 'best yacht', 'good yacht', 'great yacht', 'nice yacht',
    'show yacht', 'tell about yacht', 'help with booking', 'assist with charter', 'yacht information', 'yacht info', 'yacht details',
    
    // Common misspellings and variations
    'yatch', 'yatches', 'yacth', 'yacths', 'bote', 'botes', 'ocean', 'dream',
    'marina', 'star', 'breeze', 'wave', 'explorer', 'azure', 'royal'
  ]
  
  const queryLower = query.toLowerCase().trim()
  
  // Check for yacht keywords
  const hasKeyword = yachtKeywords.some(keyword => queryLower.includes(keyword))
  
  // Check for specific yacht names (including partial matches)
  const yachtNames = fallbackYachts.map(y => y.name.toLowerCase())
  const hasYachtName = yachtNames.some(name => {
    // Check for exact match or partial match
    return queryLower.includes(name) || 
           name.split(' ').some(word => queryLower.includes(word)) ||
           queryLower.split(' ').some(word => name.includes(word))
  })
  
  // Check for common patterns
  const patterns = [
    /any\s+(yacht|boat|vessel|ship)/i,
    /what\s+(yacht|boat|vessel|ship)/i,
    /which\s+(yacht|boat|vessel|ship)/i,
    /show\s+(yacht|boat|vessel|ship)/i,
    /tell\s+(me\s+about\s+)?(yacht|boat|vessel|ship)/i,
    /suggest\s+(yacht|boat|vessel|ship)/i,
    /recommend\s+(yacht|boat|vessel|ship)/i,
    /best\s+(yacht|boat|vessel|ship)/i,
    /available\s+(yacht|boat|vessel|ship)/i,
    /today\s+(yacht|boat|vessel|ship)/i,
    /(yacht|boat|vessel|ship)\s+(today|available|suggest|recommend)/i,
    // New patterns for booking requests
    /want\s+(to\s+)?(book|reserve|rent|hire)/i,
    /(book|reserve|rent|hire)\s+(a\s+)?(yacht|boat|vessel|ship)/i,
    /(yacht|boat|vessel|ship)\s+(for|from|to)/i,
    /(october|november|december|january|february|march|april|may|june|july|august|september)/i,
    /\d{1,2}\/\d{1,2}\/\d{4}/i, // Date patterns
    /\d+\s+(days?|nights?)/i // Duration patterns
  ]
  
  const hasPattern = patterns.some(pattern => pattern.test(queryLower))
  
  // Special case: authentication messages should be considered yacht-related if they're part of a booking conversation
  const isAuthMessage = queryLower.includes('logged') || queryLower.includes('login') || queryLower.includes('authenticated')
  
  // Special case: booking requests with dates and durations
  const isBookingRequest = (
    queryLower.includes('want') && 
    (queryLower.includes('october') || queryLower.includes('2025') || queryLower.includes('days'))
  ) || (
    queryLower.includes('from') && 
    (queryLower.includes('october') || queryLower.includes('2025'))
  )
  
  // Special case: booking status queries should be yacht-related
  const isBookingStatusQuery = (
    queryLower.includes('booking') && 
    (queryLower.includes('status') || queryLower.includes('my') || queryLower.includes('check'))
  )
  
  // Special case: follow-up questions should be yacht-related
  const isFollowUpQuery = (
    queryLower.includes('so what') || 
    queryLower.includes('what now') || 
    queryLower.includes('next') ||
    queryLower.includes('then') ||
    queryLower.includes('okay') ||
    queryLower.includes('ok') ||
    queryLower.includes('yes') ||
    queryLower.includes('no') ||
    queryLower.includes('sure') ||
    queryLower.includes('continue') ||
    queryLower.includes('proceed')
  )
  
  console.log('Yacht-related check:', {
    query: query,
    hasKeyword,
    hasYachtName,
    hasPattern,
    isAuthMessage,
    isBookingRequest,
    isFollowUpQuery,
    result: hasKeyword || hasYachtName || hasPattern || isAuthMessage || isBookingRequest || isFollowUpQuery
  })
  
  return hasKeyword || hasYachtName || hasPattern || isAuthMessage || isBookingRequest || isFollowUpQuery || isBookingStatusQuery
}

export async function POST(request: Request) {
  try {
    console.log('Chat API called')
    const { message, sessionId = 'default' } = await request.json()
    console.log('Message received:', message, 'Session:', sessionId)

    // 1. RATE LIMITING
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimitResult = checkRateLimit(clientIP)
    
    if (!rateLimitResult.allowed) {
      return Response.json({
        response: `Rate limit exceeded. Please wait ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)} seconds before trying again.`,
        type: "rate_limit"
      }, { status: 429 })
    }

    // 2. AUTHENTICATION CHECK
    const user = await getAuthenticatedUser()
    const userAuthenticated = isAuthenticated(user)
    console.log('User authenticated:', userAuthenticated, 'User ID:', user?.id)

    // 2.1. CREATE SUPABASE CLIENT (use anon key for now, RLS will be disabled)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return [] },
          setAll() { /* no-op for API routes */ },
        },
      }
    )

    // 2.2. INITIALIZE CHAT MEMORY MANAGER WITH SUPABASE CLIENT
    chatMemory = new ChatMemoryManager(supabase)

    // 2.3. GET CHAT SESSION FROM MEMORY
    const chatSession = user ? await chatMemory.getChatSession(sessionId, user.id) : null
    console.log('Chat session found:', !!chatSession, 'Messages:', chatSession?.messages?.length || 0)

    // 3. CHECK FOR CLEAR CHAT COMMAND
    if (message.toLowerCase().includes('clear chat') && user) {
      await chatMemory.clearChatHistory(sessionId, user.id)
      return Response.json({
        response: "Chat history cleared! How can I help you with yacht services today?",
        type: "system"
      })
    }

    // 4. CHECK IF QUERY IS YACHT-RELATED
    if (!isYachtRelated(message)) {
      return Response.json({ 
        response: "I'm here to assist only with yacht-related services. Please ask me about yacht charters, bookings, pricing, or yacht information.",
        type: "redirect" 
      })
    }

    // 5. CHECK AUTHENTICATION FOR SENSITIVE OPERATIONS
    const sensitiveKeywords = ['book', 'payment', 'reserve', 'pay', 'booking', 'personal', 'my bookings', 'my account', 'status']
    const isSensitiveQuery = sensitiveKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )

    if (isSensitiveQuery && !userAuthenticated) {
      return Response.json({
        response: "Please sign in to continue with your booking or payment.",
        type: "auth_required"
      })
    }
    
    // 5.5. HANDLE BOOKING STATUS QUERIES
    if (userAuthenticated && message.toLowerCase().includes('booking') && message.toLowerCase().includes('status')) {
      try {
        const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bookings/status`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          const statusText = statusData.bookings.length > 0 
            ? `You have ${statusData.bookings.length} booking(s):\n\n` + 
              statusData.bookings.map((booking: any) => 
                `📅 **${booking.yacht?.name || 'Unknown Yacht'}**\n` +
                `Status: ${booking.status}\n` +
                `Dates: ${booking.start_date} to ${booking.end_date}\n` +
                `Guests: ${booking.guests}\n` +
                `Total: $${booking.total_price}\n`
              ).join('\n')
            : "You don't have any bookings yet. Would you like to book a yacht?"
          
          return Response.json({ response: statusText, type: "ai" })
        }
      } catch (error) {
        console.error('Error fetching booking status:', error)
      }
    }

    // 6. BUILD CONVERSATION CONTEXT
    const messages = chatSession?.messages || []
    const context = chatSession?.context || {}
    
    // Add user message to session
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    // Update context based on message
    const updatedContext = updateContextFromMessage(message, context)
    
    // 7. FETCH YACHT DATA FROM SUPABASE
    const yachts = await getYachtsFromDatabase()
    
    // 8. BUILD CONVERSATION HISTORY FOR AI (SLIDING WINDOW)
    const MAX_CONTEXT_MESSAGES = 10
    const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES)
    const conversationHistory = recentMessages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Marina'}: ${msg.content}`
    ).join('\n')
    
    console.log(`Using ${recentMessages.length} recent messages (sliding window) to prevent token overflow`)
    
    // 9. CREATE YACHT CONTEXT
    const yachtContext = `
YACHT DATABASE INFORMATION:
${yachts.map(y => 
  `- ${y.name}: ${y.type}, ${y.guests} guests, ${y.length}ft, $${y.price.toLocaleString()}/day, ${y.location}`
).join('\n')}

CURRENT CONVERSATION CONTEXT:
- Selected Yacht: ${updatedContext.selectedYacht || 'None yet'}
- Guest Count: ${updatedContext.guestCount || 'Not specified'}
- Booking Intent: ${updatedContext.bookingIntent ? 'Yes' : 'No'}
- User Authenticated: ${userAuthenticated ? 'Yes' : 'No'}
- Booking Details: ${updatedContext.bookingDetails ? JSON.stringify(updatedContext.bookingDetails) : 'None'}

SERVICES OFFERED:
- Yacht charter and rental
- Professional crew and captain services
- Catering and dining options
- Watersports equipment (diving, fishing, snorkeling)
- Event planning and corporate charters
- Wedding and special occasion packages
- Safety equipment and insurance
- Marina services and docking

PRICING INFORMATION:
- Daily rates range from $${Math.min(...yachts.map(y => y.price)).toLocaleString()} to $${Math.max(...yachts.map(y => y.price)).toLocaleString()}
- Additional charges may apply for catering, premium amenities, and special services
- Group discounts available for bookings over 3 days
- Seasonal pricing adjustments apply

BOOKING PROCESS:
- Check availability for desired dates
- Confirm yacht selection and guest count
- Process payment through secure Razorpay integration
- Receive booking confirmation and itinerary
- Enjoy your yacht charter experience

CAPACITY MANAGEMENT:
- Each yacht has a maximum guest capacity
- System prevents overbooking
- Real-time availability checking
- User authentication required for bookings
`

    try {
      console.log('Calling Gemini AI...')
      // Try multiple models for better reliability
      const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
      let model = genAI.getGenerativeModel({ model: models[0] })
      
      const prompt = `You are Marina, a professional yacht booking assistant for a luxury yacht charter company. 

CRITICAL INSTRUCTIONS:
- You MUST maintain conversation context and remember previous interactions
- If user has selected a yacht, reference it specifically and use that yacht's details
- If user mentioned guest count, use that information in your response
- If user is checking availability, provide specific next steps for their selected yacht
- Be consistent with previous responses in the same conversation
- ONLY respond to yacht-related queries
- Be helpful, professional, and engaging (2-4 sentences)
- Always encourage booking or provide next steps
- Use the yacht information provided below to answer questions accurately
- Be conversational and friendly
- Provide specific details about yachts when asked
- Help with pricing calculations when requested
- Guide users through the booking process
- If user is NOT authenticated, mention they need to log in to complete bookings
- If user IS authenticated, proceed with booking confirmation and payment options

CONTEXT AWARENESS:
- If user selected "Ocean Dream" and mentioned "3 ppl", respond about Ocean Dream for 3 people
- If user said "yes check", they want to check availability for their selected yacht
- If user provided a date like "23/10/2025", they want to book for that date
- If user said "I have logged in already" or similar, they are authenticated and ready to proceed with payment
- If user asks for "generate bill" or "payment", provide the booking summary and payment options
- Always reference the specific yacht they selected in your responses
- Use the guest count they mentioned in your calculations
- If user is authenticated and has booking details, proceed with payment process

AUTHENTICATION HANDLING:
- If User Authenticated: "Yes" - DO NOT ask them to log in again
- If User Authenticated: "Yes" - Proceed directly to booking confirmation and payment
- If User Authenticated: "Yes" - Generate Razorpay payment link for Saudi Arabia
- If User Authenticated: "Yes" - Provide booking summary with total cost
- NEVER ask authenticated users to log in again

CRITICAL: If the user says "i have logged in already" or similar, they are authenticated. 
DO NOT give the generic "I can only help with yacht-related inquiries" response.
Instead, proceed with their booking request and generate payment details.

${yachtContext}

${conversationHistory ? `CONVERSATION HISTORY:
${conversationHistory}

` : ''}Current User Query: ${message}

Respond as Marina, maintaining conversation context and providing helpful yacht booking assistance. Use the context above to give consistent, relevant responses:`

      let text
      let aiSuccess = false
      
      // Try multiple models with retry logic for better reliability
      for (let i = 0; i < models.length && !aiSuccess; i++) {
        let retryCount = 0
        const maxRetries = 3
        
        while (retryCount < maxRetries && !aiSuccess) {
          try {
            console.log(`Trying Gemini model: ${models[i]} (attempt ${retryCount + 1})`)
            model = genAI.getGenerativeModel({ model: models[i] })
            const result = await model.generateContent(prompt)
            const response = await result.response
            text = response.text()
            console.log(`AI response generated successfully with ${models[i]}`)
            aiSuccess = true
          } catch (aiError: any) {
            console.error(`AI generation error with ${models[i]} (attempt ${retryCount + 1}):`, aiError)
            
            // Retry on 503 errors with exponential backoff
            if (aiError?.status === 503 && retryCount < maxRetries - 1) {
              const delay = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
              console.log(`Retrying in ${delay}ms due to 503 error...`)
              await new Promise(resolve => setTimeout(resolve, delay))
              retryCount++
            } else {
              break
            }
          }
        }
        
        if (i === models.length - 1 && !aiSuccess) {
          // All models failed, use fallback
          console.log('All Gemini models failed, using fallback response')
          
          // Fallback response based on context
          if (updatedContext.bookingIntent && updatedContext.selectedYacht) {
            text = `I understand you'd like to book the ${updatedContext.selectedYacht} for ${updatedContext.guestCount || 2} guests. I'm experiencing some technical difficulties with our AI system, but I can still help you with your booking. Please try again in a moment, or contact our support team for immediate assistance.`
          } else if (updatedContext.selectedYacht) {
            text = `I can see you're interested in the ${updatedContext.selectedYacht}. I'm experiencing some technical difficulties with our AI system, but I can still help you with yacht information. Please try again in a moment.`
          } else {
            text = `I'm experiencing some technical difficulties with our AI system. I'm here to help with yacht bookings and services. Please try again in a moment, or contact our support team for immediate assistance.`
          }
        }
      }

      // 11. SAVE MESSAGES TO MEMORY
      if (user) {
        // Add user message
        await chatMemory.addMessage(sessionId, user.id, userMessage)
        
        // Add assistant response
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: text || 'I apologize, but I encountered an error generating a response.',
          timestamp: Date.now(),
          messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
        await chatMemory.addMessage(sessionId, user.id, assistantMessage)
        
        // Update context
        await chatMemory.updateContext(sessionId, user.id, updatedContext)
      }

// REPLACE LINES ~480-550 (the payment processing section) WITH THIS:

// 12. PROCESS PAYMENT FOR AUTHENTICATED USERS
if (userAuthenticated && user && updatedContext.bookingIntent && (updatedContext.selectedYacht || updatedContext.needPaymentLink)) {
  try {
    console.log('Processing authenticated booking for yacht:', updatedContext.selectedYacht)
    
    // Find yacht ID from the selected yacht name
    const selectedYacht = yachts.find(y => y.name === updatedContext.selectedYacht)
    const yachtId = selectedYacht?.id || fallbackYachts.find(y => y.name === updatedContext.selectedYacht)?.id

    if (!yachtId) {
      console.error('Yacht ID not found for:', updatedContext.selectedYacht)
      return Response.json({ response: text, type: "ai" })
    }
    
    // Create booking details if not exists
    const bookingDetails = updatedContext.bookingDetails || {
      yachtName: updatedContext.selectedYacht,
      duration: 3, // Default 3 days
      totalPrice: (selectedYacht?.price || fallbackYachts.find(y => y.name === updatedContext.selectedYacht)?.price || 1200) * 3,
      startDate: new Date().toISOString().split('T')[0] // Today's date
    }
    
    // Create Razorpay order
    const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payments/create-razorpay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        yachtName: bookingDetails.yachtName,
        yachtId: yachtId,
        duration: bookingDetails.duration,
        totalPrice: bookingDetails.totalPrice,
        guestCount: updatedContext.guestCount || 2,
        startDate: bookingDetails.startDate,
        userId: user?.id // Pass user ID to payment API
      })
    })
    
    if (paymentResponse.ok) {
      const paymentData = await paymentResponse.json()
      
      // UPDATED: Return payment data for button instead of link
      const enhancedResponse = `${text}\n\n🚢 **BOOKING DETAILS** 🚢\n\n` +
        `**Yacht:** ${bookingDetails.yachtName}\n` +
        `**Duration:** ${bookingDetails.duration} days\n` +
        `**Start Date:** ${bookingDetails.startDate}\n` +
        `**Guests:** ${updatedContext.guestCount || 2}\n` +
        `**Total:** ₹${bookingDetails.totalPrice.toLocaleString()}\n\n` +
        `💳 **Click the payment button below to complete your booking**\n` +
        `Order ID: ${paymentData.order.id}`
      
      // UPDATED: Return payment button data
      return Response.json({ 
        response: enhancedResponse, 
        type: "ai",
        showPaymentButton: true, // NEW: Flag to show button
        paymentData: { // NEW: Payment button data
          orderId: paymentData.order.id,
          amount: paymentData.order.amount,
          currency: paymentData.order.currency,
          razorpayKey: paymentData.razorpayKey,
          bookingId: paymentData.booking.id,
          yachtName: bookingDetails.yachtName,
        }
      })
    } else {
      console.error('Payment creation failed:', await paymentResponse.text())
      const errorResponse = `${text}\n\n⚠️ **Payment Setup Failed**\n\nI encountered an issue setting up your payment. Please try again or contact support.`
      return Response.json({ response: errorResponse, type: "ai" })
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    const errorResponse = `${text}\n\n⚠️ **Payment Processing Error**\n\nI encountered an error processing your payment. Please try again.`
    return Response.json({ response: errorResponse, type: "ai" })
  }
}

return Response.json({ response: text, type: "ai" })

    return Response.json({ response: text, type: "ai" })
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      
      // Fallback response
      const yachtNames = yachts.map(y => y.name).join(', ')
      return Response.json({ 
        response: `I'd be happy to help you with yacht services! We have several yachts available: ${yachtNames}. Which one interests you? I can provide more details or help you book.`, 
        type: "fallback" 
      })
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      { response: "I apologize for the technical difficulty. Please try again or contact our support team for yacht booking assistance." },
      { status: 500 },
    )
  }
}