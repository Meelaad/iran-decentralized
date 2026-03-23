import React from 'react';
import { useParams } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS, SECTORS } from '../../data';
import CONTENT from '../../locales/pages/layers.json';
import './LayersPage.css';

export default function LayersPage() {
    const { t, isRTL, headFont } = useLang();
    const { blueprintId } = useParams();
    const blueprint = BLUEPRINTS[blueprintId] || BLUEPRINTS.decentralized;
    const sharedLayers = blueprint.sharedLayers || [];

    return (
        <div className="layers-page">
            <div className="layers-page-scanline" />
            <div className="layers-bg-grid" />
            <div className="layers-inner">
                <h1
                    className="layers-title"
                    style={{ fontFamily: headFont }}
                >
                    {t(CONTENT.title)}
                </h1>
                <p className="layers-subtitle">
                    {t({
                        en: `${CONTENT.subtitle.en} ${t(blueprint.name)}.`,
                        fa: `${CONTENT.subtitle.fa} ${t(blueprint.name)}.`
                    })}
                </p>

                <div className="layers-stack">
                    {sharedLayers.map((layer, i) => {
                        const details = CONTENT.layerDetails[i];
                        const connectedSectors = details?.sectors
                            .map(id => SECTORS.find(s => s.id === id))
                            .filter(Boolean);

                        return (
                            <div
                                key={i}
                                className="layer-card"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="layer-card-index">L{i + 1}</div>
                                <div className="layer-card-main">
                                    <div className="layer-card-header">
                                        <span className="layer-card-icon">{layer.icon}</span>
                                        <h2
                                            className="layer-card-name"
                                            style={{ fontFamily: headFont }}
                                        >
                                            {t(layer.name)}
                                        </h2>
                                    </div>
                                    <p className="layer-card-desc">{t(layer.desc)}</p>

                                    {blueprint.id === 'decentralized' && details && (
                                        <>
                                            <div className="layer-card-features">
                                                <div className="layer-features-label">
                                                    {t(CONTENT.keyCapabilitiesLabel)}
                                                </div>
                                                <ul className="layer-features-list">
                                                    {(isRTL ? details.features.fa : details.features.en).map((f, j) => (
                                                        <li key={j}>{f}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="layer-card-sectors">
                                                <div className="layer-sectors-label">
                                                    {t(CONTENT.connectedSectorsLabel)}
                                                </div>
                                                <div className="layer-sector-chips">
                                                    {connectedSectors.map(s => (
                                                        <span
                                                            key={s.id}
                                                            className="layer-sector-chip"
                                                            style={{ borderColor: s.border, color: s.border }}
                                                        >
                                                            {s.icon} {t(s.label)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
