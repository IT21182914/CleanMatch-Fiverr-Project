-- Add metadata column to notifications table if it doesn't exist
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Create index for notification metadata queries if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_notifications_metadata ON notifications USING GIN (metadata);
