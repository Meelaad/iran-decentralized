// DecentralizedGovArchitecture.jsx

import React, { useState, useCallback, useMemo } from "react";
import { SECTORS, CONNECTIONS, SHARED_LAYERS } from './data';
import './Architecture.css';
import BlockchainOverlay from "./BlockchainOverlay";

export default function DecentralizedGovArchitecture() {
    const [lang, setLang] = useState("fa");
    const [selected, setSelected] = useState(null);
    const [hoveredConn, setHoveredConn] = useState(null);
    const [showLayer, setShowLayer] = useState(null);
    const [view, setView] = useState("map");

    const t = useCallback((obj) => obj[lang] || obj.en, [lang]);
    const isRTL = lang === "fa";

    const selectedSector = useMemo(
        () => SECTORS.find((s) => s.id === selected),
        [selected]
    );

    const relatedConnections = useMemo(() => {
        if (!selected) return [];
        return CONNECTIONS.filter(
            (c) => c.from === selected || c.to === selected
        );
    }, [selected]);

    const relatedIds = useMemo(() => {
        const ids = new Set();
        relatedConnections.forEach((c) => {
            ids.add(c.from);
            ids.add(c.to);
        });
        return ids;
    }, [relatedConnections]);

    const getSectorPos = useCallback((id) => {
        const s = SECTORS.find((sec) => sec.id === id);
        return s ? { x: s.x, y: s.y } : { x: 50, y: 50 };
    }, []);

    return (


        <div
            className="container"
            dir={isRTL ? "rtl" : "ltr"}
            style={{
                fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'IBM Plex Mono', monospace"
                }}>
                <div className="blockchain-overlay">
                    <div className="blockchain-aurora" />
                    <BlockchainOverlay />
                </div>

                <div className="app-header">
                    <div>
                        <div className={`app-kicker ${!isRTL ? "is-ltr" : ""}`}>
                            {isRTL ? "ساختار حاکمیت آینده ایران نسخه ۱.۰" : "IRAN FUTURE ARCHITECTURE OVERVIEW v1.0"}
                        </div>
                        <h1
                            className="app-title"
                            style={{
                                fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Space Grotesk', sans-serif"
                            }}
                        >
                            {isRTL ? "دولت دیجیتال و غیرمتمرکز" : "Decentralized Digital Government"}
                        </h1>
                    </div>

                    <div className="app-controls">
                        <div className="control-group">
                            <button
                                className={`btn-base ${lang === "fa" ? "btn-active" : ""}`}
                                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                                onClick={() => setLang("fa")}>فارسی</button>
                            <button
                                className={`btn-base ${lang === "en" ? "btn-active" : ""}`}
                                style={{ fontFamily: "'IBM Plex Mono', sans-serif" }}
                                onClick={() => setLang("en")}>EN</button>
                        </div>

                        <div className="control-group">
                            <button className={`btn-base ${view === "map" ? "btn-active" : ""}`}
                                    onClick={() => setView("map")}>{isRTL ? "نقشه" : "MAP"}</button>
                            <button className={`btn-base ${view === "list" ? "btn-active" : ""}`}
                                    onClick={() => setView("list")}>{isRTL ? "لیست" : "LIST"}</button>
                        </div>
                    </div>
                </div>

                {view === "map" ? (
                    <div className="map-shell">
                        <div className="map-stage">
                            <svg
                                viewBox="0 0 100 90"
                                className="arch-map-svg"
                                preserveAspectRatio="xMidYMid meet"
                                onMouseDown={e => e.preventDefault()}
                            >
                                <defs>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="0.3" result="blur" />
                                        <feMerge>
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {CONNECTIONS.map((conn, i) => {
                                    const from = getSectorPos(conn.from);
                                    const to = getSectorPos(conn.to);
                                    const isRelated = selected && (conn.from === selected || conn.to === selected);
                                    const isHovered = hoveredConn === i;
                                    const dimmed = selected && !isRelated;
                                    const midX = (from.x + to.x) / 2;
                                    const midY = (from.y + to.y) / 2;
                                    const dx = to.x - from.x;
                                    const dy = to.y - from.y;
                                    const offsetX = -dy * 0.08;
                                    const offsetY = dx * 0.08;

                                    return (
                                        <g key={`conn-${i}`}
                                           onMouseEnter={() => setHoveredConn(i)}
                                           onMouseLeave={() => setHoveredConn(null)}
                                           style={{ cursor: "default" }}>
                                            <path
                                                className="conn-line"
                                                d={`M ${from.x} ${from.y} Q ${midX + offsetX} ${midY + offsetY} ${to.x} ${to.y}`}
                                                stroke={isRelated ? "#66d9ff" : isHovered ? "#8fa8c0" : "#2f4666"}
                                                strokeWidth={isRelated ? 0.25 * conn.strength * 0.4 : isHovered ? 0.2 : 0.08}
                                                fill="none"
                                                opacity={dimmed ? 0.08 : isRelated ? 0.95 : 0.68}
                                                strokeDasharray={conn.strength === 1 ? "0.5 0.3" : "none"}
                                            />
                                            {(isHovered || isRelated) && (
                                                <text
                                                    x={midX + offsetX * 0.6}
                                                    y={midY + offsetY * 0.6}
                                                    fontSize="1.4"
                                                    fill={isRelated ? "#4fc3f7" : "#5a6a7a"}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontFamily={isRTL ? "Vazirmatn" : "IBM Plex Mono"}
                                                    fontWeight="500"
                                                >
                                                    {t(conn.label)}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}

                                {SECTORS.map((sector) => {
                                    const isSelected = selected === sector.id;
                                    const isRelated = relatedIds.has(sector.id);
                                    const dimmed = selected && !isRelated && !isSelected;
                                    const r = sector.tier === "core" ? 4 : sector.tier === "primary" ? 3.2 : sector.tier === "secondary" ? 2.8 : 2.4;

                                    return (
                                        <g key={sector.id} className="sector-node" onClick={() => setSelected(isSelected ? null : sector.id)} onMouseDown={e => e.preventDefault()} opacity={dimmed ? 0.2 : 1} style={{ outline: 'none' }}>
                                            <circle cx={sector.x} cy={sector.y} r={r + 0.5} fill="none" stroke={isSelected ? "#4fc3f7" : sector.border} strokeWidth={isSelected ? 0.2 : 0.08} opacity={isSelected ? 0.8 : 0.3} strokeDasharray={isSelected ? "none" : "0.3 0.2"} />
                                            <circle className={`sector-node-circle ${isSelected ? "is-selected" : ""}`} cx={sector.x} cy={sector.y} r={r} stroke={isSelected ? "#4fc3f7" : sector.border} strokeWidth={isSelected ? 0.18 : 0.1} filter={isSelected ? "url(#glow)" : "none"} />
                                            <text x={sector.x} y={sector.y + 0.3} fontSize={r * 0.65} textAnchor="middle" dominantBaseline="middle">{sector.icon}</text>
                                            <text className={`sector-node-label ${isSelected ? "is-selected" : ""}`} x={sector.x} y={sector.y + r + 1.6} fontSize="1.4" textAnchor="middle" fontFamily={isRTL ? "Vazirmatn" : "IBM Plex Mono"} fontWeight={isSelected ? "600" : "400"}>
                                                {t(sector.label)}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>

                            {selectedSector && (
                                <div
                                    className="side-panel"
                                    style={{
                                        [isRTL ? "left" : "right"]: 12,
                                        border: `1px solid ${selectedSector.border}40`,
                                        color: selectedSector.border
                                    }}
                                >
                                    <div className="side-panel-header">
                                        <div className={`side-panel-kicker ${!isRTL ? "is-ltr" : ""}`} style={{ color: selectedSector.border }}>
                                            {selectedSector.tier.toUpperCase()} {isRTL ? "بخش" : "SECTOR"}
                                        </div>
                                        <button className="side-panel-close" onClick={() => setSelected(null)}>✕</button>
                                    </div>
                                    <div className="side-panel-icon">{selectedSector.icon}</div>
                                    <h2
                                        className="side-panel-title"
                                        style={{ fontFamily: isRTL ? "Vazirmatn" : "'Space Grotesk', sans-serif" }}
                                    >
                                        {t(selectedSector.label)}
                                    </h2>
                                    <p className="side-panel-desc">
                                        {t(selectedSector.desc)}
                                    </p>

                                    <div className={`panel-section-label ${!isRTL ? "is-ltr" : ""}`}>
                                        {isRTL ? "سیستم‌های داخلی" : "INTERNAL SYSTEMS"}
                                    </div>
                                    {selectedSector.contents.map((item, i) => (
                                        <div
                                            key={i}
                                            className="panel-item"
                                            style={{
                                                borderLeft: isRTL ? "none" : `2px solid ${selectedSector.border}30`,
                                                borderRight: isRTL ? `2px solid ${selectedSector.border}30` : "none"
                                            }}
                                        >
                                            {t(item)}
                                        </div>
                                    ))}

                                    {relatedConnections.length > 0 && (
                                        <>
                                            <div className={`panel-section-label with-top-margin ${!isRTL ? "is-ltr" : ""}`}>
                                                {isRTL ? `ارتباطات (${relatedConnections.length})` : `CONNECTIONS (${relatedConnections.length})`}
                                            </div>
                                            {relatedConnections.map((conn, i) => {
                                                const other = conn.from === selected ? conn.to : conn.from;
                                                const otherSec = SECTORS.find((s) => s.id === other);
                                                return (
                                                    <div key={i} className="panel-connection-row">
                                                        <span>{otherSec?.icon} {t(otherSec?.label)}</span>
                                                        <span className="panel-connection-pill">
                                                            {t(conn.label)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="shared-footer">
                            <div className={`shared-footer-title ${!isRTL ? "is-ltr" : ""}`}>
                                {isRTL ? "لایه‌های زیرساخت مشترک (پایه پروتکل)" : "SHARED INFRASTRUCTURE LAYERS (PROTOCOL FOUNDATION)"}
                            </div>
                            <div className="shared-chip-row">
                                {SHARED_LAYERS.map((layer, i) => (
                                    <div key={i} className="layer-chip" onClick={() => setShowLayer(showLayer === i ? null : i)}
                                         style={{ padding: "7px 11px", background: showLayer === i ? "rgba(79,195,247,0.08)" : "rgba(9,13,19,0.72)", border: `1px solid ${showLayer === i ? "#4fc3f740" : "rgba(91,103,120,0.22)"}`, borderRadius: 0, fontSize: 11, color: showLayer === i ? "#7fd8ff" : "#667384", display: "flex", alignItems: "center", gap: 6 }}>
                                        <span>{layer.icon}</span> <span>{t(layer.name)}</span>
                                    </div>
                                ))}
                            </div>
                            {showLayer !== null && (
                                <div className="shared-chip-desc">
                                    {t(SHARED_LAYERS[showLayer].desc)}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="list-view">
                        {["core", "primary", "secondary", "tertiary"].map((tier) => {
                            const tierSectors = SECTORS.filter((s) => s.tier === tier);
                            const tierLabels = {
                                core: { en: "CORE LAYER", fa: "لایه هسته (اصلی)" },
                                primary: { en: "PRIMARY SECTORS", fa: "بخش‌های اولیه" },
                                secondary: { en: "SECONDARY SECTORS", fa: "بخش‌های ثانویه" },
                                tertiary: { en: "SUPPORTING SECTORS", fa: "بخش‌های پشتیبان" }
                            };
                            const tierColors = { core: "#4fc3f7", primary: "#66bb6a", secondary: "#ffa726", tertiary: "#ab47bc" };

                            return (
                                <div key={tier} className="list-tier">
                                    <div
                                        className={`list-tier-title ${!isRTL ? "is-ltr" : ""}`}
                                        style={{ color: tierColors[tier], borderBottom: `1px solid ${tierColors[tier]}20` }}
                                    >
                                        {t(tierLabels[tier])}
                                    </div>
                                    <div className="list-grid">
                                        {tierSectors.map((sector) => (
                                            <div
                                                key={sector.id}
                                                className="list-card"
                                                onClick={() => { setSelected(sector.id); setView("map"); }}
                                                style={{ border: `1px solid ${sector.border}20`, borderLeft: `3px solid ${sector.border}` }}
                                            >
                                                <div className="list-card-header">
                                                    <span className="list-card-icon">{sector.icon}</span>
                                                    <span
                                                        className="list-card-title"
                                                        style={{ fontFamily: isRTL ? "Vazirmatn" : "'Space Grotesk', sans-serif" }}
                                                    >
                                                        {t(sector.label)}
                                                    </span>
                                                </div>
                                                <p className="list-card-desc">
                                                    {t(sector.desc)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );}