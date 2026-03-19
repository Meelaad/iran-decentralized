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

export function useAdminPlans() {
    return useQuery({
        queryKey: ['admin-plans'],
        staleTime: 30_000,
        queryFn: async () => {
            const { data } = await supabase
                .from('transitional_plans')
                .select('id, slug, name_en, name_fa, status, endorsement_count, is_official, created_at')
                .order('created_at', { ascending: false });
            return data ?? [];
        },
    });
}

export function useSeedPlans() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (plans) => {
            const token = await getToken();
            const res = await fetch('/api/admin/plans/seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ plans }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Seed failed');
            return json;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-plans'] }),
    });
}

export function usePromotePlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (planId) => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/plans/promote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                body: JSON.stringify({ planId }),
            });
            if (!res.ok) throw new Error('Failed to promote plan');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-plans'] }),
    });
}

export function useArchivePlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (planId) => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/plans/archive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                body: JSON.stringify({ planId }),
            });
            if (!res.ok) throw new Error('Failed to archive plan');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-plans'] }),
    });
}

export function useVerificationQueue() {
    return useQuery({
        queryKey: ['admin-verification-queue'],
        staleTime: 30_000,
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/verification/queue', {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            return res.ok ? res.json() : [];
        },
    });
}

export function useReviewVerification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ queueId, action }) => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/verification/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                body: JSON.stringify({ queueId, action }),
            });
            if (!res.ok) throw new Error('Review failed');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-verification-queue'] }),
    });
}

export function useMapMarkers() {
    return useQuery({
        queryKey: ['admin-map-markers'],
        staleTime: 30_000,
        queryFn: async () => {
            const { data } = await supabase
                .from('map_markers')
                .select('*')
                .order('created_at', { ascending: true });
            return data ?? [];
        },
    });
}

export function useAddMapMarker() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ type, lon, lat, color, label, description, region, pop_estimate }) => {
            const { data, error } = await supabase
                .from('map_markers')
                .insert({
                    type,
                    lon: parseFloat(lon),
                    lat: parseFloat(lat),
                    color: color || '#26DEC2',
                    label: label || '',
                    description: description || null,
                    region: region || null,
                    pop_estimate: pop_estimate || null,
                })
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-map-markers'] });
            queryClient.invalidateQueries({ queryKey: ['map-markers-public'] });
        },
    });
}

export function useUpdateMapMarker() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, type, lon, lat, color, label, description, region, pop_estimate }) => {
            const updates = { updated_at: new Date().toISOString() };
            if (type !== undefined) updates.type = type;
            if (lon !== undefined) updates.lon = parseFloat(lon);
            if (lat !== undefined) updates.lat = parseFloat(lat);
            if (color !== undefined) updates.color = color;
            if (label !== undefined) updates.label = label;
            if (description !== undefined) updates.description = description;
            if (region !== undefined) updates.region = region;
            if (pop_estimate !== undefined) updates.pop_estimate = pop_estimate;
            const { data, error } = await supabase
                .from('map_markers')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-map-markers'] });
            queryClient.invalidateQueries({ queryKey: ['map-markers-public'] });
        },
    });
}

export function useDeleteMapMarker() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase.from('map_markers').delete().eq('id', id);
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-map-markers'] });
            queryClient.invalidateQueries({ queryKey: ['map-markers-public'] });
        },
    });
}

/** Mutation: admin manual civic score adjustment. Invalidates leaderboard and users. */
export function useAdjustCivicScore() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, delta, reason }) => {
            const token = await getToken();
            const res = await fetch('/api/admin/civic-adjust', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ user_id: userId, delta, reason }),
            });
            const json = await res.json().catch(() => { throw new Error('Server returned non-JSON response'); });
            if (!res.ok) throw new Error(json.error || 'Adjustment failed');
            return json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-civic-leaderboard'] });
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
    });
}

export function useAdminCivicLeaderboard() {
    return useQuery({
        queryKey: ['admin-civic-leaderboard'],
        staleTime: 60_000,
        queryFn: async () => {
            const { data } = await supabase
                .from('profiles')
                .select('id, email, full_name, civic_score, trust_tier')
                .order('civic_score', { ascending: false })
                .limit(50);
            return data ?? [];
        },
    });
}
