import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const VALID_BLUEPRINTS = new Set([
    'decentralized',
    'constMonarchy',
    'secularLiberal',
    'federalDemocratic',
    'democraticSocialist',
    'absoluteMonarchy',
]);

function calcAge(dateStr) {
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    // ── Auth ──────────────────────────────────────────────────────────────────
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(auth.slice(7));
    if (authError || !user) {
        return res.status(401).json({ error: 'Invalid or expired session.' });
    }

    // ── Validate blueprint ────────────────────────────────────────────────────
    const { blueprintId } = req.body || {};
    if (!blueprintId || !VALID_BLUEPRINTS.has(blueprintId)) {
        return res.status(400).json({ error: 'Invalid blueprint ID.' });
    }

    // ── Server-side age check — cannot be bypassed by client ──────────────────
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('birth_date')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        return res.status(500).json({ error: 'Could not read your profile.' });
    }

    if (!profile.birth_date) {
        return res.status(403).json({ error: 'age_unverified' });
    }

    const age = calcAge(profile.birth_date);
    if (isNaN(age) || age < 18) {
        return res.status(403).json({ error: 'age_ineligible' });
    }
    if (age > 99) {
        return res.status(403).json({ error: 'invalid_date' });
    }

    // ── Cast vote ─────────────────────────────────────────────────────────────
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ preferred_blueprint: blueprintId })
        .eq('id', user.id);

    if (updateError) {
        return res.status(500).json({ error: 'Failed to save vote. Please try again.' });
    }

    return res.status(200).json({ ok: true });
}
