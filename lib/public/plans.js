import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function safePlanRow(row) {
    return {
        id: row.id,
        slug: row.slug,
        name: { en: row.name_en, fa: row.name_fa },
        summary: { en: row.summary_en || '', fa: row.summary_fa || '' },
        fullDocUrl: row.full_doc_url,
        status: row.status,
        signatureCount: row.signature_count,
        signatureThreshold: row.signature_threshold,
        isOfficial: row.is_official,
        coverColor: row.cover_color,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export async function getArenaPlans(req) {
    const { data: plans, error } = await supabase
        .from('transitional_plans')
        .select('*')
        .eq('status', 'arena')
        .order('created_at', { ascending: false });

    if (error) throw { status: 500, error: 'Failed to load plans.' };

    const result = [];
    for (const p of plans || []) {
        const { data: stats } = await supabase
            .from('daily_plan_stats')
            .select('*')
            .eq('plan_id', p.id)
            .order('stat_date', { ascending: false })
            .limit(1);
        result.push({
            ...safePlanRow(p),
            latestStats: (stats && stats[0]) || null
        });
    }
    return result;
}

export async function getPlanBySlug(slug, req) {
    const { data: plan } = await supabase
        .from('transitional_plans')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
    if (!plan) return null;

    const { data: sectors } = await supabase
        .from('plan_sectors')
        .select('*')
        .eq('plan_id', plan.id)
        .order('sort_order', { ascending: true });

    const { data: experts } = await supabase
        .from('experts')
        .select('*')
        .eq('plan_id', plan.id);

    const { data: stats } = await supabase
        .from('daily_plan_stats')
        .select('*')
        .eq('plan_id', plan.id)
        .order('stat_date', { ascending: false })
        .limit(1);

    const amendmentCountRes = await supabase
        .from('amendments')
        .select('id', { count: 'exact' })
        .eq('plan_id', plan.id);

    const amendmentCount = amendmentCountRes?.count || 0;

    return {
        ...safePlanRow(plan),
        sectors: sectors || [],
        experts: experts || [],
        latestStats: (stats && stats[0]) || null,
        amendmentCount
    };
}

async function getCallerId(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;
    const token = auth.slice(7);
    const { data: { user } } = await supabase.auth.getUser(token);
    return user?.id || null;
}

export async function endorsePlan(req) {
    const callerId = await getCallerId(req);
    if (!callerId) throw { status: 401, error: 'Unauthorized' };

    const planId = (req.body || {}).planId;
    if (!planId) throw { status: 400, error: 'planId is required' };

    // Check age (if birth_date exists)
    const { data: profile } = await supabase
        .from('profiles')
        .select('birth_date, preferred_blueprint')
        .eq('id', callerId)
        .maybeSingle();

    if (profile?.birth_date) {
        const birth = new Date(profile.birth_date);
        const age = Math.floor((Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        if (age < 18) throw { status: 403, error: 'Must be 18 or older to endorse.' };
    }

    // Was this user's first endorsement?
    const { data: existing } = await supabase
        .from('plan_endorsements')
        .select('*')
        .eq('user_id', callerId);
    const hadEndorsements = (existing && existing.length > 0);

    // Upsert endorsement
    const { error: upsertErr } = await supabase
        .from('plan_endorsements')
        .upsert({ user_id: callerId, plan_id: planId }, { onConflict: 'user_id' });
    if (upsertErr) throw { status: 500, error: 'Failed to endorse plan.' };

    // Civic score + badge only on first-ever endorsement (not on every plan switch)
    if (!hadEndorsements) {
        const { error: scoreErr } = await supabase
            .from('civic_score_events')
            .insert({ user_id: callerId, event_type: 'plan_vote', score_delta: 2, metadata: JSON.stringify({ plan_id: planId }) });
        if (scoreErr) console.error('Failed to log score event', scoreErr);

        await supabase.from('profiles').update({ preferred_blueprint: planId }).eq('id', callerId);
        const { awardBadgeToUser } = await import('./badges.js');
        await awardBadgeToUser(callerId, 'endorser', { plan_id: planId });
    }

    return { ok: true };
}

export async function signPlan(req) {
    const callerId = await getCallerId(req);
    if (!callerId) throw { status: 401, error: 'Unauthorized' };

    const planId = (req.body || {}).planId;
    if (!planId) throw { status: 400, error: 'planId is required' };

    // Deduplication — check before inserting to prevent double civic score
    const { data: existingSig } = await supabase
        .from('plan_signatures')
        .select('id')
        .eq('user_id', callerId)
        .eq('plan_id', planId)
        .maybeSingle();

    if (existingSig) {
        // Already signed — return current count without awarding score again
        const { count } = await supabase
            .from('plan_signatures')
            .select('*', { count: 'exact', head: true })
            .eq('plan_id', planId);
        return { ok: true, signatureCount: count || 0, alreadySigned: true };
    }

    // Insert signature — DB trigger handles signature_count increment + auto-promote atomically
    const { error: insErr } = await supabase
        .from('plan_signatures')
        .insert({ user_id: callerId, plan_id: planId });
    if (insErr) throw { status: 500, error: 'Failed to sign plan.' };

    // Read updated count (set by trigger)
    const { count: sigCount } = await supabase
        .from('plan_signatures')
        .select('*', { count: 'exact', head: true })
        .eq('plan_id', planId);

    // Log civic score event (first signature only — dedup check above ensures this)
    const { error: scoreErr } = await supabase
        .from('civic_score_events')
        .insert({ user_id: callerId, event_type: 'plan_endorsed', score_delta: 1, metadata: JSON.stringify({ plan_id: planId }) });
    if (scoreErr) console.error('Failed to log signature score event', scoreErr);

    // Award badge (first signature for this plan)
    const { awardBadgeToUser } = await import('./badges.js');
    await awardBadgeToUser(callerId, 'plan_signed', { plan_id: planId });

    return { ok: true, signatureCount: sigCount || 0 };
}
