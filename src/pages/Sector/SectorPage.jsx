import React, { useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS, SECTORS, CONNECTIONS } from "../../data";
import { supabase } from '../../lib/supabase';
import './SectorPage.css';

export default function SectorPage() {
    const { sectorId, blueprintId } = useParams();
    const { t, tKey, isRTL } = useLang();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetch('/api/public/civic/score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({ event_type: 'daily_login' }),
                }).catch(() => {});
            }
        });
    }, []);

    const activeSectors = (blueprintId && BLUEPRINTS[blueprintId]?.sectors) || SECTORS;
    const activeConnections = (blueprintId && BLUEPRINTS[blueprintId]?.connections) || CONNECTIONS;
    const mapLink = blueprintId ? `/blueprint/gov/${blueprintId}` : '/blueprint/gov/decentralized';
    const sectorBase = blueprintId ? `/blueprint/gov/${blueprintId}/sectors` : '/sectors';

    const sector = useMemo(() => activeSectors.find(s => s.id === sectorId), [sectorId, activeSectors]);

    const connections = useMemo(() => {
        if (!sector) return [];
        return activeConnections
            .filter(c => c.from === sector.id || c.to === sector.id)
            .map(c => {
                const otherId = c.from === sector.id ? c.to : c.from;
                const other = activeSectors.find(s => s.id === otherId);
                return { ...c, other };
            });
    }, [sector, activeConnections, activeSectors]);

    if (!sector) {
        return (
            <div className="sector-not-found">
                <h2>404</h2>
                <p>{tKey('sector.notFound')}</p>
                <Link to={mapLink} className="sector-back" style={{ marginTop: 24 }}>
                    ← {tKey('common.backToMap')}
                </Link>
            </div>
        );
    }

    return (
        <div className="sector-page">
            <div className="sector-page-retro-grid" />
            <div className="sector-page-scanline" />

            <div className="sector-page-inner">
                <Link to={mapLink} className="sector-back">
                    ← {tKey('common.backToMap')}
                </Link>

                <div className="sector-hero">
                    <div className="sector-hero-tier" style={{ color: sector.border }}>
                        {tKey(`blueprint.tiers.${sector.tier}`)}
                    </div>
                    <span className="sector-hero-icon">{sector.icon}</span>
                    <h1
                        className="sector-hero-title"
                        style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                    >
                        {t(sector.label)}
                    </h1>
                    <p className="sector-hero-desc">{t(sector.desc)}</p>
                </div>

                <div className="sector-divider" />

                <div className="sector-section-title">
                    {tKey('blueprint.internalSystems')}
                </div>
                <div className="sector-systems-grid">
                    {sector.contents.map((item, i) => (
                        <div
                            key={i}
                            className="sector-system-card"
                            style={{
                                borderLeftColor: sector.border,
                                animationDelay: `${i * 0.06}s`
                            }}
                        >
                            {t(item)}
                        </div>
                    ))}
                </div>

                {connections.length > 0 && (
                    <>
                        <div className="sector-section-title">
                            {tKey('blueprint.connections', { count: connections.length })}
                        </div>
                        <div className="sector-connections">
                            {connections.map((conn, i) => (
                                <Link
                                    key={i}
                                    to={`${sectorBase}/${conn.other?.id}`}
                                    className="sector-conn-row"
                                >
                                    <div className="sector-conn-left">
                                        <span className="sector-conn-icon">{conn.other?.icon}</span>
                                        <span>{t(conn.other?.label)}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span className="sector-conn-label">{t(conn.label)}</span>
                                        <span className="sector-conn-arrow">{isRTL ? "←" : "→"}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                <div className="sector-divider" />

                <div className="sector-content-placeholder">
                    <div className="sector-content-placeholder-title">
                        {tKey('sector.detailedContent')}
                    </div>
                    {tKey('sector.comingSoon')}
                </div>
            </div>
        </div>
    );
}
