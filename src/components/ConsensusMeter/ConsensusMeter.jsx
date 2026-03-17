import React from 'react';
import { useLang } from '../../contexts/LangContext';
import './ConsensusMeter.css';

export default function ConsensusMeter({ totalUsers = 0, totalEndorsed = 0, targetPct = 0.67 }) {
    const { tKey, isRTL } = useLang();
    const pct         = totalUsers > 0 ? Math.min(1, totalEndorsed / totalUsers) : 0;
    const displayPct  = Math.round(pct * 100);
    const needed      = Math.max(0, Math.ceil(targetPct * totalUsers - totalEndorsed));
    // Animate fill colour: cyan below target, green at/above target
    const fillColor   = pct >= targetPct ? '#69d98c' : '#8B5CF6';

    return (
        <div className="cm-root" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="cm-pct">{displayPct}%</div>
            <div className="cm-label">{tKey('arena.consensusLabel')}</div>
            <div className="cm-bar" role="progressbar" aria-valuenow={displayPct} aria-valuemin={0} aria-valuemax={100}>
                <div className="cm-fill" style={{ width: `${displayPct}%`, background: fillColor }} />
                <div className="cm-target-line" style={{ insetInlineStart: `${Math.round(targetPct * 100)}%` }} />
            </div>
            {needed > 0 && (
                <div className="cm-note">
                    {tKey('arena.consensusNeeded', { n: needed.toLocaleString(), pct: Math.round(targetPct * 100) })}
                </div>
            )}
        </div>
    );
}
