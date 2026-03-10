import { requireAdmin } from './_auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    const { supabase } = ctx;

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });

    if (profilesError) {
        return res.status(500).json({ error: 'Failed to fetch profiles.' });
    }

    // Fetch all invite codes
    const { data: allCodes } = await supabase
        .from('invite_codes')
        .select('*')
        .order('created_at', { ascending: true });

    // Fetch all registration metadata
    const { data: allMeta } = await supabase
        .from('registration_metadata')
        .select('*');

    // Fetch auth users for emails (service role can call admin API)
    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 });

    const emailMap = {};
    if (authUsers) {
        for (const u of authUsers) {
            emailMap[u.id] = u.email;
        }
    }

    // Build name map for invited_by resolution
    const nameMap = {};
    for (const p of profiles) {
        nameMap[p.id] = p.full_name;
    }

    // Combine data
    const result = profiles.map(p => ({
        id:                     p.id,
        email:                  emailMap[p.id] || null,
        full_name:              p.full_name,
        country:                p.country,
        user_type:              p.user_type,
        invited_by:             p.invited_by,
        invited_by_name:        p.invited_by ? (nameMap[p.invited_by] || p.invited_by) : null,
        invite_codes_remaining: p.invite_codes_remaining,
        is_admin:               p.is_admin,
        created_at:             p.created_at,
        invite_codes:           (allCodes || [])
            .filter(c => c.owner_id === p.id)
            .map(c => ({ id: c.id, code: c.code, used_by: c.used_by, used_at: c.used_at, created_at: c.created_at })),
        metadata:               (allMeta || []).find(m => m.user_id === p.id) || null,
    }));

    return res.status(200).json(result);
}
