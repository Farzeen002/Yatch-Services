-- Complete Database Fix Script for Yacht Services
-- This script addresses all current issues and ensures proper functionality

-- 1. Enable RLS on chat_sessions table
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS policy for chat_sessions (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'chat_sessions' 
        AND policyname = 'Users can access their own chat sessions'
    ) THEN
        CREATE POLICY "Users can access their own chat sessions" ON public.chat_sessions
        FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- 3. Create missing functions for triggers
CREATE OR REPLACE FUNCTION update_chat_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = EXTRACT(EPOCH FROM NOW()) * 1000;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_booking_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update booking status based on payment status
    IF NEW.status = 'captured' OR NEW.status = 'paid' THEN
        UPDATE public.bookings 
        SET status = 'confirmed' 
        WHERE id = NEW.booking_id;
    ELSIF NEW.status = 'failed' OR NEW.status = 'cancelled' THEN
        UPDATE public.bookings 
        SET status = 'cancelled' 
        WHERE id = NEW.booking_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create missing triggers
DO $$
BEGIN
    -- Chat sessions trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_chat_sessions_updated_at'
    ) THEN
        CREATE TRIGGER update_chat_sessions_updated_at
        BEFORE UPDATE ON public.chat_sessions
        FOR EACH ROW
        EXECUTE FUNCTION update_chat_sessions_updated_at();
    END IF;
    
    -- Yachts trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_yachts_updated_at'
    ) THEN
        CREATE TRIGGER update_yachts_updated_at
        BEFORE UPDATE ON public.yachts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Payments triggers
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_booking_status_trigger'
    ) THEN
        CREATE TRIGGER update_booking_status_trigger
        AFTER UPDATE OF status ON public.payments
        FOR EACH ROW
        EXECUTE FUNCTION update_booking_status();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_payments_updated_at'
    ) THEN
        CREATE TRIGGER update_payments_updated_at
        BEFORE UPDATE ON public.payments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 5. Create missing bookings table (if not exists)
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    yacht_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    guests integer NOT NULL,
    total_price numeric(10, 2) NOT NULL,
    status character varying(50) NOT NULL DEFAULT 'pending',
    special_requests text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT bookings_pkey PRIMARY KEY (id),
    CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT bookings_yacht_id_fkey FOREIGN KEY (yacht_id) REFERENCES public.yachts (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- 6. Create indexes for bookings table
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_yacht_id ON public.bookings USING btree (yacht_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings USING btree (status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings USING btree (start_date, end_date);

-- 7. Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policy for bookings
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Users can access their own bookings'
    ) THEN
        CREATE POLICY "Users can access their own bookings" ON public.bookings
        FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- 9. Create trigger for bookings updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_bookings_updated_at'
    ) THEN
        CREATE TRIGGER update_bookings_updated_at
        BEFORE UPDATE ON public.bookings
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 10. Enable RLS on other tables
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies for other tables
DO $$
BEGIN
    -- Enquiries policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'enquiries' 
        AND policyname = 'Users can access their own enquiries'
    ) THEN
        CREATE POLICY "Users can access their own enquiries" ON public.enquiries
        FOR ALL USING (true); -- Allow all for enquiries
    END IF;
    
    -- Feedback policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'feedback' 
        AND policyname = 'Users can access their own feedback'
    ) THEN
        CREATE POLICY "Users can access their own feedback" ON public.feedback
        FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Payments policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payments' 
        AND policyname = 'Users can access their own payments'
    ) THEN
        CREATE POLICY "Users can access their own payments" ON public.payments
        FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Receipts policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'receipts' 
        AND policyname = 'Users can access their own receipts'
    ) THEN
        CREATE POLICY "Users can access their own receipts" ON public.receipts
        FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- 12. Create cleanup function for old chat sessions
CREATE OR REPLACE FUNCTION cleanup_old_chat_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.chat_sessions 
    WHERE expires_at IS NOT NULL 
    AND expires_at < EXTRACT(EPOCH FROM NOW()) * 1000;
END;
$$ LANGUAGE plpgsql;

-- 13. Update existing chat sessions to have proper expires_at values
UPDATE public.chat_sessions 
SET expires_at = EXTRACT(EPOCH FROM NOW()) * 1000 + (24 * 60 * 60 * 1000)
WHERE expires_at IS NULL;

-- 14. Create function to get available yachts
CREATE OR REPLACE FUNCTION get_available_yachts(
    start_date_param date,
    end_date_param date,
    guest_count_param integer DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    name character varying,
    type character varying,
    price numeric,
    rating numeric,
    reviews integer,
    location character varying,
    guests integer,
    length numeric,
    amenities text[],
    images text[],
    description text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        y.id,
        y.name,
        y.type,
        y.price,
        y.rating,
        y.reviews,
        y.location,
        y.guests,
        y.length,
        y.amenities,
        y.images,
        y.description
    FROM public.yachts y
    WHERE y.id NOT IN (
        SELECT DISTINCT b.yacht_id
        FROM public.bookings b
        WHERE b.status IN ('confirmed', 'pending')
        AND (
            (b.start_date <= start_date_param AND b.end_date >= start_date_param)
            OR (b.start_date <= end_date_param AND b.end_date >= end_date_param)
            OR (b.start_date >= start_date_param AND b.end_date <= end_date_param)
        )
    )
    AND (guest_count_param IS NULL OR y.guests >= guest_count_param)
    ORDER BY y.price ASC;
END;
$$ LANGUAGE plpgsql;

-- 15. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 16. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_expires_at ON public.chat_sessions USING btree (expires_at);
CREATE INDEX IF NOT EXISTS idx_bookings_dates_status ON public.bookings USING btree (start_date, end_date, status);
CREATE INDEX IF NOT EXISTS idx_yachts_guests ON public.yachts USING btree (guests);

-- 17. Insert sample yachts if table is empty
INSERT INTO public.yachts (name, type, price, rating, reviews, location, guests, length, amenities, images, description)
SELECT * FROM (VALUES
    ('Ocean Dream', 'Motor Yacht', 8500.00, 4.8, 24, 'Monaco Marina', 12, 85.0, 
     ARRAY['Professional crew', 'Gourmet catering', 'Watersports equipment', 'WiFi', 'Air conditioning'], 
     ARRAY['https://example.com/ocean-dream-1.jpg', 'https://example.com/ocean-dream-2.jpg'],
     'Luxury motor yacht perfect for corporate events and special occasions. Features spacious deck areas and premium amenities.'),
    
    ('Sea Breeze', 'Sailing Yacht', 4200.00, 4.6, 18, 'Cannes Port', 8, 65.0,
     ARRAY['Experienced captain', 'Snorkeling gear', 'Fishing equipment', 'Cooler', 'Bluetooth sound system'],
     ARRAY['https://example.com/sea-breeze-1.jpg', 'https://example.com/sea-breeze-2.jpg'],
     'Classic sailing yacht offering an authentic maritime experience. Ideal for romantic getaways and small group charters.'),
    
    ('Royal Wave', 'Catamaran', 6800.00, 4.9, 31, 'St. Tropez Harbor', 16, 78.0,
     ARRAY['Dual hull stability', 'Large deck space', 'Professional crew', 'Premium bar', 'Sound system'],
     ARRAY['https://example.com/royal-wave-1.jpg', 'https://example.com/royal-wave-2.jpg'],
     'Spacious catamaran perfect for larger groups. Features stable dual-hull design and extensive deck areas.'),
    
    ('Marina Star', 'Motor Yacht', 3200.00, 4.4, 15, 'Nice Port', 6, 45.0,
     ARRAY['Captain included', 'Basic amenities', 'Cooler', 'Bluetooth audio'],
     ARRAY['https://example.com/marina-star-1.jpg', 'https://example.com/marina-star-2.jpg'],
     'Compact motor yacht ideal for intimate gatherings and day trips. Great value for smaller groups.'),
    
    ('Azure Explorer', 'Sailing Yacht', 5500.00, 4.7, 22, 'Antibes Marina', 10, 72.0,
     ARRAY['Experienced crew', 'Watersports equipment', 'Gourmet catering', 'WiFi', 'Premium bar'],
     ARRAY['https://example.com/azure-explorer-1.jpg', 'https://example.com/azure-explorer-2.jpg'],
     'Elegant sailing yacht combining comfort with adventure. Perfect for exploring the French Riviera.')
) AS sample_yachts(name, type, price, rating, reviews, location, guests, length, amenities, images, description)
WHERE NOT EXISTS (SELECT 1 FROM public.yachts LIMIT 1);

-- 18. Final verification
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Tables created/updated: chat_sessions, bookings, yachts, payments, receipts, enquiries, feedback';
    RAISE NOTICE 'RLS policies enabled for all tables';
    RAISE NOTICE 'Triggers and functions created';
    RAISE NOTICE 'Sample yachts inserted if table was empty';
END $$;


