import { requireAdmin } from '../../../lib/admin/_auth.js';
import { getUsers, generateCodes, deleteCode, updateInvites, seedBlueprints, saveBlueprintLayout } from '../../../lib/admin/operations.js';
import { rateLimit, validateRequestSize, setSecurityHeaders } from '../../../lib/security/middleware.js';

export default async function handler(req, res) {
    setSecurityHeaders(res);
    const path = req.url.split('/api/admin/')[1]?.split('?')[0] || '';

    try {
        rateLimit(req, 'api');
        validateRequestSize(req, 500 * 1024);
        await requireAdmin(req);
    } catch (error) {
        const status = error.status || 401;
        const message = error.error || 'Unauthorized';
        return res.status(status).json({ error: message });
    }

    try {
        switch (path) {
            case 'users':
                if (req.method !== 'GET') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                const users = await getUsers();
                return res.status(200).json(users);

            case 'generate-codes':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                await generateCodes(req.body);
                return res.status(200).json({ ok: true });

            case 'delete-code':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                await deleteCode(req.body.code_id);
                return res.status(200).json({ ok: true });

            case 'update-invites':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                await updateInvites(req.body);
                return res.status(200).json({ ok: true });

            case 'seed-blueprints':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                const result = await seedBlueprints(req.body.blueprints);
                return res.status(200).json(result);

            case 'save-blueprint-layout':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                await saveBlueprintLayout(req.body);
                return res.status(200).json({ ok: true });

            default:
                return res.status(404).json({ error: 'Endpoint not found in Admin domain' });
        }
    } catch (error) {
        const status = error.status || 500;
        const message = error.error || 'Internal Server Error';
        if (status === 500) {
            console.error(`Admin Domain Error [${path}]:`, message);
        }
        return res.status(status).json({ error: message });
    }
}
