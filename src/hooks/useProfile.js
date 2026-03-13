import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetches the full profile row for the authenticated user.
 */
export function useProfile(userId) {
    return useQuery({
        queryKey: ['profile', userId],
        enabled: !!userId,
        staleTime: 2 * 60 * 1000,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) throw error;
            return data;
        },
    });
}

/**
 * Fetches the invite codes owned by the user.
 */
export function useInviteCodes(userId) {
    return useQuery({
        queryKey: ['invite-codes', userId],
        enabled: !!userId,
        staleTime: 60 * 1000,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('invite_codes')
                .select('code, used_by, used_at')
                .eq('owner_id', userId)
                .order('created_at');
            if (error) throw error;
            return data ?? [];
        },
    });
}

/**
 * Mutation: updates arbitrary profile fields on the user's own row.
 * Safe — RLS enforces the user can only update their own profile.
 * Invalidates the profile cache on success.
 */
export function useUpdateProfile(userId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (fields) => {
            const { error } = await supabase
                .from('profiles')
                .update(fields)
                .eq('id', userId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        },
    });
}

/**
 * Mutation: casts a vote via the secure server endpoint.
 * Token is retrieved at call time — never cached.
 * Invalidates the profile cache so the displayed vote updates.
 */
export function useCastVote(userId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (blueprintId) => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/crypto/vote', {
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
            queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        },
    });
}

/**
 * Mutation: generates an invite code via the secure server endpoint.
 * Invalidates both invite-codes and profile (quota decrements).
 */
export function useGenerateCode(userId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/users/generate-code', {
                method: 'POST',
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw json;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invite-codes', userId] });
            queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        },
    });
}
