-- Migration to add user_name column to users table
-- This will handle the case where the table exists but the column is missing

-- Check if the user_name column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'user_name'
  ) THEN
    ALTER TABLE users ADD COLUMN user_name VARCHAR(100) UNIQUE;
    RAISE NOTICE 'Added user_name column to users table';
  ELSE
    RAISE NOTICE 'user_name column already exists in users table';
  END IF;
END $$;

-- Update the cleaner_profiles table to ensure all freelancer-specific columns exist
DO $$
BEGIN
  -- Add cleaning_services column if it doesn't exist
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'cleaning_services'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN cleaning_services TEXT[];
    RAISE NOTICE 'Added cleaning_services column to cleaner_profiles table';
  END IF;

  -- Add cleaning_frequency column if it doesn't exist
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'cleaning_frequency'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN cleaning_frequency VARCHAR(50) DEFAULT 'part-time';
    RAISE NOTICE 'Added cleaning_frequency column to cleaner_profiles table';
  END IF;

  -- Add preferred_hours column if it doesn't exist
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'preferred_hours'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN preferred_hours TEXT;
    RAISE NOTICE 'Added preferred_hours column to cleaner_profiles table';
  END IF;

  -- Add message column if it doesn't exist
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'message'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN message TEXT;
    RAISE NOTICE 'Added message column to cleaner_profiles table';
  END IF;

  -- Add document upload columns if they don't exist
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'id_front_url'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN id_front_url TEXT;
    RAISE NOTICE 'Added id_front_url column to cleaner_profiles table';
  END IF;

  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'id_back_url'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN id_back_url TEXT;
    RAISE NOTICE 'Added id_back_url column to cleaner_profiles table';
  END IF;

  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'ssn_front_url'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN ssn_front_url TEXT;
    RAISE NOTICE 'Added ssn_front_url column to cleaner_profiles table';
  END IF;

  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'ssn_back_url'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN ssn_back_url TEXT;
    RAISE NOTICE 'Added ssn_back_url column to cleaner_profiles table';
  END IF;

  -- Add agreement columns if they don't exist
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'agreement_accepted'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN agreement_accepted BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added agreement_accepted column to cleaner_profiles table';
  END IF;

  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'terms_1099_accepted'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN terms_1099_accepted BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added terms_1099_accepted column to cleaner_profiles table';
  END IF;

  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'brings_supplies'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN brings_supplies BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added brings_supplies column to cleaner_profiles table';
  END IF;

  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'cleaner_profiles' 
    AND column_name = 'has_experience'
  ) THEN
    ALTER TABLE cleaner_profiles ADD COLUMN has_experience BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added has_experience column to cleaner_profiles table';
  END IF;
END $$;
