-- 007: profile_locks
-- Adds name_locked flag so full_name can only be changed once by the user.
-- birth_date is already present from migration 005; it is locked implicitly once set.

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS name_locked BOOLEAN NOT NULL DEFAULT FALSE;
