-- Sliding Window Memory Schema
-- Add TTL support to chat_sessions table

-- Add expires_at column for TTL
ALTER TABLE public.chat_sessions 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for TTL cleanup
CREATE INDEX IF NOT EXISTS idx_chat_sessions_expires_at 
ON public.chat_sessions (expires_at);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.chat_sessions 
  WHERE expires_at < NOW();
  
  RAISE NOTICE 'Cleaned up expired chat sessions';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired sessions (runs every hour)
-- Note: This requires pg_cron extension to be enabled
-- SELECT cron.schedule('cleanup-expired-sessions', '0 * * * *', 'SELECT cleanup_expired_sessions();');

-- Manual cleanup function (call this periodically)
CREATE OR REPLACE FUNCTION manual_cleanup_expired_sessions()
RETURNS TABLE(deleted_count bigint) AS $$
DECLARE
  deleted_count bigint;
BEGIN
  DELETE FROM public.chat_sessions 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN QUERY SELECT deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Update existing sessions to have TTL
UPDATE public.chat_sessions 
SET expires_at = NOW() + INTERVAL '24 hours'
WHERE expires_at IS NULL;

-- Add constraint to ensure expires_at is set
ALTER TABLE public.chat_sessions 
ALTER COLUMN expires_at SET NOT NULL;

-- Add default value for new sessions
ALTER TABLE public.chat_sessions 
ALTER COLUMN expires_at SET DEFAULT NOW() + INTERVAL '24 hours';



