import React from 'react';
import { useParams } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import CONTENT from '../../locales/pages/roadmap.json';
import './RoadmapPage.css';

const { decentralizedPhases: DECENTRALIZED_PHASES, tierConfig: TIER_CONFIG } = CONTENT;

export default function RoadmapPage() {
    const { t, isRTL, headFont } = useLang();
    const { blueprintId } = useParams();
    const blueprint = BLUEPRINTS[blueprintId] || BLUEPRINTS.decentralized;

    const phases = React.useMemo(() => {
        if (blueprint.id === 'decentralized') {
            return DECENTRALIZED_PHASES;
        }

        const grouped = { core: [], primary: [], secondary: [], tertiary: [] };
        for (const sector of blueprint.sectors) {
            if (grouped[sector.tier]) {
                grouped[sector.tier].push(sector);
            }
        }

        return Object.entries(grouped)
            .filter(([, sectors]) => sectors.length > 0)
            .map(([tier, sectors]) => ({
                ...TIER_CONFIG[tier],
                items: sectors.map(s => s.label),
            }));
    }, [blueprint]);

    return (
        <div className="roadmap-page">
            <div className="roadmap-page-scanline" />
            <div className="roadmap-bg-grid" />
            <div className="roadmap-inner">
                <h1
                    className="roadmap-title"
                    style={{ fontFamily: headFont }}
                >
                    {t(CONTENT.title)}
                </h1>
                <p className="roadmap-subtitle">
                    {t({
                        en: `A phased path for the ${t(blueprint.name)} blueprint.`,
                        fa: `مسیر گام‌به‌گام برای طرح ${t(blueprint.name)}.`
                    })}
                </p>

                <div className="roadmap-timeline">
                    <div className="roadmap-timeline-line" />
                    {phases.map((phase, i) => (
                        <div
                            key={i}
                            className="roadmap-phase"
                            style={{ animationDelay: `${i * 0.12}s` }}
                        >
                            <div className="roadmap-phase-dot" style={{ borderColor: phase.color, boxShadow: `0 0 12px ${phase.color}40` }} />
                            <div className="roadmap-phase-content">
                                <h2
                                    className="roadmap-phase-title"
                                    style={{
                                        color: phase.color,
                                        fontFamily: headFont
                                    }}
                                >
                                    {t(phase.phase)}
                                </h2>
                                <ul className="roadmap-phase-items">
                                    {phase.items.map((item, j) => (
                                        <li
                                            key={j}
                                            className="roadmap-item"
                                            style={{ animationDelay: `${i * 0.12 + j * 0.05}s` }}
                                        >
                                            <span className="roadmap-item-bullet" style={{ background: phase.color }} />
                                            <span>{t(item)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
