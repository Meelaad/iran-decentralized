-- Migration 008: add badges column to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS badges jsonb NOT NULL DEFAULT '[]';

COMMENT ON COLUMN profiles.badges IS 'JSON array of earned badge ids with metadata: [{id, awarded_at, metadata}]';
