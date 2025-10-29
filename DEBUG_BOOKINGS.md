# 🔍 Debugging Bookings Issue

## Problem
Chatbot says "no bookings" even though bookings exist in the database.

## Possible Causes

### 1. User ID Mismatch
**Most Likely Issue:**
- Your `bookings.user_id` references `auth.users(id)` (Supabase Auth table)
- The logged-in user's `auth.users.id` might not match the `user_id` in your bookings

**To Check:**
```sql
-- In Supabase SQL Editor:

-- 1. Check current logged-in user's ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- 2. Check user_ids in bookings table
SELECT DISTINCT user_id FROM bookings;

-- 3. Check if they match
SELECT 
  b.*,
  u.email
FROM bookings b
LEFT JOIN auth.users u ON b.user_id = u.id;
```

### 2. Row Level Security (RLS)
Supabase RLS might be blocking the query.

**To Check:**
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookings';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'bookings';
```

### 3. Authentication Not Working
Cookies might not be sent properly from the chatbot.

## How to Debug

### Step 1: Check Server Logs

After you type "view my bookings" in the chatbot, check your terminal/console for these logs:

```
[fetchUserBookings] Fetching bookings for userId: xxx-xxx-xxx
[fetchUserBookings] Response status: 200
[fetchUserBookings] Received bookings: 0 bookings
[GET /api/bookings] Auth check - User: xxx-xxx-xxx Error: null
[GET /api/bookings] Fetching bookings for user_id: xxx-xxx-xxx
[GET /api/bookings] Found 0 bookings for user xxx-xxx-xxx
[GET /api/bookings] Total bookings in DB (sample): X
[GET /api/bookings] Sample user_ids in bookings: [...]
```

### Step 2: Compare User IDs

Look at the logs and compare:
- **Logged-in user ID:** From `[GET /api/bookings] Auth check - User: XXX`
- **Bookings user IDs:** From `[GET /api/bookings] Sample user_ids in bookings: [YYY, ZZZ]`

**If they DON'T match:** That's your problem!

## Solutions

### Solution 1: User ID Mismatch - Update Existing Bookings

If your bookings have the wrong user_id, update them:

```sql
-- First, find your correct auth user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
-- Copy the ID (let's call it NEW_USER_ID)

-- Then update your bookings
UPDATE bookings 
SET user_id = 'NEW_USER_ID'  -- Replace with actual UUID
WHERE user_id = 'OLD_USER_ID';  -- Replace with old UUID

-- Or update ALL bookings if you're the only user:
UPDATE bookings 
SET user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

### Solution 2: Disable RLS Temporarily (for testing)

```sql
-- Disable RLS on bookings table
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- OR create a policy that allows users to see their own bookings
CREATE POLICY "Users can view own bookings" 
ON bookings FOR SELECT 
USING (auth.uid() = user_id);
```

### Solution 3: Create Test Booking

Create a new booking with the correct user_id to test:

```sql
-- Get your current user ID
SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Create a test booking
INSERT INTO bookings (
  yacht_id,
  user_id,
  start_date,
  end_date,
  guests,
  total_price,
  status,
  payment_status
) VALUES (
  (SELECT id FROM yachts LIMIT 1),  -- Uses first yacht
  (SELECT id FROM auth.users WHERE email = 'your-email@example.com'),
  '2024-12-15',
  '2024-12-20',
  8,
  15000.00,
  'confirmed',
  'completed'
);
```

## Quick Diagnostic Query

Run this in Supabase SQL Editor:

```sql
-- This will show you everything you need to know
SELECT 
  'Auth Users' as table_name,
  COUNT(*) as count,
  array_agg(DISTINCT id::text) as ids,
  array_agg(DISTINCT email) as emails
FROM auth.users

UNION ALL

SELECT 
  'Bookings' as table_name,
  COUNT(*) as count,
  array_agg(DISTINCT user_id::text) as user_ids,
  NULL as emails
FROM bookings

UNION ALL

SELECT 
  'Matched Bookings' as table_name,
  COUNT(*) as count,
  array_agg(DISTINCT b.user_id::text) as user_ids,
  array_agg(DISTINCT u.email) as emails
FROM bookings b
JOIN auth.users u ON b.user_id = u.id;
```

**Interpretation:**
- **Row 1:** Shows all auth users and their IDs
- **Row 2:** Shows all user_ids in bookings
- **Row 3:** Shows matched bookings (should match Row 2 if everything is correct)

If Row 3 count = 0, you have a mismatch!

## Expected Behavior

**When working correctly:**
1. User types "view my bookings"
2. Logs show: `[fetchUserBookings] Fetching bookings for userId: abc-123`
3. Logs show: `[GET /api/bookings] Found 3 bookings for user abc-123`
4. Chatbot displays 3 booking cards
5. No "You don't have any bookings yet" message

## Test After Fix

1. Run the SQL fix above
2. Restart your dev server: `npm run dev`
3. Login to your app
4. Open chatbot
5. Type: "view my bookings"
6. Check terminal logs
7. Should see your bookings!

## Common Mistakes

❌ **Wrong table:** Using `public.users` instead of `auth.users`
- `bookings.user_id` → `auth.users.id` (correct)
- `bookings.user_id` → `public.users.id` (wrong)

❌ **Multiple accounts:** Logged in with different email than bookings
- Check: `SELECT email FROM auth.users WHERE id = 'user_id_from_logs'`

❌ **RLS blocking:** Row Level Security preventing access
- Check: `SELECT * FROM pg_policies WHERE tablename = 'bookings'`

## Next Steps

1. **Check logs** - Run "view my bookings" and read terminal output
2. **Run diagnostic query** - Use the SQL query above
3. **Compare user IDs** - See if they match
4. **Apply fix** - Update user_ids if needed
5. **Test** - Try again

---

**Need Help?**
Share the output from:
1. Terminal logs (after typing "view my bookings")
2. The diagnostic SQL query results
3. Your current user's email

I can then tell you exactly what's wrong!

