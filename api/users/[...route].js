import { generateInviteCode } from '../../lib/users/invites.js';
import { rateLimit, validateRequestSize, setSecurityHeaders, checkOrigin } from '../../lib/security/middleware.js';

export default async function handler(req, res) {
    setSecurityHeaders(res);
    const path = req.url.split('/api/users/')[1]?.split('?')[0] || '';

    try {
        checkOrigin(req);
        rateLimit(req, 'api');
        validateRequestSize(req, 10 * 1024);

        switch (path) {
            case 'verify-institutional':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { getCallerIdFromReq } = await import('../../lib/public/civic.js');
                    const callerId = await getCallerIdFromReq(req);
                    if (!callerId) return res.status(401).json({ error: 'Unauthorized' });
                    const email = ((req.body || {}).email || '').toLowerCase();
                    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
                    const domain = email.split('@')[1];
                    const trustedDomains = ['edu', 'ac', 'gov', 'ac.ir', 'edu.ir', 'university.edu'];
                    const isTrusted = trustedDomains.some(d => domain.endsWith(d));
                    if (!isTrusted) return res.status(400).json({ error: 'Domain not accepted for institutional verification' });
                    // Award institutional_email_verified (+2)
                    const { recordScoreEvent } = await import('../../lib/public/civic.js');
                    await recordScoreEvent({ headers: req.headers, on: req.on, url: req.url, method: req.method, // fake minimal req wrapper
                      // create a small stream-like req is tricky; instead call recordScoreEvent via a helper that accepts userId
                    });
                    // fallback: directly insert event and update profile
                    const { createClient } = await import('@supabase/supabase-js');
                    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
                    await supabase.from('civic_score_events').insert({ user_id: callerId, event_type: 'institutional_email_verified', score_delta: 2, metadata: { email } });
                    // increment profile
                    const { data: profile } = await supabase.from('profiles').select('civic_score').eq('id', callerId).maybeSingle();
                    const newScore = (profile?.civic_score || 0) + 2;
                    await supabase.from('profiles').update({ civic_score: newScore }).eq('id', callerId);
                    return res.status(200).json({ ok: true });
                }

            case 'verify-photo':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { getCallerIdFromReq } = await import('../../lib/public/civic.js');
                    const callerId = await getCallerIdFromReq(req);
                    if (!callerId) return res.status(401).json({ error: 'Unauthorized' });
                    const fileUrl = (req.body || {}).fileUrl;
                    if (!fileUrl) return res.status(400).json({ error: 'fileUrl required' });
                    // Create a pending submission event (no score yet)
                    const { createClient } = await import('@supabase/supabase-js');
                    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
                    await supabase.from('civic_score_events').insert({ user_id: callerId, event_type: 'photo_submitted', score_delta: 0, metadata: { fileUrl } });
                    return res.status(200).json({ ok: true });
                }

            case 'verify-id':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { getCallerIdFromReq } = await import('../../lib/public/civic.js');
                    const callerId = await getCallerIdFromReq(req);
                    if (!callerId) return res.status(401).json({ error: 'Unauthorized' });
                    const fileUrl = (req.body || {}).fileUrl;
                    if (!fileUrl) return res.status(400).json({ error: 'fileUrl required' });
                    const { createClient } = await import('@supabase/supabase-js');
                    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
                    await supabase.from('civic_score_events').insert({ user_id: callerId, event_type: 'id_submitted', score_delta: 0, metadata: { fileUrl } });
                    return res.status(200).json({ ok: true });
                }

            case 'verify-phone':
                if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
                {
                    const { getCallerIdFromReq } = await import('../../lib/public/civic.js');
                    const callerId = await getCallerIdFromReq(req);
                    if (!callerId) return res.status(401).json({ error: 'Unauthorized' });
                    const phone = (req.body || {}).phone;
                    if (!phone) return res.status(400).json({ error: 'phone required' });
                    // For now, log phone submission and create a pending event
                    const { createClient } = await import('@supabase/supabase-js');
                    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
                    await supabase.from('civic_score_events').insert({ user_id: callerId, event_type: 'phone_submitted', score_delta: 0, metadata: { phone } });
                    return res.status(200).json({ ok: true });
                }

            case 'generate-code':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                const result = await generateInviteCode(req);
                return res.status(200).json(result);

            default:
                return res.status(404).json({ error: 'Endpoint not found in Users domain' });
        }
    } catch (error) {
        const status = error.status || 500;
        const message = error.error || 'Internal Server Error';
        if (status === 500) {
            console.error(`Users Domain Error [${path}]:`, message);
        }
        return res.status(status).json({ error: message });
    }
}
