-- Support Requests table schema for Help & Support feature
-- Run this SQL in your Supabase SQL editor

-- Create support_requests table
CREATE TABLE IF NOT EXISTS public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  booking_id UUID NOT NULL,
  yacht_name VARCHAR(255) NOT NULL,
  issue_type VARCHAR(50) NOT NULL CHECK (issue_type IN ('cancel', 'refund', 'modification', 'payment', 'other')),
  issue_details TEXT NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  admin_response TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT support_requests_pkey PRIMARY KEY (id),
  CONSTRAINT support_requests_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT support_requests_booking_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings (id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_support_requests_user_id ON public.support_requests USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_booking_id ON public.support_requests USING btree (booking_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_status ON public.support_requests USING btree (status);
CREATE INDEX IF NOT EXISTS idx_support_requests_issue_type ON public.support_requests USING btree (issue_type);
CREATE INDEX IF NOT EXISTS idx_support_requests_created_at ON public.support_requests USING btree (created_at DESC);

-- Create updated_at trigger (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_support_requests_updated_at 
  BEFORE UPDATE ON public.support_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can view their own support requests
CREATE POLICY "Users can view own support requests" ON public.support_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create support requests
CREATE POLICY "Users can create support requests" ON public.support_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own support requests (limited fields)
CREATE POLICY "Users can update own support requests" ON public.support_requests
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Note: Admin access policies should be added separately based on your admin role implementation
-- Example admin policy (uncomment and modify as needed):
-- CREATE POLICY "Admins can view all support requests" ON public.support_requests
--   FOR SELECT USING (
--     auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@example.com'))
--   );

COMMENT ON TABLE public.support_requests IS 'Stores customer support requests linked to bookings';
COMMENT ON COLUMN public.support_requests.issue_type IS 'Type of issue: cancel, refund, modification, payment, or other';
COMMENT ON COLUMN public.support_requests.status IS 'Request status: pending, in_progress, resolved, or closed';

