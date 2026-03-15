-- Score rules table
CREATE TABLE IF NOT EXISTS score_rules (
  event_type            text    PRIMARY KEY,
  score_delta           int     NOT NULL,
  description           text,
  is_one_time           boolean NOT NULL DEFAULT false,
  is_repeatable_daily   boolean NOT NULL DEFAULT false
);

INSERT INTO score_rules (event_type, score_delta, description, is_one_time, is_repeatable_daily)
VALUES
  ('daily_login',               1,  'Log in on a given calendar day',                       false, true),
  ('consecutive_3_day_login',   1,  'Log in for 3 consecutive days',                         false, false),
  ('vote_cast',                 2,  'Cast a blueprint vote (post-collapse)',                 false, false),
  ('plan_vote',                 2,  'Endorse a transitional plan',                           false, false),
  ('expert_vote',               1,  'Vote approve/reject on a nominated expert',             false, false),
  ('amendment_vote',            1,  'Vote on an amendment',                                  false, false),
  ('amendment_proposed',        3,  'Propose an amendment (MID+ only)',                      false, false),
  ('amendment_500_upvotes',     1,  'Your amendment reached 500 upvotes',                   false, false),
  ('comment_posted',            1,  'Ask an expert a question in Q&A',                      false, false),
  ('plan_signed',               1,  'Sign an incubator plan',                                false, false),
  ('invited_user_joined',       5,  'Someone you invited successfully registered',           false, false),
  ('email_verified',            1,  'Confirmed email address (OTP)',                         true,  false),
  ('institutional_email',       2,  'Verified institutional (.edu/.gov) email',              true,  false),
  ('phone_verified',            2,  'Verified phone number via SMS OTP',                     true,  false),
  ('photo_verified',            1,  'Profile photo approved by admin',                       true,  false),
  ('id_verified',               3,  'Government ID approved by admin',                       true,  false),
  ('zk_proof_linked',           2,  'Linked a ZK identity proof (future)',                   true,  false),
  ('streak_7',                  3,  'Reached a 7-day consecutive login streak',              false, false),
  ('streak_30',                10,  'Reached a 30-day consecutive login streak',             false, false),
  ('invited_user_banned',      -3,  'A user you invited was banned by moderators',          false, false)
ON CONFLICT (event_type) DO NOTHING;

-- Verification queue table
CREATE TABLE IF NOT EXISTS verification_queue (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type         text NOT NULL CHECK (type IN ('photo', 'id_document')),
  file_url     text NOT NULL,
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by  uuid REFERENCES profiles(id),
  reviewed_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE verification_queue ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'verification_queue' AND policyname = 'vq_own_read') THEN
    CREATE POLICY "vq_own_read" ON verification_queue FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'verification_queue' AND policyname = 'vq_own_insert') THEN
    CREATE POLICY "vq_own_insert" ON verification_queue FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'verification_queue' AND policyname = 'vq_admin') THEN
    CREATE POLICY "vq_admin" ON verification_queue FOR ALL
      USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));
  END IF;
END $$;
