-- Add missing payment fields to bookings table
-- Run this SQL in your Supabase SQL Editor if you're getting "column does not exist" errors

-- Add payment_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'payment_id'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN payment_id VARCHAR(255);
    COMMENT ON COLUMN public.bookings.payment_id IS 'Payment transaction ID from payment gateway';
  END IF;
END $$;

-- Add payment_mode column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'payment_mode'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN payment_mode VARCHAR(50) DEFAULT 'online';
    COMMENT ON COLUMN public.bookings.payment_mode IS 'Payment mode: online, cash, bank_transfer, etc.';
  END IF;
END $$;

-- Add payment_status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending' 
      CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'));
    COMMENT ON COLUMN public.bookings.payment_status IS 'Payment status: pending, completed, failed, or refunded';
  END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Ensure created_at exists (should already exist but just in case)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Create or replace the update trigger for updated_at
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;

CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON public.bookings USING btree (payment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings USING btree (payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings USING btree (created_at DESC);

-- Display confirmation
DO $$ 
BEGIN
  RAISE NOTICE 'Migration completed successfully! All booking payment fields are now available.';
END $$;

