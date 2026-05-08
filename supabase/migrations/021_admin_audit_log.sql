-- Admin audit log: every admin action is recorded
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    action      text NOT NULL,
    target_id   uuid,
    target_type text,
    metadata    jsonb DEFAULT '{}',
    ip          text,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_log_admin_id   ON admin_audit_log(admin_id);
CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_log_action     ON admin_audit_log(action);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON admin_audit_log
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can read audit log" ON admin_audit_log
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
    );

GRANT SELECT ON admin_audit_log TO authenticated;
