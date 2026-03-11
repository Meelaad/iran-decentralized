import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    // Auth check
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }
    const token = auth.slice(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
        return res.status(401).json({ error: 'Invalid or expired session.' });
    }

    const { invite_code, full_name, country, user_type, metadata, preferred_blueprint } = req.body || {};

    const normalizedCode = String(invite_code || '').trim().toUpperCase();

    // Check if profile already exists — idempotent
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

    if (existingProfile) {
        return res.status(200).json({ ok: true, already_registered: true });
    }

    // Resolve invite code
    let codeRow = null;
    const isSeed = process.env.SEED_INVITE_CODE && normalizedCode === process.env.SEED_INVITE_CODE;

    if (!isSeed) {
        const { data: fetchedCode, error: codeError } = await supabase
            .from('invite_codes')
            .select('id, owner_id, used_by')
            .eq('code', normalizedCode)
            .single();

        if (codeError || !fetchedCode) {
            return res.status(400).json({ error: 'Invite code not found.' });
        }
        if (fetchedCode.used_by !== null) {
            return res.status(409).json({ error: 'Invite code has already been used.' });
        }
        codeRow = fetchedCode;
    }

    // Get IP from request
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.socket?.remoteAddress
        || null;

    // Insert profile
    const VALID_BLUEPRINTS = ['decentralized', 'constMonarchy', 'secularLiberal'];
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id:                  user.id,
            full_name:           String(full_name || '').trim(),
            country:             String(country || '').trim(),
            user_type:           String(user_type || 'citizen').trim(),
            invited_by:          codeRow?.owner_id ?? null,
            preferred_blueprint: VALID_BLUEPRINTS.includes(preferred_blueprint) ? preferred_blueprint : 'decentralized',
        });

    if (profileError) {
        return res.status(500).json({ error: 'Failed to create profile.' });
    }

    // Mark code as used and decrement owner's remaining count
    if (!isSeed && codeRow) {
        await supabase
            .from('invite_codes')
            .update({ used_by: user.id, used_at: new Date().toISOString() })
            .eq('id', codeRow.id);

        await supabase.rpc('decrement_invite_remaining', {
            profile_id: codeRow.owner_id,
        });
    }

    // Insert registration metadata (best-effort)
    const meta = metadata && typeof metadata === 'object' ? metadata : {};
    await supabase.from('registration_metadata').insert({
        user_id:        user.id,
        ip_address:     ip,
        user_agent:     meta.user_agent ? String(meta.user_agent).slice(0, 500) : null,
        timezone:       meta.timezone ?? null,
        language:       meta.language ?? null,
        screen:         meta.screen ?? null,
        color_depth:    meta.color_depth ?? null,
        hardware_cores: meta.hardware_cores ?? null,
        device_memory:  meta.device_memory ?? null,
        platform:       meta.platform ?? null,
        touch_points:   meta.touch_points ?? null,
        canvas_hash:    meta.canvas_hash ?? null,
        webgl_vendor:   meta.webgl_vendor ? String(meta.webgl_vendor).slice(0, 200) : null,
        webgl_renderer: meta.webgl_renderer ? String(meta.webgl_renderer).slice(0, 200) : null,
        audio_hash:     meta.audio_hash ?? null,
    });

    return res.status(200).json({ ok: true });
}
