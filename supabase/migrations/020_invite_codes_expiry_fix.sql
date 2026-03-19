-- Migration 020: Fix invite_codes expiry logic
--
-- Problems fixed:
-- 1. expires_at was NOT NULL with default now()+48h — stamped all existing rows with
--    a bulk expiry when the column was added. Registration trigger codes should be non-expiring.
-- 2. register.js checks `expires_at !== null` (designed for null=non-expiring) — schema disagreed.
-- 3. create_initial_invite_codes and admin_generate_codes relied on the column default,
--    giving all registration/admin codes a 48h expiry unintentionally.
-- 4. One 6-char code exists (old JS bug) — unusable, cleaned up.
-- 5. Duplicate SELECT RLS policy dropped.

-- 1. Make expires_at nullable. NULL = non-expiring (matches register.js logic).
--    User-generated codes still set expires_at explicitly to now()+48h.
ALTER TABLE public.invite_codes ALTER COLUMN expires_at DROP NOT NULL;
ALTER TABLE public.invite_codes ALTER COLUMN expires_at SET DEFAULT NULL;

-- 2. Un-expire the registration codes that were bulk-stamped by the migration default.
--    They all share the exact same expiry timestamp (set when the column was added).
UPDATE public.invite_codes
SET expires_at = NULL
WHERE used_by IS NULL
  AND expires_at = '2026-03-16 05:26:35.376918+00';

-- 3. Delete the 1 wrong-length (6-char) code — already invalid per validate-invite regex.
DELETE FROM public.invite_codes
WHERE length(code) != 8;

-- 4. Drop the duplicate RLS SELECT policy.
DROP POLICY IF EXISTS "Users can view own invite codes" ON public.invite_codes;

-- 5. Update create_initial_invite_codes: explicitly pass expires_at = NULL (non-expiring).
CREATE OR REPLACE FUNCTION create_initial_invite_codes()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
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
        INSERT INTO public.invite_codes (code, owner_id, expires_at)
        VALUES (new_code, NEW.id, NULL);
    END LOOP;
    RETURN NEW;
END;
$$;

-- 6. Update admin_generate_codes: explicitly pass expires_at = NULL (non-expiring).
CREATE OR REPLACE FUNCTION admin_generate_codes(p_owner_id uuid, p_count int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
        INSERT INTO public.invite_codes (code, owner_id, expires_at)
        VALUES (new_code, p_owner_id, NULL);
    END LOOP;
    UPDATE public.profiles
    SET invite_codes_remaining = invite_codes_remaining + p_count
    WHERE id = p_owner_id;
END;
$$;
