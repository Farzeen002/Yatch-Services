# 🔧 OpenAI API Issues - Quick Fix Guide

## 🚨 Current Issues

Based on your error logs, you have **two critical issues**:

### 1. ❌ OpenAI API Quota Exceeded (429 Error)

```
Error: 429 You exceeded your current quota
code: 'insufficient_quota'
```

**What this means:** Your OpenAI API key has no credits or has exceeded its quota.

### 2. ❌ Invalid GPT Model (404 Error)

```
Error: 404 The model `gpt-4-turbo-preview` does not exist
code: 'model_not_found'
```

**What this means:** The model `gpt-4-turbo-preview` is deprecated or you don't have access.

---

##  Solutions

### Solution 1: Fix OpenAI API Quota

You have **3 options**:

#### Option A: Add Credits to Your OpenAI Account (Recommended)

1. Go to: https://platform.openai.com/account/billing
2. Add a payment method
3. Add credits (minimum $5 recommended)
4. Wait 5-10 minutes for activation

#### Option B: Use a Different API Key

If you have another OpenAI account with credits:

1. Get API key from: https://platform.openai.com/api-keys
2. Update `.env.local`:

```bash
OPENAI_API_KEY=sk-proj-your-new-key-here
```

3. Restart your dev server

#### Option C: Use Free Tier Alternative (For Testing)

For testing without OpenAI, you can:

- Disable voice features temporarily
- Use mock responses for testing the UI
- Test with Gemini or other free alternatives

---

### Solution 2: Fix GPT Model Error  **ALREADY FIXED!**

I've already updated your code to use **`gpt-4o-mini`** which is:

-  Currently available
-  Much cheaper than GPT-4
-  Faster responses
-  Good quality for chatbot use

**The updated code now uses:**

```typescript
const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
```

---

## 🚀 Quick Start After Fix

### Step 1: Update Your Environment

Create or update `.env.local`:

```bash
# REQUIRED - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-key-with-credits

# OPTIONAL - Choose your model (defaults to gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini

# Your existing Supabase vars
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Step 2: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Test the Chatbot

1. Open: `http://localhost:3000`
2. Click the blue chat button
3. Try: **"Show me all yachts"**
4. Should work WITHOUT errors now!

---

## 💰 OpenAI Pricing (Updated)

### GPT Models (Conversation)

| Model              | Input (per 1M tokens) | Output (per 1M tokens) | Quality   |
| ------------------ | --------------------- | ---------------------- | --------- |
| **gpt-4o-mini**  | $0.15                 | $0.60                  | Good      |
| gpt-4o             | $2.50                 | $10.00                 | Excellent |
| gpt-3.5-turbo      | $0.50                 | $1.50                  | Basic     |

### Voice Features

| Feature       | Cost            | Notes        |
| ------------- | --------------- | ------------ |
| Whisper (STT) | $0.006/min      | Voice input  |
| TTS           | $0.015/1K chars | Voice output |

### Estimated Costs

**With gpt-4o-mini (recommended):**

- Per conversation (5 turns): **~$0.02**
- 1000 conversations: **~$20/month**

**If you use gpt-4o:**

- Per conversation (5 turns): **~$0.15**
- 1000 conversations: **~$150/month**

**Pro tip:** Start with `gpt-4o-mini` for testing!

---

## 🔍 How to Check Your OpenAI Status

### Check Credits

1. Visit: https://platform.openai.com/account/usage
2. See your current usage
3. Check remaining credits

### Check API Key

```bash
# Test your API key (from terminal)
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Should return a list of models if key is valid.

---

## 🛡️ Graceful Degradation (Already Implemented!)

I've added **fallback handling** so your app won't crash:

### Voice Features (STT/TTS)

 **If quota exceeded:**

- Shows user-friendly error: "Voice unavailable. Please use text input."
- Automatically disables voice features
- Chatbot still works with text input

### Chat Features

 **If GPT model fails:**

- Returns fallback message
- User can still browse yachts
- Doesn't crash the app

---

## 📋 Testing Checklist

After fixing your API key:

```bash
□ Update OPENAI_API_KEY in .env.local
□ Restart dev server (npm run dev)
□ Test text chat: "Show me yachts"
□ Test booking flow: "Book Eclipse"
□ Test voice input (click mic)
□ Test voice output (enable speaker)
□ Check console for errors
```

---

## 🆘 Still Having Issues?

### Error: "Invalid API key"

- **Fix:** Double-check your API key has no extra spaces
- **Format:** Should start with `sk-proj-` or `sk-`

### Error: "Rate limit exceeded"

- **Fix:** Wait 60 seconds between requests
- **Or:** Upgrade your OpenAI plan tier

### Error: Model still not found

- **Fix:** Check `.env.local` has `OPENAI_MODEL=gpt-4o-mini`
- **Or:** Remove `OPENAI_MODEL` line to use default

### Voice features don't work

- **Must have:** HTTPS or localhost
- **Must have:** Browser microphone permissions
- **Must have:** OpenAI credits for Whisper/TTS

---

##  Recommended Setup

**For Development/Testing:**

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

**For Production:**

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o
```

---

## 💡 Pro Tips

1. **Start Small:** Test with `gpt-4o-mini` first
2. **Monitor Usage:** Check OpenAI dashboard regularly
3. **Set Limits:** Configure spending limits in OpenAI settings
4. **Cache Responses:** Consider caching common queries
5. **Rate Limiting:** Implement on your API endpoints

---

## 📞 Get Help

**OpenAI Support:**

- Dashboard: https://platform.openai.com
- Docs: https://platform.openai.com/docs
- Billing: https://platform.openai.com/account/billing

**Your Chatbot Status:**

- Health Check: `http://localhost:3000/api/whosyep-ai`
- Voice Check: `http://localhost:3000/api/whosyep-ai/voice`

---

##  Summary

### What I Fixed:

1.  Changed model from `gpt-4-turbo-preview` → `gpt-4o-mini`
2.  Added graceful error handling for quota exceeded
3.  Voice features fail gracefully when no credits
4.  App won't crash - shows user-friendly errors

### What You Need to Do:

1. ⚠️ Add credits to your OpenAI account ($5-10 minimum)
2. ⚠️ OR get a new API key with credits
3. ⚠️ Update `.env.local` with valid key
4. ⚠️ Restart dev server

### After That:

- ✨ Everything should work perfectly!
- 💬 Chat features will work
- 🎤 Voice features will work (if you have credits)
- 🛥️ Yacht booking will work end-to-end

---

**Need immediate testing without OpenAI?**
The yacht browsing, selection, and UI all work without AI.
Just use text input and the booking forms directly.

---

**Version:** 1.0.1  
**Updated:** October 27, 2025  
**Status:** ⚠️ Requires OpenAI API Credits
