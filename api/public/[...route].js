import { sendContactEmail } from '../../lib/public/contact.js';
import { rateLimit, validateRequestSize, setSecurityHeaders } from '../../lib/security/middleware.js';
import { getArenaPlans, getPlanBySlug, endorsePlan, signPlan } from '../../lib/public/plans.js';

export default async function handler(req, res) {
    setSecurityHeaders(res);
    const path = req.url.split('/api/public/')[1]?.split('?')[0] || '';

    try {
        // Use 'api' tier for public reads; write endpoints (endorse/sign/contact) use 'strict' inline
        const isWrite = req.method === 'POST';
        rateLimit(req, isWrite ? 'strict' : 'api');
        validateRequestSize(req, 200 * 1024);

        // Plans handling: /api/public/plans, /api/public/plans/:slug, /api/public/plans/endorse, /api/public/plans/sign
        if (path.startsWith('plans')) {
            const parts = path.split('/').filter(Boolean); // ['plans', 'endorse'] or ['plans', 'nufdi-ipp'] or ['plans']

            if (parts.length === 1) {
                // GET list of arena plans
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
                const result = await getArenaPlans(req);
                return res.status(200).json(result);
            }

            if (parts[1] === 'endorse') {
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                const result = await endorsePlan(req);
                return res.status(200).json(result);
            }

            if (parts[1] === 'sign') {
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                const result = await signPlan(req);
                return res.status(200).json(result);
            }

            // GET single plan by slug: /api/public/plans/:slug
            if (req.method === 'GET' && parts.length === 2) {
                const plan = await getPlanBySlug(parts[1], req);
                return res.status(plan ? 200 : 404).json(plan || { error: 'Plan not found.' });
            }

            if (parts[1] === 'submit') {
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                const { submitPlan } = await import('../../lib/public/submissions.js');
                const result = await submitPlan(req);
                return res.status(result && result.ok ? 200 : 500).json(result);
            }

            return res.status(404).json({ error: 'Plans endpoint route not found.' });
        }

        // Stats endpoints
        if (path.startsWith('stats')) {
            const partsStats = path.split('/').filter(Boolean); // ['stats','plans'] or ['stats','geo','<planId>']
            if (partsStats[1] === 'plans' && req.method === 'GET') {
                const { getPlanStatsLast30 } = await import('../../lib/public/stats.js');
                const planId = req.query?.planId || (req.url.split('?')[1] ? new URLSearchParams(req.url.split('?')[1]).get('planId') : null);
                const out = await getPlanStatsLast30(planId);
                return res.status(out && out.ok ? 200 : 400).json(out);
            }
            if (partsStats[1] === 'geo' && req.method === 'GET' && partsStats[2]) {
                const { getPlanGeoStats } = await import('../../lib/public/stats.js');
                const out = await getPlanGeoStats(partsStats[2]);
                return res.status(out && out.ok ? 200 : 400).json(out);
            }
            if (partsStats[1] === 'overview' && req.method === 'GET') {
                const { getStatsOverview } = await import('../../lib/public/stats.js');
                const out = await getStatsOverview();
                return res.status(200).json(out);
            }
        }

        // Amendments endpoints
        if (path.startsWith('amendments')) {
            const partsA = path.split('/').filter(Boolean);
            if (partsA[1] === 'propose' && req.method === 'POST') {
                const { proposeAmendment } = await import('../../lib/public/amendments.js');
                const out = await proposeAmendment(req);
                return res.status(out && out.ok ? 200 : 400).json(out);
            }
            if (partsA[1] === 'vote' && req.method === 'POST') {
                const { voteAmendment } = await import('../../lib/public/amendments.js');
                const out = await voteAmendment(req);
                return res.status(out && out.ok ? 200 : 400).json(out);
            }
            // GET /api/public/amendments?planId=X
            if (partsA.length === 1 && req.method === 'GET') {
                const planId = new URLSearchParams(req.url.split('?')[1] || '').get('planId');
                const { listAmendments } = await import('../../lib/public/amendments.js');
                const out = await listAmendments(planId);
                return res.status(out && out.ok ? 200 : 400).json(out);
            }
        }

        // Experts endpoints
        if (path.startsWith('experts')) {
            const partsE = path.split('/').filter(Boolean);
            if (partsE[1] === 'vote' && req.method === 'POST') {
                const { voteExpert } = await import('../../lib/public/experts.js');
                const out = await voteExpert(req);
                return res.status(out && out.ok ? 200 : 400).json(out);
            }
            if (partsE[1] === 'nominate' && req.method === 'POST') {
                const { nominateExpert } = await import('../../lib/public/experts.js');
                const out = await nominateExpert(req);
                return res.status(out && out.ok ? 200 : 400).json(out);
            }
            if (partsE[1] === 'qa' && req.method === 'POST') {
                const { postExpertQA } = await import('../../lib/public/experts.js');
                const out = await postExpertQA(req);
                return res.status(out && out.ok ? 200 : 400).json(out);
            }
        }

        // Civic score endpoint: POST /api/public/civic/score
        if (path.startsWith('civic/score')) {
            if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
            const { recordScoreEvent } = await import('../../lib/public/civic.js');
            const result = await recordScoreEvent(req);
            return res.status(200).json(result);
        }

        switch (path) {
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
