-- Migration 013: Fix self-referential RLS bug from migration 012.
-- The EXISTS subquery in 012 queried `profiles` from inside a `profiles` policy,
-- causing circular RLS evaluation and breaking the admin check in useAuth.js.
-- Fix: use a SECURITY DEFINER function that bypasses RLS to check admin status.

-- Drop the broken policy from 012
DROP POLICY IF EXISTS "admins_read_all_profiles" ON profiles;

-- Function runs as the DB owner (SECURITY DEFINER), bypassing RLS entirely
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  );
$$;

-- Now the policy is safe: no self-reference, no circular evaluation
CREATE POLICY "admins_read_all_profiles" ON profiles
FOR SELECT USING (
  auth.uid() = id
  OR public.is_admin_user()
);
