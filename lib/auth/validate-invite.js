import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function validateInviteCode(code) {
    if (!code || typeof code !== 'string') {
        throw { status: 400, error: 'Invite code is required.' };
    }

    const normalized = code.trim().toUpperCase().slice(0, 20);

    if (!/^[A-Z0-9]{8}$/.test(normalized)) {
        throw { status: 400, error: 'Invalid invite code format.' };
    }

    if (process.env.SEED_INVITE_CODE && normalized === process.env.SEED_INVITE_CODE) {
        return { ok: true, seed: true };
    }

    const { data, error } = await supabase
        .from('invite_codes')
        .select('id, used_by')
        .eq('code', normalized)
        .single();

    if (error || !data) {
        throw { status: 404, error: 'Invite code not found.' };
    }

    if (data.used_by !== null) {
        throw { status: 409, error: 'This invite code has already been used.' };
    }

    return { ok: true };
}
