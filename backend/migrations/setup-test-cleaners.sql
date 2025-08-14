-- Quick setup script to add test cleaners and service areas for ZIP 82600

-- First, let's see what cleaners we have
SELECT u.id, u.first_name, u.last_name, u.email, u.zip_code, cp.is_available 
FROM users u 
LEFT JOIN cleaner_profiles cp ON u.id = cp.user_id 
WHERE u.role = 'cleaner' 
ORDER BY u.id;

-- Add service area coverage for ZIP 82600 (Tissamaraharama)
-- This will allow cleaners to be matched with bookings in this area

-- If you have existing cleaners, add their service areas:
INSERT INTO cleaner_service_areas (cleaner_id, zip_code, zip_prefix, is_primary)
SELECT u.id, '82600', '826', 
       CASE WHEN u.zip_code = '82600' THEN true ELSE false END
FROM users u 
JOIN cleaner_profiles cp ON u.id = cp.user_id
WHERE u.role = 'cleaner' 
  AND u.is_active = true 
  AND cp.is_available = true
ON CONFLICT (cleaner_id, zip_code) DO NOTHING;

-- Also add broader area coverage (all 826xx ZIP codes)
INSERT INTO cleaner_service_areas (cleaner_id, zip_code, zip_prefix, is_primary)
SELECT u.id, '82600', '826', false
FROM users u 
JOIN cleaner_profiles cp ON u.id = cp.user_id
WHERE u.role = 'cleaner' 
  AND u.is_active = true
  AND cp.is_available = true
  AND NOT EXISTS (
    SELECT 1 FROM cleaner_service_areas csa 
    WHERE csa.cleaner_id = u.id AND csa.zip_code = '82600'
  );

-- If no cleaners exist, create a test cleaner:
INSERT INTO users (
  first_name, last_name, email, password, role, 
  phone, zip_code, is_active, created_at
) VALUES (
  'Maria', 'Cleaner', 'maria.cleaner@cleanmatch.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: password123
  'cleaner', '+94 77 123 4567', '82600', true, NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create cleaner profile for the test cleaner
INSERT INTO cleaner_profiles (
  user_id, hourly_rate, service_radius, rating, total_jobs,
  is_available, background_check_status, experience_years,
  availability_schedule, bio, last_active
)
SELECT u.id, 28.00, 20, 4.7, 15, true, 'approved', 3,
  '{
    "monday": {"available": true, "startTime": "08:00", "endTime": "18:00"},
    "tuesday": {"available": true, "startTime": "08:00", "endTime": "18:00"},
    "wednesday": {"available": true, "startTime": "08:00", "endTime": "18:00"},
    "thursday": {"available": true, "startTime": "08:00", "endTime": "18:00"},
    "friday": {"available": true, "startTime": "08:00", "endTime": "18:00"},
    "saturday": {"available": true, "startTime": "09:00", "endTime": "17:00"},
    "sunday": {"available": false, "startTime": null, "endTime": null}
  }'::jsonb,
  'Experienced cleaner specializing in residential and small commercial spaces.',
  NOW() - INTERVAL '2 hours'
FROM users u 
WHERE u.email = 'maria.cleaner@cleanmatch.com'
ON CONFLICT (user_id) DO UPDATE SET
  is_available = true,
  background_check_status = 'approved',
  last_active = NOW() - INTERVAL '2 hours';

-- Add service area for the test cleaner
INSERT INTO cleaner_service_areas (cleaner_id, zip_code, zip_prefix, is_primary)
SELECT u.id, '82600', '826', true
FROM users u 
WHERE u.email = 'maria.cleaner@cleanmatch.com'
ON CONFLICT (cleaner_id, zip_code) DO NOTHING;

-- Add broader coverage
INSERT INTO cleaner_service_areas (cleaner_id, zip_code, zip_prefix, is_primary)
SELECT u.id, '82601', '826', false
FROM users u 
WHERE u.email = 'maria.cleaner@cleanmatch.com'
ON CONFLICT (cleaner_id, zip_code) DO NOTHING;

-- Verify the setup
SELECT 
  u.first_name, u.last_name, u.zip_code,
  cp.is_available, cp.rating, cp.hourly_rate,
  COUNT(csa.id) as service_areas
FROM users u
JOIN cleaner_profiles cp ON u.id = cp.user_id
LEFT JOIN cleaner_service_areas csa ON u.id = csa.cleaner_id
WHERE u.role = 'cleaner' AND u.is_active = true
GROUP BY u.id, u.first_name, u.last_name, u.zip_code, cp.is_available, cp.rating, cp.hourly_rate
ORDER BY u.first_name;

-- Show service area coverage
SELECT 
  u.first_name, u.last_name,
  csa.zip_code, csa.zip_prefix, csa.is_primary
FROM cleaner_service_areas csa
JOIN users u ON csa.cleaner_id = u.id
ORDER BY u.first_name, csa.zip_code;
