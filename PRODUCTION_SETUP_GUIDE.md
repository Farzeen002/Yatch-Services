# 🚀 PRODUCTION SETUP GUIDE

## ✅ **REAL PAYMENT LINKS - NO MORE MOCK DATA**

### **🔧 STEP 1: Get Real Razorpay Credentials**

1. **Go to Razorpay Dashboard:**

   - Visit: https://dashboard.razorpay.com/
   - Sign up/Login to your account

2. **Get API Keys:**

   - Go to **Settings** → **API Keys**
   - Click **Generate API Keys**
   - Copy your **Key ID** and **Secret Key**

3. **Add to Environment:**
   ```bash
   # Create .env.local file:
   RAZORPAY_KEY_ID=rzp_live_your_live_key_id
   RAZORPAY_KEY_SECRET=your_live_secret_key
   ```

### **🗄️ STEP 2: Set Up Database**

**Run this SQL in your Supabase SQL Editor:**

```sql
-- Copy and paste the contents of: sql/production_setup.sql
```

### **🔐 STEP 3: Configure Supabase Auth**

1. **Go to Supabase Dashboard:**

   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Enable Authentication:**

   - Go to **Authentication** → **Settings**
   - Enable **Email** authentication
   - Configure email templates

3. **Get Supabase Credentials:**

   - Go to **Settings** → **API**
   - Copy **Project URL** and **Anon Key**

4. **Add to Environment:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### **🤖 STEP 4: Configure Gemini AI**

1. **Get Gemini API Key:**

   - Visit: https://aistudio.google.com/
   - Create a new project
   - Get your API key

2. **Add to Environment:**
   ```bash
   GEMINI_API_KEY=your-gemini-api-key
   ```

### **🚀 STEP 5: Test Production System**

```bash
# Test real payment links
node test-real-payment-links.js

# Test complete production system
node test-production-real.js
```

---

## 🎯 **EXPECTED RESULTS**

### **✅ Real Payment Links Generated:**

- ✅ **Clickable Payment Button**: Blue button in chat
- ✅ **Real Razorpay URL**: `https://checkout.razorpay.com/v1/checkout.js?key_id=...&order_id=...`
- ✅ **Secure Checkout**: Real Razorpay payment page
- ✅ **Production Ready**: No mock data, real payments

### **✅ Payment Flow:**

1. **User books yacht** → Chatbot responds
2. **Payment button appears** → Clickable blue button
3. **User clicks button** → Opens Razorpay checkout
4. **User completes payment** → Real payment processed
5. **Booking confirmed** → Database updated

---

## 🧪 **TESTING PRODUCTION**

### **Test Real Payment Flow:**

1. **Start server**: `npm run dev`
2. **Open chatbot**
3. **Book yacht**: "I want to book Marina Star for 3 days"
4. **Click payment button** (should open Razorpay checkout)
5. **Complete payment** with test card: `4111 1111 1111 1111`

### **Expected Results:**

- ✅ **Payment button appears** in chat
- ✅ **Button is clickable** and opens Razorpay
- ✅ **Real payment processing** (no mock data)
- ✅ **Booking confirmation** after payment

---

## 🎉 **PRODUCTION READY!**

Your yacht booking system now has:

- ✅ **Real Razorpay Integration** (no mock data)
- ✅ **Clickable Payment Buttons** (blue buttons in chat)
- ✅ **Real Payment Processing** (actual money transactions)
- ✅ **Production Security** (RLS, audit logs)
- ✅ **Scalable Architecture** (ready for real users)

**This is now a REAL business system that can handle actual payments!** 🚢💳✨


