import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function requireAdmin(req, res) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) { res.status(401).json({ error: 'Unauthorized.' }); return null; }
    const { data: { user }, error } = await supabase.auth.getUser(auth.slice(7));
    if (error || !user) { res.status(401).json({ error: 'Invalid session.' }); return null; }
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) { res.status(403).json({ error: 'Forbidden.' }); return null; }
    return { user, supabase };
}
