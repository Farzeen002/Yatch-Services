# WhosYEP AI - Yacht Booking Chatbot Guide

## Overview

The WhosYEP AI Chatbot is a conversational AI assistant that helps users browse and book luxury yachts with full voice interaction support using OpenAI Whisper (speech-to-text) and TTS (text-to-speech).

## Features

###  Implemented Features

1. **Voice Interaction**

   - Speech-to-Text using OpenAI Whisper
   - Text-to-Speech using OpenAI TTS (6 voice options)
   - Toggle voice on/off
   - Real-time audio recording and playback

2. **Yacht Browsing**

   - Fetch all available yachts from backend API
   - Display yachts in beautiful, interactive cards
   - Show yacht details: name, location, capacity, price, type
   - Click-to-book functionality

3. **Yacht Search by Name**

   - Search for specific yacht by name
   - Fuzzy matching for partial names
   - Suggest alternatives when yacht not found
   - Display "yacht not found" message with alternatives

4. **Dynamic Yacht Links**

   - Generate dynamic links for each yacht
   - Format: `http://localhost:3000/yachts/<yacht-slug>`
   - Clickable links in chat interface
   - Open yacht details in new tab

5. **Conversational Booking Flow**

   - Step 1: Yacht selection (by name or from list)
   - Step 2: Ask for number of guests
   - Step 3: Ask for trip duration (days)
   - Step 4: Confirm booking details with total price
   - Natural conversation flow with context retention

6. **Smart Intent Detection**
   - Booking intent detection
   - Search/browse intent
   - Specific yacht query
   - Support requests
   - Context-aware responses

## Usage Examples

### Example 1: Browse All Yachts

**User:** "Show me all available yachts"

**AI Response:**

- Displays list of all yachts with details
- Each yacht card is clickable to start booking

### Example 2: Book Specific Yacht by Name

**User:** "I want to book the Sunset Dream yacht"

**AI Response:**

- Searches for "Sunset Dream" in database
- If found: Shows yacht details with dynamic link
- Asks: "How many guests will be joining you?"

**User:** "5 guests"

**AI Response:**

- Confirms: 5 guests
- Asks: "How many days would you like to book the yacht for?"

**User:** "3 days"

**AI Response:**

- Shows booking summary:
  - Yacht: Sunset Dream
  - Guests: 5
  - Duration: 3 days
  - Total: $X
- Provides link to proceed with booking

### Example 3: Yacht Not Found - Suggest Alternatives

**User:** "Book the SuperYacht X"

**AI Response:**

- "I'm sorry, but I couldn't find a yacht named 'SuperYacht X' in our database."
- "Here are some amazing alternatives:"
- Displays list of available yachts with click-to-book

### Example 4: Voice Interaction

**User:** (Clicks microphone button and speaks) "Show me yachts in Dubai"

**System:**

- Records audio
- Transcribes using Whisper
- Processes as text message
- AI responds with relevant yachts
- Speaks response using TTS (if voice enabled)

## Technical Architecture

### Components

1. **Frontend Chatbot** (`whosyep-ai-chatbot.tsx`)

   - React component with voice controls
   - Message rendering with yacht cards
   - Audio recording and playback
   - Real-time UI updates

2. **API Endpoints**

   - `/api/whosyep-ai` - Main conversation endpoint
   - `/api/whosyep-ai/voice` - Voice interaction (STT/TTS)
   - `/api/yachts` - Yacht data from Supabase
   - `/api/bookings` - Booking creation

3. **Conversation Graph** (`conversation-graph.ts`)

   - LangGraph state machine
   - Node-based conversation flow
   - Session state management
   - Context retention

4. **Graph Nodes** (`graph-nodes.ts`)
   - `detectIntentNode` - Analyzes user intent
   - `searchYachtNode` - Fetches and finds yachts
   - `extractBookingDetailsNode` - Extracts booking info
   - `generateResponseNode` - AI response generation

### Conversation Flow

```
User Message
    ↓
Intent Detection
    ↓
Fetch Yachts (if needed)
    ↓
Search Specific Yacht (if mentioned)
    ↓
Extract Booking Details
    ↓
Generate AI Response
    ↓
Display with Rich UI
```

### State Management

```typescript
ConversationState {
  messages: Array<Message>
  context: {
    availableYachts: Yacht[]      // All fetched yachts
    selectedYacht: Yacht           // Currently selected
    bookingIntent: {
      yachtId, yachtName,
      guestCount, duration,
      totalPrice
    }
    currentIntent: string          // booking, search, etc.
    awaitingInput: string          // guest_count, duration, etc.
    yachtFound: boolean            // Search result
    searchedYachtName: string      // What user searched
  }
}
```

## Testing Guide

### Prerequisites

1. **Environment Variables**

   ```bash
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

2. **Database Setup**
   - Ensure `yachts` table has data
   - Required fields: id, name, type, price, location, guests, images

### Test Cases

#### Test 1: List All Yachts

```
User: "Show me all yachts"
Expected: List of yachts with clickable cards
```

#### Test 2: Book Yacht by Name (Exists)

```
User: "Book Azure Explorer"
Expected:
- Shows yacht details
- Shows dynamic link
- Asks for guest count

User: "4"
Expected: Asks for duration

User: "5 days"
Expected:
- Shows booking summary
- Total price calculated
- Link to proceed
```

#### Test 3: Book Yacht by Name (Doesn't Exist)

```
User: "Book Titanic II"
Expected:
- "Titanic II not available" message
- Suggests alternative yachts
- Shows list of available yachts
```

#### Test 4: Voice Booking Flow

```
1. Click microphone button
2. Say: "I want to book a yacht"
3. System transcribes and responds
4. AI speaks response (if voice enabled)
5. Continue conversation via voice
```

#### Test 5: General Inquiry

```
User: "What yachts do you have in Miami?"
Expected:
- Searches for Miami location
- Shows matching yachts
- Offers to help with booking
```

### Voice Testing

1. **Test STT (Speech-to-Text)**

   - Click microphone button
   - Speak clearly: "Show me available yachts"
   - Verify transcription accuracy
   - Check response

2. **Test TTS (Text-to-Speech)**

   - Enable voice (speaker icon)
   - Send text message
   - Verify AI speaks response
   - Test stop speaking button

3. **Test Different Voices**
   - Modify voice parameter in code
   - Options: alloy, echo, fable, onyx, nova, shimmer
   - Test different voices for clarity

### Performance Testing

1. **Response Time**

   - Measure API response time
   - Should be < 3 seconds for normal queries
   - Voice transcription: < 2 seconds

2. **Concurrent Sessions**

   - Open multiple chat windows
   - Verify session isolation
   - Check state persistence

3. **Error Handling**
   - Test with invalid input
   - Test API failures
   - Verify graceful degradation

## Deployment Checklist

- [ ] Set OpenAI API key in production
- [ ] Configure Supabase credentials
- [ ] Test voice features on HTTPS (required for microphone)
- [ ] Verify CORS settings for API calls
- [ ] Test on mobile devices
- [ ] Monitor API usage and costs
- [ ] Set up rate limiting for voice API
- [ ] Configure session timeout
- [ ] Add analytics tracking
- [ ] Set up error logging

## API Usage & Costs

### OpenAI API Costs

1. **Whisper (STT)**

   - $0.006 per minute of audio
   - Average query: ~5 seconds = $0.0005

2. **TTS**

   - $0.015 per 1,000 characters
   - Average response: ~100 chars = $0.0015

3. **GPT-4**
   - Input: $0.01 per 1k tokens
   - Output: $0.03 per 1k tokens
   - Average conversation turn: ~$0.02

**Estimated cost per conversation (5 turns): $0.15**

## Troubleshooting

### Issue: Microphone not working

**Solution:** Ensure HTTPS is enabled (required for browser microphone access)

### Issue: Voice not playing

**Solution:** Check browser audio permissions and volume settings

### Issue: Yacht not found (but exists)

**Solution:** Check yacht name spelling and fuzzy matching logic

### Issue: Booking details not collected

**Solution:** Verify context state and intent detection

### Issue: API rate limiting

**Solution:** Implement exponential backoff and request queuing

## Future Enhancements

- [ ] Multi-language support (translate yacht details)
- [ ] Date picker integration for booking
- [ ] Payment processing via chatbot
- [ ] Save favorite yachts
- [ ] Share yacht links
- [ ] Booking history in chat
- [ ] Calendar availability view
- [ ] Price comparison
- [ ] Special offers and discounts
- [ ] Customer reviews integration
- [ ] Image gallery in chat
- [ ] Video previews
- [ ] Live availability status
- [ ] Weather information
- [ ] Route suggestions
- [ ] Chat history export

## Support

For issues or questions:

- Email: support@whosyep.com
- Documentation: [your-docs-link]
- API Status: [status-page-link]

---

**Version:** 1.0.0  
**Last Updated:** October 27, 2025  
**Author:** WhosYEP AI Team
