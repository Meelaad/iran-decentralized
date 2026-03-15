import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SCORE_DELTAS = {
  daily_login: 1,
  vote_cast: 2,
  plan_vote: 2,
  expert_vote: 1,
  amendment_vote: 1,
  amendment_proposed: 3,
  comment_posted: 1,
  plan_endorsed: 1,
  invited_user_joined: 5,
  email_verified: 1,
  phone_verified: 2,
  id_verified: 3,
  photo_verified: 1,
  institutional_email_verified: 2,
  streak_7: 3,
  streak_30: 10,
};

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

  const body = await new Promise((resolve) => {
    let d = '';
    req.on('data', chunk => d += chunk);
    req.on('end', () => { try { resolve(JSON.parse(d || '{}')); } catch(e){ resolve({}); } });
    req.on('error', () => resolve({}));
  });

  const eventType = body.event_type;
  if (!eventType) throw { status: 400, error: 'event_type is required' };

  const delta = SCORE_DELTAS[eventType] ?? 0;
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

  // Streak logic: if last_active_date < today, increment streak and add daily_login handling
  const lastActiveStr = lastActive ? lastActive.toISOString().split('T')[0] : null;
  if (lastActiveStr !== todayStr) {
    // New active day
    newStreak = (profile?.streak_days || 0) + 1;
    // Update contribution grid
    contributionGrid = { ...contributionGrid };
    contributionGrid[todayStr] = (contributionGrid[todayStr] || 0) + 1;

    // Check for streak milestones
    if (newStreak === 7) {
      // award streak_7
      newScore += SCORE_DELTAS.streak_7 || 0;
      await supabase.from('civic_score_events').insert({ user_id: callerId, event_type: 'streak_7', score_delta: SCORE_DELTAS.streak_7 || 0, metadata: {} });
      try { const { awardBadgeToUser } = await import('./badges.js'); await awardBadgeToUser(callerId, 'streak_7'); } catch (e) { console.error('badge award failed', e); }
    }
    if (newStreak === 30) {
      newScore += SCORE_DELTAS.streak_30 || 0;
      await supabase.from('civic_score_events').insert({ user_id: callerId, event_type: 'streak_30', score_delta: SCORE_DELTAS.streak_30 || 0, metadata: {} });
      try { const { awardBadgeToUser } = await import('./badges.js'); await awardBadgeToUser(callerId, 'streak_30'); } catch (e) { console.error('badge award failed', e); }
    }

    // Update last_active_date
    const { error: updErr } = await supabase
      .from('profiles')
      .update({ civic_score: newScore, last_active_date: now.toISOString(), streak_days: newStreak, contribution_grid: contributionGrid })
      .eq('id', callerId);
    if (updErr) console.error('Failed to update profile after score event', updErr.message || updErr);
  } else {
    // Same day, just update score (no streak increment)
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
  const delta = SCORE_DELTAS[eventType] ?? 0;
  const { error: insertErr } = await supabase.from('civic_score_events').insert({ user_id: userId, event_type: eventType, score_delta: delta, metadata });
  if (insertErr) console.error('Failed to insert civic_score_event (server helper)', insertErr.message || insertErr);

  // Update profile score atomically: read current and update
  const { data: profile } = await supabase.from('profiles').select('civic_score').eq('id', userId).maybeSingle();
  const newScore = (profile?.civic_score || 0) + delta;
  const { error: updErr } = await supabase.from('profiles').update({ civic_score: newScore }).eq('id', userId);
  if (updErr) console.error('Failed to update profile civic_score (server helper)', updErr.message || updErr);

  return { ok: true, delta, newScore };
}
