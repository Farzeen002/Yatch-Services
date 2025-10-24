# Yacht Services Integration Guide

This guide covers the complete integration setup for your yacht services platform with AI chatbot, payment processing, and translation capabilities.

## 🚀 Features Implemented

### 1. AI-Powered Chatbot with Gemini

- **Yacht-specific conversations only** - Bot redirects non-yacht queries
- **Intelligent pricing estimates** - Provides cost calculations based on guest count and duration
- **Yacht recommendations** - Suggests suitable yachts based on preferences
- **Arabic translation support** - Integrated Azure Translator for Arabic queries

### 2. Razorpay Payment Integration

- **Secure payment processing** - Complete Razorpay integration
- **Payment verification** - Server-side signature verification
- **Database storage** - Payment details stored in Supabase
- **Booking confirmation** - Automatic booking status updates

### 3. Enhanced Database Schema

- **Payments table** - Complete payment tracking
- **Users table** - Extended user profiles
- **Row Level Security** - Secure data access policies

## 📁 Files Created/Modified

### New Files:

- `sql/payments_schema.sql` - Database schema for payments and users
- `app/api/payments/create-order/route.ts` - Razorpay order creation
- `app/api/payments/verify/route.ts` - Payment verification
- `components/payment-component.tsx` - Payment UI component
- `components/booking-form.tsx` - Complete booking flow
- `ENVIRONMENT_SETUP.md` - Environment configuration guide

### Modified Files:

- `app/api/chat/route.ts` - Enhanced with Gemini AI and yacht constraints
- `app/api/translate/route.ts` - Updated for Arabic-only translations
- `package.json` - Added Razorpay and Gemini AI dependencies

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyCwfirveZpYO2Gp_lEc_JsD1u47CRFIJqQ

# Azure Translator Configuration
AZURE_TRANSLATOR_KEY=your_azure_translator_key
AZURE_TRANSLATOR_REGION=your_azure_translator_region

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
```

### 2. Database Setup

Run the SQL scripts in your Supabase SQL editor:

1. **Existing schema**: `sql/yachts_schema.sql` (already exists)
2. **New payments schema**: `sql/payments_schema.sql` (run this)

### 3. Dependencies Installation

```bash
npm install razorpay @google/generative-ai --legacy-peer-deps
```

## 🤖 Chatbot Features

### Yacht-Specific Constraints

The chatbot is programmed to:

- Only respond to yacht-related queries
- Redirect non-yacht questions politely
- Provide pricing estimates based on guest count and duration
- Recommend suitable yachts based on preferences
- Handle Arabic translation requests

### Example Queries the Bot Handles:

- "What yachts are available?"
- "How much does it cost for 8 guests for 3 days?"
- "Recommend a luxury yacht for corporate event"
- "What's the price for Sea Breeze?"
- "Translate this to Arabic: I want to book a yacht"

### Example Queries the Bot Redirects:

- "What's the weather today?"
- "Tell me a joke"
- "How do I cook pasta?"
- Any non-yacht related questions

## 💳 Payment Integration

### Razorpay Flow:

1. **Order Creation**: `/api/payments/create-order`

   - Creates Razorpay order
   - Links to booking
   - Returns order details

2. **Payment Verification**: `/api/payments/verify`

   - Verifies payment signature
   - Stores payment in database
   - Updates booking status

3. **Frontend Integration**: `PaymentComponent`
   - Loads Razorpay script
   - Handles payment UI
   - Manages payment states

### Payment Data Stored:

- Razorpay payment ID, order ID, signature
- Amount, currency, payment method
- Transaction fees, refund information
- Booking and user associations
- Payment metadata

## 🌐 Translation Integration

### Arabic Translation Only:

- Azure Translator configured for Arabic target language
- Only processes translation requests in chatbot context
- Returns translated text with source language detection
- Handles errors gracefully

## 🧪 Testing the Integration

### 1. Test Chatbot

```bash
# Start the development server
npm run dev

# Test yacht-related queries
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What yachts are available?"}'

# Test non-yacht query (should redirect)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the weather today?"}'
```

### 2. Test Payment Flow

1. Create a booking through the UI
2. Proceed to payment step
3. Use Razorpay test credentials
4. Verify payment is stored in database

### 3. Test Translation

```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "I want to book a yacht"}'
```

## 🔒 Security Features

### Database Security:

- Row Level Security (RLS) enabled
- Users can only access their own data
- Service role has full access for admin operations

### Payment Security:

- Server-side signature verification
- Secure API key handling
- Payment data encryption in database

### API Security:

- Input validation on all endpoints
- Error handling without sensitive data exposure
- Rate limiting considerations

## 📊 Monitoring and Logging

### Key Metrics to Monitor:

- Chatbot response times
- Payment success rates
- Translation accuracy
- Database query performance

### Logging Points:

- Payment verification attempts
- Chatbot query processing
- Translation requests
- Database operations

## 🚨 Troubleshooting

### Common Issues:

1. **Gemini AI not responding**

   - Check API key configuration
   - Verify internet connectivity
   - Check API quota limits

2. **Payment verification failing**

   - Verify Razorpay credentials
   - Check signature generation
   - Ensure proper webhook configuration

3. **Translation not working**

   - Check Azure Translator credentials
   - Verify region configuration
   - Check API quota

4. **Database connection issues**
   - Verify Supabase credentials
   - Check RLS policies
   - Ensure proper table permissions

## 📈 Future Enhancements

### Potential Improvements:

1. **Real-time yacht availability** - Connect to actual yacht database
2. **Advanced AI features** - Image recognition for yacht selection
3. **Multi-language support** - Expand beyond Arabic
4. **Payment analytics** - Dashboard for payment insights
5. **Booking management** - Admin panel for booking oversight

## 📞 Support

For technical support or questions about the integration:

1. Check the environment configuration
2. Verify all API keys are correct
3. Test individual components separately
4. Review the console logs for errors

---

**Note**: This integration provides a complete yacht booking platform with AI assistance, secure payments, and translation capabilities. All components are designed to work together seamlessly while maintaining security and performance standards.

