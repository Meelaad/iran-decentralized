import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import { supabase } from '../../lib/supabase';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch';
import { SHOW_VOTE_COUNTS } from '../../config';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { FeatureSlider, RIGHT_FEATURES } from '../../components/FeatureSlider/FeatureSlider';
import CONTENT from '../../locales/pages/start-selection.json';
import './StartSelection.css';

function useLiveVoteCounts() {
    const [votes, setVotes] = useState({});
    useEffect(() => {
        supabase.rpc('get_blueprint_vote_counts').then(({ data }) => {
            const map = {};
            for (const row of data ?? []) map[row.blueprint_id] = Number(row.votes);
            setVotes(map);
        });
    }, []);
    return votes;
}

export default function StartSelection() {
    const { isRTL, t, lang, setLang, monoFont, headFont } = useLang();
    const votes = useLiveVoteCounts();
    const [activeStage, setActiveStage] = useState(1);
    const [menuOpen, setMenuOpen] = useState(false);

    const blueprints = Object.values(BLUEPRINTS);

    return (
        <div className="ss-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="ss-bg-grid" style={{ viewTransitionName: 'standalone-bg' }} />

            {/* Language switcher + theme toggle */}
            {/* <div className="ss-lang" style={{ viewTransitionName: 'standalone-topbar' }}>
                <ThemeSwitch />
                <button className={`ss-lang-btn${lang === 'fa' ? ' is-active' : ''}`} onClick={() => setLang('fa')} style={{ fontFamily: headFont }}>فارسی</button>
                <button className={`ss-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => setLang('en')}>EN</button>
            </div> */}

            {/* Mobile menu button */}
            {/* <div className="ss-mobile-menu">
                <button className="ss-mobile-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
                    {menuOpen
                        ? <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" /></svg>
                        : <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" /></svg>
                    }
                </button>
                {menuOpen && (
                    <div className="ss-mobile-menu-dropdown">
                        <ThemeSwitch />
                        <div className="ss-mobile-lang">
                            <button className={`ss-lang-btn${lang === 'fa' ? ' is-active' : ''}`} onClick={() => { setLang('fa'); setMenuOpen(false); }} style={{ fontFamily: headFont }}>فارسی</button>
                            <button className={`ss-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => { setLang('en'); setMenuOpen(false); }}>EN</button>
                        </div>
                    </div>
                )}
            </div> */}

            <header className="ss-header">
                <BrandMark size="sm" />
                <h1 className="ss-title">
                    {t(CONTENT.title)}
                </h1>
                <p className="ss-sub">
                    {t(CONTENT.subtitle)}
                </p>
            </header>

            {/* ── Mobile stage switcher — pill segmented (hidden on desktop) ── */}
            <div className="ss-stage-tabs">
                <div className="ss-pill-track">
                    <div className={`ss-pill-thumb${activeStage === 1 ? ' left' : ' right'}`} />
                    <button
                        className={`ss-pill-btn${activeStage === 1 ? ' is-active' : ''}`}
                        onClick={() => setActiveStage(1)}
                        style={{ fontFamily: headFont }}
                    >
                        {t(CONTENT.tabTransition)}
                    </button>
                    <button
                        className={`ss-pill-btn${activeStage === 2 ? ' is-active' : ''}`}
                        onClick={() => setActiveStage(2)}
                        style={{ fontFamily: headFont }}
                    >
                        {t(CONTENT.tabDestination)}
                    </button>
                </div>
            </div>

            <div className="ss-zones">
                {/* ── Zone 1: Pre-Collapse ───────────────────────────────── */}
                <div className={`ss-zone ss-zone--pre${activeStage !== 1 ? ' ss-zone--inactive' : ''}`}>
                    <div className="ss-zone-header">
                        <h2 className="ss-zone-title">
                            {t(CONTENT.zone1Title)}
                        </h2>
                        <p className="ss-zone-desc">
                            {t(CONTENT.zone1Desc)}
                        </p>
                    </div>
                    <div className="ss-zone-links">
                        <Link to="/arena" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">⚡</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.arenaTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.arenaDesc)}
                                </div>
                            </div>
                        </Link>
                        <Link to="/plans" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">📜</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.proposedBlueprintsTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.proposedBlueprintsDesc)}
                                </div>
                            </div>
                        </Link>
                        <Link to="/pre" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">🗺</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.preTransTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.preTransDesc)}
                                </div>
                            </div>
                        </Link>
                        <Link to="/compare/transition" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">⚖️</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.comparePlansTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.comparePlansDesc)}
                                </div>
                            </div>
                        </Link>
                        <Link to="/vote" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">🗳</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.voteTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.voteDesc)}
                                </div>
                            </div>
                        </Link>
                        <Link to="/global" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">🌍</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.globalMapTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.globalMapDesc)}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* ── Zone 2: Post-Collapse ──────────────────────────────── */}
                <div className={`ss-zone ss-zone--post${activeStage !== 2 ? ' ss-zone--inactive' : ''}`}>
                    <div className="ss-zone-header">
                        <h2 className="ss-zone-title">
                            {t(CONTENT.zone2Title)}
                        </h2>
                        <p className="ss-zone-desc">
                            {t(CONTENT.zone2Desc)}
                        </p>
                    </div>
                    <div className="ss-zone-links">
                        <Link to="/blueprints" className="ss-link ss-link--post">
                            <span className="ss-link-icon">🧭</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.proposedGovSystemsTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.proposedGovSystemsDesc)}
                                </div>
                            </div>
                        </Link>
                        <Link to="/destination" className="ss-link ss-link--post">
                            <span className="ss-link-icon">🏛</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.destinationHubTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.destinationHubDesc)}
                                </div>
                            </div>
                        </Link>
                        <Link to="/blueprint/gov/decentralized" className="ss-link ss-link--post">
                            <span className="ss-link-icon">🗺</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.mapViewTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.mapViewDesc)}
                                </div>
                            </div>
                        </Link>
                        <Link to="/compare" className="ss-link ss-link--post">
                            <span className="ss-link-icon">⚖️</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.compareTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.compareDesc)}
                                </div>
                            </div>
                        </Link>
                        <Link to="/vote" className="ss-link ss-link--post">
                            <span className="ss-link-icon">🗳</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {t(CONTENT.voteDestTitle)}
                                </div>
                                <div className="ss-link-desc">
                                    {t(CONTENT.voteDestDesc)}
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Live blueprint vote mini-summary */}
                    {SHOW_VOTE_COUNTS && Object.keys(votes).length > 0 && (
                        <div className="ss-vote-summary">
                            <div className="ss-vote-summary-label" style={{ fontFamily: monoFont }}>
                                {t(CONTENT.liveVoteSnapshot)}
                            </div>
                            {blueprints.slice(0, 3).map(bp => {
                                const count = votes[bp.id] ?? 0;
                                const total = Object.values(votes).reduce((a, b) => a + b, 0);
                                const pct = total ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={bp.id} className="ss-vote-row">
                                        <span className="ss-vote-name">{t(bp.name)}</span>
                                        <div className="ss-vote-bar-wrap">
                                            <div className="ss-vote-bar" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="ss-vote-pct" style={{ fontFamily: monoFont }}>{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="ss-footer">
                <Link to="/access-mode" className="ss-back" style={{ fontFamily: monoFont }}>← {t(CONTENT.backToAccessMode)}</Link>
            </div>

            <FeatureSlider items={RIGHT_FEATURES} />
        </div>
    );
}
