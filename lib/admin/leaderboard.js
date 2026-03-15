import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function takeLeaderboardSnapshot(date = new Date()) {
  const snapshotDate = date.toISOString().slice(0, 10);
  // Fetch top users globally and by country
  const { data: rows, error } = await supabase
    .from('profiles')
    .select('id, display_name, civic_score, country_code')
    .order('civic_score', { ascending: false })
    .limit(500);
  if (error) {
    console.error('failed to fetch profiles for leaderboard', error.message || error);
    return null;
  }

  // Rank global
  const inserts = [];
  rows.forEach((r, idx) => {
    inserts.push({ user_id: r.id, display_name: r.display_name || null, civic_score: r.civic_score || 0, trust_tier: null, country_code: r.country_code || null, snapshot_date: snapshotDate, rank_global: idx + 1, rank_country: null });
  });

  // For country ranks, compute simple rankings per country
  const byCountry = {};
  rows.forEach(r => {
    const c = r.country_code || 'ZZ';
    byCountry[c] = byCountry[c] || [];
    byCountry[c].push(r);
  });
  Object.keys(byCountry).forEach(c => {
    byCountry[c].sort((a, b) => (b.civic_score || 0) - (a.civic_score || 0));
    byCountry[c].forEach((u, idx) => {
      const globalIdx = rows.findIndex(rr => rr.id === u.id);
      const entry = inserts[globalIdx];
      if (entry) entry.rank_country = idx + 1;
    });
  });

  // Insert snapshot rows in a single batch
  const { error: insErr } = await supabase.from('leaderboard_snapshots').insert(inserts);
  if (insErr) {
    console.error('failed to insert leaderboard snapshot', insErr.message || insErr);
    return null;
  }
  return { ok: true, inserted: inserts.length };
}
