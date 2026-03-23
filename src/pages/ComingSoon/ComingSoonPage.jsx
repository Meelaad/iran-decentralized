import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import CONTENT from '../../locales/pages/coming-soon.json';
import './ComingSoonPage.css';

export default function ComingSoonPage() {
    const { t, isRTL } = useLang();
    const { pathname } = useLocation();
    const sectionKey = CONTENT.sections[pathname] ? pathname : 'default';
    const section = CONTENT.sections[sectionKey];
    const icon = CONTENT.icons[sectionKey];
    const link = CONTENT.links[sectionKey] || null;
    const dir = isRTL ? 'rtl' : 'ltr';
    const monoFont = isRTL ? "'Irancell', sans-serif" : "'intelone-mono', monospace";
    const headFont = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";

    return (
        <div className="cs2-page" dir={dir}>
            <div className="cs2-inner">
                <div className="cs2-label" style={{ fontFamily: monoFont }}>
                    {t(section.label)}
                </div>

                <div className="cs2-icon">{icon}</div>

                <h1 className="cs2-title" style={{ fontFamily: headFont }}>
                    {t(section.title)}
                </h1>

                <p className="cs2-desc">{t(section.desc)}</p>

                <div className="cs2-status" style={{ fontFamily: monoFont }}>
                    <span className="cs2-status-dot" />
                    <span>{t(section.eta)}</span>
                </div>

                {link && (
                    <Link to={link} className="cs2-action-btn">
                        {t(section.linkLabel)}
                    </Link>
                )}

                <div className="cs2-nav">
                    <Link to="/plans" className="cs2-nav-link">
                        {t(CONTENT.nav.allPlans)}
                    </Link>
                    <Link to="/arena" className="cs2-nav-link cs2-nav-link--dim">
                        {t(CONTENT.nav.arena)}
                    </Link>
                </div>
            </div>
        </div>
    );
}
