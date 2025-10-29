# 📧 Gmail Email Setup - Quick & Free!

**Perfect for internal projects - NO domain verification needed!**

---

## 🚀 Setup (5 Minutes)

### Step 1: Create Gmail App Password

1. **Go to Google Account:**
   - Visit [myaccount.google.com](https://myaccount.google.com)
   - Sign in with your Gmail account

2. **Enable 2-Step Verification** (if not already enabled):
   - Click **Security** (left sidebar)
   - Scroll to "How you sign in to Google"
   - Click **2-Step Verification**
   - Follow the setup steps
   - Click **Turn On**

3. **Create App Password:**
   - Stay in **Security** section
   - Scroll down to "2-Step Verification"
   - Click **App passwords**
   - You may need to sign in again
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter name: **Yacht Services**
   - Click **Generate**
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

---

### Step 2: Update `.env.local`

Replace Resend config with Gmail config:

```env
# Gmail Configuration (FREE - No domain verification!)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Example:**
```env
GMAIL_USER=reena@infomaticscorp.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Remove these lines** (not needed anymore):
```env
# DELETE THESE:
RESEND_API_KEY=...
EMAIL_FROM=...
```

---

### Step 3: Restart Your Server

```bash
# Press Ctrl+C to stop the server
npm run dev
```

---

### Step 4: Test It!

1. **Make a booking** (use ANY email address!)
2. **Complete payment**
3. **Check the recipient's inbox** 📧

You'll receive:
-  Payment Confirmation (with PDF receipt)
-  Booking Confirmation (with PDF summary)

**Works with ANY email** - no restrictions! 🎉

---

##  Advantages

### Gmail vs Resend:

| Feature | Gmail | Resend Free |
|---------|-------|-------------|
| Domain verification | ❌ **Not needed** |  Required |
| Send to anyone |  **Yes** | ❌ Only your email |
| Setup time | 5 minutes | 30+ minutes |
| Emails/day | 500 free | 100 |
| Cost | **FREE** | FREE |
| Best for | Internal projects | Production |

---

## 📊 Gmail Limits

- **Free Gmail:** 500 emails/day
- **Google Workspace:** 2,000 emails/day
- More than enough for internal projects!

---

## 🔒 Security

-  App password is separate from your main password
-  Can be revoked anytime
-  Specific to this application
-  Doesn't expose your real password

---

## 🆘 Troubleshooting

### Issue: "Invalid login"

**Solution:**
- Make sure 2-Step Verification is enabled
- Generate a new App Password
- Copy it exactly (remove spaces if any)
- Update `.env.local`
- Restart server

### Issue: "Less secure app access"

**Solution:**
- Don't use "less secure apps"
- Use **App Passwords** instead (more secure!)
- Follow Step 1 above

### Issue: Emails not sending

**Solution:**
1. Check GMAIL_USER is correct
2. Check GMAIL_APP_PASSWORD is correct (16 characters)
3. Check `.env.local` file is in project root
4. Restart server
5. Check console for errors

---

## 🎨 Customize Email Sender Name

The emails will show as:
```
From: Yacht Services <your-email@gmail.com>
```

To change the display name, edit `lib/email-service.ts`:

```typescript
from: `"Your Company Name" <${process.env.GMAIL_USER}>`,
```

---

##  Testing Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated
- [ ] GMAIL_USER added to `.env.local`
- [ ] GMAIL_APP_PASSWORD added to `.env.local`
- [ ] Server restarted
- [ ] Test booking made
- [ ] Emails received successfully
- [ ] PDFs attached to emails

---

## 📝 Complete `.env.local` Example

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gmail Email Service (FREE!)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Razorpay (optional)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

---

## 🎉 You're Done!

Your email system now works with Gmail - completely free, no domain verification, and sends to anyone!

Perfect for internal projects! 🚀

---

**Questions?** Check the console for error messages or contact your team.


