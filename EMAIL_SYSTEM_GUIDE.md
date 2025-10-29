# Email System Complete Guide

## 📧 Overview

This yacht booking platform includes a comprehensive email notification system with professional templates for different stages of the user journey.

## ✨ Features

### 1. **Welcome Email** 
-  **Trigger**: Sent immediately after user registration/login
- 📄 **Content**: Platform introduction, feature highlights, call-to-action
- 🎨 **Design**: Blue gradient header with welcoming tone

### 2. **Follow-Up Email** (Abandoned Booking)
-  **Trigger**: When user views a yacht but doesn't complete booking
- 📄 **Content**: Reminder about yacht, urgency messaging, booking link
- 🎨 **Design**: Orange/yellow theme with yacht image

### 3. **Payment Confirmation Email**
-  **Trigger**: Automatically after successful payment
- 📄 **Content**: Transaction details, payment ID, receipt
- 📎 **Attachment**: PDF receipt with all payment details
- 🎨 **Design**: Green success theme

### 4. **Booking Confirmation Email**
-  **Trigger**: When booking status is confirmed
- 📄 **Content**: Complete booking summary, important info, support links
- 📎 **Attachment**: PDF booking summary
- 🎨 **Design**: Purple theme with yacht image

## 🚀 Setup Instructions

### Step 1: Get Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day on free tier)
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy the key (starts with `re_`)

### Step 2: Verify Your Domain (Production)

For production use, you need to verify your sending domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the provided DNS records to your domain registrar:
   - SPF record
   - DKIM records
   - DMARC record (optional but recommended)
5. Wait for verification (usually a few minutes)

**For Testing:**
- Use `onboarding@resend.dev` as your from email (no domain verification needed)
- Limited to 100 emails/day

### Step 3: Configure Environment Variables

Create or update your `.env.local` file:

```env
# Resend Email Service
RESEND_API_KEY=re_your_actual_api_key

# Email From Address
EMAIL_FROM=noreply@yourdomain.com
# Or for testing: EMAIL_FROM=onboarding@resend.dev

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Or for production: NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 4: Install Dependencies

The system uses jsPDF for PDF generation (already in your project). No additional dependencies needed!

### Step 5: Test the Email System

#### Test Welcome Email:
```bash
curl -X POST http://localhost:3000/api/emails/welcome \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie"
```

#### Test from UI:
1. Log in to your account
2. The welcome email will be sent automatically on first login
3. Make a booking to test payment and booking confirmation emails

## 📂 File Structure

```
Yatch-Services/
├── lib/
│   ├── email-service.ts          # Core email sending logic
│   ├── email-templates.ts        # HTML email templates
│   └── pdf-generator.ts          # PDF generation for receipts
├── app/api/emails/
│   ├── welcome/route.ts          # Welcome email endpoint
│   ├── follow-up/route.ts        # Follow-up email endpoint
│   ├── payment-confirmation/route.ts  # Payment email endpoint
│   └── booking-confirmation/route.ts  # Booking email endpoint
└── app/api/payments/
    └── verify/route.ts           # Updated to trigger emails
```

## 🔄 Email Triggers

### Automatic Triggers

#### 1. Payment Confirmation
**Triggered by:** `/api/payments/verify` (after successful payment)
- Sends payment confirmation with PDF receipt
- Sends booking confirmation with PDF summary
- Both emails sent asynchronously (don't block payment response)

#### 2. Welcome Email
**How to integrate:**

Add this to your login/signup success handler:

```typescript
// After successful login
fetch('/api/emails/welcome', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
}).catch(console.error);
```

#### 3. Follow-Up Email (Manual Trigger)
**Use case:** Abandoned bookings

You can call this from a scheduled job or manually:

```typescript
fetch('/api/emails/follow-up', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    yachtId: 'yacht-uuid',
    yachtName: 'Luxury Yacht Name',
  }),
});
```

### Manual Email Triggers (via API)

#### Send Welcome Email:
```javascript
POST /api/emails/welcome
// No body required - uses authenticated user
```

#### Send Follow-Up Email:
```javascript
POST /api/emails/follow-up
Content-Type: application/json

{
  "yachtId": "yacht-uuid",
  "yachtName": "Yacht Name"
}
```

#### Send Payment Confirmation:
```javascript
POST /api/emails/payment-confirmation
Content-Type: application/json

{
  "bookingId": "booking-uuid",
  "paymentId": "pay_abc123"
}
```

#### Send Booking Confirmation:
```javascript
POST /api/emails/booking-confirmation
Content-Type: application/json

{
  "bookingId": "booking-uuid"
}
```

## 📊 Email Templates Customization

### Edit Company Information

Edit `lib/pdf-generator.ts` to update company details on PDFs:

```typescript
const companyName = data.companyName || 'Your Company Name';
const companyAddress = data.companyAddress || 'Your Address';
const companyPhone = data.companyPhone || 'Your Phone';
const companyEmail = data.companyEmail || 'Your Email';
```

### Customize Email Colors

Edit `lib/email-templates.ts`:

- **Welcome Email**: Blue theme (`#0ea5e9`)
- **Follow-Up Email**: Orange theme (`#f59e0b`)
- **Payment Email**: Green theme (`#10b981`)
- **Booking Email**: Purple theme (`#8b5cf6`)

### Add Your Logo

Replace the emoji headers with your logo:

```html
<!-- Replace this: -->
<h1 style="...">⚓ Welcome Aboard!</h1>

<!-- With this: -->
<img src="https://yourdomain.com/logo.png" alt="Company Logo" style="max-width: 200px;">
```

## 🧪 Testing

### Test Emails During Development

1. **Use Resend's Testing Domain:**
   ```env
   EMAIL_FROM=onboarding@resend.dev
   ```

2. **Test Each Email Type:**
   - Create a test account
   - Trigger welcome email manually
   - Make a test booking to trigger payment/booking emails
   - Check Resend dashboard for delivery status

3. **Check Email Rendering:**
   - Use [Email on Acid](https://www.emailonacid.com/)
   - Or [Litmus](https://www.litmus.com/)
   - Or just send to multiple email clients (Gmail, Outlook, etc.)

### View Email Logs

1. Go to [Resend Dashboard](https://resend.com/emails)
2. View all sent emails
3. See delivery status, opens, clicks
4. Debug any failures

## 🔒 Security Best Practices

### 1. Protect API Keys
```bash
# Never commit .env.local to git
echo ".env.local" >> .gitignore
```

### 2. Rate Limiting
Consider adding rate limiting to email endpoints to prevent abuse:

```typescript
// Example: Max 5 emails per hour per user
```

### 3. User Verification
All email endpoints verify the user is authenticated before sending.

### 4. Environment Variables
Always use environment variables, never hardcode:
- API keys
- Email addresses
- Domain names

## 📈 Monitoring & Analytics

### Resend Dashboard Metrics:
- **Delivery Rate**: % of emails successfully delivered
- **Bounce Rate**: Failed deliveries
- **Open Rate**: How many recipients opened the email
- **Click Rate**: Clicks on links in emails

### Error Handling:
All email endpoints return proper status codes:
- `200`: Email sent successfully
- `400`: Missing parameters
- `401`: User not authenticated
- `404`: Resource (booking) not found
- `500`: Server error

Check server logs for detailed error messages.

## 🎨 Email Design Best Practices

### Current Implementation:
 Responsive design (mobile-friendly)
 Inline CSS (best email compatibility)
 Professional color schemes
 Clear call-to-action buttons
 PDF attachments for records
 Branded footers

### Recommendations:
1. **Test on Multiple Clients**: Gmail, Outlook, Apple Mail, etc.
2. **Keep It Simple**: Complex layouts may break in some email clients
3. **Use Tables**: For layout (old-school but reliable)
4. **Inline CSS**: Always use inline styles
5. **Alt Text**: Always add alt text to images
6. **Plain Text Version**: Consider adding (currently HTML only)

## 🚨 Troubleshooting

### Email Not Sending?

1. **Check API Key:**
   ```bash
   echo $RESEND_API_KEY
   ```

2. **Check Server Logs:**
   ```bash
   # Look for email service errors
   grep "Email service error" logs
   ```

3. **Verify Environment:**
   - Is `RESEND_API_KEY` set?
   - Is `EMAIL_FROM` valid?
   - Is domain verified (for production)?

4. **Check Resend Dashboard:**
   - Go to resend.com/emails
   - Check for failed deliveries
   - View error messages

### Emails Going to Spam?

1. **Verify Domain**: Must verify SPF/DKIM
2. **Avoid Spam Words**: "Free", "Act now", excessive caps
3. **Include Unsubscribe**: Add unsubscribe link
4. **Warm Up Domain**: Start with low volume
5. **Monitor Bounce Rate**: Keep it below 5%

### PDF Not Generating?

1. **Check jsPDF Import:**
   ```typescript
   import { jsPDF } from 'jspdf';
   ```

2. **Buffer Conversion:**
   ```typescript
   Buffer.from(doc.output('arraybuffer'));
   ```

3. **Memory Issues:** Large PDFs may cause issues on serverless

## 📞 Support

### Resend Support:
- [Documentation](https://resend.com/docs)
- [Support](https://resend.com/support)
- [Community](https://resend.com/discord)

### Email Template Testing:
- [Mailtrap](https://mailtrap.io/) - Test emails without sending
- [Email on Acid](https://www.emailonacid.com/) - Preview in all clients

## 🎉 Go Live Checklist

Before going to production:

- [ ] Resend API key configured
- [ ] Domain verified in Resend
- [ ] SPF/DKIM DNS records added
- [ ] Email templates tested
- [ ] PDF generation tested
- [ ] All environment variables set
- [ ] NEXT_PUBLIC_APP_URL points to production domain
- [ ] EMAIL_FROM uses verified domain
- [ ] Rate limiting implemented (optional)
- [ ] Error monitoring setup
- [ ] Test emails sent to real addresses
- [ ] Spam score checked (use Mail Tester)
- [ ] Mobile responsiveness verified
- [ ] Unsubscribe link added (optional)
- [ ] Privacy policy updated (mention email usage)

## 📝 Pricing

### Resend Pricing:
- **Free**: 100 emails/day, 1 verified domain
- **Pro ($20/mo)**: 50,000 emails/month
- **Enterprise**: Custom pricing

**Note:** Free tier is perfect for testing and small deployments!

---

**Version:** 1.0.0  
**Last Updated:** October 28, 2025  
**Author:** Development Team

For questions or issues, please check the troubleshooting section or contact support.


