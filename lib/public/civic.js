import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Module-level cache for score_rules table (5-minute TTL)
let _rulesCache = null;
let _rulesCachedAt = 0;
const RULES_TTL_MS = 5 * 60 * 1000;

async function getScoreRules() {
  const now = Date.now();
  if (_rulesCache && now - _rulesCachedAt < RULES_TTL_MS) return _rulesCache;

  const { data, error } = await supabase.from('score_rules').select('*');
  if (error || !data) {
    console.error('Failed to fetch score_rules:', error?.message);
    return _rulesCache || {};
  }
  _rulesCache = Object.fromEntries(data.map(r => [r.event_type, r]));
  _rulesCachedAt = now;
  return _rulesCache;
}

export async function listScoreRules() {
  const rules = await getScoreRules();
  return { ok: true, rules: Object.values(rules) };
}

export async function getCallerIdFromReq(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  try {
    const { data } = await supabase.auth.getUser(token);
    return data?.user?.id || null;
  } catch (e) {
    return null;
  }
}

export async function recordScoreEvent(req) {
  // Body: { event_type: string, metadata?: object }
  const callerId = await getCallerIdFromReq(req);
  if (!callerId) throw { status: 401, error: 'Unauthorized' };

  const body = req.body || {};
  const eventType = body.event_type;
  if (!eventType) throw { status: 400, error: 'event_type is required' };

  const rules = await getScoreRules();
  const rule = rules[eventType];
  const delta = rule?.score_delta ?? 0;
  const metadata = body.metadata || {};

  // Insert event
  const { error: insertErr } = await supabase
    .from('civic_score_events')
    .insert({ user_id: callerId, event_type: eventType, score_delta: delta, metadata });
  if (insertErr) console.error('Failed to insert civic_score_event', insertErr.message || insertErr);

  // Fetch profile
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('civic_score, last_active_date, streak_days, contribution_grid')
    .eq('id', callerId)
    .maybeSingle();
  if (profileErr) console.error('Failed to fetch profile for score update', profileErr.message || profileErr);

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  let newScore = (profile?.civic_score || 0) + delta;
  let newStreak = profile?.streak_days || 0;
  let lastActive = profile?.last_active_date ? new Date(profile.last_active_date) : null;
  let contributionGrid = profile?.contribution_grid || {};

  const lastActiveStr = lastActive ? lastActive.toISOString().split('T')[0] : null;
  if (lastActiveStr !== todayStr) {
    newStreak = (profile?.streak_days || 0) + 1;
    contributionGrid = { ...contributionGrid };
    contributionGrid[todayStr] = (contributionGrid[todayStr] || 0) + 1;

    if (newStreak === 7) {
      const streak7Delta = rules['streak_7']?.score_delta ?? 0;
      newScore += streak7Delta;
      await supabase.from('civic_score_events').insert({ user_id: callerId, event_type: 'streak_7', score_delta: streak7Delta, metadata: {} });
      try { const { awardBadgeToUser } = await import('./badges.js'); await awardBadgeToUser(callerId, 'streak_7'); } catch (e) { console.error('badge award failed', e); }
    }
    if (newStreak === 30) {
      const streak30Delta = rules['streak_30']?.score_delta ?? 0;
      newScore += streak30Delta;
      await supabase.from('civic_score_events').insert({ user_id: callerId, event_type: 'streak_30', score_delta: streak30Delta, metadata: {} });
      try { const { awardBadgeToUser } = await import('./badges.js'); await awardBadgeToUser(callerId, 'streak_30'); } catch (e) { console.error('badge award failed', e); }
    }

    const { error: updErr } = await supabase
      .from('profiles')
      .update({ civic_score: newScore, last_active_date: now.toISOString(), streak_days: newStreak, contribution_grid: contributionGrid })
      .eq('id', callerId);
    if (updErr) console.error('Failed to update profile after score event', updErr.message || updErr);
  } else {
    const { error: updErr } = await supabase
      .from('profiles')
      .update({ civic_score: newScore })
      .eq('id', callerId);
    if (updErr) console.error('Failed to update profile score', updErr.message || updErr);
  }

  return { ok: true, event: eventType, delta, newScore };
}

// Server-side helper: award score for a known user id (bypasses req stream)
export async function awardScoreForUser(userId, eventType, metadata = {}) {
  if (!userId || !eventType) return { ok: false, error: 'missing' };
  const rules = await getScoreRules();
  const delta = rules[eventType]?.score_delta ?? 0;
  const { error: insertErr } = await supabase.from('civic_score_events').insert({ user_id: userId, event_type: eventType, score_delta: delta, metadata });
  if (insertErr) console.error('Failed to insert civic_score_event (server helper)', insertErr.message || insertErr);

  const { data: profile } = await supabase.from('profiles').select('civic_score').eq('id', userId).maybeSingle();
  const newScore = (profile?.civic_score || 0) + delta;
  const { error: updErr } = await supabase.from('profiles').update({ civic_score: newScore }).eq('id', userId);
  if (updErr) console.error('Failed to update profile civic_score (server helper)', updErr.message || updErr);

  return { ok: true, delta, newScore };
}
