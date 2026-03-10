import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode() {
    return Array.from({ length: 8 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(auth.slice(7));
    if (authError || !user) {
        return res.status(401).json({ error: 'Invalid session.' });
    }

    // Check quota
    const { data: profile } = await supabase
        .from('profiles')
        .select('invite_codes_remaining')
        .eq('id', user.id)
        .single();

    if (!profile || profile.invite_codes_remaining <= 0) {
        return res.status(403).json({ error: 'No invite codes remaining.' });
    }

    // Generate a unique code
    let code = null;
    for (let i = 0; i < 10; i++) {
        const candidate = randomCode();
        const { data: existing } = await supabase
            .from('invite_codes')
            .select('code')
            .eq('code', candidate)
            .maybeSingle();
        if (!existing) { code = candidate; break; }
    }

    if (!code) {
        return res.status(500).json({ error: 'Failed to generate a unique code. Try again.' });
    }

    const { error: insertError } = await supabase
        .from('invite_codes')
        .insert({ code, owner_id: user.id });

    if (insertError) {
        return res.status(500).json({ error: 'Failed to save code.' });
    }

    await supabase.rpc('decrement_invite_remaining', { profile_id: user.id });

    return res.status(200).json({ code });
}
