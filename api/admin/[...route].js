import { requireAdmin } from '../../../lib/admin/_auth.js';
import { getUsers, generateCodes, deleteCode, updateInvites, seedBlueprints, saveBlueprintLayout } from '../../../lib/admin/operations.js';
import { rateLimit, validateRequestSize, setSecurityHeaders } from '../../../lib/security/middleware.js';

export default async function handler(req, res) {
    setSecurityHeaders(res);
    const path = req.url.split('/api/admin/')[1]?.split('?')[0] || '';

    try {
        rateLimit(req, 'api');
        validateRequestSize(req, 500 * 1024);
        await requireAdmin(req);
    } catch (error) {
        const status = error.status || 401;
        const message = error.error || 'Unauthorized';
        return res.status(status).json({ error: message });
    }

    try {
        switch (path) {
            case 'users':
                if (req.method !== 'GET') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                const users = await getUsers();
                return res.status(200).json(users);

            case 'generate-codes':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                await generateCodes(req.body);
                return res.status(200).json({ ok: true });

            case 'delete-code':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                await deleteCode(req.body.code_id);
                return res.status(200).json({ ok: true });

            case 'update-invites':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                await updateInvites(req.body);
                return res.status(200).json({ ok: true });

            case 'seed-blueprints':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                const result = await seedBlueprints(req.body.blueprints);
                return res.status(200).json(result);

            case 'save-blueprint-layout':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                await saveBlueprintLayout(req.body);
                return res.status(200).json({ ok: true });

            case 'verification/approve':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                {
                    const body = req.body || {};
                    const { user_id, type } = body;
                    if (!user_id || !type) return res.status(400).json({ error: 'user_id and type required' });
                    // Map approval types to event_type and delta
                    const mapping = {
                        photo: { event: 'photo_verified', delta: 1 },
                        id: { event: 'id_verified', delta: 3 },
                        phone: { event: 'phone_verified', delta: 2 },
                        institutional_email: { event: 'institutional_email_verified', delta: 2 },
                    };
                    const m = mapping[type];
                    if (!m) return res.status(400).json({ error: 'unknown verification type' });

                    const { createClient } = await import('@supabase/supabase-js');
                    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

                    await supabase.from('civic_score_events').insert({ user_id, event_type: m.event, score_delta: m.delta, metadata: { approved_by: req.headers['x-user-id'] || null } });

                    // increment civic_score
                    const { data: profile } = await supabase.from('profiles').select('civic_score').eq('id', user_id).maybeSingle();
                    const newScore = (profile?.civic_score || 0) + m.delta;
                    await supabase.from('profiles').update({ civic_score: newScore }).eq('id', user_id);

                    return res.status(200).json({ ok: true, event: m.event, newScore });
                }

            case 'leaderboard/snapshot':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                {
                    const { takeLeaderboardSnapshot } = await import('../../lib/admin/leaderboard.js');
                    const out = await takeLeaderboardSnapshot();
                    if (!out) return res.status(500).json({ error: 'snapshot_failed' });
                    return res.status(200).json({ ok: true, inserted: out.inserted || out.inserted });
                }

            default:
                return res.status(404).json({ error: 'Endpoint not found in Admin domain' });
        }
    } catch (error) {
        const status = error.status || 500;
        const message = error.error || 'Internal Server Error';
        if (status === 500) {
            console.error(`Admin Domain Error [${path}]:`, message);
        }
        return res.status(status).json({ error: message });
    }
}
