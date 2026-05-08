import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { FeatureSlider, RIGHT_FEATURES } from '../../components/FeatureSlider/FeatureSlider';
import CONTENT from '../../locales/pages/access-mode.json';
import './AccessModePage.css';

export default function AccessModePage() {
    const { t, isRTL, lang, setLang, monoFont, headFont } = useLang();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="am-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="am-bg-grid" style={{ viewTransitionName: 'standalone-bg' }} />

            {/* Top bar */}
            {/* <div className="am-topbar" style={{ viewTransitionName: 'standalone-topbar' }}>
                <ThemeSwitch />
                <button
                    className={`am-lang-btn${lang === 'fa' ? ' is-active' : ''}`}
                    onClick={() => setLang('fa')}
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >فارسی</button>
                <button
                    className={`am-lang-btn${lang === 'en' ? ' is-active' : ''}`}
                    onClick={() => setLang('en')}
                >EN</button>
            </div> */}

            {/* Mobile menu button */}
            {/* <div className="am-mobile-menu">
                <button className="am-mobile-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
                    {menuOpen
                        ? <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" /></svg>
                        : <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" /></svg>
                    }
                </button>
                {menuOpen && (
                    <div className="am-mobile-menu-dropdown">
                        <ThemeSwitch />
                        <div className="am-mobile-lang">
                            <button className={`am-lang-btn${lang === 'fa' ? ' is-active' : ''}`} onClick={() => { setLang('fa'); setMenuOpen(false); }} style={{ fontFamily: "'Vazirmatn', sans-serif" }}>فارسی</button>
                            <button className={`am-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => { setLang('en'); setMenuOpen(false); }}>EN</button>
                        </div>
                    </div>
                )}
            </div> */}

            <div className="am-inner">
                <header className="am-header">
                    <BrandMark size="lg" />
                    <h1 className="am-title" style={{ fontFamily: headFont }}>
                        {t(CONTENT.title)}
                    </h1>
                    <p className="am-subtitle">
                        {t(CONTENT.subtitle)}
                    </p>
                </header>

                <div className="am-cards">

                    {/* ── Easy Access ── */}
                    <div
                        className="am-card am-card--easy"
                        onClick={() => { if (document.startViewTransition) { document.startViewTransition(() => navigate('/simple')); } else { navigate('/simple'); } }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') { if (document.startViewTransition) { document.startViewTransition(() => navigate('/simple')); } else { navigate('/simple'); } } }}
                    >
                        <div className="am-card-icon">🌿</div>
                        <div className="am-card-badge am-card-badge--easy" style={{ fontFamily: monoFont }}>
                            {t(CONTENT.easyBadge)}
                        </div>
                        <h2 className="am-card-title" style={{ fontFamily: headFont }}>
                            {t(CONTENT.easyTitle)}
                        </h2>
                        <p className="am-card-desc">
                            {t(CONTENT.easyDesc)}
                        </p>
                        <ul className="am-card-features">
                            <li>{t(CONTENT.easyFeature1)}</li>
                            <li>{t(CONTENT.easyFeature2)}</li>
                            <li>{t(CONTENT.easyFeature3)}</li>
                            <li>{t(CONTENT.easyFeature4)}</li>
                        </ul>
                        <div className="am-card-cta" style={{ fontFamily: monoFont }}>
                            {t(CONTENT.completeCta)}
                        </div>
                    </div>

                    {/* ── Complete Access ── */}
                    <div
                        className="am-card am-card--complete"
                        onClick={() => { if (document.startViewTransition) { document.startViewTransition(() => navigate('/choose')); } else { navigate('/choose'); } }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') { if (document.startViewTransition) { document.startViewTransition(() => navigate('/choose')); } else { navigate('/choose'); } } }}
                    >
                        <div className="am-card-icon">⚡</div>
                        <div className="am-card-badge am-card-badge--complete" style={{ fontFamily: monoFont }}>
                            {t(CONTENT.completeBadge)}
                        </div>
                        <h2 className="am-card-title" style={{ fontFamily: headFont }}>
                            {t(CONTENT.completeTitle)}
                        </h2>
                        <p className="am-card-desc">
                            {t(CONTENT.completeDesc)}
                        </p>
                        <ul className="am-card-features">
                            <li>{t(CONTENT.completeFeature1)}</li>
                            <li>{t(CONTENT.completeFeature2)}</li>
                            <li>{t(CONTENT.completeFeature3)}</li>
                            <li>{t(CONTENT.completeFeature4)}</li>
                        </ul>
                        <div className="am-card-cta" style={{ fontFamily: monoFont }}>
                            {t(CONTENT.completeCta)}
                        </div>
                    </div>

                </div>

                <div className="am-footer">
                    <Link to="/" className="am-back" style={{ fontFamily: monoFont }}>
                        {t(CONTENT.backHome)}
                    </Link>
                </div>
            </div>

            <FeatureSlider items={RIGHT_FEATURES} />
        </div>
    );
}
