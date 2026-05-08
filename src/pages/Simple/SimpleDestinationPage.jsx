import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import CONTENT from '../../locales/pages/simple.json';
import { SimpleCard } from './SimpleTransitionPage';
import './SimpleGrid.css';

const DEST_CARDS = [
    {
        key: 'dest-overview',
        emoji: '🏛',
        titleKey: 'destOverTitle',
        descKey: 'destOverDesc',
        href: '/destination',
        img: 'https://images.unsplash.com/photo-1588598158573-07984d1f19bc?w=800&q=70&auto=format',
        accent: 'green',
    },
    {
        key: 'blueprints',
        emoji: '📐',
        titleKey: 'bpTitle',
        descKey: 'bpDesc',
        href: '/blueprints',
        img: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&q=70&auto=format',
        accent: 'purple',
    },
    {
        key: 'gov-map',
        emoji: '🗺',
        titleKey: 'mapTitle',
        descKey: 'mapDesc',
        href: '/blueprint/gov/decentralized',
        img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=70&auto=format',
        accent: 'cyan',
    },
    {
        key: 'sectors',
        emoji: '🔷',
        titleKey: 'sectorsTitle',
        descKey: 'sectorsDesc',
        href: '/blueprint/gov/decentralized/sectors',
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=70&auto=format',
        accent: 'blue',
    },
    {
        key: 'layers',
        emoji: '🔧',
        titleKey: 'layersTitle',
        descKey: 'layersDesc',
        href: '/blueprint/gov/decentralized/layers',
        img: 'https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?w=800&q=70&auto=format',
        accent: 'amber',
    },
    {
        key: 'roadmap',
        emoji: '🛤',
        titleKey: 'roadmapTitle',
        descKey: 'roadmapDesc',
        href: '/blueprint/gov/decentralized/roadmap',
        img: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&q=70&auto=format',
        accent: 'teal',
    },
    {
        key: 'compare-dest',
        emoji: '⚖',
        titleKey: 'compareDestTitle',
        descKey: 'compareDestDesc',
        href: '/compare',
        img: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=70&auto=format',
        accent: 'red',
    },
];

export default function SimpleDestinationPage() {
    const { t, isRTL, headFont } = useLang();
    const navigate = useNavigate();

    return (
        <div className="svg-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="svg-bg" />

            <header className="svg-header">
                <div className="svg-zone-pill svg-zone-pill--dest">
                    🏛&nbsp; {t(CONTENT.destinationZone)}
                </div>
                <h1 className="svg-page-title">{t(CONTENT.destPageTitle)}</h1>
                <p className="svg-page-sub">{t(CONTENT.destPageSub)}</p>
            </header>

            <div className="svg-grid">
                {DEST_CARDS.map(card => (
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
