import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetches the authenticated user's forked blueprints from /api/blueprints.
 * Token is retrieved at query time so it's always fresh.
 */
export function useMyBlueprints(userId) {
    return useQuery({
        queryKey: ['my-blueprints', userId],
        enabled: !!userId,
        staleTime: 2 * 60 * 1000,
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/blueprints', {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (!res.ok) throw new Error('Failed to load blueprints');
            const all = await res.json();
            return all.filter(bp => !bp.isOfficial);
        },
    });
}

/**
 * Mutation: forks an official blueprint via the secure API endpoint.
 * Token is retrieved at call time — never cached.
 * Invalidates my-blueprints cache on success.
 */
export function useForkBlueprint(userId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (blueprintId) => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/blueprint-fork', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ blueprintId }),
            });
            const json = await res.json();
            if (!res.ok) throw json;
            return json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-blueprints', userId] });
        },
    });
}
