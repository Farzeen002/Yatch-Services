# Database Setup Instructions

## Quick Setup

To fix the "profiles table not found" error, run the following SQL in your Supabase SQL editor:

### Option 1: Run Complete Setup (Recommended)
```sql
-- Copy and paste the entire content of setup-database.sql
-- This will create all tables, indexes, triggers, and sample data
```

### Option 2: Run Just the Profiles Table
```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles USING btree (email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles USING btree (phone);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

## What This Fixes

1. **Creates the `profiles` table** with all required fields
2. **Sets up proper relationships** with the `auth.users` table
3. **Enables Row Level Security** for data protection
4. **Creates necessary indexes** for performance
5. **Sets up triggers** for automatic timestamp updates

## After Running the SQL

1. The profile modal should work correctly
2. Users can complete their profiles before booking
3. Profile data will be saved to the database
4. The booking flow will work as expected

## Verification

After running the SQL, you can verify the setup by:

1. Going to your Supabase dashboard
2. Checking the "Table Editor" section
3. You should see the `profiles` table listed
4. The table should have the correct columns and relationships

## Troubleshooting

If you still get errors:

1. **Check Supabase connection**: Ensure your environment variables are correct
2. **Verify table creation**: Check if the table appears in Supabase dashboard
3. **Check RLS policies**: Ensure the policies are created correctly
4. **Test with a simple query**: Try running a basic SELECT query on the profiles table

## Next Steps

Once the database is set up:

1. Test the profile completion flow
2. Try making a booking
3. Verify the booking appears in the bookings page
4. Check that the admin can see and manage bookings

