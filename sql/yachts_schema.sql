-- Yachts, Bookings, and Profiles table schemas for Supabase
-- Run this SQL in your Supabase SQL editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create yachts table
CREATE TABLE IF NOT EXISTS public.yachts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews INTEGER DEFAULT 0,
  location VARCHAR(255) NOT NULL,
  guests INTEGER NOT NULL,
  length DECIMAL(8,2) NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  unavailable_dates DATE[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NULL,
  CONSTRAINT yachts_pkey PRIMARY KEY (id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  yacht_id UUID NULL,
  user_id UUID NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_id VARCHAR(255) NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT bookings_yacht_id_fkey FOREIGN KEY (yacht_id) REFERENCES yachts (id) ON DELETE CASCADE
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  yacht_id UUID REFERENCES yachts(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  yacht_id UUID REFERENCES yachts(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles USING btree (email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles USING btree (phone);
CREATE INDEX IF NOT EXISTS idx_yachts_type ON public.yachts USING btree (type);
CREATE INDEX IF NOT EXISTS idx_yachts_location ON public.yachts USING btree (location);
CREATE INDEX IF NOT EXISTS idx_yachts_price ON public.yachts USING btree (price);
CREATE INDEX IF NOT EXISTS idx_bookings_yacht_id ON public.bookings USING btree (yacht_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings USING btree (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries USING btree (status);
CREATE INDEX IF NOT EXISTS idx_feedback_yacht_id ON public.feedback USING btree (yacht_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_yachts_updated_at 
  BEFORE UPDATE ON public.yachts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON public.bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
-- Users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role_type = 'admin'
    )
  );
-- Insert sample yachts data
INSERT INTO yachts (name, type, price, rating, reviews, location, guests, length, amenities, description) VALUES
(
  'Ocean Dream',
  'Motor Yacht',
  8500.00,
  4.8,
  127,
  'Monaco Marina',
  12,
  85.5,
  ARRAY['WiFi', 'Air Conditioning', 'Jacuzzi', 'Chef Service', 'Wine Cellar', 'Helipad', 'Gym'],
  'Luxurious motor yacht perfect for corporate events and family gatherings. Features state-of-the-art amenities and professional crew.'
),
(
  'Sea Breeze',
  'Sailing Yacht',
  4200.00,
  4.6,
  89,
  'Cannes Port',
  8,
  65,
  ARRAY['WiFi', 'Air Conditioning', 'Fishing Gear', 'Kayaks', 'Snorkeling Equipment'],
  'Elegant sailing yacht offering the perfect blend of luxury and adventure. Ideal for romantic getaways and small group charters.'
),
(
  'Royal Wave',
  'Catamaran',
  6800.00,
  4.9,
  156,
  'St. Tropez Harbor',
  16,
  78.2,
  ARRAY['WiFi', 'Air Conditioning', 'Jacuzzi', 'Chef Service', 'Wine Cellar', 'Gym', 'Sauna'],
  'Spacious catamaran with multiple decks and premium amenities. Perfect for large groups and special celebrations.'
),
(
  'Marina Star',
  'Motor Yacht',
  3200.00,
  4.4,
  73,
  'Nice Port',
  6,
  45.8,
  ARRAY['WiFi', 'Air Conditioning', 'Fishing Gear'],
  'Compact yet luxurious motor yacht ideal for intimate gatherings and day trips along the French Riviera.'
),
(
  'Azure Explorer',
  'Sailing Yacht',
  5500.00,
  4.7,
  94,
  'Antibes Marina',
  10,
  72.3,
  ARRAY['WiFi', 'Air Conditioning', 'Chef Service', 'Wine Cellar', 'Kayaks', 'Snorkeling Equipment'],
  'Premium sailing yacht combining traditional elegance with modern comfort. Features spacious cabins and professional crew.'
);

