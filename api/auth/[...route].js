import { validateInviteCode } from '../../lib/auth/validate-invite.js';
import { completeRegistration } from '../../lib/auth/register.js';
import { rateLimit, validateRequestSize, setSecurityHeaders, checkOrigin } from '../../lib/security/middleware.js';

export default async function handler(req, res) {
    setSecurityHeaders(res);
    const path = req.url.split('/api/auth/')[1]?.split('?')[0] || '';

    try {
        checkOrigin(req);
        rateLimit(req, 'auth');
        validateRequestSize(req, 50 * 1024);

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
        const status = error.status || 500;
        const message = error.error || 'Internal Server Error';
        if (status === 500) {
            console.error(`Auth Domain Error [${path}]:`, message);
        }
        return res.status(status).json({ error: message });
    }
}
