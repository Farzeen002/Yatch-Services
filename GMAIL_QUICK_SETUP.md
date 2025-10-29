# ⚡ Gmail Email Setup - 2 Minute Guide

**Perfect for internal projects - NO domain verification needed!**

---

## 📝 Quick Steps

### 1. Get Gmail App Password

Visit: **[myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**

- Select app: **Mail**
- Select device: **Other** → Type: **Yacht Services**
- Click **Generate**
- **Copy** the 16-character code

---

### 2. Update `.env.local`

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=paste-16-char-code-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Remove old Resend config:**
```env
# DELETE THESE LINES:
RESEND_API_KEY=...
EMAIL_FROM=...
```

---

### 3. Restart Server

```bash
npm run dev
```

---

### 4. Test

Make a booking → Check email → **Done!** 

---

##  Benefits

 **FREE** - Gmail's free tier (500 emails/day)
 **No domain verification** - works immediately
 **Send to anyone** - any email address
 **2 minute setup** - fast and simple

---

## 💡 Note

**First time?** You may need to:
1. Enable 2-Step Verification first
2. Then create App Password

Full guide: See `GMAIL_SETUP_GUIDE.md`

---

**That's it!** Your emails will now work with ANY recipient! 🎉


