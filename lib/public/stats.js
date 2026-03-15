import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function getStatsOverview() {
  const [{ count: totalUsers }, { count: totalEndorsed }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('plan_endorsements').select('user_id', { count: 'exact', head: true }),
  ]);
  return { ok: true, totalUsers: totalUsers || 0, totalEndorsed: totalEndorsed || 0 };
}

export async function getPlanStatsLast30(planId) {
  if (!planId) return { error: 'planId required' };
  const { data, error } = await supabase.from('daily_plan_stats').select('*').eq('plan_id', planId).order('stat_date', { ascending: false }).limit(30);
  if (error) return { error: 'failed' };
  return { ok: true, stats: data || [] };
}

export async function getPlanGeoStats(planId) {
  if (!planId) return { error: 'planId required' };
  const { data, error } = await supabase.from('daily_geo_stats').select('*').eq('plan_id', planId).order('stat_date', { ascending: false }).limit(365);
  if (error) return { error: 'failed' };
  return { ok: true, geo: data || [] };
}
