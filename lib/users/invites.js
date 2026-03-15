import { createClient } from '@supabase/supabase-js';
import { customAlphabet } from 'nanoid';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const nanoid6 = customAlphabet(ALPHABET, 6);

function randomCode() {
    return nanoid6();
}

export async function generateInviteCode(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        throw { status: 401, error: 'Unauthorized.' };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(auth.slice(7));
    if (authError || !user) {
        throw { status: 401, error: 'Invalid or expired session.' };
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('invite_codes_remaining')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        throw { status: 500, error: 'Could not read your profile.' };
    }

    if (profile.invite_codes_remaining <= 0) {
        throw { status: 403, error: 'No invite codes remaining.' };
    }

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
        throw { status: 500, error: 'Failed to generate a unique code. Try again.' };
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
        .from('invite_codes')
        .insert({ code, owner_id: user.id, expires_at: expiresAt });

    if (insertError) {
        throw { status: 500, error: 'Failed to save code. Your quota was not affected.' };
    }

    const { error: rpcError } = await supabase.rpc('decrement_invite_remaining', {
        profile_id: user.id,
    });

    if (rpcError) {
        await supabase.from('invite_codes').delete().eq('code', code).eq('owner_id', user.id);
        throw { status: 500, error: 'Failed to update quota. Please try again.' };
    }

    return { code };
}
