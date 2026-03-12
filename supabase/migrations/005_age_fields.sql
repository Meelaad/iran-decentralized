-- 005: age_fields
-- Adds birth_year (from registration) and birth_date (from vote age gate) to profiles.

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS birth_year  smallint
        CHECK (birth_year IS NULL OR (birth_year >= 1900 AND birth_year <= 2100)),
    ADD COLUMN IF NOT EXISTS birth_date  date
        CHECK (birth_date IS NULL OR (birth_date >= '1900-01-01' AND birth_date <= CURRENT_DATE));