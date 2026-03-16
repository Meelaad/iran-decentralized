-- Migration 012: Allow admins to read all profiles via anon key (for admin preview feature)
-- Without this, frontend anon client gets 406 when admin tries to view another user's profile.

CREATE POLICY "admins_read_all_profiles" ON profiles
FOR SELECT USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  )
);
