import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
}


export function useAdminUsers() {
    return useQuery({
        queryKey: ['admin-users'],
        staleTime: 60 * 1000,
        queryFn: async () => {
            const token = await getToken();
            const res = await fetch('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 401 || res.status === 403) throw Object.assign(new Error('Access denied'), { status: res.status });
            if (!res.ok) throw new Error('Failed to load users');
            return res.json();
        },
    });
}

/**
 * Fetches all blueprints from DB (official + forks) for the admin blueprint table.
 */
export function useAdminBlueprints() {
    return useQuery({
        queryKey: ['admin-blueprints'],
        staleTime: 2 * 60 * 1000,
        queryFn: async () => {
            const token = await getToken();
            const res = await fetch('/api/blueprints', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to load blueprints');
            return res.json();
        },
    });
}

/** Mutation: generate N codes for a user. Invalidates admin-users. */
export function useGenerateCodes() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, count }) => {
            const token = await getToken();
            const res = await fetch('/api/admin/generate-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ user_id: userId, count }),
            });
            if (!res.ok) throw new Error('Failed to generate codes');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
    });
}

/** Mutation: delete a single invite code by ID. Invalidates admin-users. */
export function useDeleteCode() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (codeId) => {
            const token = await getToken();
            const res = await fetch('/api/admin/delete-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ code_id: codeId }),
            });
            if (!res.ok) throw new Error('Failed to delete code');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
    });
}

/** Mutation: set invite_codes_remaining for a user. Invalidates admin-users. */
export function useSetInvites() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, remaining }) => {
            const token = await getToken();
            const res = await fetch('/api/admin/update-invites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ user_id: userId, remaining }),
            });
            if (!res.ok) throw new Error('Failed to update invites');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
    });
}

/** Mutation: seed official blueprints from data.js into DB. Invalidates admin-blueprints. */
export function useSeedBlueprints() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (blueprints) => {
            const token = await getToken();
            const res = await fetch('/api/admin/seed-blueprints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ blueprints }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Seed failed');
            return json;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blueprints'] }),
    });
}
