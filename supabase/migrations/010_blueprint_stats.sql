-- daily blueprint vote stats (populated by nightly cron)
CREATE TABLE IF NOT EXISTS daily_blueprint_stats (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id     text NOT NULL,
  stat_date        date NOT NULL,
  vote_count       int  NOT NULL DEFAULT 0,
  vote_delta       int  NOT NULL DEFAULT 0,
  weighted_votes   numeric(10,2) DEFAULT 0,
  UNIQUE (blueprint_id, stat_date)
);
CREATE INDEX IF NOT EXISTS idx_bp_stats_date ON daily_blueprint_stats(blueprint_id, stat_date DESC);

-- weighted vote count RPC
CREATE OR REPLACE FUNCTION get_blueprint_vote_counts_weighted()
RETURNS TABLE(blueprint_id text, votes bigint, weighted_votes numeric) AS $$
  SELECT
    p.preferred_blueprint AS blueprint_id,
    COUNT(*)              AS votes,
    SUM(CASE p.trust_tier
      WHEN 'HIGH' THEN 3
      WHEN 'MID'  THEN 2
      ELSE 1
    END)::numeric         AS weighted_votes
  FROM profiles p
  WHERE p.preferred_blueprint IS NOT NULL
  GROUP BY p.preferred_blueprint;
$$ LANGUAGE sql STABLE;

-- increment_civic_score helper RPC
CREATE OR REPLACE FUNCTION increment_civic_score(p_user_id uuid, p_delta int)
RETURNS void AS $$
  UPDATE profiles
  SET civic_score = LEAST(10, GREATEST(1, civic_score + p_delta))
  WHERE id = p_user_id;
$$ LANGUAGE sql;

-- update trust tier trigger (correct thresholds: LOW=1-3, MID=4-7, HIGH=8-10)
CREATE OR REPLACE FUNCTION update_trust_tier()
RETURNS TRIGGER AS $$
BEGIN
  NEW.trust_tier := CASE
    WHEN NEW.civic_score >= 8 THEN 'HIGH'
    WHEN NEW.civic_score >= 4 THEN 'MID'
    ELSE 'LOW'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_trust_tier ON profiles;
CREATE TRIGGER trg_update_trust_tier
  BEFORE INSERT OR UPDATE OF civic_score ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_trust_tier();
