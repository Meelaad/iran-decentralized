-- Migration 020: Voting system security hardening
-- Fixes:
--   1. plan_endorsements / plan_signatures — ensure tables exist with UNIQUE constraints + RLS + GRANTs
--   2. Atomic signature_count via DB trigger (removes race condition from JS)
--   3. profiles.preferred_blueprint CHECK constraint (whitelist valid values)
--   4. civic_score_events RLS — service role only for writes

-- ── 1. plan_endorsements ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS plan_endorsements (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid NOT NULL,
    plan_id    text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'plan_endorsements_user_unique'
    ) THEN
        ALTER TABLE plan_endorsements
            ADD CONSTRAINT plan_endorsements_user_unique UNIQUE (user_id);
    END IF;
END $$;

ALTER TABLE plan_endorsements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plan_endorsements_user_select" ON plan_endorsements;
CREATE POLICY "plan_endorsements_user_select"
    ON plan_endorsements FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "plan_endorsements_user_write" ON plan_endorsements;
CREATE POLICY "plan_endorsements_user_write"
    ON plan_endorsements FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON plan_endorsements TO authenticated;
GRANT SELECT ON plan_endorsements TO anon;

-- ── 2. plan_signatures ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS plan_signatures (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid NOT NULL,
    plan_id    text NOT NULL,
    created_at timestamptz DEFAULT now()
);

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'plan_signatures_user_plan_unique'
    ) THEN
        ALTER TABLE plan_signatures
            ADD CONSTRAINT plan_signatures_user_plan_unique UNIQUE (user_id, plan_id);
    END IF;
END $$;

ALTER TABLE plan_signatures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plan_signatures_user_select" ON plan_signatures;
CREATE POLICY "plan_signatures_user_select"
    ON plan_signatures FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "plan_signatures_user_insert" ON plan_signatures;
CREATE POLICY "plan_signatures_user_insert"
    ON plan_signatures FOR INSERT
    WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT ON plan_signatures TO authenticated;
GRANT SELECT ON plan_signatures TO anon;

-- ── 3. Atomic signature_count trigger ────────────────────────────────────────
-- Replaces the race-prone JS read-then-write pattern in signPlan().

CREATE OR REPLACE FUNCTION increment_plan_signature_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
    UPDATE transitional_plans
    SET signature_count = signature_count + 1
    WHERE id = NEW.plan_id::uuid;

    -- Auto-promote incubator → arena once threshold is reached
    UPDATE transitional_plans
    SET status = 'arena'
    WHERE id = NEW.plan_id::uuid
      AND status = 'incubator'
      AND signature_threshold > 0
      AND signature_count >= signature_threshold;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_increment_sig_count ON plan_signatures;
CREATE TRIGGER trg_increment_sig_count
    AFTER INSERT ON plan_signatures
    FOR EACH ROW
    EXECUTE FUNCTION increment_plan_signature_count();

-- ── 4. Blueprint ID whitelist constraint on profiles ─────────────────────────

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_preferred_blueprint_check'
    ) THEN
        ALTER TABLE profiles
            ADD CONSTRAINT profiles_preferred_blueprint_check
            CHECK (preferred_blueprint IS NULL OR preferred_blueprint IN (
                'decentralized',
                'constMonarchy',
                'secularLiberal',
                'federalDemocratic',
                'democraticSocialist',
                'absoluteMonarchy'
            ));
    END IF;
END $$;

-- ── 5. civic_score_events RLS — reads allowed, writes service-role only ───────

ALTER TABLE IF EXISTS civic_score_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "civic_score_events_user_select" ON civic_score_events;
CREATE POLICY "civic_score_events_user_select"
    ON civic_score_events FOR SELECT
    USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for client roles → only service role can write
