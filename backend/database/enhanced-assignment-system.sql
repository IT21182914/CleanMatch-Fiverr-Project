-- Enhanced cleaner assignment system database tables
-- Run this script to add the required tables and columns

-- Add assignment tracking columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS assignment_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS assigned_by_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_override_reason TEXT;

-- Create cleaner service areas table for explicit ZIP code coverage
CREATE TABLE IF NOT EXISTS cleaner_service_areas (
    id SERIAL PRIMARY KEY,
    cleaner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    zip_code VARCHAR(10),
    zip_prefix VARCHAR(5), -- For area-based matching (first 3 or 2 digits)
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cleaner_service_areas_cleaner_id ON cleaner_service_areas(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_cleaner_service_areas_zip_code ON cleaner_service_areas(zip_code);
CREATE INDEX IF NOT EXISTS idx_cleaner_service_areas_zip_prefix ON cleaner_service_areas(zip_prefix);

-- Add notification metadata column for structured data
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Create index for notification metadata queries
CREATE INDEX IF NOT EXISTS idx_notifications_metadata ON notifications USING GIN (metadata);

-- Add cleaner profile enhancements
ALTER TABLE cleaner_profiles 
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(5,2) DEFAULT 0.00;

-- Create index for booking assignment queries
CREATE INDEX IF NOT EXISTS idx_bookings_cleaner_date_status ON bookings(cleaner_id, booking_date, status);
CREATE INDEX IF NOT EXISTS idx_bookings_status_zip_date ON bookings(status, zip_code, booking_date);

-- Add booking assignment status index
CREATE INDEX IF NOT EXISTS idx_bookings_assignment_status ON bookings(status) WHERE status IN ('pending_assignment', 'confirmed');

-- Update cleaner profiles with calculated completion rates
UPDATE cleaner_profiles 
SET completion_rate = (
    SELECT COALESCE(
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / 
             NULLIF(COUNT(*) FILTER (WHERE status IN ('completed', 'cancelled', 'no_show')), 0)) * 100, 
            2
        ), 
        0
    )
    FROM bookings 
    WHERE cleaner_id = cleaner_profiles.user_id
);

-- Function to automatically update cleaner completion rates
CREATE OR REPLACE FUNCTION update_cleaner_completion_rate()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status IN ('completed', 'cancelled', 'no_show') THEN
        UPDATE cleaner_profiles 
        SET completion_rate = (
            SELECT COALESCE(
                ROUND(
                    (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / 
                     NULLIF(COUNT(*) FILTER (WHERE status IN ('completed', 'cancelled', 'no_show')), 0)) * 100, 
                    2
                ), 
                0
            )
            FROM bookings 
            WHERE cleaner_id = NEW.cleaner_id
        ),
        last_active = CURRENT_TIMESTAMP
        WHERE user_id = NEW.cleaner_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update completion rates automatically
DROP TRIGGER IF EXISTS trigger_update_cleaner_stats ON bookings;
CREATE TRIGGER trigger_update_cleaner_stats
    AFTER UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_cleaner_completion_rate();

-- Populate service areas from existing cleaner zip codes
INSERT INTO cleaner_service_areas (cleaner_id, zip_code, zip_prefix, is_primary)
SELECT DISTINCT 
    u.id,
    u.zip_code,
    LEFT(u.zip_code, 3),
    TRUE
FROM users u
JOIN cleaner_profiles cp ON u.id = cp.user_id
WHERE u.role = 'cleaner' 
  AND u.zip_code IS NOT NULL 
  AND u.is_active = TRUE
ON CONFLICT DO NOTHING;

-- Add adjacent ZIP codes for better coverage (example for major metro areas)
-- This is a simplified version - in production, you'd want a more comprehensive ZIP code database
INSERT INTO cleaner_service_areas (cleaner_id, zip_code, zip_prefix, is_primary)
SELECT DISTINCT
    csa.cleaner_id,
    z.adjacent_zip,
    LEFT(z.adjacent_zip, 3),
    FALSE
FROM cleaner_service_areas csa
CROSS JOIN (
    -- Example adjacent ZIP codes for major areas
    VALUES 
    ('90210', '90211'), ('90210', '90209'), ('90210', '90212'),
    ('10001', '10002'), ('10001', '10003'), ('10001', '10004'),
    ('60601', '60602'), ('60601', '60603'), ('60601', '60604'),
    ('94102', '94103'), ('94102', '94104'), ('94102', '94105')
) AS z(base_zip, adjacent_zip)
WHERE csa.zip_code = z.base_zip
  AND csa.is_primary = TRUE
ON CONFLICT DO NOTHING;

-- Create function to update last_active when cleaner accepts or completes bookings
CREATE OR REPLACE FUNCTION update_cleaner_last_active()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.cleaner_id IS NOT NULL AND OLD.cleaner_id != NEW.cleaner_id THEN
        -- Cleaner was assigned
        UPDATE cleaner_profiles 
        SET last_active = CURRENT_TIMESTAMP
        WHERE user_id = NEW.cleaner_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for last_active updates
DROP TRIGGER IF EXISTS trigger_update_last_active ON bookings;
CREATE TRIGGER trigger_update_last_active
    AFTER UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_cleaner_last_active();

COMMENT ON TABLE cleaner_service_areas IS 'Defines explicit service areas for cleaners to improve ZIP-based matching';
COMMENT ON COLUMN bookings.assigned_at IS 'Timestamp when cleaner was assigned to booking';
COMMENT ON COLUMN bookings.assignment_attempts IS 'Number of times auto-assignment was attempted';
COMMENT ON COLUMN bookings.assigned_by_admin IS 'Whether assignment was done manually by admin';
COMMENT ON COLUMN bookings.admin_override_reason IS 'Reason provided for manual admin assignment';
