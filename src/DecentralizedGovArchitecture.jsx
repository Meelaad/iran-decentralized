// DecentralizedGovArchitecture.jsx

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { SECTORS, CONNECTIONS, SHARED_LAYERS } from './data';
import { useLang } from './contexts/LangContext';
import './Architecture.css';
import BlockchainOverlay from "./BlockchainOverlay";

function useHexLayout() {
    const HEX_BASE = 170;
    const GAP = 6;

    const calcLayout = useCallback(() => {
        const w = window.innerWidth;
        const available = w - 48; // padding
        // how many full hexes + half offset fit
        const cols = Math.max(2, Math.floor((available + GAP) / (HEX_BASE + GAP)));
        const hexW = Math.min(HEX_BASE, Math.floor((available - GAP * (cols - 1)) / (cols + 0.5)));
        return { cols, hexW };
    }, []);

    const [layout, setLayout] = useState(calcLayout);

    useEffect(() => {
        const onResize = () => setLayout(calcLayout());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [calcLayout]);

    return layout;
}

function CardParticles({ color = "139,92,246" }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;
        const particles = [];
        const count = 28;
        const linkDist = 55;

        function resize() {
            canvas.width = canvas.offsetWidth * devicePixelRatio;
            canvas.height = canvas.offsetHeight * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        resize();

        const w = () => canvas.offsetWidth;
        const h = () => canvas.offsetHeight;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w(),
                y: Math.random() * h(),
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.2 + 0.4,
            });
        }

        function draw() {
            ctx.clearRect(0, 0, w(), h());

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w()) p.vx *= -1;
                if (p.y < 0 || p.y > h()) p.vy *= -1;
            }

            // Lines
            for (let i = 0; i < count; i++) {
                for (let j = i + 1; j < count; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < linkDist) {
                        const alpha = (1 - dist / linkDist) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${color},${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Dots
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},0.5)`;
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        }

        draw();

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
        };
    }, [color]);

    return <canvas ref={canvasRef} className="list-card-particles" />;
}

function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

export default function DecentralizedGovArchitecture() {
    const { t, isRTL, headFont } = useLang();
    const [selected, setSelected] = useState(null);
    const [panelVisible, setPanelVisible] = useState(false);
    const [panelOrigin, setPanelOrigin] = useState(null);
    const [hoveredConn, setHoveredConn] = useState(null);
    const [showLayer, setShowLayer] = useState(null);
    const [view, setView] = useState("map");
    const { cols: hexCols, hexW } = useHexLayout();
    const svgRef = useRef(null);

    const handleNodeClick = useCallback((sectorId, isSelected) => {
        if (isSelected) { setSelected(null); setPanelVisible(false); return; }
        const svg = svgRef.current;
        if (svg) {
            const sector = SECTORS.find(s => s.id === sectorId);
            if (sector) {
                const pt = svg.createSVGPoint();
                pt.x = sector.x;
                pt.y = sector.y;
                const ctm = svg.getScreenCTM();
                if (ctm) {
                    const screenPt = pt.matrixTransform(ctm);
                    const stage = svg.parentElement;
                    const rect = stage.getBoundingClientRect();
                    setPanelOrigin({ x: screenPt.x - rect.left, y: screenPt.y - rect.top });
                }
            }
        }
        setSelected(sectorId);
        // Desktop: show immediately. Mobile: delay handled in useEffect.
        if (window.innerWidth > 900) setPanelVisible(true);
    }, []);

    // Delay side panel on mobile so connection animation plays first
    useEffect(() => {
        if (!selected) { setPanelVisible(false); return; }
        if (window.innerWidth > 900) return; // desktop handled in click or view-change effect
        const timer = setTimeout(() => setPanelVisible(true), 120);
        return () => clearTimeout(timer);
    }, [selected]);

    // When switching from list → map with a selection, open the panel after map renders
    useEffect(() => {
        if (view !== 'map' || !selected) { if (view === 'list') setPanelVisible(false); return; }
        const timer = setTimeout(() => setPanelVisible(true), 280);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view]);

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

    const svgViewBox = "15 8 70 72";

    // Proximity mesh lines — straight lines between nearby nodes
    const meshLines = useMemo(() => {
        const lines = [];
        const threshold = 26;
        for (let i = 0; i < SECTORS.length; i++) {
            for (let j = i + 1; j < SECTORS.length; j++) {
                const a = SECTORS[i], b = SECTORS[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < threshold) {
                    lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, dist });
                }
            }
        }
        return lines;
    }, []);

    return (


        <div
            className="container"
            style={{
                fontFamily: headFont
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
                                fontFamily: headFont
                            }}
                        >
                            {isRTL ? "دولت دیجیتال و غیرمتمرکز" : "Decentralized Digital Government"}
                        </h1>
                    </div>

                    <div className="app-controls">
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
                                ref={svgRef}
                                viewBox={svgViewBox}
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

                                {/* Proximity mesh — decentralized network look */}
                                {meshLines.map((line, i) => (
                                    <line
                                        key={`mesh-${i}`}
                                        className="mesh-line"
                                        x1={line.x1} y1={line.y1}
                                        x2={line.x2} y2={line.y2}
                                        stroke="#4a7faa"
                                        strokeWidth="0.15"
                                        opacity={0.15 + 0.25 * (1 - line.dist / 25)}
                                        style={{
                                            animation: `meshPulse ${3 + (i % 5)}s ${(i * 0.6).toFixed(1)}s ease-in-out infinite`
                                        }}
                                    />
                                ))}

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
                                    const pathD = `M ${from.x} ${from.y} Q ${midX + offsetX} ${midY + offsetY} ${to.x} ${to.y}`;
                                    const idleStyle = !isRelated && !dimmed && !isHovered ? {
                                        animation: `${i % 2 === 0 ? "edgeLightning" : "edgeIdle"} ${3 + (i % 7)}s ${(i * 0.37 + (i % 3) * 1.1).toFixed(2)}s infinite`
                                    } : {};

                                    const bits = ["1","0","1","1","0","0","1","0"];

                                    return (
                                        <g key={`conn-${i}`}
                                           onMouseEnter={() => setHoveredConn(i)}
                                           onMouseLeave={() => setHoveredConn(null)}
                                           onMouseDown={e => e.preventDefault()}
                                           style={{ cursor: "default" }}>
                                            <path
                                                className={`conn-line${isRelated ? " is-active" : ""}`}
                                                d={pathD}
                                                stroke={isRelated ? "#66d9ff" : isHovered ? "#8fa8c0" : undefined}
                                                strokeWidth={isRelated ? 0.25 * conn.strength * 0.4 : isHovered ? 0.2 : 0.08}
                                                fill="none"
                                                opacity={dimmed ? 0.08 : isRelated ? 0.95 : undefined}
                                                strokeDasharray={!isRelated && conn.strength === 1 ? "0.5 0.3" : isRelated ? undefined : "none"}
                                                style={idleStyle}
                                            />
                                            {isRelated && bits.map((bit, b) => (
                                                <text
                                                    key={b}
                                                    fontSize="1.5"
                                                    fill={bit === "1" ? "#66d9ff" : "#2eb8d4"}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontFamily="Inter"
                                                    fontWeight="700"
                                                    opacity="0.9"
                                                >
                                                    <animateMotion
                                                        dur={`${1.6 + (b % 3) * 0.4}s`}
                                                        begin={`${b * 0.22}s`}
                                                        repeatCount="indefinite"
                                                        path={pathD}
                                                    />
                                                    {bit}
                                                </text>
                                            ))}
                                            {(isHovered || isRelated) && (
                                                <text
                                                    x={midX + offsetX * 0.6}
                                                    y={midY + offsetY * 0.6}
                                                    fontSize="1.4"
                                                    fill={isRelated ? "#8B5CF6" : "#5a6a7a"}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontFamily={isRTL ? "Vazirmatn" : "Inter"}
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
                                    const r = sector.tier === "core" ? 4 : sector.tier === "primary" ? 3.4 : 2.8;

                                    return (
                                        <g key={sector.id} className="sector-node" onClick={() => handleNodeClick(sector.id, isSelected)} onMouseDown={e => e.preventDefault()} opacity={dimmed ? 0.2 : 1} style={{ outline: 'none' }}>
                                            <circle cx={sector.x} cy={sector.y} r={r + 0.5} fill="none" stroke={isSelected ? "#8B5CF6" : sector.border} strokeWidth={isSelected ? 0.2 : 0.08} opacity={isSelected ? 0.8 : 0.3} strokeDasharray={isSelected ? "none" : "0.3 0.2"} />
                                            <circle className={`sector-node-circle ${isSelected ? "is-selected" : ""}`} cx={sector.x} cy={sector.y} r={r} stroke={isSelected ? "#8B5CF6" : sector.border} strokeWidth={isSelected ? 0.18 : 0.1} filter={isSelected ? "url(#glow)" : "none"} />
                                            {sector.subIcon
                                                ? <>
                                                    <text x={sector.x} y={sector.y - r * 0.2} fontSize={r * 0.9} textAnchor="middle" dominantBaseline="middle" opacity={0.75}>{sector.icon}</text>
                                                    <text x={sector.x} y={sector.y + r * 0.55} fontSize={r * 0.8} textAnchor="middle" dominantBaseline="middle">{sector.subIcon}</text>
                                                  </>
                                                : <text x={sector.x} y={sector.y + 0.3} fontSize={r * 1.33} textAnchor="middle" dominantBaseline="middle">{sector.icon}</text>
                                            }
                                            <text className={`sector-node-label ${isSelected ? "is-selected" : ""}`} x={sector.x} y={sector.y + r + 1.6} fontSize="1.4" textAnchor="middle" fontFamily={isRTL ? "Vazirmatn" : "Inter"} fontWeight={isSelected ? "600" : "500"}>
                                                {t(sector.label)}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>

                            {panelVisible && selectedSector && (
                                <div
                                    key={selected}
                                    className="side-panel"
                                    onMouseDown={e => e.preventDefault()}
                                    style={{
                                        [isRTL ? "left" : "right"]: 12,
                                        border: `1px solid ${selectedSector.border}40`,
                                        color: selectedSector.border,
                                        "--panel-origin-x": panelOrigin ? `${panelOrigin.x}px` : "50%",
                                        "--panel-origin-y": panelOrigin ? `${panelOrigin.y}px` : "0",
                                    }}
                                >
                                    <div className="side-panel-header">
                                        <div className={`side-panel-kicker ${!isRTL ? "is-ltr" : ""}`} style={{ color: selectedSector.border }}>
                                            {t({
                                                core: { en: "CORE LAYER", fa: "لایه هسته" },
                                                primary: { en: "PRIMARY SECTOR", fa: "بخش اولیه" },
                                                secondary: { en: "SECONDARY SECTOR", fa: "بخش ثانویه" },
                                                tertiary: { en: "SUPPORTING SECTOR", fa: "بخش پشتیبان" },
                                            }[selectedSector.tier])}
                                        </div>
                                        <button className="side-panel-close" onClick={() => setSelected(null)}>✕</button>
                                    </div>
                                    <div className="side-panel-icon">{selectedSector.icon}</div>
                                    <h2
                                        className="side-panel-title"
                                        style={{ fontFamily: headFont }}
                                    >
                                        {t(selectedSector.label)}
                                    </h2>
                                    <p className="side-panel-desc">
                                        {t(selectedSector.desc)}
                                    </p>

                                    <Link
                                        to={`/sectors/${selectedSector.id}`}
                                        style={{
                                            display: "inline-block",
                                            fontSize: 11,
                                            color: "#66d9ff",
                                            border: "1px solid rgba(139,92,246,0.2)",
                                            padding: "6px 14px",
                                            marginBottom: 16,
                                            textDecoration: "none",
                                            letterSpacing: "0.06em",
                                            transition: "background 0.2s, border-color 0.2s",
                                            background: "rgba(139,92,246,0.04)",
                                        }}
                                    >
                                        {isRTL ? "جزئیات بیشتر ←" : "LEARN MORE →"}
                                    </Link>

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

                        <div className="mobile-tab-bar">
                            <button className={`tab-btn${view === "map" ? " tab-active" : ""}`} onClick={() => setView("map")}>
                                <span className="tab-icon">🗺️</span>
                                {isRTL ? "نقشه" : "MAP"}
                            </button>
                            <button className={`tab-btn${view === "list" ? " tab-active" : ""}`} onClick={() => setView("list")}>
                                <span className="tab-icon">⬡</span>
                                {isRTL ? "لیست" : "LIST"}
                            </button>
                        </div>

                        <div className="shared-footer">
                            <div className={`shared-footer-title ${!isRTL ? "is-ltr" : ""}`}>
                                {isRTL ? "لایه‌های زیرساخت مشترک (پایه پروتکل)" : "SHARED INFRASTRUCTURE LAYERS (PROTOCOL FOUNDATION)"}
                            </div>
                            <div className="shared-chip-row">
                                {SHARED_LAYERS.map((layer, i) => (
                                    <div key={i} className="layer-chip" onClick={() => setShowLayer(showLayer === i ? null : i)}
                                         style={{ padding: "7px 11px", background: showLayer === i ? "rgba(139,92,246,0.08)" : "rgba(9,13,19,0.72)", border: `1px solid ${showLayer === i ? "#8B5CF640" : "rgba(91,103,120,0.22)"}`, borderRadius: 0, fontSize: 11, color: showLayer === i ? "#7fd8ff" : "#667384", display: "flex", alignItems: "center", gap: 6 }}>
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
                        <div className="hex-honeycomb" style={{
                            "--hex-w": `${hexW}px`,
                            gridTemplateColumns: `repeat(${hexCols}, var(--hex-w))`,
                        }}>
                            {SECTORS.map((sector, i) => {
                                const row = Math.floor(i / hexCols);
                                const isOffsetRow = row % 2 === 1;
                                const isFirstRow = row === 0;
                                return (
                                    <div
                                        key={sector.id}
                                        className={`hex-card-wrap${isOffsetRow ? " hex-row-offset" : ""}`}
                                        style={{
                                            gridRow: row + 1,
                                            marginTop: isFirstRow ? 0 : undefined,
                                        }}
                                        onClick={() => { setSelected(sector.id); setView("map"); }}
                                        onMouseDown={e => e.preventDefault()}
                                    >
                                        <div
                                            className="list-card hex-shape"
                                            style={{ "--card-accent": sector.border }}
                                        >
                                            <CardParticles color={hexToRgb(sector.border)} />
                                            <svg className="hex-bottom-edges" viewBox="0 0 200 220" preserveAspectRatio="none">
                                                <polyline
                                                    points="0,165 100,220 200,165"
                                                    fill="none"
                                                    stroke={sector.border}
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="hex-card-content">
                                                <span className="list-card-icon">{sector.icon}</span>
                                                <span
                                                    className="list-card-title"
                                                    style={{ fontFamily: headFont }}
                                                >
                                                    {t(sector.label)}
                                                </span>
                                                <p className="list-card-desc">
                                                    {t(sector.desc)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );}