import { sendContactEmail } from '../../../lib/public/contact.js';
import { rateLimit, validateRequestSize, setSecurityHeaders } from '../../../lib/security/middleware.js';

export default async function handler(req, res) {
    setSecurityHeaders(res);
    const path = req.url.split('/api/public/')[1]?.split('?')[0] || '';

    try {
        rateLimit(req, 'strict');
        validateRequestSize(req, 20 * 1024);

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
