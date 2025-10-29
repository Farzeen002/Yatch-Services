# Help & Support Feature Documentation

## Overview

The Help & Support feature allows users to submit support requests directly from their booking details. This feature provides a structured way for customers to report issues, request cancellations, refunds, modifications, or get help with payment problems.

## Features Implemented

### 1. **User Interface Components**
-  Help & Support button in booking details modal
-  Multi-step dialog with issue type selection
-  Context-aware forms based on issue type
-  Success confirmation screen
-  Responsive design with modern UI

### 2. **Issue Types Supported**

#### 🚫 Cancel Booking
Request cancellation for a booking with reason explanation.

#### 💰 Request Refund
Submit refund requests with detailed justification.

#### 📅 Modify Booking
Request changes to booking dates, guest count, or other details.

#### 💳 Payment Issue
Report payment or billing problems.

#### ❓ Other Issue
General support for any other concerns or questions.

### 3. **Backend Implementation**
-  Secure API endpoint (`/api/support`)
-  User authentication verification
-  Booking ownership validation
-  Database storage with full audit trail
-  Row Level Security (RLS) policies

## Setup Instructions

### Step 1: Database Setup

Run the SQL migration to create the `support_requests` table:

```bash
# Navigate to Supabase SQL Editor
# Copy and paste the contents of: sql/support_requests_schema.sql
```

Or run this SQL directly:

```sql
-- See sql/support_requests_schema.sql for complete schema
```

### Step 2: Verify Environment Variables

Ensure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Test the Feature

1. Navigate to `/user` (user bookings page)
2. Click "View Details" on any booking
3. Click "Help & Support" button
4. Select an issue type
5. Provide details
6. Submit request

## Database Schema

### Table: `support_requests`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `booking_id` | UUID | Foreign key to bookings |
| `yacht_name` | VARCHAR(255) | Name of the yacht |
| `issue_type` | VARCHAR(50) | Type of issue (cancel, refund, modification, payment, other) |
| `issue_details` | TEXT | Detailed description of the issue |
| `user_email` | VARCHAR(255) | User's email for contact |
| `user_name` | VARCHAR(255) | User's full name |
| `status` | VARCHAR(50) | Request status (pending, in_progress, resolved, closed) |
| `admin_response` | TEXT | Admin's response (optional) |
| `resolved_at` | TIMESTAMP | When the issue was resolved |
| `created_at` | TIMESTAMP | Request creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Indexes

- `idx_support_requests_user_id` - Fast user lookup
- `idx_support_requests_booking_id` - Fast booking lookup
- `idx_support_requests_status` - Filter by status
- `idx_support_requests_issue_type` - Filter by issue type
- `idx_support_requests_created_at` - Sort by date

### Row Level Security (RLS)

-  Users can only view their own support requests
-  Users can create support requests
-  Users can update their own support requests
-  Admin policies can be added separately

## API Endpoints

### POST `/api/support`

Submit a new support request.

**Request Body:**
```json
{
  "bookingId": "uuid",
  "yachtName": "Luxury Yacht Name",
  "issueType": "cancel | refund | modification | payment | other",
  "issueDetails": "Detailed description of the issue",
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Support request submitted successfully",
  "supportRequest": { ... }
}
```

### GET `/api/support`

Retrieve all support requests for the authenticated user.

**Response:**
```json
{
  "success": true,
  "supportRequests": [
    {
      "id": "uuid",
      "booking_id": "uuid",
      "yacht_name": "Luxury Yacht",
      "issue_type": "cancel",
      "issue_details": "...",
      "status": "pending",
      "created_at": "2025-10-28T12:00:00Z"
    }
  ]
}
```

## User Flow

1. **Access Support**
   - User navigates to bookings page
   - Opens booking details modal
   - Clicks "Help & Support" button

2. **Select Issue Type**
   - User presented with 5 issue type options
   - Each option has clear description
   - Visual icons for better UX

3. **Provide Details**
   - Form appears based on selected issue type
   - Context-aware placeholder text
   - Required field validation

4. **Submit Request**
   - Form validation
   - API call to create support request
   - Success confirmation displayed

5. **Confirmation**
   - Success message shown
   - User notified that support will contact them
   - Modal auto-closes after 2 seconds

## Files Modified/Created

### Created Files:
- `Yatch-Services/app/api/support/route.ts` - Support API endpoint
- `Yatch-Services/sql/support_requests_schema.sql` - Database schema
- `Yatch-Services/HELP_SUPPORT_FEATURE.md` - This documentation

### Modified Files:
- `Yatch-Services/app/user/page.tsx` - Added Help & Support UI components

## Future Enhancements

### Recommended Features:
1. **Email Notifications**
   - Send confirmation email to user
   - Notify support team of new requests
   - Use SendGrid, Resend, or Nodemailer

2. **Admin Dashboard**
   - View all support requests
   - Filter by status, type, date
   - Add admin responses
   - Update request status
   - Analytics and reporting

3. **Real-time Updates**
   - WebSocket integration for status updates
   - Push notifications
   - In-app notification center

4. **Automated Responses**
   - AI-powered initial responses
   - FAQ integration
   - Chatbot for common issues

5. **Priority System**
   - Mark urgent requests
   - SLA tracking
   - Escalation workflows

6. **File Attachments**
   - Allow users to upload screenshots
   - Support for multiple file types
   - Secure file storage

## Security Considerations

-  User authentication required
-  Booking ownership verified
-  RLS policies prevent unauthorized access
-  Input validation and sanitization
-  SQL injection protection via Supabase client
-  CORS and CSRF protection

## Testing Checklist

- [ ] User can access Help & Support from booking details
- [ ] All 5 issue types display correctly
- [ ] Form validation works properly
- [ ] API creates support request in database
- [ ] User can only view their own requests
- [ ] Success message displays after submission
- [ ] Modal closes properly
- [ ] Database constraints work (RLS, foreign keys)
- [ ] Error handling works for edge cases
- [ ] Mobile responsive design verified

## Troubleshooting

### Issue: "Failed to submit support request"
**Solution:** 
1. Check database connection
2. Verify `support_requests` table exists
3. Check RLS policies are enabled
4. Verify user is authenticated

### Issue: "Booking not found or access denied"
**Solution:**
1. Verify booking belongs to user
2. Check booking ID is valid UUID
3. Ensure user is logged in

### Issue: Table does not exist
**Solution:**
Run the SQL migration in `sql/support_requests_schema.sql`

## Support

For questions or issues with this feature, please contact the development team or refer to the main project documentation.

---

**Version:** 1.0.0  
**Last Updated:** October 28, 2025  
**Author:** AI Development Team

