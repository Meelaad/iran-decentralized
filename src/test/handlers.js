import { http, HttpResponse } from 'msw';

export const MOCK_BLUEPRINT = {
    id: 'decentralized',
    name: { en: 'Decentralized', fa: 'غیرمتمرکز' },
    isOfficial: true,
    sectors: [{ id: 's1', name: { en: 'Justice', fa: 'دادگستری' } }],
    connections: [],
};

export const MOCK_PROFILE = {
    id: 'test-user-id',
    full_name: 'Test User',
    email: 'test@example.com',
    user_type: 'citizen',
    country: 'Iran',
    invite_codes_remaining: 5,
    is_admin: false,
    name_locked: false,
    birth_date: '1990-01-01',
    preferred_blueprint: 'decentralized',
    created_at: '2025-01-01T00:00:00Z',
};

export const MOCK_INVITE_CODES = [
    { code: 'ABCD1234', used_by: null, used_at: null },
    { code: 'EFGH5678', used_by: 'other-user', used_at: '2025-02-01T00:00:00Z' },
];

export const handlers = [
    // Blueprints API
    http.get('/api/blueprints', ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (id === 'decentralized') return HttpResponse.json(MOCK_BLUEPRINT);
        if (id) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json([MOCK_BLUEPRINT]);
    }),

    // Cast vote API
    http.post('/api/cast-vote', async ({ request }) => {
        const body = await request.json();
        if (!body.blueprintId) return HttpResponse.json({ error: 'Invalid blueprint ID.' }, { status: 400 });
        return HttpResponse.json({ ok: true });
    }),

    // Generate invite code API
    http.post('/api/generate-code', () => {
        return HttpResponse.json({ ok: true });
    }),

    // Validate invite API
    http.post('/api/validate-invite', async ({ request }) => {
        const body = await request.json();
        if (body.code === 'VALID123') return HttpResponse.json({ ok: true });
        return HttpResponse.json({ error: 'Invite code not found.' }, { status: 404 });
    }),

    // Supabase profiles table
    http.get('http://test.supabase.local/rest/v1/profiles', ({ request }) => {
        const accept = request.headers.get('Accept') ?? '';
        if (accept.includes('vnd.pgrst.object')) return HttpResponse.json(MOCK_PROFILE);
        return HttpResponse.json([MOCK_PROFILE]);
    }),

    // Supabase profiles update
    http.patch('http://test.supabase.local/rest/v1/profiles', () => {
        return new HttpResponse(null, { status: 204 });
    }),

    // Supabase invite_codes table
    http.get('http://test.supabase.local/rest/v1/invite_codes', () => {
        return HttpResponse.json(MOCK_INVITE_CODES);
    }),

    // Supabase blueprint_layouts table
    http.get('http://test.supabase.local/rest/v1/blueprint_layouts', () => {
        return HttpResponse.json([]);
    }),
];
