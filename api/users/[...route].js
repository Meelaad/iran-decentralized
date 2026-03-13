import { generateInviteCode } from '../../../lib/users/invites.js';

export default async function handler(req, res) {
    const path = req.url.split('/api/users/')[1]?.split('?')[0] || '';

    try {
        switch (path) {
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
        console.error(`Users Domain Error [${path}]:`, error);
        const status = error.status || 500;
        const message = error.error || 'Internal Server Error';
        return res.status(status).json({ error: message });
    }
}
