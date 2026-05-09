import { sendContactEmail } from '../../lib/public/contact.js';
import { rateLimit, validateRequestSize, setSecurityHeaders, checkOrigin } from '../../lib/security/middleware.js';
import { getArenaPlans, getPlanBySlug, endorsePlan, signPlan } from '../../lib/public/plans.js';
import { searchPublicPlans } from '../../lib/public/search.js';
import { listScoreRules } from '../../lib/public/civic.js';

export default async function handler(req, res) {
    setSecurityHeaders(res);
    const path = req.url.split('/api/public/')[1]?.split('?')[0] || '';

    try {
        // Use 'api' tier for public reads; write endpoints (endorse/sign/contact) use 'strict' inline
        const isWrite = req.method === 'POST';
        if (isWrite) checkOrigin(req);
        rateLimit(req, isWrite ? 'strict' : 'api');
        validateRequestSize(req, 200 * 1024);

        switch (path) {
            // Plans — flat GET list
            case 'plans':
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    // GET /api/public/plans?slug=<slug> → single plan
                    const qs = new URLSearchParams(req.url.split('?')[1] || '');
                    const slug = qs.get('slug');
                    if (slug) {
                        const plan = await getPlanBySlug(slug, req);
                        return res.status(plan ? 200 : 404).json(plan || { error: 'Plan not found.' });
                    }
                    const result = await getArenaPlans(req);
                    return res.status(200).json(result);
                }

            case 'plans-endorse':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                return res.status(200).json(await endorsePlan(req));

            case 'plans-sign':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                return res.status(200).json(await signPlan(req));

            case 'plans-submit':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { submitPlan } = await import('../../lib/public/submissions.js');
                    const result = await submitPlan(req);
                    return res.status(result && result.ok ? 200 : 500).json(result);
                }

            // Stats — flat paths
            case 'stats-plans':
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { getPlanStatsLast30 } = await import('../../lib/public/stats.js');
                    const planId = new URLSearchParams(req.url.split('?')[1] || '').get('planId');
                    const out = await getPlanStatsLast30(planId);
                    return res.status(out && out.ok ? 200 : 400).json(out);
                }

            case 'stats-geo':
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { getPlanGeoStats } = await import('../../lib/public/stats.js');
                    const planId = new URLSearchParams(req.url.split('?')[1] || '').get('planId');
                    const out = await getPlanGeoStats(planId);
                    return res.status(out && out.ok ? 200 : 400).json(out);
                }

            case 'stats-overview':
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { getStatsOverview } = await import('../../lib/public/stats.js');
                    const out = await getStatsOverview();
                    return res.status(200).json(out);
                }

            // Amendments — flat paths
            case 'amendments':
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const planId = new URLSearchParams(req.url.split('?')[1] || '').get('planId');
                    const { listAmendments } = await import('../../lib/public/amendments.js');
                    const out = await listAmendments(planId);
                    return res.status(out && out.ok ? 200 : 400).json(out);
                }

            case 'amendments-vote':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { voteAmendment } = await import('../../lib/public/amendments.js');
                    const out = await voteAmendment(req);
                    return res.status(out && out.ok ? 200 : 400).json(out);
                }

            case 'amendments-propose':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { proposeAmendment } = await import('../../lib/public/amendments.js');
                    const out = await proposeAmendment(req);
                    return res.status(out && out.ok ? 200 : 400).json(out);
                }

            // Experts — flat paths
            case 'experts-vote':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { voteExpert } = await import('../../lib/public/experts.js');
                    const out = await voteExpert(req);
                    return res.status(out && out.ok ? 200 : 400).json(out);
                }

            case 'experts-nominate':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { nominateExpert } = await import('../../lib/public/experts.js');
                    const out = await nominateExpert(req);
                    return res.status(out && out.ok ? 200 : 400).json(out);
                }

            case 'experts-qa':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { postExpertQA } = await import('../../lib/public/experts.js');
                    const out = await postExpertQA(req);
                    return res.status(out && out.ok ? 200 : 400).json(out);
                }

            // Score rules — public reference data
            case 'score-rules':
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
                return res.status(200).json(await listScoreRules());

            // Civic score
            case 'civic-score':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { recordScoreEvent } = await import('../../lib/public/civic.js');
                    const result = await recordScoreEvent(req);
                    return res.status(200).json(result);
                }

            case 'search':
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
                return res.status(200).json(await searchPublicPlans(req));

            case 'contact':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                await sendContactEmail(req);
                return res.status(200).json({ ok: true });

            default:
                return res.status(404).json({ error: 'Endpoint not found in Public domain' });
        }
    } catch (error) {
        const status = error.status || 500;
        const message = error.error || 'Internal Server Error';
        if (status === 500) {
            console.error(`Public Domain Error [${path}]:`, message);
        }
        return res.status(status).json({ error: message });
    }
}
