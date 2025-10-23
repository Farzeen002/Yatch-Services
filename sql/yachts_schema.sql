-- Yachts table schema for Supabase
-- Run this SQL in your Supabase SQL editor

-- Create yachts table
CREATE TABLE IF NOT EXISTS yachts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews INTEGER DEFAULT 0,
  location VARCHAR(255) NOT NULL,
  guests INTEGER NOT NULL,
  length DECIMAL(8,2) NOT NULL, -- in feet
  amenities TEXT[] DEFAULT '{}', -- array of amenities
  unavailable_dates DATE[] DEFAULT '{}', -- array of unavailable dates
  images TEXT[] DEFAULT '{}', -- array of image URLs (max 8)
  videos TEXT[] DEFAULT '{}', -- array of video URLs (max 2)
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table (if not exists)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  yacht_id UUID REFERENCES yachts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  yacht_id UUID REFERENCES yachts(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, resolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  yacht_id UUID REFERENCES yachts(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  ARRAY['WiFi', 'Air Conditioning', 'Jacuzzi', 'Diving Equipment', 'Chef Service', 'Wine Cellar', 'Helipad', 'Gym'],
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
  ARRAY['WiFi', 'Air Conditioning', 'Diving Equipment', 'Fishing Gear', 'Kayaks', 'Snorkeling Equipment'],
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
  ARRAY['WiFi', 'Air Conditioning', 'Jacuzzi', 'Diving Equipment', 'Chef Service', 'Wine Cellar', 'Gym', 'Sauna'],
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
  ARRAY['WiFi', 'Air Conditioning', 'Diving Equipment', 'Fishing Gear'],
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
  ARRAY['WiFi', 'Air Conditioning', 'Diving Equipment', 'Chef Service', 'Wine Cellar', 'Kayaks', 'Snorkeling Equipment'],
  'Premium sailing yacht combining traditional elegance with modern comfort. Features spacious cabins and professional crew.'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_yachts_type ON yachts(type);
CREATE INDEX IF NOT EXISTS idx_yachts_location ON yachts(location);
CREATE INDEX IF NOT EXISTS idx_yachts_price ON yachts(price);
CREATE INDEX IF NOT EXISTS idx_bookings_yacht_id ON bookings(yacht_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_feedback_yacht_id ON feedback(yacht_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_yachts_updated_at BEFORE UPDATE ON yachts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
