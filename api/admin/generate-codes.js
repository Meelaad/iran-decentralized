import { requireAdmin } from './_auth.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    const { supabase } = ctx;

    const { user_id, count } = req.body || {};

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required.' });
    }

    const safeCount = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);

    const { error } = await supabase.rpc('admin_generate_codes', {
        p_owner_id: user_id,
        p_count:    safeCount,
    });

    if (error) {
        return res.status(500).json({ error: error.message || 'Failed to generate codes.' });
    }

    return res.status(200).json({ ok: true });
}
