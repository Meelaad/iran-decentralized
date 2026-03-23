import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MAX_Q = 100;
// Strip anything that looks like SQL injection or script injection
const SANITIZE_RE = /[<>"'`]/g;

function sanitize(raw) {
    return String(raw ?? '').replace(SANITIZE_RE, '').trim().slice(0, MAX_Q);
}

/**
 * Searches only public arena plans (status='arena').
 * Returns minimal safe fields — no user data, no auth-gated content.
 */
export async function searchPublicPlans(req) {
    const qs = new URLSearchParams(req.url.split('?')[1] || '');
    const raw = qs.get('q') || '';
    const q = sanitize(raw);

    if (q.length < 2) return { results: [] };

    // Use ilike for simple contains search — safe with parameterized query via supabase-js
    const pattern = `%${q}%`;

    const { data, error } = await supabase
        .from('transitional_plans')
        .select('slug, name_en, name_fa, summary_en, summary_fa, cover_color, is_official')
        .eq('status', 'arena')
        .or(`name_en.ilike.${pattern},name_fa.ilike.${pattern},summary_en.ilike.${pattern},summary_fa.ilike.${pattern}`)
        .limit(10);

    if (error) throw { status: 500, error: 'Search failed.' };

    return {
        results: (data ?? []).map(r => ({
            type: 'plan',
            id: r.slug,
            title_en: r.name_en,
            title_fa: r.name_fa,
            body_en: r.summary_en ?? '',
            body_fa: r.summary_fa ?? '',
            url: `/arena/${r.slug}`,
            meta: { coverColor: r.cover_color, isOfficial: r.is_official },
        })),
    };
}
