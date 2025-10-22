import { generateText } from "ai"

// Mock database for yachts
const yachts = [
  { id: 1, name: "Luxury Catamaran", price: 5000, capacity: 12, length: "45ft" },
  { id: 2, name: "Private Speedboat", price: 3000, capacity: 6, length: "35ft" },
  { id: 3, name: "Mega Yacht", price: 15000, capacity: 20, length: "80ft" },
  { id: 4, name: "Sailing Vessel", price: 4000, capacity: 8, length: "50ft" },
]

const bookings = [
  { id: 1, yachtName: "Luxury Catamaran", date: "2025-11-15", guests: 8, status: "confirmed" },
  { id: 2, yachtName: "Private Speedboat", date: "2025-11-20", guests: 4, status: "pending" },
]

// Automation handlers for different query types
function handleYachtInquiry(query: string): string {
  if (query.toLowerCase().includes("available") || query.toLowerCase().includes("yacht")) {
    const yachtList = yachts.map((y) => `${y.name} (${y.capacity} guests, $${y.price}/day)`).join(", ")
    return `We have these luxury yachts available: ${yachtList}. Which one interests you?`
  }
  return ""
}

function handlePricingInquiry(query: string): string {
  if (query.toLowerCase().includes("price") || query.toLowerCase().includes("cost")) {
    const minPrice = Math.min(...yachts.map((y) => y.price))
    const maxPrice = Math.max(...yachts.map((y) => y.price))
    return `Our yachts range from $${minPrice} to $${maxPrice} per day. Pricing adjusts based on guest count and season. Would you like details on a specific yacht?`
  }
  return ""
}

function handleBookingInquiry(query: string): string {
  if (query.toLowerCase().includes("book") || query.toLowerCase().includes("reserve")) {
    return `I'd love to help you book! To get started, please tell me: 1) Which yacht interests you? 2) What date? 3) How many guests? I can process your booking instantly.`
  }
  return ""
}

function handleBookingStatus(query: string): string {
  if (query.toLowerCase().includes("booking") || query.toLowerCase().includes("reservation")) {
    if (bookings.length === 0) return "You don't have any bookings yet. Would you like to make one?"
    const bookingList = bookings
      .map((b) => `${b.yachtName} on ${b.date} for ${b.guests} guests (${b.status})`)
      .join("; ")
    return `Your bookings: ${bookingList}`
  }
  return ""
}

function handleSpecialRequests(query: string): string {
  if (
    query.toLowerCase().includes("special") ||
    query.toLowerCase().includes("catering") ||
    query.toLowerCase().includes("event")
  ) {
    return `We offer special services including catering, water sports equipment, professional crew, and event planning. What would you like to arrange?`
  }
  return ""
}

function handleSupportRequest(query: string): string {
  if (query.toLowerCase().includes("support") || query.toLowerCase().includes("help")) {
    return `I'm here to help! You can ask me about available yachts, pricing, bookings, or special services. If you need to speak with our team, I can connect you with a specialist.`
  }
  return ""
}

// Main automation logic
function getAutomatedResponse(query: string): string | null {
  const handlers = [
    handleYachtInquiry,
    handlePricingInquiry,
    handleBookingInquiry,
    handleBookingStatus,
    handleSpecialRequests,
    handleSupportRequest,
  ]

  for (const handler of handlers) {
    const response = handler(query)
    if (response) return response
  }

  return null
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // First, try automated responses
    const automatedResponse = getAutomatedResponse(message)
    if (automatedResponse) {
      return Response.json({ response: automatedResponse, type: "automated" })
    }

    // If no automated response, use AI for complex queries
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are Marina, a professional yacht booking assistant for a luxury yacht charter company. 
      You help customers with yacht inquiries, bookings, pricing, and special requests. 
      Be concise, professional, and helpful. Keep responses to 2-3 sentences.
      Available yachts: ${yachts.map((y) => y.name).join(", ")}.
      Price range: $${Math.min(...yachts.map((y) => y.price))} - $${Math.max(...yachts.map((y) => y.price))} per day.`,
      prompt: message,
    })

    return Response.json({ response: text, type: "ai" })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      { response: "I apologize for the technical difficulty. Please try again or contact our support team." },
      { status: 500 },
    )
  }
}
