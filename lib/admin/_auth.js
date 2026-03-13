import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function requireAdmin(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        throw { status: 401, error: 'Unauthorized.' };
    }

    const { data: { user }, error } = await supabase.auth.getUser(auth.slice(7));
    if (error || !user) {
        throw { status: 401, error: 'Invalid session.' };
    }

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) {
        throw { status: 403, error: 'Forbidden.' };
    }

    return { user, supabase };
}
