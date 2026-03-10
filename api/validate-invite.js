import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const { code } = req.body || {};

    if (!code) {
        return res.status(400).json({ error: 'Invite code is required.' });
    }

    const normalized = String(code).trim().toUpperCase();

    if (!/^[A-Z0-9]{8}$/.test(normalized)) {
        return res.status(400).json({ error: 'Invalid invite code format.' });
    }

    // Seed code bypass — no DB lookup needed
    if (process.env.SEED_INVITE_CODE && normalized === process.env.SEED_INVITE_CODE) {
        return res.status(200).json({ ok: true, seed: true });
    }

    const { data, error } = await supabase
        .from('invite_codes')
        .select('id, used_by')
        .eq('code', normalized)
        .single();

    if (error || !data) {
        return res.status(404).json({ error: 'Invite code not found.' });
    }

    if (data.used_by !== null) {
        return res.status(409).json({ error: 'This invite code has already been used.' });
    }

    return res.status(200).json({ ok: true });
}