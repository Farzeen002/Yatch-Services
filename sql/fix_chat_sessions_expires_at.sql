-- Add missing expires_at column to chat_sessions table
ALTER TABLE public.chat_sessions 
ADD COLUMN IF NOT EXISTS expires_at bigint;

-- Update existing records to have expires_at set to 24 hours from now
UPDATE public.chat_sessions 
SET expires_at = EXTRACT(EPOCH FROM NOW()) * 1000 + (24 * 60 * 60 * 1000)
WHERE expires_at IS NULL;

-- Create index for expires_at for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_expires_at ON public.chat_sessions USING btree (expires_at);

