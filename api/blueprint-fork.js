// api/blueprint-fork.js
// POST — authenticated. Forks an official (or public) blueprint into the caller's account.
// Body: { blueprintId: string, name?: { en, fa } }

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateForkId() {
    return 'fork_' + Math.random().toString(36).slice(2, 10);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized.' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(auth.slice(7));
    if (authError || !user) return res.status(401).json({ error: 'Invalid session.' });

    const { blueprintId, name } = req.body || {};
    if (!blueprintId) return res.status(400).json({ error: 'blueprintId required.' });

    // Fetch source blueprint
    const { data: source, error: srcError } = await supabase
        .from('blueprints')
        .select('*')
        .eq('id', blueprintId)
        .single();

    if (srcError || !source) return res.status(404).json({ error: 'Blueprint not found.' });
    if (!source.is_official && !source.is_public) {
        return res.status(403).json({ error: 'Cannot fork a private blueprint.' });
    }

    // Limit: max 10 forks per user
    const { count } = await supabase
        .from('blueprints')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('is_official', false);

    if (count >= 10) return res.status(429).json({ error: 'Fork limit reached (10).' });

    const forkId = generateForkId();
    const forkName = name || { en: `${source.name_en} (fork)`, fa: `${source.name_fa} (فورک)` };

    const { data: fork, error: insertError } = await supabase
        .from('blueprints')
        .insert({
            id:                 forkId,
            name_en:            forkName.en,
            name_fa:            forkName.fa,
            use_force_layout:   source.use_force_layout,
            is_official:        false,
            owner_id:           user.id,
            forked_from:        source.id,
            sectors_data:       source.sectors_data,
            connections_data:   source.connections_data,
            shared_layers_data: source.shared_layers_data,
            is_public:          false,
        })
        .select()
        .single();

    if (insertError) return res.status(500).json({ error: insertError.message });

    return res.status(201).json({ ok: true, forkId: fork.id });
}
