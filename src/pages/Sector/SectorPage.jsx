import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useLang } from "../../components/Layout/Layout";
import { SECTORS, CONNECTIONS } from "../../data";
import './SectorPage.css';

export default function SectorPage() {
    const { sectorId } = useParams();
    const { t, isRTL } = useLang();

    const sector = useMemo(() => SECTORS.find(s => s.id === sectorId), [sectorId]);

    const connections = useMemo(() => {
        if (!sector) return [];
        return CONNECTIONS
            .filter(c => c.from === sector.id || c.to === sector.id)
            .map(c => {
                const otherId = c.from === sector.id ? c.to : c.from;
                const other = SECTORS.find(s => s.id === otherId);
                return { ...c, other };
            });
    }, [sector]);

    if (!sector) {
        return (
            <div className="sector-not-found">
                <h2>404</h2>
                <p>{isRTL ? "بخش مورد نظر یافت نشد" : "Sector not found"}</p>
                <Link to="/" className="sector-back" style={{ marginTop: 24 }}>
                    ← {isRTL ? "بازگشت به نقشه" : "BACK TO MAP"}
                </Link>
            </div>
        );
    }

    const tierLabels = {
        core: { en: "CORE LAYER", fa: "لایه هسته" },
        primary: { en: "PRIMARY SECTOR", fa: "بخش اولیه" },
        secondary: { en: "SECONDARY SECTOR", fa: "بخش ثانویه" },
        tertiary: { en: "SUPPORTING SECTOR", fa: "بخش پشتیبان" },
    };

    return (
        <div className="sector-page">
            <div className="sector-page-retro-grid" />
            <div className="sector-page-scanline" />

            <div className="sector-page-inner">
                <Link to="/" className="sector-back">
                    ← {isRTL ? "بازگشت به نقشه" : "BACK TO MAP"}
                </Link>

                <div className="sector-hero">
                    <div className="sector-hero-tier" style={{ color: sector.border }}>
                        {t(tierLabels[sector.tier])}
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
                    {isRTL ? "سیستم‌های داخلی" : "INTERNAL SYSTEMS"}
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
                            {isRTL ? `ارتباطات (${connections.length})` : `CONNECTIONS (${connections.length})`}
                        </div>
                        <div className="sector-connections">
                            {connections.map((conn, i) => (
                                <Link
                                    key={i}
                                    to={`/sectors/${conn.other?.id}`}
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
                        {isRTL ? "محتوای تفصیلی" : "DETAILED CONTENT"}
                    </div>
                    {isRTL
                        ? "محتوای تفصیلی این بخش به زودی اضافه خواهد شد..."
                        : "Detailed content for this sector coming soon..."
                    }
                </div>
            </div>
        </div>
    );
}
