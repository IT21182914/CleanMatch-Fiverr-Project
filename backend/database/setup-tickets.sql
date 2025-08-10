-- Ticketing System Database Schema
-- Run this script to add the ticketing system tables

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    freelancer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    assigned_admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    category VARCHAR(50) NOT NULL CHECK (category IN ('service_quality', 'lateness', 'damage', 'payment', 'other')),
    priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
    
    summary VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    internal_notes TEXT,
    
    -- SLA timestamps
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_response_at TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ticket messages table for conversation thread
CREATE TABLE IF NOT EXISTS ticket_messages (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE, -- true for admin internal notes, false for customer messages
    attachments JSONB, -- array of attachment objects with name, url, type, size
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ticket attachments table
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
    message_id INTEGER REFERENCES ticket_messages(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    file_url TEXT NOT NULL,
    uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ticket timeline table for tracking all actions
CREATE TABLE IF NOT EXISTS ticket_timeline (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL, -- 'created', 'status_changed', 'priority_changed', 'assigned', 'message_added', 'resolved', 'closed'
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_booking_id ON tickets(booking_id);
CREATE INDEX IF NOT EXISTS idx_tickets_freelancer_id ON tickets(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_admin_id ON tickets(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_opened_at ON tickets(opened_at);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_user_id ON ticket_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_created_at ON ticket_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_attachments_message_id ON ticket_attachments(message_id);

CREATE INDEX IF NOT EXISTS idx_ticket_timeline_ticket_id ON ticket_timeline(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_timeline_created_at ON ticket_timeline(created_at);

-- Create trigger to update updated_at on tickets table
CREATE OR REPLACE FUNCTION update_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_ticket_updated_at();

-- Add metadata column to notifications table for ticket-related notifications
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS metadata JSONB;
