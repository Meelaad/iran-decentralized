import { validateInviteCode } from '../../../lib/auth/validate-invite.js';
import { completeRegistration } from '../../../lib/auth/register.js';

export default async function handler(req, res) {
    const path = req.url.split('/api/auth/')[1]?.split('?')[0] || '';

    try {
        switch (path) {
            case 'validate-invite':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                const result = await validateInviteCode(req.body.code);
                return res.status(200).json(result);

            case 'register':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                const regResult = await completeRegistration(req);
                return res.status(200).json(regResult);

            default:
                return res.status(404).json({ error: 'Endpoint not found in Auth domain' });
        }
    } catch (error) {
        console.error(`Auth Domain Error [${path}]:`, error);
        const status = error.status || 500;
        const message = error.error || 'Internal Server Error';
        return res.status(status).json({ error: message });
    }
}
