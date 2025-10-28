-- Enhanced payment schema that works with your existing bookings table
-- This extends your current schema with payment tracking

-- Payment records table (extends your existing bookings)
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
) TABLESPACE pg_default;

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments USING btree (booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments USING btree (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON public.payments USING btree (razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments USING btree (status);

-- RLS Policies for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own payments" ON public.payments
  FOR ALL USING (auth.uid() = user_id);

-- Receipts table for payment confirmations
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
) TABLESPACE pg_default;

-- Indexes for receipts
CREATE INDEX IF NOT EXISTS idx_receipts_booking_id ON public.receipts USING btree (booking_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payment_id ON public.receipts USING btree (payment_id);
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON public.receipts USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_receipt_number ON public.receipts USING btree (receipt_number);

-- RLS Policies for receipts
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own receipts" ON public.receipts
  FOR ALL USING (auth.uid() = user_id);

-- Audit logs for payment events
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
) TABLESPACE pg_default;

-- Indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_payment_id ON public.payment_audit_logs USING btree (payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_booking_id ON public.payment_audit_logs USING btree (booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_user_id ON public.payment_audit_logs USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_event_type ON public.payment_audit_logs USING btree (event_type);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_created_at ON public.payment_audit_logs USING btree (created_at);

-- RLS Policies for audit logs
ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own audit logs" ON public.payment_audit_logs
  FOR ALL USING (auth.uid() = user_id);

-- Function to generate receipt numbers
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS text AS $$
BEGIN
  RETURN 'RCP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('receipt_sequence')::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for receipt numbers
CREATE SEQUENCE IF NOT EXISTS receipt_sequence START 1;

-- Function to update booking status based on payment
CREATE OR REPLACE FUNCTION update_booking_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update booking status based on payment status
  IF NEW.status = 'paid' THEN
    UPDATE public.bookings 
    SET status = 'confirmed', updated_at = NOW()
    WHERE id = NEW.booking_id;
  ELSIF NEW.status = 'failed' THEN
    UPDATE public.bookings 
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = NEW.booking_id;
  ELSIF NEW.status = 'refunded' THEN
    UPDATE public.bookings 
    SET status = 'refunded', updated_at = NOW()
    WHERE id = NEW.booking_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update booking status when payment status changes
CREATE TRIGGER update_booking_status_trigger
  AFTER UPDATE OF status ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_status();

-- Function to log payment events
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



