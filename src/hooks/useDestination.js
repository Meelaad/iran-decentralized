import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useBlueprintVoteCounts() {
  return useQuery({
    queryKey: ['blueprint-vote-counts'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase.rpc('get_blueprint_vote_counts');
      const map = {};
      let total = 0;
      for (const row of data ?? []) {
        map[row.blueprint_id] = Number(row.votes);
        total += Number(row.votes);
      }
      return { votes: map, total };
    },
  });
}

export function useBlueprintStats() {
  return useQuery({
    queryKey: ['blueprint-stats'],
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase
        .from('daily_blueprint_stats')
        .select('*')
        .order('stat_date', { ascending: true })
        .limit(180); // 30 days × 6 blueprints
      return data ?? [];
    },
  });
}
