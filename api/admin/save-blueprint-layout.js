// POST /api/admin/save-blueprint-layout
// Body: { blueprintId: string, positions: { [sectorId]: { x: number, y: number } } }
// Requires admin session.

import { requireAdmin } from './_auth.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const ctx = await requireAdmin(req, res);
    if (!ctx) return;

    const { blueprintId, positions } = req.body;
    if (!blueprintId || typeof positions !== 'object') {
        return res.status(400).json({ error: 'Missing blueprintId or positions.' });
    }

    const { error } = await ctx.supabase
        .from('blueprint_layouts')
        .upsert(
            { blueprint_id: blueprintId, positions, updated_at: new Date().toISOString() },
            { onConflict: 'blueprint_id' }
        );

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
}
