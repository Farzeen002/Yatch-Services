# Language Translation Guide - Marassi Gulf

## Overview
This document describes the comprehensive English-Arabic language translation system implemented for the Marassi Gulf yacht booking platform. The system uses Azure Translator API for real-time translation and includes a beautiful, user-friendly language switcher.

## Features Implemented

### 1. **Enhanced Language Switcher**
- **Location**: Navigation bar (desktop and mobile)
- **Design**: Beautiful gradient button with:
  - Animated country flags (🇺🇸 / 🇸🇦)
  - Smooth transitions between languages
  - Loading animation during translation
  - Visual indicators showing current language
  - Hover effects and scale animations
  
### 2. **RTL/LTR Support**
- Automatically switches text direction based on language
- Arabic: Right-to-Left (RTL)
- English: Left-to-Right (LTR)
- Applied to the entire document root (`<html>` element)

### 3. **Comprehensive Translations**
All major components and pages now support both languages:

#### **Navigation**
- Home → الرئيسية
- Yachts → اليخوت
- Customer Support → دعم العملاء
- Dashboard → لوحة التحكم
- My Bookings → حجوزاتي
- Invoices → الفواتير
- Staff → الموظفين
- Login → تسجيل الدخول
- Profile → الملف الشخصي
- Logout → تسجيل الخروج

#### **Hero Section**
- Main title and subtitle
- Call-to-action buttons
- All descriptive text

#### **Features Section**
- Section title
- Feature cards (Instant Booking, AI-Powered Assistance, 24/7 Support, Luxury Fleet)
- Feature descriptions

#### **Yachts Section**
- Section titles
- Yacht cards
- Capacity, location, pricing labels
- "View Details" and "Book Now" buttons

#### **Footer**
- Brand description
- Quick Links section
- Legal section (Privacy Policy, Terms of Service, Refund Policy)
- Contact information
- Copyright text

#### **Support Page**
- Page title and subtitle
- "Start Chat" button
- Contact sections

#### **Chatbot**
- Chatbot title ("Marassi AI" / "مراسي الذكاء الاصطناعي")
- Subtitle
- Placeholder text
- Send and clear buttons
- Greeting message

#### **Booking Forms**
- Date selection
- Guest count
- Availability check
- Price display
- Booking reference

#### **Common UI Elements**
- Loading states
- Error messages
- Success messages
- Cancel/Save/Close buttons
- Search functionality

## Implementation Details

### File Structure

```
Yatch-Services/
├── lib/
│   └── language-context.tsx      # Language provider & translations
├── components/
│   ├── language-switcher.tsx     # Language toggle button
│   ├── navigation.tsx            # Updated with translations
│   ├── hero-section.tsx          # Updated with translations
│   ├── footer.tsx                # Updated with translations
│   └── whosyep-ai-chatbot.tsx    # Chatbot with translations
├── app/
│   ├── support/
│   │   └── page.tsx              # Support page with translations
│   └── api/
│       └── translate/
│           └── route.ts          # Azure Translator API route
└── LANGUAGE_TRANSLATION_GUIDE.md # This file
```

### Language Context (`lib/language-context.tsx`)

The language context manages:
- Current language state
- Language toggle function
- Translation function `t(key)`
- Loading state during translation
- Persistence to localStorage
- RTL/LTR direction switching
- HTML lang attribute

#### Usage in Components:
```typescript
import { useLanguage } from "@/lib/language-context"

export default function MyComponent() {
  const { t, language, toggleLanguage, isTranslating } = useLanguage()
  
  return (
    <div>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.subtitle")}</p>
    </div>
  )
}
```

### Language Switcher (`components/language-switcher.tsx`)

Beautiful, animated button with:
- Flag icons (🇺🇸 for English, 🇸🇦 for Arabic)
- Language names ("English" / "العربية")
- Smooth transitions using Framer Motion
- Loading spinner during translation
- Visual indicators (dots) showing active language
- Gradient background with hover effects
- Scale animation on hover

### Azure Translator Integration

#### API Route: `/app/api/translate/route.ts`
- Handles translation requests
- Validates input parameters
- Calls Azure Translator API
- Returns translated text

#### Environment Variables Required:
```env
AZURE_TRANSLATOR_KEY=your_key_here
AZURE_TRANSLATOR_REGION=eastasia
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com/
```

## How to Use

### For Developers

1. **Add New Translations**:
   Edit `lib/language-context.tsx` and add new keys:
   ```typescript
   const translations: Record<string, { en: string; ar: string }> = {
     // Add your translations
     "myComponent.title": { 
       en: "Welcome", 
       ar: "مرحباً" 
     },
   }
   ```

2. **Use in Components**:
   ```typescript
   const { t } = useLanguage()
   return <h1>{t("myComponent.title")}</h1>
   ```

3. **Check Current Language**:
   ```typescript
   const { language } = useLanguage()
   if (language === "ar") {
     // Arabic-specific logic
   }
   ```

### For Users

1. **Switch Language**:
   - Click the language button in the navigation bar
   - Desktop: Top right corner
   - Mobile: Inside the hamburger menu

2. **Language Persistence**:
   - Your language preference is saved to browser localStorage
   - Will be remembered on next visit

3. **RTL Support**:
   - When Arabic is selected, the entire page layout switches to RTL
   - Text alignment, navigation, and all UI elements adapt automatically

## Translated Components

### ✅ Fully Translated:
- [x] Navigation Bar
- [x] Hero Section
- [x] Features Section
- [x] Featured Yachts Section
- [x] Footer
- [x] Support Page
- [x] Chatbot (WhosYEP AI / Marassi AI)
- [x] Common UI Elements

### 🔄 Partially Translated (can be extended):
- [ ] Admin Dashboard
- [ ] Booking Forms (detailed forms)
- [ ] User Profile Modal
- [ ] Email Templates
- [ ] Invoice Pages

### 📝 Content That Remains in English:
- Email addresses (support@marassigulf.com)
- Phone numbers
- Dates and times (localized format can be added)
- Currency symbols

## Best Practices

1. **Always use translation keys**: Never hardcode text
2. **Keep translations consistent**: Use the same Arabic translation for the same English term
3. **Test RTL layout**: Check that all components look good in Arabic
4. **Use semantic keys**: Name keys based on component and purpose (e.g., `footer.contactInfo`)
5. **Handle pluralization**: Add separate keys for singular/plural if needed
6. **Consider context**: The same English word might need different Arabic translations in different contexts

## Testing

### Manual Testing Checklist:
- [x] Language switcher button appears on desktop
- [x] Language switcher button appears on mobile
- [x] Clicking button switches language
- [x] Page direction changes (LTR ↔ RTL)
- [x] All navigation items are translated
- [x] Hero section text is translated
- [x] Footer text is translated
- [x] Support page text is translated
- [x] Chatbot text is translated
- [x] Loading animation shows during switch
- [x] Language preference persists after refresh

### Browser Compatibility:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Troubleshooting

### Issue: Translations not showing
**Solution**: Check that the component is wrapped with `LanguageProvider` in the layout

### Issue: RTL not working
**Solution**: Verify that `document.documentElement.dir` is being set in the `toggleLanguage` function

### Issue: Language not persisting
**Solution**: Check localStorage permissions in the browser

### Issue: Azure Translator errors
**Solution**: Verify that all environment variables are set correctly and the API key is valid

## Future Enhancements

1. **Dynamic Content Translation**:
   - Translate yacht descriptions from database
   - Translate user-generated content

2. **More Languages**:
   - Add French, Spanish, etc.
   - Update language switcher for dropdown

3. **Professional Translations**:
   - Review and refine Arabic translations with native speakers
   - Add localized date/time formats
   - Add localized currency formatting

4. **SEO**:
   - Add language-specific meta tags
   - Implement hreflang tags
   - Create language-specific URLs

5. **Accessibility**:
   - Add ARIA labels in both languages
   - Ensure keyboard navigation works in RTL

## Credits

- **Design**: Beautiful gradient language switcher with animated transitions
- **Translation Service**: Azure Translator API
- **UI Framework**: Framer Motion for animations
- **Icons**: Lucide React
- **Font Support**: Default fonts support both English and Arabic

## Support

For questions or issues related to the translation system:
- Check this guide first
- Review the code comments in `language-context.tsx`
- Test the language switcher in both desktop and mobile views
- Verify environment variables are properly configured

---

**Last Updated**: October 29, 2025
**Version**: 1.0.0
**Status**: ✅ Fully Implemented and Tested

