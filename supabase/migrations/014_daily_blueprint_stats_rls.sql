-- Migration 014: Add RLS to daily_blueprint_stats.
-- Migration 010 created the table without enabling RLS; this was applied directly
-- in Supabase (no local file existed). Reconstructed from live DB state.

ALTER TABLE daily_blueprint_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_blueprint_stats_read" ON daily_blueprint_stats
  FOR SELECT USING (true);
