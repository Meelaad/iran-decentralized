import { requireAdmin } from '../../lib/admin/_auth.js';
import { getUsers, generateCodes, deleteCode, updateInvites, seedBlueprints, saveBlueprintLayout, getMapMarkers, addMapMarker, updateMapMarker, deleteMapMarker } from '../../lib/admin/operations.js';
import { rateLimit, validateRequestSize, setSecurityHeaders } from '../../lib/security/middleware.js';

export default async function handler(req, res) {
    setSecurityHeaders(res);
    const path = req.url.split('/api/admin/')[1]?.split('?')[0] || '';

    let adminUser;
    try {
        rateLimit(req, 'admin');
        validateRequestSize(req, 500 * 1024);
        const adminResult = await requireAdmin(req);
        adminUser = adminResult.user;
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

            case 'plans/seed':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                {
                    const { plans } = req.body || {};
                    if (!Array.isArray(plans) || plans.length === 0) {
                        return res.status(400).json({ error: 'plans array required' });
                    }
                    const { createClient: ccS } = await import('@supabase/supabase-js');
                    const supabaseS = ccS(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
                    let seeded = 0;
                    for (const p of plans) {
                        const { error } = await supabaseS
                            .from('transitional_plans')
                            .upsert({
                                slug: p.slug,
                                name_en: p.name_en,
                                name_fa: p.name_fa,
                                summary_en: p.summary_en,
                                summary_fa: p.summary_fa,
                                cover_color: p.cover_color || null,
                                is_official: true,
                                status: p.status || 'arena',
                            }, { onConflict: 'slug', ignoreDuplicates: false });
                        if (!error) seeded++;
                    }
                    return res.status(200).json({ ok: true, seeded });
                }

            case 'plans/promote':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                {
                    const { planId } = req.body || {};
                    if (!planId) return res.status(400).json({ error: 'planId required' });
                    const { createClient: cc1 } = await import('@supabase/supabase-js');
                    const supabaseAdmin1 = cc1(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
                    await supabaseAdmin1.from('transitional_plans').update({ status: 'arena' }).eq('id', planId);
                    return res.status(200).json({ ok: true });
                }

            case 'plans/archive':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                {
                    const { planId } = req.body || {};
                    if (!planId) return res.status(400).json({ error: 'planId required' });
                    const { createClient: cc2 } = await import('@supabase/supabase-js');
                    const supabaseAdmin2 = cc2(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
                    await supabaseAdmin2.from('transitional_plans').update({ status: 'archived' }).eq('id', planId);
                    return res.status(200).json({ ok: true });
                }

            case 'verification/queue':
                if (req.method !== 'GET') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                {
                    const { createClient: cc3 } = await import('@supabase/supabase-js');
                    const supabaseAdmin3 = cc3(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
                    const { data: queueData } = await supabaseAdmin3
                        .from('verification_queue')
                        .select('id, user_id, type, file_url, status, created_at, profiles!user_id(email, full_name)')
                        .eq('status', 'pending')
                        .order('created_at');
                    return res.status(200).json(queueData ?? []);
                }

            case 'verification/review':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                {
                    const { queueId, action } = req.body || {};
                    if (!queueId || !action) return res.status(400).json({ error: 'queueId and action required' });
                    if (!['approved', 'rejected'].includes(action)) return res.status(400).json({ error: 'action must be approved or rejected' });
                    const { createClient: cc4 } = await import('@supabase/supabase-js');
                    const supabaseAdmin4 = cc4(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
                    const { data: queueItem } = await supabaseAdmin4
                        .from('verification_queue')
                        .select('user_id, type')
                        .eq('id', queueId)
                        .single();
                    if (!queueItem) return res.status(404).json({ error: 'Not found' });
                    await supabaseAdmin4
                        .from('verification_queue')
                        .update({ status: action, reviewed_by: adminUser?.id ?? null, reviewed_at: new Date().toISOString() })
                        .eq('id', queueId);
                    if (action === 'approved') {
                        const deltaMap = { photo: 1, id_document: 3 };
                        const delta = deltaMap[queueItem.type] ?? 1;
                        await supabaseAdmin4.rpc('increment_civic_score', { p_user_id: queueItem.user_id, p_delta: delta });
                        await supabaseAdmin4.from('civic_score_events').insert({
                            user_id: queueItem.user_id,
                            event_type: queueItem.type === 'photo' ? 'photo_verified' : 'id_verified',
                            score_delta: delta,
                        });
                    }
                    return res.status(200).json({ ok: true });
                }

            case 'civic/adjust':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                {
                    const { user_id, delta, reason } = req.body || {};

                    // Validate inputs
                    if (!user_id) return res.status(400).json({ error: 'user_id required' });
                    const parsedDelta = parseInt(delta, 10);
                    if (isNaN(parsedDelta) || parsedDelta === 0)
                        return res.status(400).json({ error: 'delta must be a non-zero integer' });
                    if (parsedDelta < -50 || parsedDelta > 50)
                        return res.status(400).json({ error: 'delta must be between -50 and +50 per adjustment' });
                    if (reason && typeof reason !== 'string')
                        return res.status(400).json({ error: 'reason must be a string' });
                    if (reason && reason.length > 500)
                        return res.status(400).json({ error: 'reason must be 500 characters or fewer' });

                    const { createClient: ccCivic } = await import('@supabase/supabase-js');
                    const supabaseCivic = ccCivic(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

                    // Read current score
                    const { data: profile, error: profileErr } = await supabaseCivic
                        .from('profiles')
                        .select('civic_score')
                        .eq('id', user_id)
                        .maybeSingle();
                    if (profileErr || !profile) return res.status(404).json({ error: 'User not found' });

                    const previousScore = profile.civic_score ?? 0;
                    const newScore = Math.max(0, previousScore + parsedDelta);

                    // Insert audit event first — if this fails, we abort before touching the score
                    const { error: eventErr } = await supabaseCivic.from('civic_score_events').insert({
                        user_id,
                        event_type: 'admin_adjustment',
                        score_delta: parsedDelta,
                        metadata: {
                            reason: reason || null,
                            adjusted_by: adminUser?.id ?? null,
                            previous_score: previousScore,
                            new_score: newScore,
                        },
                    });
                    if (eventErr) {
                        console.error('civic/adjust event insert failed:', eventErr.message);
                        return res.status(500).json({ error: 'Failed to log adjustment event' });
                    }

                    // Apply score change (update_trust_tier trigger fires automatically)
                    const { error: updateErr } = await supabaseCivic
                        .from('profiles')
                        .update({ civic_score: newScore })
                        .eq('id', user_id);
                    if (updateErr) {
                        console.error('civic/adjust profile update failed:', updateErr.message);
                        return res.status(500).json({ error: 'Event logged but profile update failed — check DB' });
                    }

                    return res.status(200).json({ ok: true, previousScore, newScore, delta: parsedDelta });
                }

            case 'map-markers':
                if (req.method === 'GET') {
                    const markers = await getMapMarkers();
                    return res.status(200).json(markers);
                }
                if (req.method === 'POST') {
                    const data = await addMapMarker({ ...req.body, created_by: adminUser?.id ?? null });
                    return res.status(201).json(data);
                }
                return res.status(405).json({ error: 'Method not allowed.' });

            case 'map-markers/update':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const updated = await updateMapMarker(req.body || {});
                    return res.status(200).json(updated);
                }

            case 'map-markers/delete':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    await deleteMapMarker((req.body || {}).id);
                    return res.status(200).json({ ok: true });
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
