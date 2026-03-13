import { describe, it, expect, vi } from 'vitest';

/**
 * API Integration Tests
 * 
 * These tests validate the server-side logic of critical endpoints.
 * They use MSW handlers defined in src/test/handlers.js
 */

describe('API: /api/cast-vote', () => {
    it('accepts valid vote from eligible user', async () => {
        const res = await fetch('/api/cast-vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blueprintId: 'decentralized' }),
        });

        expect(res.ok).toBe(true);
        const data = await res.json();
        expect(data).toEqual({ ok: true });
    });

    it('rejects vote with invalid blueprint ID', async () => {
        const res = await fetch('/api/cast-vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blueprintId: '' }),
        });

        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Invalid blueprint ID.');
    });
});

describe('API: /api/generate-code', () => {
    it('generates invite code for authenticated user', async () => {
        const res = await fetch('/api/generate-code', {
            method: 'POST',
            headers: { Authorization: 'Bearer test-token' },
        });

        expect(res.ok).toBe(true);
        const data = await res.json();
        expect(data).toEqual({ ok: true });
    });
});

describe('API: /api/validate-invite', () => {
    it('validates existing invite code', async () => {
        const res = await fetch('/api/validate-invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'VALID123' }),
        });

        expect(res.ok).toBe(true);
        const data = await res.json();
        expect(data).toEqual({ ok: true });
    });

    it('rejects non-existent invite code', async () => {
        const res = await fetch('/api/validate-invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'INVALID1' }),
        });

        expect(res.status).toBe(404);
        const data = await res.json();
        expect(data.error).toBe('Invite code not found.');
    });
});

describe('API: /api/blueprints', () => {
    it('fetches single blueprint by ID', async () => {
        const res = await fetch('/api/blueprints?id=decentralized');

        expect(res.ok).toBe(true);
        const data = await res.json();
        expect(data.id).toBe('decentralized');
        expect(data.name).toHaveProperty('en');
        expect(data.name).toHaveProperty('fa');
    });

    it('returns 404 for non-existent blueprint', async () => {
        const res = await fetch('/api/blueprints?id=nonexistent');

        expect(res.status).toBe(404);
    });

    it('fetches all blueprints when no ID provided', async () => {
        const res = await fetch('/api/blueprints');

        expect(res.ok).toBe(true);
        const data = await res.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
    });
});
