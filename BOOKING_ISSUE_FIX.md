# 🔧 Fixing "No Bookings" Issue

## Quick Diagnosis

Your chatbot says you have no bookings, but you know they exist in the database. This is **99% likely a User ID mismatch**.

## What's Happening

Your database schema has:
- `bookings.user_id` → references `auth.users(id)` (Supabase Auth)
- When you log in, Supabase creates a user in `auth.users` table
- Your bookings might have a **different** `user_id` than your current logged-in user

## Quick Fix (5 Minutes)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the left sidebar
3. Open the file: `sql/diagnose_bookings.sql`
4. Or create a new query

### Step 2: Run This Query

```sql
-- Find YOUR user ID
SELECT id, email FROM auth.users WHERE email = 'YOUR-EMAIL@example.com';
-- COPY the ID that appears

-- Find bookings and their user_ids  
SELECT id, user_id, start_date, end_date FROM bookings;
-- Compare the user_id with your ID from above
```

### Step 3: Do They Match?

**If YES** ✅ → Problem is elsewhere (check RLS below)  
**If NO** ❌ → Continue to Step 4

### Step 4: Update Bookings to Your User ID

```sql
-- Replace BOTH placeholders with values from Step 2
UPDATE bookings 
SET user_id = 'YOUR-USER-ID-FROM-AUTH-USERS'
WHERE user_id = 'OLD-USER-ID-FROM-BOOKINGS';

-- Verify it worked:
SELECT id, user_id FROM bookings;
```

### Step 5: Test in Chatbot

1. Restart your dev server: `npm run dev`
2. Log in to your app
3. Open chatbot
4. Type: "view my bookings"
5. Should now show your bookings! 🎉

## Alternative: You're the Only User?

If you're the only user in the system, this is even easier:

```sql
-- Update ALL bookings to your user
UPDATE bookings 
SET user_id = (SELECT id FROM auth.users WHERE email = 'YOUR-EMAIL@example.com');

-- Verify:
SELECT COUNT(*) FROM bookings 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR-EMAIL@example.com');
```

## Still Not Working? Check RLS

Row Level Security might be blocking access:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'bookings';

-- If rowsecurity = true, temporarily disable it:
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Test again in chatbot
```

**For production**, create proper RLS policies:

```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own bookings
CREATE POLICY "Users can view own bookings" 
ON bookings FOR SELECT 
USING (auth.uid() = user_id);
```

## Debug with Logs

I've added extensive logging. After typing "view my bookings", check your terminal:

```
[fetchUserBookings] Fetching bookings for userId: abc-123-def
[GET /api/bookings] Auth check - User: abc-123-def Error: null
[GET /api/bookings] Fetching bookings for user_id: abc-123-def
[GET /api/bookings] Found 0 bookings for user abc-123-def
[GET /api/bookings] Sample user_ids in bookings: [xyz-456-ghi, ...]
```

**Compare:**
- **User abc-123-def** (logged in user)
- **vs xyz-456-ghi** (user_id in bookings)

If different → That's your problem! Use SQL fix above.

## Common Scenarios

### Scenario 1: Created Bookings Before Setting Up Auth
- Bookings have random/null user_ids
- Fix: Update them to your current auth user ID

### Scenario 2: Multiple Test Accounts
- Created bookings with one account
- Logged in with different account
- Fix: Log in with the original account, OR update bookings

### Scenario 3: Imported Data
- Imported bookings from elsewhere
- user_ids don't match auth.users
- Fix: Update to match your auth user ID

## Complete Diagnostic Script

I've created a complete SQL script at:
**`sql/diagnose_bookings.sql`**

Run it step-by-step in Supabase SQL Editor. It will:
1. ✅ Show your current user ID
2. ✅ Show all bookings and their user_ids
3. ✅ Check if they match
4. ✅ Find orphaned bookings
5. ✅ Provide fix queries (commented out)
6. ✅ Check RLS status
7. ✅ Verify after fixes

## Expected Result After Fix

```
You: "view my bookings"

AI: "You have 3 bookings:

1. Ocean Majesty in London
   December 15-20, 2024
   8 guests, $15,000
   Status: Confirmed
   Payment: Paid

2. Eclipse in Monaco  
   January 5-10, 2025
   12 guests, $18,000
   Status: Pending
   Payment: Pending

Would you like details on any of these?"

[Shows beautiful booking cards]
```

## Quick Checklist

After applying the fix:

- [ ] Ran SQL query to find your user ID
- [ ] Found bookings' user_ids
- [ ] Compared them (do they match?)
- [ ] Updated bookings to your user ID
- [ ] Verified update worked
- [ ] Restarted dev server
- [ ] Logged in to app
- [ ] Tested "view my bookings" in chatbot
- [ ] Bookings now appear! 🎉

## Still Stuck?

Share these outputs:

1. **Your user ID:**
   ```sql
   SELECT id FROM auth.users WHERE email = 'your-email';
   ```

2. **Booking user_ids:**
   ```sql
   SELECT DISTINCT user_id FROM bookings;
   ```

3. **Terminal logs** after typing "view my bookings"

With these, I can tell you exactly what's wrong!

---

**TL;DR:**
1. Run `sql/diagnose_bookings.sql` in Supabase
2. Update bookings to your user ID
3. Restart server
4. Test chatbot
5. Done! ✅

