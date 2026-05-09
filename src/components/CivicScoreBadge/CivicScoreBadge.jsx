import React, { useState } from 'react';
import { useLang } from '../../contexts/LangContext';
import './CivicScoreBadge.css';

const TIER_COLORS = {
    LOW: 'oklch(57% 0.22 25)',
    MID: 'oklch(84% 0.17 80)',
    HIGH: 'oklch(75% 0.18 150)',
};
const TIER_WEIGHTS = { LOW: '1', MID: '2', HIGH: '3' };

export default function CivicScoreBadge({ score = 1, tier = 'LOW', size = 'medium' }) {
    const { tKey } = useLang();
    const [showTip, setShowTip] = useState(false);
    const color = TIER_COLORS[tier] || TIER_COLORS.LOW;
    const tierLabel = tKey(`civicScore.${tier.toLowerCase()}`);
    const weight = TIER_WEIGHTS[tier] || '1';
    const tooltip = tKey('civicScore.tooltip', { tier: tierLabel, weight });

    return (
        <div
            className={`csb-root csb-size--${size}`}
            style={{ borderColor: color, color }}
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            aria-label={tooltip}
        >
            <span className="csb-score">{score}</span>
            <span className="csb-tier" style={{ color }}>{tierLabel}</span>
            {showTip && (
                <div className="csb-tooltip">{tooltip}</div>
            )}
        </div>
    );
}
