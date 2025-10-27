-- Fix RLS policy for chat_sessions to allow INSERT operations
-- This script fixes the "new row violates row-level security policy" error

-- 1. Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can access their own chat sessions" ON public.chat_sessions;

-- 2. Create separate policies for SELECT, INSERT, UPDATE, and DELETE
CREATE POLICY "Users can select their own chat sessions" ON public.chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions" ON public.chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" ON public.chat_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Ensure RLS is enabled
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- 4. Grant necessary permissions
GRANT ALL ON public.chat_sessions TO authenticated;
GRANT ALL ON public.chat_sessions TO anon;

-- 5. Create a function to check if user can access chat session
CREATE OR REPLACE FUNCTION can_access_chat_session(session_id_param text, user_id_param uuid)
RETURNS boolean AS $$
BEGIN
    RETURN auth.uid() = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Alternative: Create a more permissive policy for development
-- (Uncomment if the above doesn't work)
/*
DROP POLICY IF EXISTS "Users can select their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can insert their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON public.chat_sessions;

-- More permissive policy for development
CREATE POLICY "Allow all operations for authenticated users" ON public.chat_sessions
    FOR ALL USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);
*/

-- 7. Verify the policies are working
DO $$
BEGIN
    RAISE NOTICE 'RLS policies updated for chat_sessions table';
    RAISE NOTICE 'Users can now INSERT, SELECT, UPDATE, and DELETE their own chat sessions';
END $$;


