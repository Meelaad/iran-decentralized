import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import CONTENT from '../../locales/pages/pretrans.json';
import './PreTransPage.css';

export default function PreTransPage() {
    const { isRTL, t } = useLang();

    return (
        <div className="pretrans-root" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="pretrans-bg-grid" />

            <div className="pretrans-inner">
                <Link to="/choose" className="pretrans-back">
                    ← {t(CONTENT.backLink)}
                </Link>

                <div className="pretrans-eyebrow">
                    {t(CONTENT.eyebrow)}
                </div>
                <h1 className="pretrans-title">
                    {t(CONTENT.title)}
                </h1>
                <p className="pretrans-sub">
                    {t(CONTENT.subtitle)}
                </p>

                <div className="pretrans-grid">
                    {CONTENT.sections.map(s => (
                        <Link key={s.to} to={s.to} className="pretrans-card">
                            <span className="pretrans-card-icon">{s.icon}</span>
                            <div className="pretrans-card-title">{t(s.title)}</div>
                            <div className="pretrans-card-desc">{t(s.desc)}</div>
                        </Link>
                    ))}
                </div>

                <div className="pretrans-footer">
                    <Link to="/destination" className="pretrans-phase2-link">
                        {t(CONTENT.phase2Link)}
                    </Link>
                </div>
            </div>
        </div>
    );
}
