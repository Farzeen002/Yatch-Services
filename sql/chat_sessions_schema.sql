-- Chat Sessions Table for storing conversation history
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid NOT NULL,
  messages jsonb DEFAULT '[]'::jsonb,
  context jsonb DEFAULT '{}'::jsonb,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  expires_at bigint,
  CONSTRAINT chat_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT chat_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON public.chat_sessions USING btree (session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON public.chat_sessions USING btree (updated_at);

-- RLS Policies
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own chat sessions
CREATE POLICY "Users can access their own chat sessions" ON public.chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Yacht Payments Table for storing payment details
CREATE TABLE IF NOT EXISTS public.yacht_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  yacht_id uuid,
  booking_id uuid,
  payment_id text NOT NULL,
  razorpay_order_id text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT yacht_payments_pkey PRIMARY KEY (id),
  CONSTRAINT yacht_payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT yacht_payments_yacht_id_fkey FOREIGN KEY (yacht_id) REFERENCES public.yachts (id) ON DELETE SET NULL,
  CONSTRAINT yacht_payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings (id) ON DELETE SET NULL
) TABLESPACE pg_default;

-- Indexes for yacht_payments
CREATE INDEX IF NOT EXISTS idx_yacht_payments_user_id ON public.yacht_payments USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_yacht_payments_payment_id ON public.yacht_payments USING btree (payment_id);
CREATE INDEX IF NOT EXISTS idx_yacht_payments_razorpay_order_id ON public.yacht_payments USING btree (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_yacht_payments_status ON public.yacht_payments USING btree (status);

-- RLS Policies for yacht_payments
ALTER TABLE public.yacht_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own payments" ON public.yacht_payments
  FOR ALL USING (auth.uid() = user_id);

-- Function to clean up old chat sessions (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_chat_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.chat_sessions 
  WHERE updated_at < (EXTRACT(EPOCH FROM NOW()) - 2592000) * 1000; -- 30 days in milliseconds
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = EXTRACT(EPOCH FROM NOW()) * 1000;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_sessions_updated_at();



