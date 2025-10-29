# 🚀 Yacht Booking Chatbot - Quick Start Guide

## Prerequisites

1. **OpenAI API Key**

   - Sign up at https://platform.openai.com
   - Create API key
   - Add to `.env.local`:

   ```bash
   OPENAI_API_KEY=sk-...
   ```

2. **Supabase Database**
   - Ensure `yachts` table has sample data
   - Required columns: id, name, type, price, location, guests, images, description

## Installation

```bash
cd Yatch-Services
npm install
```

## Configuration

Create or update `.env.local`:

```bash
# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Running the Application

```bash
npm run dev
```

Application will start at `http://localhost:3000`

## Using the Chatbot

### Opening the Chatbot

1. Look for the floating blue chat button in bottom-right corner
2. Click to open the chat window

### Text Interaction

**Example conversations:**

1. **Browse Yachts:**

   ```
   You: Show me all available yachts
   AI: [Displays list of yachts with details]
   ```

2. **Book by Name:**

   ```
   You: I want to book the Azure Explorer
   AI: Great choice! How many guests will be joining you?
   You: 6
   AI: Perfect! How many days would you like to book for?
   You: 4 days
   AI: [Shows booking summary with total price and link]
   ```

3. **Search Non-Existent Yacht:**
   ```
   You: Book the SuperYacht 3000
   AI: I'm sorry, SuperYacht 3000 isn't available.
       Here are some alternatives: [Shows yacht list]
   ```

### Voice Interaction

1. **Enable Voice:**

   - Click the speaker icon in chat header to enable/disable TTS
   - When enabled, AI will speak responses

2. **Voice Input:**

   - Click the microphone button in input area
   - Speak your message (e.g., "Show me yachts in Miami")
   - Click again to stop recording
   - Message will be transcribed and sent automatically

3. **Stop Speaking:**
   - If AI is speaking, click "Stop speaking" link below input

### UI Controls

- 🔊 **Speaker Icon**: Toggle voice output (TTS)
- 🎤 **Microphone Button**: Start/stop voice recording (STT)
- 🗑️ **Trash Icon**: Clear chat history
- ❌ **X Button**: Close chat window

## Features

###  What Works

- [x] Fetch and display all yachts from database
- [x] Select yacht from list (click on yacht card)
- [x] Search yacht by name with fuzzy matching
- [x] Suggest alternatives when yacht not found
- [x] Conversational booking flow (yacht → guests → duration)
- [x] Dynamic yacht links (`/yachts/<slug>`)
- [x] Voice input (Whisper STT)
- [x] Voice output (OpenAI TTS)
- [x] Real-time conversation context
- [x] Booking summary with total price
- [x] Session management

### 🔄 Booking Flow

```
1. User: "Book [yacht name]"
   ↓
2. AI: "How many guests?"
   ↓
3. User: "5 guests"
   ↓
4. AI: "How many days?"
   ↓
5. User: "3 days"
   ↓
6. AI: Shows summary + proceed link
```

## Testing

### Automated Tests

Run the test script:

```bash
cd Yatch-Services
node test-yacht-booking-chatbot.js
```

This will:

1. Check API endpoints
2. Test yacht listing
3. Test booking flow
4. Test yacht not found scenario
5. Offer interactive mode

### Manual Testing Checklist

- [ ] Open chatbot on localhost:3000
- [ ] Test: "Show me all yachts" → Should list yachts
- [ ] Click on a yacht card → Should send booking message
- [ ] Test: "Book [existing yacht]" → Should ask for guests
- [ ] Provide guest count → Should ask for duration
- [ ] Provide duration → Should show summary
- [ ] Test: "Book FakeYacht" → Should suggest alternatives
- [ ] Test voice: Click mic, speak, verify transcription
- [ ] Test TTS: Enable voice, send message, hear response
- [ ] Test clear chat → Should reset conversation
- [ ] Test dynamic link → Should open yacht page

## Conversation Examples

### Example 1: Simple Browse

```
You: Hi
AI: Hi! I'm WhosYEP AI, your luxury yacht booking concierge.
    How can I assist you today?

You: What yachts do you have?
AI: We have several luxury yachts available:
    [Shows yacht list with cards]

You: [Clicks on "Ocean Dream" card]
AI: Great choice! The Ocean Dream is perfect for your journey.
    View full details: http://localhost:3000/yachts/ocean-dream
    Would you like to proceed with booking?
```

### Example 2: Direct Booking

```
You: Book the Sunset Paradise for 8 guests
AI: Excellent choice! The Sunset Paradise can accommodate 8 guests.
    How many days would you like to book it for?

You: 5 days
AI: Perfect! Here's your booking summary:
    - Yacht: Sunset Paradise
    - Guests: 8
    - Duration: 5 days
    - Total: $5,000

    [Proceed to Booking →]
```

### Example 3: Voice Booking

```
[User clicks microphone]
You: (speaks) "I want to book a yacht in Dubai"

[AI transcribes and responds]
AI: (speaks) "I'd be happy to help you find a yacht in Dubai.
    Here are our available yachts in that location..."

[Shows yacht list]
```

## Troubleshooting

### Issue: Chatbot button not showing

**Solution:** Check if component is imported in layout.tsx

### Issue: "OPENAI_API_KEY not configured"

**Solution:** Add key to `.env.local` and restart dev server

### Issue: No yachts displayed

**Solution:**

1. Check Supabase connection
2. Run: `curl http://localhost:3000/api/yachts`
3. Verify data exists in `yachts` table

### Issue: Microphone not working

**Solution:**

1. Browser must be on HTTPS or localhost
2. Grant microphone permissions
3. Check browser console for errors

### Issue: Voice not playing

**Solution:**

1. Check browser audio settings
2. Verify OpenAI TTS is working
3. Try different voice option

### Issue: Booking flow stuck

**Solution:**

1. Click "Clear chat" button
2. Restart conversation
3. Check console for errors

## API Endpoints

### Chat Endpoint

```
POST /api/whosyep-ai
Body: { message: string, sessionId: string }
```

### Voice Endpoint (STT)

```
POST /api/whosyep-ai/voice
Content-Type: multipart/form-data
Body: { audio: File }
```

### Voice Endpoint (TTS)

```
POST /api/whosyep-ai/voice
Content-Type: application/json
Body: { text: string, voice?: string }
```

### Yachts Endpoint

```
GET /api/yachts
Response: { yachts: Yacht[] }
```

## Architecture

```
User Interface (Chat Widget)
        ↓
API Layer (/api/whosyep-ai)
        ↓
LangGraph State Machine
        ↓
├── Intent Detection
├── Yacht Search (Supabase)
├── Booking Details Extraction
└── AI Response Generation (GPT-4)
        ↓
Response with Rich UI
```

## Next Steps

1. **Add Sample Yachts**

   ```sql
   INSERT INTO yachts (name, type, price, location, guests, images)
   VALUES
   ('Azure Explorer', 'Motor Yacht', 1200, 'Miami', 12, ARRAY['/yachts/azure.jpg']),
   ('Ocean Dream', 'Sailing Yacht', 900, 'Mediterranean', 8, ARRAY['/yachts/ocean.jpg']);
   ```

2. **Test Voice Features**

   - Speak clearly into microphone
   - Test different accents
   - Try various commands

3. **Customize Responses**

   - Edit system prompts in `graph-nodes.ts`
   - Adjust conversation flow
   - Add custom intents

4. **Deploy to Production**
   - Follow `YACHT_BOOKING_CHATBOT_GUIDE.md`
   - Configure environment variables
   - Enable HTTPS for voice features

## Support

- **Documentation**: See `YACHT_BOOKING_CHATBOT_GUIDE.md`
- **Issues**: Check browser console for errors
- **API Status**: Visit `/api/whosyep-ai` for health check

## Tips for Best Experience

1. **Be Specific**: "Book Azure Explorer for 5 guests for 3 days"
2. **Use Natural Language**: "Show me yachts" or "I want to rent a boat"
3. **Voice Tips**: Speak clearly, minimize background noise
4. **Mobile**: Works on mobile but voice requires HTTPS
5. **Context**: Chatbot remembers conversation history

---

**Version**: 1.0.0  
**Last Updated**: October 27, 2025  
**Status**:  Production Ready
