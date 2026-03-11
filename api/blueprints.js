// api/blueprints.js
// GET /api/blueprints?id=xxx  — single blueprint by ID
// GET /api/blueprints          — all official blueprints (+ caller's own forks if authed)

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function rowToBlueprint(row) {
    return {
        id: row.id,
        name: { en: row.name_en, fa: row.name_fa },
        useForceLayout: row.use_force_layout,
        isOfficial: row.is_official,
        ownerId: row.owner_id,
        forkedFrom: row.forked_from,
        description: { en: row.description_en || '', fa: row.description_fa || '' },
        sectors: row.sectors_data || [],
        connections: row.connections_data || [],
        sharedLayers: row.shared_layers_data || [],
        createdAt: row.created_at,
    };
}

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    // Resolve optional caller identity
    let callerId = null;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
        const { data: { user } } = await supabase.auth.getUser(auth.slice(7));
        if (user) callerId = user.id;
    }

    const { id } = req.query;

    if (id) {
        // Single blueprint
        const { data, error } = await supabase
            .from('blueprints')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) return res.status(404).json({ error: 'Blueprint not found.' });
        // Check visibility
        if (!data.is_official && !data.is_public && data.owner_id !== callerId) {
            return res.status(403).json({ error: 'Forbidden.' });
        }
        return res.json(rowToBlueprint(data));
    }

    // All official blueprints
    const { data: official } = await supabase
        .from('blueprints')
        .select('*')
        .eq('is_official', true)
        .order('created_at', { ascending: true });

    const result = (official || []).map(rowToBlueprint);

    // If authed, also return caller's own forks
    if (callerId) {
        const { data: forks } = await supabase
            .from('blueprints')
            .select('*')
            .eq('owner_id', callerId)
            .eq('is_official', false)
            .order('created_at', { ascending: false });
        if (forks?.length) result.push(...forks.map(rowToBlueprint));
    }

    return res.json(result);
}
