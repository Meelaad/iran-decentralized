// api/admin/seed-blueprints.js
// POST — admin only. Upserts official blueprints from the request body.
// Call once from admin UI with the serialized BLUEPRINTS from data.js.

import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './_auth.js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { blueprints } = req.body || {};
    if (!Array.isArray(blueprints) || blueprints.length === 0) {
        return res.status(400).json({ error: 'blueprints array required.' });
    }

    const rows = blueprints.map(bp => ({
        id:                  bp.id,
        name_en:             bp.name?.en || bp.id,
        name_fa:             bp.name?.fa || bp.id,
        use_force_layout:    bp.useForceLayout ?? true,
        is_official:         true,
        owner_id:            null,
        forked_from:         null,
        sectors_data:        bp.sectors || [],
        connections_data:    bp.connections || [],
        shared_layers_data:  bp.sharedLayers || [],
        is_public:           true,
        description_en:      bp.description?.en || null,
        description_fa:      bp.description?.fa || null,
    }));

    const { error } = await supabase
        .from('blueprints')
        .upsert(rows, { onConflict: 'id' });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, seeded: rows.length });
}
