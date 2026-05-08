-- Index for efficient time-based queries and pagination on civic_score_events
CREATE INDEX IF NOT EXISTS idx_civic_score_events_user_created
    ON civic_score_events(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_civic_score_events_created_at
    ON civic_score_events(created_at DESC);

-- Retention function: deletes events older than 1 year
CREATE OR REPLACE FUNCTION delete_old_civic_score_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    deleted_count integer;
BEGIN
    DELETE FROM civic_score_events
    WHERE created_at < now() - interval '1 year';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION delete_old_civic_score_events IS
    'Deletes civic_score_events older than 1 year. Run monthly via pg_cron or Supabase scheduled function.';
