import { requireAdmin } from './_auth.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    const { supabase } = ctx;

    const { user_id, remaining } = req.body || {};

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required.' });
    }

    const safeRemaining = Math.min(Math.max(parseInt(remaining, 10) || 0, 0), 100);

    const { error } = await supabase
        .from('profiles')
        .update({ invite_codes_remaining: safeRemaining })
        .eq('id', user_id);

    if (error) {
        return res.status(500).json({ error: error.message || 'Failed to update invite count.' });
    }

    return res.status(200).json({ ok: true });
}
