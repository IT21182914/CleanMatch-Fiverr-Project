
-- Create trust_badges table if not exists
CREATE TABLE IF NOT EXISTS trust_badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) DEFAULT 'certification',
    icon_url TEXT,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create testimonials table if not exists
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    service_type VARCHAR(255),
    location VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    booking_id INTEGER REFERENCES bookings(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trust_badges_active ON trust_badges(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured, rating DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- Insert trust badges
INSERT INTO trust_badges (name, description, type, icon_url, display_order, is_active) 
   VALUES ('Better Business Bureau A+', 'Accredited business with A+ rating from the Better Business Bureau', 'certification', '/images/badges/bbb-logo.png', 1, true)
   ON CONFLICT DO NOTHING;
INSERT INTO trust_badges (name, description, type, icon_url, display_order, is_active) 
   VALUES ('Bonded & Insured', 'All our cleaners are bonded and insured for your protection', 'guarantee', '/images/badges/bonded-insured.png', 2, true)
   ON CONFLICT DO NOTHING;
INSERT INTO trust_badges (name, description, type, icon_url, display_order, is_active) 
   VALUES ('Background Checked', 'Comprehensive background checks on all cleaning professionals', 'guarantee', '/images/badges/background-check.png', 3, true)
   ON CONFLICT DO NOTHING;
INSERT INTO trust_badges (name, description, type, icon_url, display_order, is_active) 
   VALUES ('Satisfaction Guarantee', '100% satisfaction guarantee or we''ll make it right', 'guarantee', '/images/badges/satisfaction-guarantee.png', 4, true)
   ON CONFLICT DO NOTHING;
INSERT INTO trust_badges (name, description, type, icon_url, display_order, is_active) 
   VALUES ('As Seen on Local News', 'Featured on ABC7, NBC4, and CBS2 for exceptional service', 'media', '/images/badges/media-coverage.png', 5, true)
   ON CONFLICT DO NOTHING;
INSERT INTO trust_badges (name, description, type, icon_url, display_order, is_active) 
   VALUES ('HomeAdvisor Elite Service', 'Top-rated cleaning service on HomeAdvisor platform', 'award', '/images/badges/homeadvisor-elite.png', 6, true)
   ON CONFLICT DO NOTHING;
INSERT INTO trust_badges (name, description, type, icon_url, display_order, is_active) 
   VALUES ('Angie''s List Super Service Award', 'Winner of Angie''s List Super Service Award 2023', 'award', '/images/badges/angies-list-award.png', 7, true)
   ON CONFLICT DO NOTHING;
INSERT INTO trust_badges (name, description, type, icon_url, display_order, is_active) 
   VALUES ('Green Cleaning Certified', 'Certified in eco-friendly and non-toxic cleaning methods', 'certification', '/images/badges/green-certified.png', 8, true)
   ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, content, rating, service_type, location, is_featured, created_at) 
   VALUES ('Sarah Johnson', 'CleanMatch found me the perfect cleaner! Maria has been cleaning my home for 6 months now and she''s absolutely wonderful. Always on time, thorough, and my house sparkles when she''s done.', 5, 'Regular Cleaning', 'Brooklyn, NY', true, '2024-01-15T00:00:00.000Z')
   ON CONFLICT DO NOTHING;
INSERT INTO testimonials (customer_name, content, rating, service_type, location, is_featured, created_at) 
   VALUES ('Michael Chen', 'I was skeptical about hiring a cleaning service, but CleanMatch made it so easy. The cleaner they matched me with, Rosa, is trustworthy and does an amazing job. Highly recommend!', 5, 'Deep Cleaning', 'Manhattan, NY', true, '2024-01-20T00:00:00.000Z')
   ON CONFLICT DO NOTHING;
INSERT INTO testimonials (customer_name, content, rating, service_type, location, is_featured, created_at) 
   VALUES ('Emily Davis', 'Best decision ever! My cleaner Ana is like family now. She takes such good care of my home and I can always count on her. The booking process was seamless.', 5, 'Move-in Cleaning', 'Queens, NY', true, '2024-02-01T00:00:00.000Z')
   ON CONFLICT DO NOTHING;
INSERT INTO testimonials (customer_name, content, rating, service_type, location, is_featured, created_at) 
   VALUES ('David Rodriguez', 'CleanMatch saved my sanity! As a busy dad, I needed help keeping the house clean. The cleaner they found, Carmen, is incredible with kids and pets. Couldn''t be happier.', 5, 'Family Home Cleaning', 'Bronx, NY', true, '2024-02-10T00:00:00.000Z')
   ON CONFLICT DO NOTHING;
INSERT INTO testimonials (customer_name, content, rating, service_type, location, is_featured, created_at) 
   VALUES ('Jennifer Wilson', 'Professional, reliable, and thorough. My office building has never looked better since we started using CleanMatch. The team they provided is fantastic.', 5, 'Commercial Cleaning', 'Staten Island, NY', false, '2024-02-15T00:00:00.000Z')
   ON CONFLICT DO NOTHING;
INSERT INTO testimonials (customer_name, content, rating, service_type, location, is_featured, created_at) 
   VALUES ('Robert Thompson', 'I''ve tried other cleaning services before, but none compare to what CleanMatch offers. Great communication, fair pricing, and exceptional cleaning quality.', 5, 'Apartment Cleaning', 'Manhattan, NY', false, '2024-02-20T00:00:00.000Z')
   ON CONFLICT DO NOTHING;
INSERT INTO testimonials (customer_name, content, rating, service_type, location, is_featured, created_at) 
   VALUES ('Lisa Martinez', 'The AI matching system really works! They found me a cleaner who specializes in eco-friendly products, which was exactly what I needed for my family.', 5, 'Eco-Friendly Cleaning', 'Brooklyn, NY', true, '2024-02-25T00:00:00.000Z')
   ON CONFLICT DO NOTHING;
INSERT INTO testimonials (customer_name, content, rating, service_type, location, is_featured, created_at) 
   VALUES ('James Anderson', 'Quick, efficient, and affordable. The cleaner arrived exactly on time and did an outstanding job. Will definitely book again through CleanMatch.', 4, 'One-Time Cleaning', 'Queens, NY', false, '2024-03-01T00:00:00.000Z')
   ON CONFLICT DO NOTHING;

-- Update the updated_at trigger for both tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_trust_badges_updated_at ON trust_badges;
CREATE TRIGGER update_trust_badges_updated_at 
    BEFORE UPDATE ON trust_badges 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON testimonials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
