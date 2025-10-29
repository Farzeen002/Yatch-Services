# 🔧 Environment Setup Guide

## Quick Fix for "Failed to fetch" Error

The chatbot error you're experiencing is due to missing environment variables, specifically the `OPENAI_API_KEY`.

## Step-by-Step Setup

### 1. Create Environment File

In your project root, create a file named `.env.local`:

```bash
# Windows PowerShell
Copy-Item .env.template .env.local

# Or manually create the file
New-Item -Path .env.local -ItemType File
```

### 2. Get Your OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)

**Important:** You need to add credits to your OpenAI account:
- Go to [OpenAI Billing](https://platform.openai.com/account/billing)
- Add a payment method
- Add at least $5 in credits

### 3. Configure `.env.local`

Open `.env.local` and add your keys:

```env
# REQUIRED: Supabase (you should already have these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# REQUIRED: OpenAI (for chatbot)
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini

# REQUIRED: Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# OPTIONAL: Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 4. Restart Development Server

```bash
# Stop current server (Press Ctrl+C)
# Then restart:
npm run dev
```

### 5. Test the Chatbot

1. Open: `http://localhost:3000`
2. Click the blue chat button (bottom right)
3. Try: "Show me all yachts"
4. Should work without errors now! ✅

## Common Issues & Solutions

### ❌ Error: "Failed to fetch"
**Cause:** Missing `OPENAI_API_KEY`  
**Fix:** Add the key to `.env.local` and restart server

### ❌ Error: "You exceeded your current quota"
**Cause:** No credits in OpenAI account  
**Fix:** Add credits at [OpenAI Billing](https://platform.openai.com/account/billing)

### ❌ Error: "Invalid API key"
**Cause:** Incorrect or expired API key  
**Fix:** Generate a new key from OpenAI dashboard

### ❌ Chatbot still not working
**Checklist:**
- [ ] `.env.local` file exists in project root
- [ ] `OPENAI_API_KEY` starts with `sk-proj-` or `sk-`
- [ ] No extra spaces in the key
- [ ] Development server restarted after adding key
- [ ] OpenAI account has credits

## Verify Setup

### Check API Key
```bash
# In PowerShell, run:
$env:OPENAI_API_KEY
```

### Test API Endpoint
Open in browser: `http://localhost:3000/api/whosyep-ai`

Should return:
```json
{
  "status": "online",
  "service": "WhosYEP AI",
  "version": "1.0.0",
  "powered_by": "LangGraph + OpenAI GPT-4"
}
```

## OpenAI Pricing

Using `gpt-4o-mini` (recommended for development):
- **Cost:** ~$0.02 per conversation (5 messages)
- **Monthly estimate:** ~$20 for 1000 conversations
- **Voice features:** Additional cost for Whisper STT and TTS

## Environment Variables Reference

| Variable | Required | Purpose | Where to Get |
|----------|----------|---------|--------------|
| `OPENAI_API_KEY` | ✅ Yes | Chatbot AI | [OpenAI Dashboard](https://platform.openai.com/api-keys) |
| `OPENAI_MODEL` | ⚠️ Optional | AI Model | Use `gpt-4o-mini` for dev |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Database | [Supabase Dashboard](https://supabase.com/dashboard) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Auth | [Supabase Dashboard](https://supabase.com/dashboard) |
| `RAZORPAY_KEY_ID` | ✅ Yes | Payments | [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) |
| `RAZORPAY_KEY_SECRET` | ✅ Yes | Payments | [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) |

## Next Steps

Once your environment is configured:

1. ✅ Test chatbot functionality
2. ✅ Test yacht search and listing
3. ✅ Test booking flow
4. ✅ Test payment integration
5. ✅ Review the guides in the project:
   - `CHATBOT_README.md` - Chatbot features
   - `PAYMENT_AND_BOOKING_FIXES.md` - Payment setup
   - `PRODUCTION_SETUP_GUIDE.md` - Production deployment

## Support

If you're still experiencing issues:

1. Check browser console for detailed errors
2. Check terminal/server logs
3. Verify all environment variables are correct
4. Ensure OpenAI account has credits
5. Try creating a new API key

---

**Version:** 1.0.0  
**Last Updated:** October 29, 2025  
**Status:** Ready to use ✅

