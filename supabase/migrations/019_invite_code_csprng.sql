-- Migration 019: Replace PRNG-based invite code generation with CSPRNG
--
-- PostgreSQL's random() uses a Mersenne-Twister PRNG seeded at session start.
-- gen_random_bytes() (pgcrypto) uses the OS CSPRNG (/dev/urandom or equivalent).
--
-- Alphabet: 32 characters (excludes 0, 1, I, O, l to prevent visual ambiguity)
-- Code length: 8 characters → 32^8 ≈ 1.1 trillion combinations (~40 bits of entropy)
--
-- Bias note: 256 (byte range) is exactly divisible by 32 (alphabet size),
-- so byte_val % 32 has ZERO modulo bias — every character maps to exactly 8 byte values.
-- No rejection sampling required.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    charset   text  := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result    text  := '';
    raw_bytes bytea;
    i         int;
BEGIN
    -- 8 bytes → 8 characters; no rejection loop needed (256 % 32 = 0)
    raw_bytes := gen_random_bytes(8);
    FOR i IN 0..7 LOOP
        result := result || substr(charset, (get_byte(raw_bytes, i) % 32) + 1, 1);
    END LOOP;
    RETURN result;
END;
$$;
