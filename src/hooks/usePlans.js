import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

async function authHeader() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

async function postJSON(url, body) {
    const headers = await authHeader();
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

// ── Read hooks ────────────────────────────────────────────────────────────────

export function useArenaPlans() {
    return useQuery({
        queryKey: ['arena-plans'],
        queryFn: async () => {
            const res = await fetch('/api/public/plans');
            if (!res.ok) throw new Error('Failed to load plans');
            return res.json();
        },
        staleTime: 60_000,
    });
}

export function usePlan(slug) {
    return useQuery({
        queryKey: ['plan', slug],
        queryFn: async () => {
            const res = await fetch(`/api/public/plans/${slug}`);
            if (!res.ok) throw new Error('Failed to load plan');
            return res.json();
        },
        enabled: !!slug,
    });
}

export function usePlanStats(planId) {
    return useQuery({
        queryKey: ['plan-stats', planId],
        queryFn: async () => {
            const res = await fetch(`/api/public/stats/plans?planId=${planId}`);
            if (!res.ok) throw new Error('Failed to load stats');
            return res.json();
        },
        enabled: !!planId,
        staleTime: 300_000,
    });
}

export function usePlanGeoStats(planId) {
    return useQuery({
        queryKey: ['plan-geo', planId],
        queryFn: async () => {
            const res = await fetch(`/api/public/stats/geo/${planId}`);
            if (!res.ok) throw new Error('Failed to load geo stats');
            return res.json();
        },
        enabled: !!planId,
        staleTime: 300_000,
    });
}

export function usePlanAmendments(planId) {
    return useQuery({
        queryKey: ['amendments', planId],
        queryFn: async () => {
            const res = await fetch(`/api/public/amendments?planId=${planId}`);
            if (!res.ok) throw new Error('Failed to load amendments');
            return res.json();
        },
        enabled: !!planId,
    });
}

export function useStatsOverview() {
    return useQuery({
        queryKey: ['stats-overview'],
        queryFn: async () => {
            const res = await fetch('/api/public/stats/overview');
            if (!res.ok) return { totalUsers: 0, totalEndorsed: 0 };
            return res.json();
        },
        staleTime: 300_000,
    });
}

// ── Mutation hooks ────────────────────────────────────────────────────────────

export function useEndorsePlan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ planId }) => postJSON('/api/public/plans/endorse', { planId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['arena-plans'] });
        },
    });
}

export function useSignPlan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ planId }) => postJSON('/api/public/plans/sign', { planId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['arena-plans'] });
        },
    });
}

export function useSubmitPlan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body) => postJSON('/api/public/plans/submit', body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['arena-plans'] });
        },
    });
}

export function useVoteAmendment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ amendmentId, vote }) =>
            postJSON('/api/public/amendments/vote', { amendmentId, vote }),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['amendments'] });
        },
    });
}

export function useProposeAmendment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body) => postJSON('/api/public/amendments/propose', body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['amendments'] });
        },
    });
}
