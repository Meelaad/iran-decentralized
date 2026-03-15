import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BADGES = {
  genesis_node: { id: 'genesis_node', title: 'Genesis Node', icon: '🌱' },
  endorser: { id: 'endorser', title: 'Endorser', icon: '✊' },
  questioner: { id: 'questioner', title: 'Questioner', icon: '❓' },
  reformer: { id: 'reformer', title: 'Reformer', icon: '📜' },
  recruiter: { id: 'recruiter', title: 'Recruiter', icon: '🤝' },
  verified_citizen: { id: 'verified_citizen', title: 'Verified Citizen', icon: '⭐' },
  trusted_voice: { id: 'trusted_voice', title: 'Trusted Voice', icon: '🏆' },
  streak_7: { id: 'streak_7', title: 'Streak 7', icon: '🔥' },
  streak_30: { id: 'streak_30', title: 'Streak 30', icon: '💎' }
};

export async function awardBadgeToUser(userId, badgeId, metadata = {}) {
  if (!userId || !badgeId) return null;
  // Fetch current badges
  const { data: profile, error: pErr } = await supabase.from('profiles').select('badges').eq('id', userId).maybeSingle();
  if (pErr) {
    console.error('failed to fetch profile badges', pErr.message || pErr);
    return null;
  }
  const badges = Array.isArray(profile?.badges) ? profile.badges : [];
  if (badges.find(b => b.id === badgeId)) return { ok: false, reason: 'already_awarded' };

  const newBadge = { id: badgeId, awarded_at: new Date().toISOString(), metadata };
  badges.push(newBadge);

  const { error: updErr } = await supabase.from('profiles').update({ badges }).eq('id', userId);
  if (updErr) {
    console.error('failed to update badges', updErr.message || updErr);
    return null;
  }

  return { ok: true, badge: newBadge };
}

export function getBadgeMeta(badgeId) {
  return BADGES[badgeId] || null;
}

export function listAllBadges() {
  return Object.values(BADGES);
}
