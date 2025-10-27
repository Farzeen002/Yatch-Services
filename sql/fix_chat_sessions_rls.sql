-- Fix RLS policy for chat_sessions table
-- This allows authenticated users to manage their own chat sessions

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own chat sessions." ON public.chat_sessions;

-- Create new policy that allows authenticated users to manage their own sessions
CREATE POLICY "Users can manage their own chat sessions."
ON public.chat_sessions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Also allow service role to manage sessions (for API routes)
CREATE POLICY "Service role can manage all chat sessions."
ON public.chat_sessions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.chat_sessions TO authenticated;
GRANT ALL ON public.chat_sessions TO service_role;

-- Ensure the table exists with proper structure
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  messages JSONB DEFAULT '[]'::JSONB,
  context JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chat_sessions_pkey PRIMARY KEY (session_id, user_id)
);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON public.chat_sessions (session_id);



