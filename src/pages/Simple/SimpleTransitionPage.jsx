import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import CONTENT from '../../locales/pages/simple.json';
import './SimpleGrid.css';

const TRANSITION_CARDS = [
    {
        key: 'arena',
        emoji: '⚔',
        titleKey: 'arenaTitle',
        descKey: 'arenaDesc',
        href: '/arena',
        img: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=800&q=70&auto=format',
        accent: 'purple',
    },
    {
        key: 'plans',
        emoji: '📋',
        titleKey: 'plansTitle',
        descKey: 'plansDesc',
        href: '/plans',
        img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=70&auto=format',
        accent: 'blue',
    },
    {
        key: 'vote',
        emoji: '🗳',
        titleKey: 'voteTitle',
        descKey: 'voteDesc',
        href: '/vote',
        img: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=70&auto=format',
        accent: 'green',
    },
    {
        key: 'pre',
        emoji: '🗺',
        titleKey: 'preTitle',
        descKey: 'preDesc',
        href: '/pre',
        img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70&auto=format',
        accent: 'amber',
    },
    {
        key: 'global',
        emoji: '🌐',
        titleKey: 'globalTitle',
        descKey: 'globalDesc',
        href: '/global',
        img: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=70&auto=format',
        accent: 'cyan',
    },
    {
        key: 'compare-trans',
        emoji: '⚖',
        titleKey: 'compareTransTitle',
        descKey: 'compareTransDesc',
        href: '/compare/transition',
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=70&auto=format',
        accent: 'red',
    },
];

export default function SimpleTransitionPage() {
    const { t, isRTL, headFont } = useLang();
    const navigate = useNavigate();

    return (
        <div className="svg-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="svg-bg" />

            <header className="svg-header">
                <div className="svg-zone-pill svg-zone-pill--trans">
                    🔄&nbsp; {t(CONTENT.transitionZone)}
                </div>
                <h1 className="svg-page-title">{t(CONTENT.transPageTitle)}</h1>
                <p className="svg-page-sub">{t(CONTENT.transPageSub)}</p>
            </header>

            <div className="svg-grid">
                {TRANSITION_CARDS.map(card => (
                    <SimpleCard
                        key={card.key}
                        emoji={card.emoji}
                        title={t(CONTENT[card.titleKey])}
                        desc={t(CONTENT[card.descKey])}
                        img={card.img}
                        accent={card.accent}
                        openLabel={t(CONTENT.openCard)}
                        onClick={() => navigate(card.href)}
                    />
                ))}
            </div>

            <footer className="svg-footer">
                <Link to="/simple" className="svg-back">
                    ← {t(CONTENT.backSimple)}
                </Link>
            </footer>
        </div>
    );
}

export function SimpleCard({ emoji, title, desc, img, accent, openLabel, onClick }) {
    const { headFont } = useLang();
    return (
        <button
            className={`svg-card svg-card--${accent}`}
            onClick={onClick}
            aria-label={title}
            style={{ fontFamily: headFont }}
        >
            {/* Image strip */}
            <div className="svg-card-img-wrap">
                <div
                    className="svg-card-img"
                    style={{ backgroundImage: `url('${img}')` }}
                />
                <div className="svg-card-img-overlay" />
                <div className="svg-card-emoji-float">{emoji}</div>
            </div>

            {/* Content */}
            <div className="svg-card-body">
                <h3 className="svg-card-title">{title}</h3>
                <p className="svg-card-desc">{desc}</p>
                <div className="svg-card-open">
                    {openLabel}
                    <span className="svg-card-arrow">→</span>
                </div>
            </div>
        </button>
    );
}
