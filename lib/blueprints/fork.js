import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateForkId() {
    return 'fork_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

export async function forkBlueprint(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        throw { status: 401, error: 'Unauthorized.' };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(auth.slice(7));
    if (authError || !user) {
        throw { status: 401, error: 'Invalid session.' };
    }

    const { blueprintId, name } = req.body || {};
    if (!blueprintId) {
        throw { status: 400, error: 'blueprintId required.' };
    }

    const { data: source, error: srcError } = await supabase
        .from('blueprints')
        .select('*')
        .eq('id', blueprintId)
        .single();

    if (srcError || !source) {
        throw { status: 404, error: 'Blueprint not found.' };
    }

    if (!source.is_official && !source.is_public) {
        throw { status: 403, error: 'Cannot fork a private blueprint.' };
    }

    const { count } = await supabase
        .from('blueprints')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('is_official', false);

    if (count >= 10) {
        throw { status: 429, error: 'Fork limit reached (10).' };
    }

    const forkId = generateForkId();
    const forkName = name || { en: `${source.name_en} (fork)`, fa: `${source.name_fa} (فورک)` };

    const { data: fork, error: insertError } = await supabase
        .from('blueprints')
        .insert({
            id: forkId,
            name_en: forkName.en,
            name_fa: forkName.fa,
            use_force_layout: source.use_force_layout,
            is_official: false,
            owner_id: user.id,
            forked_from: source.id,
            sectors_data: source.sectors_data,
            connections_data: source.connections_data,
            shared_layers_data: source.shared_layers_data,
            is_public: false,
        })
        .select()
        .single();

    if (insertError) {
        throw { status: 500, error: 'Failed to create blueprint fork.' };
    }

    return { ok: true, forkId: fork.id };
}
