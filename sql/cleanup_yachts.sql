-- Clean up invalid yacht entries from database
-- Run this SQL in your Supabase SQL editor to remove test/invalid yachts

-- Delete invalid yacht entries
DELETE FROM yachts 
WHERE 
  name IS NULL OR 
  LENGTH(name) <= 2 OR 
  price <= 100 OR 
  guests <= 0 OR 
  guests >= 100 OR
  LOWER(name) LIKE '%test%' OR
  LOWER(name) LIKE '%dfd%' OR
  LOWER(name) LIKE '%ds%' OR
  name = 'motor yacht' OR
  name = 'Eclipse';

-- Verify the cleanup
SELECT name, type, guests, length, price, location 
FROM yachts 
ORDER BY price ASC;

-- If you want to keep only the main yachts, you can also run:
-- DELETE FROM yachts WHERE name NOT IN ('Ocean Dream', 'Sea Breeze', 'Royal Wave', 'Marina Star', 'Azure Explorer');



