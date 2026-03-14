import { castVote } from '../../../lib/crypto/vote.js';
import { rateLimit, validateRequestSize, setSecurityHeaders } from '../../../lib/security/middleware.js';

export default async function handler(req, res) {
    setSecurityHeaders(res);
    const path = req.url.split('/api/crypto/')[1]?.split('?')[0] || '';

    try {
        rateLimit(req, 'api');
        validateRequestSize(req, 10 * 1024);

        switch (path) {
            case 'vote':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                const result = await castVote(req);
                return res.status(200).json(result);

            default:
                return res.status(404).json({ error: 'Endpoint not found in Crypto domain' });
        }
    } catch (error) {
        const status = error.status || 500;
        const message = error.error || 'Internal Server Error';
        if (status === 500) {
            console.error(`Crypto Domain Error [${path}]:`, message);
        }
        return res.status(status).json({ error: message });
    }
}
