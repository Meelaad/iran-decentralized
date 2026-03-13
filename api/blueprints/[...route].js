import { getBlueprints, getBlueprintById } from '../../../lib/blueprints/crud.js';
import { forkBlueprint } from '../../../lib/blueprints/fork.js';

export default async function handler(req, res) {
    const path = req.url.split('/api/blueprints')[1]?.split('?')[0] || '';
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get('id');

    try {
        if (path === '' || path === '/') {
            if (req.method !== 'GET') {
                return res.status(405).json({ error: 'Method not allowed.' });
            }
            if (id) {
                const result = await getBlueprintById(id, req);
                return res.status(result ? 200 : 404).json(result || { error: 'Blueprint not found.' });
            }
            const result = await getBlueprints(req);
            return res.status(200).json(result);
        }

        switch (path) {
            case '/fork':
                if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed.' });
                }
                const result = await forkBlueprint(req);
                return res.status(200).json(result);

            default:
                return res.status(404).json({ error: 'Endpoint not found in Blueprints domain' });
        }
    } catch (error) {
        console.error(`Blueprints Domain Error [${path}]:`, error);
        const status = error.status || 500;
        const message = error.error || 'Internal Server Error';
        return res.status(status).json({ error: message });
    }
}
