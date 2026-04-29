-- Migration: Create shareable_links table
-- This table stores shareable login links with expiry and usage tracking

CREATE TABLE IF NOT EXISTS shareable_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_shareable_links_token ON shareable_links(token);
CREATE INDEX IF NOT EXISTS idx_shareable_links_email ON shareable_links(email);
CREATE INDEX IF NOT EXISTS idx_shareable_links_expires_at ON shareable_links(expires_at);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE shareable_links ENABLE ROW LEVEL SECURITY;

-- Optional: Create a cleanup job for expired links (manual cleanup)
-- Run periodically: DELETE FROM shareable_links WHERE expires_at < NOW();
