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

    // ── Auth ──────────────────────────────────────────────────────────────────
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(auth.slice(7));
    if (authError || !user) {
        return res.status(401).json({ error: 'Invalid or expired session.' });
    }

    // ── Check quota ───────────────────────────────────────────────────────────
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('invite_codes_remaining')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        return res.status(500).json({ error: 'Could not read your profile.' });
    }

    if (profile.invite_codes_remaining <= 0) {
        return res.status(403).json({ error: 'No invite codes remaining.' });
    }

    // ── Generate a unique code ────────────────────────────────────────────────
    let code = null;
    for (let attempt = 0; attempt < 10; attempt++) {
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

    // ── Insert code first (if this fails, quota is untouched) ─────────────────
    const { error: insertError } = await supabase
        .from('invite_codes')
        .insert({ code, owner_id: user.id });

    if (insertError) {
        return res.status(500).json({ error: 'Failed to save code. Your quota was not affected.' });
    }

    // ── Decrement quota — only after successful insert ────────────────────────
    const { error: rpcError } = await supabase.rpc('decrement_invite_remaining', {
        profile_id: user.id,
    });

    if (rpcError) {
        // Roll back: delete the code we just created so quota and codes stay in sync
        await supabase.from('invite_codes').delete().eq('code', code).eq('owner_id', user.id);
        return res.status(500).json({ error: 'Failed to update quota. Please try again.' });
    }

    return res.status(200).json({ code });
}
