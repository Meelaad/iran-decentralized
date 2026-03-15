import React, { useEffect, useState } from 'react';
import './BadgesShelf.css';
import { listAllBadges } from '../../data/badges';
import { useProfile } from '../../hooks/useProfile';

export default function BadgesShelf({ userId }) {
  const { data: profile } = useProfile(userId);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const all = listAllBadges();
    setBadges(all);
  }, []);

  const earned = profile?.badges || [];
  const isRTL = profile?.lang === 'fa';

  return (
    <div className="badges-shelf">
      <div className="badges-title">{isRTL ? 'دستاوردها' : 'Achievements'}</div>
      <div className="badges-list">
        {badges.map(b => {
          const earnedMeta = earned.find(e => e.id === b.id);
          return (
            <div key={b.id} className={`badge-item${earnedMeta ? ' earned' : ''}`} title={b.title}>
              <div className="badge-icon">{b.icon}</div>
              <div className="badge-key">{b.title}</div>
              {earnedMeta && <div className="badge-date">{new Date(earnedMeta.awarded_at).toLocaleDateString()}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
