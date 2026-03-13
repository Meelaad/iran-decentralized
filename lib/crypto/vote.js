import { createClient } from '@supabase/supabase-js';
import { calcAge } from '../utils.js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const VALID_BLUEPRINTS = new Set([
    'decentralized',
    'constMonarchy',
    'secularLiberal',
    'federalDemocratic',
    'democraticSocialist',
    'absoluteMonarchy',
]);

export async function castVote(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        throw { status: 401, error: 'Unauthorized.' };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(auth.slice(7));
    if (authError || !user) {
        throw { status: 401, error: 'Invalid or expired session.' };
    }

    const { blueprintId } = req.body || {};
    if (!blueprintId || !VALID_BLUEPRINTS.has(blueprintId)) {
        throw { status: 400, error: 'Invalid blueprint ID.' };
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('birth_date')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        throw { status: 500, error: 'Could not read your profile.' };
    }

    if (!profile.birth_date) {
        throw { status: 403, error: 'age_unverified' };
    }

    const age = calcAge(profile.birth_date);
    if (isNaN(age) || age < 18) {
        throw { status: 403, error: 'age_ineligible' };
    }
    if (age > 99) {
        throw { status: 403, error: 'invalid_date' };
    }

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ preferred_blueprint: blueprintId })
        .eq('id', user.id);

    if (updateError) {
        throw { status: 500, error: 'Failed to save vote. Please try again.' };
    }

    return { ok: true };
}
