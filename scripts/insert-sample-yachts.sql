-- Insert sample yacht data for testing
-- Run this in your Supabase SQL editor

-- Clear existing data (optional - remove if you want to keep existing data)
-- DELETE FROM public.yachts;

-- Insert sample yachts with proper UUIDs and data
INSERT INTO public.yachts (id, name, type, price, rating, reviews, location, guests, length, amenities, images, description) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Ocean Dream',
  'Motor Yacht',
  8500.00,
  4.8,
  127,
  'Monaco Marina',
  12,
  85.5,
  ARRAY['WiFi', 'Air Conditioning', 'Jacuzzi', 'Diving Equipment', 'Chef Service', 'Wine Cellar', 'Helipad', 'Gym'],
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'],
  'Luxurious motor yacht perfect for corporate events and family gatherings. Features state-of-the-art amenities and professional crew.'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Sea Breeze',
  'Sailing Yacht',
  4200.00,
  4.6,
  89,
  'Cannes Port',
  8,
  65,
  ARRAY['WiFi', 'Air Conditioning', 'Diving Equipment', 'Fishing Gear', 'Kayaks', 'Snorkeling Equipment'],
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'],
  'Elegant sailing yacht offering the perfect blend of luxury and adventure. Ideal for romantic getaways and small group charters.'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Royal Wave',
  'Catamaran',
  6800.00,
  4.9,
  156,
  'St. Tropez Harbor',
  16,
  78.2,
  ARRAY['WiFi', 'Air Conditioning', 'Jacuzzi', 'Diving Equipment', 'Chef Service', 'Wine Cellar', 'Gym', 'Sauna'],
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'],
  'Spacious catamaran with multiple decks and premium amenities. Perfect for large groups and special celebrations.'
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Marina Star',
  'Motor Yacht',
  3200.00,
  4.4,
  73,
  'Nice Port',
  6,
  45.8,
  ARRAY['WiFi', 'Air Conditioning', 'Diving Equipment', 'Fishing Gear'],
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'],
  'Compact yet luxurious motor yacht ideal for intimate gatherings and day trips along the French Riviera.'
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Azure Explorer',
  'Sailing Yacht',
  5500.00,
  4.7,
  94,
  'Antibes Marina',
  10,
  72.3,
  ARRAY['WiFi', 'Air Conditioning', 'Diving Equipment', 'Chef Service', 'Wine Cellar', 'Kayaks', 'Snorkeling Equipment'],
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'],
  'Premium sailing yacht combining traditional elegance with modern comfort. Features spacious cabins and professional crew.'
);
