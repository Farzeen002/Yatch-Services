-- =====================================================
-- BOOKINGS DIAGNOSTIC & FIX SCRIPT
-- Run this in Supabase SQL Editor to diagnose the issue
-- =====================================================

-- STEP 1: Check your current logged-in user
-- Replace 'your-email@example.com' with your actual email
SELECT 
  'YOUR AUTH USER ID' as info,
  id as user_id,
  email,
  created_at
FROM auth.users 
WHERE email = 'your-email@example.com';  -- CHANGE THIS!

-- STEP 2: Check all bookings and their user_ids
SELECT 
  'EXISTING BOOKINGS' as info,
  b.id as booking_id,
  b.user_id,
  b.start_date,
  b.end_date,
  b.status,
  y.name as yacht_name
FROM bookings b
LEFT JOIN yachts y ON b.yacht_id = y.id
ORDER BY b.created_at DESC;

-- STEP 3: Check if user_ids match
SELECT 
  'MATCH CHECK' as info,
  b.id as booking_id,
  b.user_id as booking_user_id,
  u.id as auth_user_id,
  u.email as auth_user_email,
  CASE 
    WHEN b.user_id = u.id THEN '✅ MATCH'
    ELSE '❌ MISMATCH'
  END as status
FROM bookings b
LEFT JOIN auth.users u ON b.user_id = u.id;

-- STEP 4: Find orphaned bookings (bookings with no matching auth user)
SELECT 
  'ORPHANED BOOKINGS' as info,
  b.*
FROM bookings b
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id = b.user_id
);

-- =====================================================
-- FIX OPTION 1: Update specific bookings to your user ID
-- =====================================================
-- Uncomment and run AFTER checking steps above

/*
-- First, get your user ID from Step 1, then:
UPDATE bookings 
SET user_id = 'PASTE-YOUR-USER-ID-HERE'  -- From Step 1
WHERE user_id = 'OLD-USER-ID-FROM-STEP-2';  -- From Step 2

-- Verify the update:
SELECT id, user_id, start_date, end_date 
FROM bookings 
WHERE user_id = 'PASTE-YOUR-USER-ID-HERE';
*/

-- =====================================================
-- FIX OPTION 2: Update ALL bookings to your user ID
-- (Use if you're the only user in the system)
-- =====================================================
-- Uncomment and run AFTER checking steps above

/*
UPDATE bookings 
SET user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'  -- CHANGE THIS!
);

-- Verify the update:
SELECT 
  COUNT(*) as total_bookings,
  user_id
FROM bookings
GROUP BY user_id;
*/

-- =====================================================
-- CHECK ROW LEVEL SECURITY (RLS)
-- =====================================================
SELECT 
  'RLS STATUS' as info,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'bookings';

-- Check RLS policies
SELECT 
  'RLS POLICIES' as info,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'bookings';

-- =====================================================
-- DISABLE RLS (if needed for testing)
-- =====================================================
-- Uncomment to disable RLS temporarily

/*
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
*/

-- =====================================================
-- CREATE PROPER RLS POLICY
-- =====================================================
-- Uncomment to create a policy that allows users to see their own bookings

/*
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Create new policies
CREATE POLICY "Users can view own bookings" 
ON bookings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" 
ON bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" 
ON bookings FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow admins to see all bookings
CREATE POLICY "Admins can view all bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role_type = 'admin'
  )
);
*/

-- =====================================================
-- FINAL VERIFICATION
-- =====================================================
-- Run this after applying fixes to verify everything works

SELECT 
  'FINAL CHECK' as info,
  b.id as booking_id,
  u.email as user_email,
  b.start_date,
  b.end_date,
  b.status,
  y.name as yacht_name,
  '✅ All Good!' as status
FROM bookings b
JOIN auth.users u ON b.user_id = u.id
JOIN yachts y ON b.yacht_id = y.id
ORDER BY b.created_at DESC;

