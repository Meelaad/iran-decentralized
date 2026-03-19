import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function getUsers() {
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });

    if (profilesError) {
        throw { status: 500, error: 'Failed to fetch profiles.' };
    }

    const { data: allCodes } = await supabase
        .from('invite_codes')
        .select('*')
        .order('created_at', { ascending: true });

    const { data: allMeta } = await supabase
        .from('registration_metadata')
        .select('*');

    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 });

    const emailMap = {};
    if (authUsers) {
        for (const u of authUsers) {
            emailMap[u.id] = u.email;
        }
    }

    const nameMap = {};
    for (const p of profiles) {
        nameMap[p.id] = p.full_name;
    }

    return profiles.map(p => ({
        id: p.id,
        email: emailMap[p.id] || null,
        full_name: p.full_name,
        country: p.country,
        user_type: p.user_type,
        invited_by: p.invited_by,
        invited_by_name: p.invited_by ? (nameMap[p.invited_by] || p.invited_by) : null,
        invite_codes_remaining: p.invite_codes_remaining,
        is_admin: p.is_admin,
        created_at: p.created_at,
        invite_codes: (allCodes || [])
            .filter(c => c.owner_id === p.id)
            .map(c => ({ id: c.id, code: c.code, used_by: c.used_by, used_at: c.used_at, created_at: c.created_at })),
        metadata: (allMeta || []).find(m => m.user_id === p.id) || null,
    }));
}

export async function generateCodes({ user_id, count }) {
    if (!user_id) {
        throw { status: 400, error: 'user_id is required.' };
    }

    const safeCount = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);

    const { error } = await supabase.rpc('admin_generate_codes', {
        p_owner_id: user_id,
        p_count: safeCount,
    });

    if (error) {
        throw { status: 500, error: 'Failed to generate codes.' };
    }

    return { ok: true };
}

export async function deleteCode(code_id) {
    if (!code_id) {
        throw { status: 400, error: 'code_id is required.' };
    }

    const { data: existing, error: fetchError } = await supabase
        .from('invite_codes')
        .select('id, used_by')
        .eq('id', code_id)
        .single();

    if (fetchError || !existing) {
        throw { status: 404, error: 'Code not found.' };
    }

    if (existing.used_by) {
        throw { status: 409, error: 'Cannot remove a code that has already been used.' };
    }

    const { error: deleteError } = await supabase
        .from('invite_codes')
        .delete()
        .eq('id', code_id);

    if (deleteError) {
        throw { status: 500, error: 'Failed to delete code.' };
    }

    return { ok: true };
}

export async function updateInvites({ user_id, remaining }) {
    if (!user_id) {
        throw { status: 400, error: 'user_id is required.' };
    }

    const safeRemaining = Math.min(Math.max(parseInt(remaining, 10) || 0, 0), 100);

    const { error } = await supabase
        .from('profiles')
        .update({ invite_codes_remaining: safeRemaining })
        .eq('id', user_id);

    if (error) {
        throw { status: 500, error: 'Failed to update invite count.' };
    }

    return { ok: true };
}

export async function seedBlueprints(blueprints) {
    if (!Array.isArray(blueprints) || blueprints.length === 0) {
        throw { status: 400, error: 'blueprints array required.' };
    }

    const rows = blueprints.map(bp => ({
        id: bp.id,
        name_en: bp.name?.en || bp.id,
        name_fa: bp.name?.fa || bp.id,
        use_force_layout: bp.useForceLayout ?? true,
        is_official: true,
        owner_id: null,
        forked_from: null,
        sectors_data: bp.sectors || [],
        connections_data: bp.connections || [],
        shared_layers_data: bp.sharedLayers || [],
        is_public: true,
        description_en: bp.description?.en || null,
        description_fa: bp.description?.fa || null,
    }));

    const { error } = await supabase
        .from('blueprints')
        .upsert(rows, { onConflict: 'id' });

    if (error) {
        throw { status: 500, error: 'Failed to seed blueprints.' };
    }

    return { ok: true, seeded: rows.length };
}

export async function getMapMarkers() {
    const { data, error } = await supabase
        .from('map_markers')
        .select('*')
        .order('created_at', { ascending: true });
    if (error) throw { status: 500, error: 'Failed to fetch map markers.' };
    return data ?? [];
}

export async function addMapMarker({ type, lon, lat, color, label, description, region, pop_estimate, created_by }) {
    if (!type || lon == null || lat == null) {
        throw { status: 400, error: 'type, lon, lat are required.' };
    }
    if (!['circle', 'triangle'].includes(type)) {
        throw { status: 400, error: 'type must be circle or triangle.' };
    }
    const { data, error } = await supabase
        .from('map_markers')
        .insert({
            type,
            lon: parseFloat(lon),
            lat: parseFloat(lat),
            color: color || '#26DEC2',
            label: label || '',
            description: description || null,
            region: region || null,
            pop_estimate: pop_estimate || null,
            created_by: created_by || null,
        })
        .select()
        .single();
    if (error) throw { status: 500, error: 'Failed to add map marker.' };
    return data;
}

export async function updateMapMarker({ id, ...fields }) {
    if (!id) throw { status: 400, error: 'id is required.' };
    const allowed = ['type', 'lon', 'lat', 'color', 'label', 'description', 'region', 'pop_estimate'];
    const updates = { updated_at: new Date().toISOString() };
    for (const k of allowed) {
        if (fields[k] !== undefined) updates[k] = fields[k];
    }
    if (updates.lon != null) updates.lon = parseFloat(updates.lon);
    if (updates.lat != null) updates.lat = parseFloat(updates.lat);
    const { data, error } = await supabase
        .from('map_markers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw { status: 500, error: 'Failed to update map marker.' };
    return data;
}

export async function deleteMapMarker(id) {
    if (!id) throw { status: 400, error: 'id is required.' };
    const { error } = await supabase.from('map_markers').delete().eq('id', id);
    if (error) throw { status: 500, error: 'Failed to delete map marker.' };
    return { ok: true };
}

export async function saveBlueprintLayout({ blueprintId, positions }) {
    if (!blueprintId || typeof positions !== 'object') {
        throw { status: 400, error: 'Missing blueprintId or positions.' };
    }

    const { error } = await supabase
        .from('blueprint_layouts')
        .upsert(
            { blueprint_id: blueprintId, positions, updated_at: new Date().toISOString() },
            { onConflict: 'blueprint_id' }
        );

    if (error) {
        throw { status: 500, error: 'Failed to save blueprint layout.' };
    }

    return { ok: true };
}
