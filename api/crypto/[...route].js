import { castVote } from '../../../lib/crypto/vote.js';

export default async function handler(req, res) {
    const path = req.url.split('/api/crypto/')[1]?.split('?')[0] || '';

    try {
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
        console.error(`Crypto Domain Error [${path}]:`, error);
        const status = error.status || 500;
        const message = error.error || 'Internal Server Error';
        return res.status(status).json({ error: message });
    }
}
