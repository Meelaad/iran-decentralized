import { requireAdmin } from './_auth.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    const { supabase } = ctx;

    const { code_id } = req.body || {};
    if (!code_id) {
        return res.status(400).json({ error: 'code_id is required.' });
    }

    // Only allow deleting unused codes
    const { data: existing, error: fetchError } = await supabase
        .from('invite_codes')
        .select('id, used_by')
        .eq('id', code_id)
        .single();

    if (fetchError || !existing) {
        return res.status(404).json({ error: 'Code not found.' });
    }

    if (existing.used_by) {
        return res.status(409).json({ error: 'Cannot remove a code that has already been used.' });
    }

    const { error: deleteError } = await supabase
        .from('invite_codes')
        .delete()
        .eq('id', code_id);

    if (deleteError) {
        return res.status(500).json({ error: 'Failed to delete code.' });
    }

    return res.status(200).json({ ok: true });
}
