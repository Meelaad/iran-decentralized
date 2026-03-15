export const BADGES = {
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

export function listAllBadges() {
  return Object.values(BADGES);
}

export function getBadgeMeta(badgeId) {
  return BADGES[badgeId] || null;
}
