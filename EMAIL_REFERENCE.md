# 📧 Email System - Quick Reference Card

## 🚀 Setup (Copy & Paste)

### 1. Get API Key
```
https://resend.com → Sign Up → API Keys → Create
```

### 2. Add to .env.local
```env
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Restart
```bash
npm run dev
```

---

## 📬 Email Types

| Email | Trigger | Includes | Status |
|-------|---------|----------|--------|
| 👋 Welcome | User login (manual) | Platform intro |  Ready |
| ⏰ Follow-Up | Abandoned booking | Yacht image, reminder |  Ready |
| 💳 Payment | Auto (after payment) | Receipt PDF |  Integrated |
| 🎉 Booking | Auto (after confirmation) | Summary PDF |  Integrated |

---

## 🔌 API Endpoints

```typescript
// Welcome Email
POST /api/emails/welcome

// Follow-Up Email
POST /api/emails/follow-up
{
  "yachtId": "uuid",
  "yachtName": "Yacht Name"
}

// Payment Confirmation
POST /api/emails/payment-confirmation
{
  "bookingId": "uuid",
  "paymentId": "pay_abc123"
}

// Booking Confirmation
POST /api/emails/booking-confirmation
{
  "bookingId": "uuid"
}
```

---

## 🎨 Customization

| What | Where | Line |
|------|-------|------|
| Email templates | `lib/email-templates.ts` | - |
| PDF content | `lib/pdf-generator.ts` | - |
| Company info | `lib/pdf-generator.ts` | ~20-23 |
| Colors | `lib/email-templates.ts` | Search hex codes |
| Logo | `lib/email-templates.ts` | Replace emoji |

---

## 🧪 Test Commands

```bash
# Browser Console (on any authenticated page)
fetch('/api/emails/welcome', { method: 'POST' });

# Or make a booking - emails send automatically!
```

---

## 🔍 Check Status

```
Resend Dashboard: https://resend.com/emails
See: Delivery, Opens, Clicks, Errors
```

---

## ⚡ Integration Examples

### Send Welcome Email on Login
```typescript
import { useWelcomeEmail } from '@/hooks/use-welcome-email';

function LoginPage() {
  const { sendWelcomeEmail } = useWelcomeEmail();
  
  const handleLogin = async () => {
    // ... your login logic
    sendWelcomeEmail(); // Send welcome email
  };
}
```

### Automatic (already integrated)
```typescript
//  Payment → Email (automatic)
//  Booking → Email (automatic)
// File: app/api/payments/verify/route.ts
```

---

##  Environment Variables

```env
# Required
RESEND_API_KEY=re_...           # From resend.com
EMAIL_FROM=noreply@domain.com   # Your email

# Auto-detected
NEXT_PUBLIC_APP_URL=...         # Your site URL

# For Testing
EMAIL_FROM=onboarding@resend.dev  # No verification needed
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Emails not sending | Check `RESEND_API_KEY` in .env.local |
| API key error | Verify key starts with `re_` |
| Domain error | Use `onboarding@resend.dev` for testing |
| Emails in spam | Verify domain + SPF/DKIM records |
| PDF not attached | Check browser console for errors |

---

## 📁 File Locations

```
lib/
├── email-service.ts          # Core email sender
├── email-templates.ts        # All 4 templates
└── pdf-generator.ts          # PDF creation

app/api/emails/
├── welcome/route.ts
├── follow-up/route.ts
├── payment-confirmation/route.ts
└── booking-confirmation/route.ts

hooks/
└── use-welcome-email.ts      # React hook

Docs:
├── EMAIL_QUICK_START.md      # 5-min guide
├── EMAIL_SYSTEM_GUIDE.md     # Full docs
├── EMAIL_SYSTEM_SUMMARY.md   # Overview
└── EMAIL_REFERENCE.md        # This file
```

---

## 🎨 Email Colors

| Type | Color | Hex |
|------|-------|-----|
| Welcome | Blue | #0ea5e9 |
| Follow-Up | Orange | #f59e0b |
| Payment | Green | #10b981 |
| Booking | Purple | #8b5cf6 |

---

## 💰 Pricing (Resend)

- **Free:** 100 emails/day, 1 domain
- **Pro:** $20/mo, 50k emails/month
- **Testing:** Use `onboarding@resend.dev`

---

##  Quick Checklist

- [ ] Resend account created
- [ ] API key copied
- [ ] Added to .env.local
- [ ] Server restarted
- [ ] Test email sent
- [ ] Payment flow tested
- [ ] PDFs generating
- [ ] Ready to use!

---

**Need More Help?**
- Quick Start: `EMAIL_QUICK_START.md`
- Full Guide: `EMAIL_SYSTEM_GUIDE.md`
- Overview: `EMAIL_SYSTEM_SUMMARY.md`

---

**Last Updated:** October 28, 2025  
**Version:** 1.0.0


