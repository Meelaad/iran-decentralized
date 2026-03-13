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

export async function getBlueprintById(id, req) {
    let callerId = null;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
        const { data: { user } } = await supabase.auth.getUser(auth.slice(7));
        if (user) callerId = user.id;
    }

    const { data, error } = await supabase
        .from('blueprints')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;

    if (!data.is_official && !data.is_public && data.owner_id !== callerId) {
        throw { status: 403, error: 'Forbidden.' };
    }

    return rowToBlueprint(data);
}

export async function getBlueprints(req) {
    let callerId = null;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
        const { data: { user } } = await supabase.auth.getUser(auth.slice(7));
        if (user) callerId = user.id;
    }

    const { data: official } = await supabase
        .from('blueprints')
        .select('*')
        .eq('is_official', true)
        .order('created_at', { ascending: true });

    const result = (official || []).map(rowToBlueprint);

    if (callerId) {
        const { data: forks } = await supabase
            .from('blueprints')
            .select('*')
            .eq('owner_id', callerId)
            .eq('is_official', false)
            .order('created_at', { ascending: false });
        if (forks?.length) result.push(...forks.map(rowToBlueprint));
    }

    return result;
}
