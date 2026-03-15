-- Migration 009: leaderboard snapshots
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id           uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid  REFERENCES profiles(id),
  display_name text,
  civic_score  int,
  trust_tier   text,
  country_code text,
  snapshot_date date,
  rank_global  int,
  rank_country int
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshot_date ON leaderboard_snapshots(snapshot_date);
