import React from 'react';
import { useLang } from '../../contexts/LangContext';
import { Link } from 'react-router-dom';
import './CareersPage.css';

export default function CareersPage() {
    const { tKey, isRTL, monoFont, headFont } = useLang();

    // Placeholder data mapping to our JSON
    const jobs = [
        {id: 'blockchain', key: 'careers.roles.blockchain', className: 'blockchain-role' },
        { id: 'frontend', key: 'careers.roles.frontend' },
        { id: 'smartContract', key: 'careers.roles.smartContract' },
        { id: 'policy', key: 'careers.roles.policy' },

    ];

    return (
        <div className="careers-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="careers-bg-grid" />
            <div className="careers-scanline" />

            <div className="careers-inner">
                <header className="careers-header">
                    <div className="careers-eyebrow" style={{ fontFamily: monoFont }}>
                        {tKey('careers.eyebrow')}
                    </div>
                    <h1 className="careers-title" style={{ fontFamily: headFont }}>
                        {tKey('careers.title')}
                    </h1>
                    <p className="careers-subtitle">{tKey('careers.subtitle')}</p>
                </header>

                <section className="careers-section">
                    <h2 className="careers-section-title" style={{ fontFamily: monoFont }}>
                        {tKey('careers.openRoles')}
                    </h2>

                    <div className="careers-grid">
                        {jobs.map(job => (
                            <div key={job.id} className="careers-card">
                                <h3 className="careers-card-title" style={{ fontFamily: headFont }}>
                                    {tKey(`${job.key}.title`)}
                                </h3>
                                <div className="careers-card-meta" style={{ fontFamily: monoFont }}>
                                    {tKey(`${job.key}.type`)}
                                </div>
                                <p className="careers-card-desc">
                                    {tKey(`${job.key}.desc`)}
                                </p>
                                <Link to={`/apply?role=${job.id}`} className="careers-apply-btn" style={{ fontFamily: monoFont }}>
                                    {tKey('careers.applyBtn')}
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="careers-footer">
                    <p>
                        {tKey('careers.contactPrompt')} <a href="mailto:careers@irandao.net">careers@irandao.net</a>
                    </p>
                </footer>
            </div>
        </div>
    );
}