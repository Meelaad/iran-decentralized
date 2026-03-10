
-- INVITE SYSTEM MIGRATION
-- NEW SQL editor tab in Supabase Studio.
-- The existing profiles table and its trigger are kept as-is.
-- This script only ADDS columns and creates new tables/functions.
--
-- After the first registration, making myself admin:
-- UPDATE public.profiles SET is_admin = true WHERE id = '<your-user-id>';



-- ──  1: Adding new columns to the existing profiles table ──────────────────
-- Uses IF NOT EXISTS so re-running this is safe.

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS invited_by             uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS invite_codes_remaining int DEFAULT 5,
    ADD COLUMN IF NOT EXISTS is_admin               bool DEFAULT false;


-- ──  2: New tables ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.invite_codes (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code       text UNIQUE NOT NULL,
    owner_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    used_by    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    used_at    timestamptz,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.registration_metadata (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_address     text,
    user_agent     text,
    timezone       text,
    language       text,
    screen         text,
    color_depth    int,
    hardware_cores int,
    device_memory  real,
    platform       text,
    touch_points   int,
    canvas_hash    text,
    webgl_vendor   text,
    webgl_renderer text,
    audio_hash     text,
    registered_at  timestamptz DEFAULT now()
);


-- ──  3: Helper — generate one random 8-char invite code ──────────────────

CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    charset text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result  text := '';
    i       int;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(charset, floor(random() * length(charset) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$;


-- ──  4: Trigger — auto-create 5 invite codes when a profile row is inserted

CREATE OR REPLACE FUNCTION create_initial_invite_codes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    new_code text;
    i        int;
BEGIN
    FOR i IN 1..5 LOOP
        LOOP
            new_code := generate_invite_code();
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM public.invite_codes WHERE code = new_code
            );
        END LOOP;
        INSERT INTO public.invite_codes (code, owner_id)
        VALUES (new_code, NEW.id);
    END LOOP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION create_initial_invite_codes();

-- the existing trigger on_auth_user_created (on auth.users) creates
-- the profile row automatically. This new trigger then fires immediately after
-- that, generating the 5 invite codes. The chain is:
--   User registers → auth.users row → profiles row → 5 invite codes


-- ── 5: Admin helper functions ───────────────────────────────────────────

CREATE OR REPLACE FUNCTION decrement_invite_remaining(profile_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
    UPDATE public.profiles
    SET invite_codes_remaining = GREATEST(0, invite_codes_remaining - 1)
    WHERE id = profile_id;
$$;

CREATE OR REPLACE FUNCTION admin_generate_codes(p_owner_id uuid, p_count int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_code text;
    i        int;
BEGIN
    FOR i IN 1..p_count LOOP
        LOOP
            new_code := generate_invite_code();
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM public.invite_codes WHERE code = new_code
            );
        END LOOP;
        INSERT INTO public.invite_codes (code, owner_id)
        VALUES (new_code, p_owner_id);
    END LOOP;
    UPDATE public.profiles
    SET invite_codes_remaining = invite_codes_remaining + p_count
    WHERE id = p_owner_id;
END;
$$;


-- ── 6: RLS on new tables ─────────────────────────────────────────────────
-- (the existing profiles table already has RLS enabled — not touching it)

ALTER TABLE public.invite_codes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_metadata ENABLE ROW LEVEL SECURITY;

-- invite_codes: each user can read their own codes
CREATE POLICY "invite_codes_select_own"
    ON public.invite_codes FOR SELECT
    USING (auth.uid() = owner_id);

-- registration_metadata: no direct client access — service role only.
-- No policy intentionally. All reads/writes go through serverless functions.
