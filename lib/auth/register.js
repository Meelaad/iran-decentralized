import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function completeRegistration(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        throw { status: 401, error: 'Unauthorized.' };
    }

    const token = auth.slice(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
        throw { status: 401, error: 'Invalid or expired session.' };
    }

    const { invite_code, full_name, country, user_type, metadata, preferred_blueprint, birth_year } = req.body || {};
    
    if (!invite_code || typeof invite_code !== 'string') {
        throw { status: 400, error: 'Valid invite code is required.' };
    }
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2 || full_name.trim().length > 100) {
        throw { status: 400, error: 'Full name must be between 2 and 100 characters.' };
    }
    if (!country || typeof country !== 'string' || country.trim().length < 2 || country.trim().length > 100) {
        throw { status: 400, error: 'Country is required.' };
    }
    
    const normalizedCode = invite_code.trim().toUpperCase().slice(0, 20);

    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

    if (existingProfile) {
        return { ok: true, already_registered: true };
    }

    let codeRow = null;
    const isSeed = process.env.SEED_INVITE_CODE && normalizedCode === process.env.SEED_INVITE_CODE;

    if (!isSeed) {
        const { data: fetchedCode, error: codeError } = await supabase
            .from('invite_codes')
            .select('id, owner_id, used_by')
            .eq('code', normalizedCode)
            .single();

        if (codeError || !fetchedCode) {
            throw { status: 400, error: 'Invite code not found.' };
        }
        if (fetchedCode.used_by !== null) {
            throw { status: 409, error: 'Invite code has already been used.' };
        }
        codeRow = fetchedCode;
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.socket?.remoteAddress
        || null;

    const VALID_BLUEPRINTS = ['decentralized', 'constMonarchy', 'secularLiberal'];
    const currentYear = new Date().getFullYear();
    const parsedBirthYear = parseInt(birth_year, 10);
    const validBirthYear = !isNaN(parsedBirthYear) && parsedBirthYear >= 1900 && parsedBirthYear <= currentYear
        ? parsedBirthYear : null;

    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            full_name: full_name.trim().slice(0, 100),
            country: country.trim().slice(0, 100),
            user_type: ['citizen', 'expert', 'observer'].includes(user_type) ? user_type : 'citizen',
            invited_by: codeRow?.owner_id ?? null,
            preferred_blueprint: VALID_BLUEPRINTS.includes(preferred_blueprint) ? preferred_blueprint : 'decentralized',
            birth_year: validBirthYear,
        });

    if (profileError) {
        throw { status: 500, error: 'Failed to create profile.' };
    }

    if (!isSeed && codeRow) {
        await supabase
            .from('invite_codes')
            .update({ used_by: user.id, used_at: new Date().toISOString() })
            .eq('id', codeRow.id);

        await supabase.rpc('decrement_invite_remaining', {
            profile_id: codeRow.owner_id,
        });
    }

    const meta = metadata && typeof metadata === 'object' ? metadata : {};
    await supabase.from('registration_metadata').insert({
        user_id: user.id,
        ip_address: ip,
        user_agent: meta.user_agent ? String(meta.user_agent).slice(0, 500) : null,
        timezone: meta.timezone ?? null,
        language: meta.language ?? null,
        screen: meta.screen ?? null,
        color_depth: meta.color_depth ?? null,
        hardware_cores: meta.hardware_cores ?? null,
        device_memory: meta.device_memory ?? null,
        platform: meta.platform ?? null,
        touch_points: meta.touch_points ?? null,
        canvas_hash: meta.canvas_hash ?? null,
        webgl_vendor: meta.webgl_vendor ? String(meta.webgl_vendor).slice(0, 200) : null,
        webgl_renderer: meta.webgl_renderer ? String(meta.webgl_renderer).slice(0, 200) : null,
        audio_hash: meta.audio_hash ?? null,
    });

    return { ok: true };
}
