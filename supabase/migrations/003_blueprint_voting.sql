-- 003: blueprint_voting
-- Adds preferred_blueprint to profiles and exposes aggregate counts
-- via a SECURITY DEFINER function (bypasses RLS so anon can read totals
-- without exposing individual profile rows).

-- ── 1: Column ────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS preferred_blueprint text DEFAULT 'decentralized'
        CHECK (preferred_blueprint IN ('decentralized', 'constMonarchy', 'secularLiberal'));

-- ── 2: Public aggregate function ─────────────────────────────────────────────
-- Returns vote counts per blueprint. SECURITY DEFINER means it runs with
-- owner privileges, bypassing the per-row RLS on profiles. Returns only
-- aggregates — no individual data is exposed.

CREATE OR REPLACE FUNCTION public.get_blueprint_vote_counts()
RETURNS TABLE(blueprint_id text, votes bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT preferred_blueprint, COUNT(*)::bigint
    FROM public.profiles
    WHERE preferred_blueprint IS NOT NULL
    GROUP BY preferred_blueprint;
$$;

GRANT EXECUTE ON FUNCTION public.get_blueprint_vote_counts() TO anon, authenticated;
