import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import CONTENT from '../../locales/pages/simple.json';
import './SimpleHubPage.css';

export default function SimpleHubPage() {
    const { t, isRTL, headFont } = useLang();
    const navigate = useNavigate();

    return (
        <div className="svh-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="svh-bg" />

            <header className="svh-header">
                <BrandMark size="nav" />
                <h1 className="svh-title">{t(CONTENT.hubTitle)}</h1>
                <p className="svh-subtitle">{t(CONTENT.hubSubtitle)}</p>
            </header>

            {/* ── Two giant hero cards ───────────────────────────────── */}
            <div className="svh-cards">

                {/* TRANSITION */}
                <button
                    className="svh-hero svh-hero--trans"
                    onClick={() => navigate('/simple/transition')}
                    aria-label={t(CONTENT.transitionTitle)}
                    style={{ fontFamily: headFont }}
                >
                    <div
                        className="svh-hero-img"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=70&auto=format')" }}
                    />
                    <div className="svh-hero-overlay" />
                    <div className="svh-hero-body">
                        <div className="svh-zone-badge svh-zone-badge--trans">
                            {t(CONTENT.transitionZone)}
                        </div>
                        <div className="svh-big-icon">🔄</div>
                        <h2 className="svh-hero-heading">{t(CONTENT.transitionTitle)}</h2>
                        <p className="svh-hero-desc">{t(CONTENT.transitionDesc)}</p>
                        <ul className="svh-feature-list">
                            <li>⚔&nbsp; {t(CONTENT.transitionItem1)}</li>
                            <li>📋&nbsp; {t(CONTENT.transitionItem2)}</li>
                            <li>🗳&nbsp; {t(CONTENT.transitionItem3)}</li>
                            <li>🌐&nbsp; {t(CONTENT.transitionItem4)}</li>
                        </ul>
                        <div className="svh-cta svh-cta--trans">
                            {t(CONTENT.explore)}
                            <span className="svh-arrow">→</span>
                        </div>
                    </div>
                </button>

                {/* DESTINATION */}
                <button
                    className="svh-hero svh-hero--dest"
                    onClick={() => navigate('/simple/destination')}
                    aria-label={t(CONTENT.destinationTitle)}
                    style={{ fontFamily: headFont }}
                >
                    <div
                        className="svh-hero-img"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=70&auto=format')" }}
                    />
                    <div className="svh-hero-overlay svh-hero-overlay--green" />
                    <div className="svh-hero-body">
                        <div className="svh-zone-badge svh-zone-badge--dest">
                            {t(CONTENT.destinationZone)}
                        </div>
                        <div className="svh-big-icon">🏛</div>
                        <h2 className="svh-hero-heading">{t(CONTENT.destinationTitle)}</h2>
                        <p className="svh-hero-desc">{t(CONTENT.destinationDesc)}</p>
                        <ul className="svh-feature-list">
                            <li>📐&nbsp; {t(CONTENT.destinationItem1)}</li>
                            <li>🔷&nbsp; {t(CONTENT.destinationItem2)}</li>
                            <li>🔧&nbsp; {t(CONTENT.destinationItem3)}</li>
                            <li>🛤&nbsp; {t(CONTENT.destinationItem4)}</li>
                        </ul>
                        <div className="svh-cta svh-cta--dest">
                            {t(CONTENT.explore)}
                            <span className="svh-arrow">→</span>
                        </div>
                    </div>
                </button>

            </div>

            {/* ── Quick action row ───────────────────────────────────── */}
            <div className="svh-quick-row">
                <button className="svh-quick-btn svh-quick-btn--vote" onClick={() => navigate('/vote')} style={{ fontFamily: headFont }}>
                    {t(CONTENT.directVote)}
                </button>
                <button className="svh-quick-btn svh-quick-btn--join" onClick={() => navigate('/register')} style={{ fontFamily: headFont }}>
                    {t(CONTENT.directJoin)}
                </button>
            </div>

            <footer className="svh-footer">
                <Link to="/access-mode" className="svh-back">
                    ← {t(CONTENT.backAccess)}
                </Link>
            </footer>
        </div>
    );
}
