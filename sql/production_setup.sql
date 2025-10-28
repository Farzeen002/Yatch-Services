-- PRODUCTION DATABASE SETUP
-- Run this in your Supabase SQL Editor to set up production tables

-- 1. Create chat_sessions table with proper RLS
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  messages JSONB DEFAULT '[]'::JSONB,
  context JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chat_sessions_pkey PRIMARY KEY (session_id, user_id)
);

-- 2. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL,
  user_id uuid NOT NULL,
  yacht_id uuid NOT NULL,
  razorpay_order_id text NOT NULL,
  razorpay_payment_id text,
  razorpay_signature text,
  amount numeric(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  receipt_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings (id) ON DELETE CASCADE,
  CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT payments_yacht_id_fkey FOREIGN KEY (yacht_id) REFERENCES public.yachts (id) ON DELETE CASCADE
);

-- 3. Create receipts table
CREATE TABLE IF NOT EXISTS public.receipts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL,
  payment_id uuid NOT NULL,
  user_id uuid NOT NULL,
  receipt_number text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'generated',
  email_sent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT receipts_pkey PRIMARY KEY (id),
  CONSTRAINT receipts_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings (id) ON DELETE CASCADE,
  CONSTRAINT receipts_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments (id) ON DELETE CASCADE,
  CONSTRAINT receipts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- 4. Create audit logs table
CREATE TABLE IF NOT EXISTS public.payment_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_id uuid,
  booking_id uuid,
  user_id uuid,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payment_audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT payment_audit_logs_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments (id) ON DELETE SET NULL,
  CONSTRAINT payment_audit_logs_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings (id) ON DELETE SET NULL,
  CONSTRAINT payment_audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE SET NULL
);

-- 5. Enable RLS on all tables
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies
-- Chat sessions policy
CREATE POLICY "Users can manage their own chat sessions" ON public.chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Payments policy
CREATE POLICY "Users can access their own payments" ON public.payments
  FOR ALL USING (auth.uid() = user_id);

-- Receipts policy
CREATE POLICY "Users can access their own receipts" ON public.receipts
  FOR ALL USING (auth.uid() = user_id);

-- Audit logs policy
CREATE POLICY "Users can access their own audit logs" ON public.payment_audit_logs
  FOR ALL USING (auth.uid() = user_id);

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON public.receipts (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_user_id ON public.payment_audit_logs (user_id);

-- 8. Create functions for production
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS text AS $$
BEGIN
  RETURN 'RCP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('receipt_sequence')::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS receipt_sequence START 1;

-- 9. Create function to log payment events
CREATE OR REPLACE FUNCTION log_payment_event(
  p_payment_id uuid,
  p_booking_id uuid,
  p_user_id uuid,
  p_event_type text,
  p_event_data jsonb DEFAULT '{}',
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.payment_audit_logs (
    payment_id, booking_id, user_id, event_type, event_data, ip_address, user_agent
  ) VALUES (
    p_payment_id, p_booking_id, p_user_id, p_event_type, p_event_data, p_ip_address, p_user_agent
  );
END;
$$ LANGUAGE plpgsql;

-- 10. Grant necessary permissions
GRANT ALL ON public.chat_sessions TO authenticated;
GRANT ALL ON public.payments TO authenticated;
GRANT ALL ON public.receipts TO authenticated;
GRANT ALL ON public.payment_audit_logs TO authenticated;



