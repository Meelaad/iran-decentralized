-- 004: db_blueprints
-- Stores blueprints (both official and user-forked) in Supabase.
-- Official blueprints are seeded via api/admin/seed-blueprints.js.
-- User forks are created via api/blueprint-fork.js (Phase C).

-- ── 1: Table ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.blueprints (
    id               text PRIMARY KEY,          -- 'decentralized' for official; uuid-ish for forks
    name_en          text NOT NULL,
    name_fa          text NOT NULL,
    use_force_layout boolean DEFAULT true,
    is_official      boolean DEFAULT false,
    owner_id         uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    forked_from      text REFERENCES public.blueprints(id) ON DELETE SET NULL,
    sectors_data     jsonb NOT NULL DEFAULT '[]',
    connections_data jsonb NOT NULL DEFAULT '[]',
    shared_layers_data jsonb NOT NULL DEFAULT '[]',
    is_public        boolean DEFAULT true,
    description_en   text,
    description_fa   text,
    created_at       timestamptz DEFAULT now(),
    updated_at       timestamptz DEFAULT now()
);

-- ── 2: RLS ───────────────────────────────────────────────────────────────────

ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

-- Anyone can read official blueprints
CREATE POLICY "blueprints_read_official"
    ON public.blueprints FOR SELECT
    USING (is_official = true);

-- Authenticated users can read public forks
CREATE POLICY "blueprints_read_public_forks"
    ON public.blueprints FOR SELECT
    TO authenticated
    USING (is_public = true AND is_official = false);

-- Owners can read their own (even private)
CREATE POLICY "blueprints_read_own"
    ON public.blueprints FOR SELECT
    TO authenticated
    USING (auth.uid() = owner_id);

-- Owners can update their own non-official blueprints
CREATE POLICY "blueprints_update_own"
    ON public.blueprints FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id AND is_official = false);

-- Owners can delete their own non-official blueprints
CREATE POLICY "blueprints_delete_own"
    ON public.blueprints FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id AND is_official = false);

-- ── 3: updated_at trigger ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER blueprints_updated_at
    BEFORE UPDATE ON public.blueprints
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 4: Fork count helper ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_blueprint_fork_counts()
RETURNS TABLE(blueprint_id text, forks bigint)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
    SELECT forked_from, COUNT(*)::bigint
    FROM public.blueprints
    WHERE forked_from IS NOT NULL
    GROUP BY forked_from;
$$;

GRANT EXECUTE ON FUNCTION public.get_blueprint_fork_counts() TO anon, authenticated;
