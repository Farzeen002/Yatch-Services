# 🌐 Azure Translator Integration - Complete Setup

## Features Implemented

### ✅ 1. Language Switcher in Navigation
- **English** 🇺🇸 and **Arabic** 🇸🇦 toggle buttons
- Visible in desktop and mobile navigation
- Globe icon with language code (EN/AR)
- Hover tooltip showing both languages
- Loading state during language switch

### ✅ 2. Azure Translator API Integration
- Real-time translation using Azure Cognitive Services
- Automatic RTL/LTR text direction switching
- Persistent language preference (localStorage)
- Translation API endpoint at `/api/translate`

### ✅ 3. Multilingual Support
- English and Arabic translations
- Right-to-left (RTL) layout for Arabic
- Static translations for common UI elements
- Dynamic translation capability via Azure API

## Environment Setup

### Step 1: Add Azure Translator Credentials

Add these to your `.env.local` file:

```env
# Azure Translator Configuration
AZURE_TRANSLATOR_KEY=your_azure_translator_key_here
AZURE_TRANSLATOR_REGION=eastasia
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com/
```

### Step 2: Verify Configuration

Test the translation API:
```bash
curl http://localhost:3000/api/translate
```

Should return:
```json
{
  "status": "configured",
  "service": "Azure Translator",
  "supportedLanguages": ["en", "ar"]
}
```

### Step 3: Restart Server

```bash
npm run dev
```

## How to Use

### For Users

**Desktop:**
1. Look for the 🌐 globe icon in the navigation bar
2. Click to toggle between English (EN) and Arabic (AR)
3. Hover to see language dropdown
4. Language preference is saved automatically

**Mobile:**
1. Open hamburger menu
2. Find language switcher below navigation links
3. Tap to switch languages

### Language Switcher Component

The switcher shows:
- 🌐 Globe icon
- Current language code (EN or AR)
- Loading spinner during translation
- Hover dropdown with:
  - 🇺🇸 English
  - 🇸🇦 العربية

## Visual Changes

### English View
```
┌─────────────────────────────────────────┐
│ 🏠 Marassi Gulf    Home  Yachts  🌐 EN │
└─────────────────────────────────────────┘

Content flows left-to-right →
```

### Arabic View (RTL)
```
┌─────────────────────────────────────────┐
│ AR 🌐  اليخوت  الرئيسية    ماراسي جلف 🏠│
└─────────────────────────────────────────┘

المحتوى يتدفق من اليمين إلى اليسار ←
```

## Technical Details

### Files Created

1. **`app/api/translate/route.ts`**
   - Azure Translator API endpoint
   - POST: Translate text
   - GET: Check configuration status

2. **`components/language-switcher.tsx`**
   - Language toggle button
   - Dropdown with both languages
   - Loading states

3. **`.env.local.example`**
   - Environment template with Azure credentials

4. **`AZURE_TRANSLATOR_SETUP.md`**
   - This documentation file

### Files Modified

1. **`components/navigation.tsx`**
   - Added `<LanguageSwitcher />` to desktop menu
   - Added `<LanguageSwitcher />` to mobile menu
   - Imported language switcher component

2. **`lib/language-context.tsx`**
   - Updated RTL/LTR direction switching
   - Added more navigation translations
   - Updated Marina → Marassi AI in translations
   - Applied direction to document element

## API Usage

### Translate Text (POST)

**Endpoint:** `POST /api/translate`

**Request:**
```json
{
  "text": "Hello, welcome to Marassi Gulf",
  "targetLanguage": "ar"
}
```

**Response:**
```json
{
  "translatedText": "مرحباً، مرحباً بك في ماراسي جلف",
  "detectedLanguage": "en"
}
```

**Example:**
```typescript
const translateText = async (text: string, targetLang: string) => {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      text, 
      targetLanguage: targetLang 
    })
  })
  const data = await response.json()
  return data.translatedText
}

// Usage
const arabic = await translateText('Book a yacht', 'ar')
// Returns: "احجز يختاً"
```

### Check Status (GET)

**Endpoint:** `GET /api/translate`

**Response:**
```json
{
  "status": "configured",
  "service": "Azure Translator",
  "supportedLanguages": ["en", "ar"]
}
```

## Supported Languages

| Language | Code | Direction | Flag |
|----------|------|-----------|------|
| English | `en` | LTR | 🇺🇸 |
| Arabic | `ar` | RTL | 🇸🇦 |

## Translation Keys

### Navigation
```typescript
"nav.home" → { en: "Home", ar: "الرئيسية" }
"nav.yachts" → { en: "Yachts", ar: "اليخوت" }
"nav.support" → { en: "Customer Support", ar: "دعم العملاء" }
"nav.myBookings" → { en: "My Bookings", ar: "حجوزاتي" }
"nav.login" → { en: "Login", ar: "تسجيل الدخول" }
"nav.profile" → { en: "Profile", ar: "الملف الشخصي" }
"nav.logout" → { en: "Logout", ar: "تسجيل الخروج" }
```

### Chatbot
```typescript
"chat.assistant" → { en: "Marassi AI", ar: "مساعد ماراسي الذكي" }
"chat.greeting" → { 
  en: "Hi! I'm Marassi AI...",
  ar: "مرحباً! أنا ماراسي AI..."
}
```

## Adding New Translations

### Method 1: Static (Recommended for UI)

Edit `lib/language-context.tsx`:

```typescript
const translations = {
  // ... existing translations
  "your.key": { 
    en: "Your English text", 
    ar: "النص العربي الخاص بك" 
  }
}
```

### Method 2: Dynamic (Azure API)

```typescript
import { useLanguage } from "@/lib/language-context"

const MyComponent = () => {
  const { language } = useLanguage()
  const [translated, setTranslated] = useState('')

  useEffect(() => {
    const translate = async () => {
      if (language === 'ar') {
        const res = await fetch('/api/translate', {
          method: 'POST',
          body: JSON.stringify({
            text: 'Dynamic text here',
            targetLanguage: 'ar'
          })
        })
        const data = await res.json()
        setTranslated(data.translatedText)
      }
    }
    translate()
  }, [language])

  return <div>{language === 'ar' ? translated : 'Dynamic text here'}</div>
}
```

## RTL Styling

When Arabic is selected, the entire page switches to RTL:

**Automatic changes:**
- Text direction: right-to-left
- Margins/paddings: reversed
- Float properties: mirrored
- Flexbox: reversed

**CSS that works automatically:**
```css
/* No changes needed! These auto-reverse in RTL: */
margin-left, margin-right
padding-left, padding-right
border-left, border-right
text-align: left/right
```

**Manual RTL handling (if needed):**
```tsx
<div className={language === 'ar' ? 'flex-row-reverse' : 'flex-row'}>
  Content
</div>
```

## Testing

### Test Language Switch
1. Visit http://localhost:3000
2. Click 🌐 EN button
3. Should change to 🌐 AR
4. Text direction changes to RTL
5. Page layout mirrors
6. Click again to switch back

### Test Translation API
```bash
# Test English to Arabic
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","targetLanguage":"ar"}'

# Should return: {"translatedText":"مرحبًا","detectedLanguage":"en"}
```

### Test Persistence
1. Switch to Arabic (AR)
2. Refresh page
3. Should remain in Arabic
4. Check localStorage: `language: "ar"`

## Troubleshooting

### Language switcher doesn't appear

**Check:**
1. `components/language-switcher.tsx` exists
2. Navigation imports it: `import LanguageSwitcher from "./language-switcher"`
3. No console errors
4. Refresh browser (Ctrl+Shift+R)

### Translation API errors

**Error: "Translation service not configured"**

**Fix:**
```bash
# Check .env.local has all three variables:
AZURE_TRANSLATOR_KEY=...
AZURE_TRANSLATOR_REGION=eastasia
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com/

# Restart server
npm run dev
```

**Error: "401 Unauthorized"**

**Fix:** Azure key expired or invalid
- Generate new key from Azure Portal
- Update `.env.local`
- Restart server

### RTL layout broken

**Check:**
1. Inspect `<html>` tag has `dir="rtl"`
2. Check `<html>` tag has `lang="ar"`
3. Clear browser cache
4. Check console for CSS errors

### Language doesn't persist

**Fix:**
```javascript
// Check localStorage in browser console:
localStorage.getItem('language')

// Should return: "en" or "ar"

// If null, set manually:
localStorage.setItem('language', 'ar')
```

## Cost Estimates

### Azure Translator Pricing

**Standard Plan:**
- First 2M characters: Free
- 2M+ characters: $10 per 1M characters

**Typical Usage:**
- Average page: ~2,000 characters
- 1,000 page translations: ~$10
- Monthly cost (1000 users): ~$10-20

**Note:** Add your own Azure Translator key to `.env.local` file

## Production Considerations

### Caching Translations

To reduce API calls, cache translations:

```typescript
const translationCache = new Map<string, string>()

async function translateWithCache(text: string, lang: string) {
  const key = `${text}:${lang}`
  if (translationCache.has(key)) {
    return translationCache.get(key)
  }
  
  const response = await fetch('/api/translate', {
    method: 'POST',
    body: JSON.stringify({ text, targetLanguage: lang })
  })
  const data = await response.json()
  
  translationCache.set(key, data.translatedText)
  return data.translatedText
}
```

### Rate Limiting

Azure limits: 100 calls/minute (free tier)

Implement rate limiting if needed:
```typescript
// In api/translate/route.ts
import { Ratelimit } from "@upstash/ratelimit"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
})
```

## Future Enhancements

### Add More Languages
- French (fr)
- Spanish (es)
- German (de)
- Chinese (zh)

### Improve UX
- Translate page content on switch
- Add language to URL (`/ar/yachts`)
- Detect browser language automatically
- Show "Translating..." loading state

### SEO
- Add hreflang tags for multilingual SEO
- Generate sitemap for each language
- Meta descriptions in both languages

## Summary

✅ **What's Working:**
- Language switcher in navigation (desktop + mobile)
- English ↔ Arabic toggle
- RTL/LTR automatic switching
- Azure Translator API integration
- Persistent language preference
- Static translations for common UI
- Dynamic translation capability

✅ **How to Use:**
1. Add Azure credentials to `.env.local`
2. Restart server
3. Click 🌐 button in navigation
4. Switch between EN and AR

✅ **Next Steps:**
- Test language switching
- Add more static translations as needed
- Consider caching for production
- Monitor Azure API usage

---

**Version:** 1.0.0  
**Created:** October 29, 2025  
**Status:** Ready to Use ✅

