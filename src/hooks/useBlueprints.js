import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetches a non-local blueprint from /api/blueprints?id=...
 * Only enabled when there is no matching local blueprint.
 */
export function useBlueprint(blueprintId, localBlueprint) {
    return useQuery({
        queryKey: ['blueprint', blueprintId],
        enabled: !localBlueprint && !!blueprintId,
        staleTime: 10 * 60 * 1000,
        queryFn: async () => {
            const res = await fetch(`/api/blueprints?id=${encodeURIComponent(blueprintId)}`);
            if (!res.ok) return null;
            return res.json();
        },
    });
}

/**
 * Fetches saved node positions for a blueprint from the blueprint_layouts table.
 * Returns the positions object directly (or {} if none saved).
 */
export function useBlueprintLayout(blueprintId) {
    return useQuery({
        queryKey: ['blueprint-layout', blueprintId],
        enabled: !!blueprintId,
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const { data } = await supabase
                .from('blueprint_layouts')
                .select('positions')
                .eq('blueprint_id', blueprintId)
                .maybeSingle();
            return data?.positions ?? {};
        },
    });
}

/**
 * Mutation: saves admin-edited node positions via the secure API endpoint.
 * Token is retrieved at call time and never cached.
 * Invalidates the layout query on success.
 */
export function useSaveBlueprintLayout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ blueprintId, positions }) => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/save-blueprint-layout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ blueprintId, positions }),
            });
            if (!res.ok) throw new Error('Failed to save layout');
            return res.json();
        },
        onSuccess: (_data, { blueprintId }) => {
            queryClient.invalidateQueries({ queryKey: ['blueprint-layout', blueprintId] });
        },
    });
}
