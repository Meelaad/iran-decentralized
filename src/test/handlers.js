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
    birth_date: null,
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

    // supabase .single() sends Accept: application/vnd.pgrst.object+json → PostgREST returns a plain object
    http.get('http://test.supabase.local/rest/v1/profiles', ({ request }) => {
        const accept = request.headers.get('Accept') ?? '';
        if (accept.includes('vnd.pgrst.object')) return HttpResponse.json(MOCK_PROFILE);
        return HttpResponse.json([MOCK_PROFILE]);
    }),


    http.get('http://test.supabase.local/rest/v1/invite_codes', () => {
        return HttpResponse.json(MOCK_INVITE_CODES);
    }),


    http.get('http://test.supabase.local/rest/v1/blueprint_layouts', () => {
        return HttpResponse.json([]);
    }),
];
