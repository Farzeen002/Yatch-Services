# 📧 Email System - Quick Start Guide

## 🚀 Get Started in 5 Minutes (FREE with Gmail!)

### Step 1: Create Gmail App Password (3 minutes)

1. Go to **[myaccount.google.com](https://myaccount.google.com)**
2. Click **Security** → Enable **2-Step Verification** (if not already)
3. Go to **Security** → **App passwords**
4. Select **Mail** → **Other (Yacht Services)**
5. Click **Generate**
6. **Copy the 16-character password**

### Step 2: Add to Environment Variables (1 minute)

Create or update `.env.local`:

```env
# Gmail Email Service (FREE - No domain verification!)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Restart Your Server (30 seconds)

```bash
npm run dev
```

### Step 4: Test It! (1 minute)

**Option A: Test via Payment Flow**
1. Make a test booking
2. Complete payment
3. Check your email - you'll receive:
   -  Payment Confirmation (with PDF receipt)
   -  Booking Confirmation (with PDF summary)

**Option B: Test Manually**

Open your browser console on any authenticated page and run:

```javascript
// Test welcome email
fetch('/api/emails/welcome', { method: 'POST' });

// Test booking confirmation (replace with real booking ID)
fetch('/api/emails/booking-confirmation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bookingId: 'your-booking-id' })
});
```

##  That's It!

Your email system is now fully functional!

## 📊 What You Get

✨ **4 Professional Email Templates:**
1. 👋 Welcome Email - Greets new users
2. ⏰ Follow-Up Email - Reminds about incomplete bookings
3. 💳 Payment Confirmation - With PDF receipt
4. 🎉 Booking Confirmation - With PDF summary

## 🔄 How It Works

### Automatic Triggers:

- **Payment Verified** → Payment Confirmation Email + Booking Confirmation Email
- **User Logs In** (first time) → Welcome Email
- **Abandoned Booking** → Follow-Up Email (manual trigger)

### Current Integration Points:

 **Payment Flow** (`/api/payments/verify`)
- Automatically sends emails after successful payment

🔧 **Welcome Email** (needs integration)
- Add to your login success callback:
  ```typescript
  // In your login component
  import { useWelcomeEmail } from '@/hooks/use-welcome-email';
  
  const { sendWelcomeEmail } = useWelcomeEmail();
  
  // After successful login
  sendWelcomeEmail();
  ```

## 📱 Check Email Status

View all sent emails:
1. Go to [resend.com/emails](https://resend.com/emails)
2. See delivery status, opens, clicks
3. Debug any issues

##  For Production

When ready to go live:

1. **Verify Your Domain:**
   - Add SPF/DKIM records
   - Use your own email: `noreply@yourdomain.com`

2. **Update Environment:**
   ```env
   EMAIL_FROM=noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

## 🆘 Need Help?

- **Not working?** → Check `EMAIL_SYSTEM_GUIDE.md` (full documentation)
- **Emails not sending?** → Check Resend dashboard for errors
- **Going to spam?** → Verify your domain properly

## 💡 Pro Tips

1. **Free Tier Limits:** 100 emails/day (perfect for testing!)
2. **Testing Domain:** Use `onboarding@resend.dev` - no verification needed
3. **Mobile Test:** Send test emails to your phone
4. **Customize:** Edit templates in `lib/email-templates.ts`

---

**That's all you need!** 🎉

For advanced configuration, check `EMAIL_SYSTEM_GUIDE.md`

