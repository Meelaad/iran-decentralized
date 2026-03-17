import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Link, useParams, Navigate, useNavigate, useLocation } from "react-router-dom";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, forceX, forceY } from 'd3-force';
import { BLUEPRINTS } from './data';
import { useLang } from './contexts/LangContext';
import { useAuth } from './hooks/useAuth';
import { useBlueprint, useBlueprintLayout, useSaveBlueprintLayout } from './hooks/useBlueprints';
import './Architecture.css';
import BlockchainOverlay from "./BlockchainOverlay";
import GovTree from './components/GovTree/GovTree';

const GRID_SIZE = 2; // SVG units
const BOUNDS = { xMin: 19, xMax: 81, yMin: 13, yMax: 75 };

function snap(val, grid) {
    return Math.round(val / grid) * grid;
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function useHexLayout() {
    const HEX_BASE = 170;
    const GAP = 6;

    const calcLayout = useCallback(() => {
        const w = window.innerWidth;
        const available = w - 48;
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
        let animId = null;
        const particles = [];
        const count = 12;
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
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},0.5)`;
                ctx.fill();
            }
            animId = requestAnimationFrame(draw);
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !animId) {
                animId = requestAnimationFrame(draw);
            } else if (!entry.isIntersecting && animId) {
                cancelAnimationFrame(animId);
                animId = null;
            }
        }, { threshold: 0 });
        observer.observe(canvas);

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        return () => {
            if (animId) cancelAnimationFrame(animId);
            observer.disconnect();
            ro.disconnect();
        };
    }, [color]);

    return <canvas ref={canvasRef} className="list-card-particles" />;
}

function useForceLayout(sectors, connections, enabled) {
    const [positions, setPositions] = useState(() =>
        Object.fromEntries(sectors.map(s => [s.id, { x: s.x, y: s.y }]))
    );

    useEffect(() => {
        if (!enabled) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPositions(Object.fromEntries(sectors.map(s => [s.id, { x: s.x, y: s.y }])));
            return;
        }

        const nodes = sectors.map(s => ({
            id: s.id,
            x: s.x,
            y: s.y,
            r: s.tier === 'core' ? 4.5 : s.tier === 'primary' ? 3.9 : 3.3,
        }));

        const links = connections
            .filter(c => nodes.find(n => n.id === c.from) && nodes.find(n => n.id === c.to))
            .map(c => ({ source: c.from, target: c.to, strength: c.strength }));

        const sim = forceSimulation(nodes)
            .force('link', forceLink(links).id(d => d.id).distance(18).strength(d => d.strength * 0.06))
            .force('charge', forceManyBody().strength(-130))
            .force('center', forceCenter(50, 44))
            .force('collide', forceCollide(d => d.r + 2.5))
            .force('x', forceX(50).strength(0.02))
            .force('y', forceY(44).strength(0.02))
            .stop();

        for (let i = 0; i < 300; i++) sim.tick();

        const result = {};
        for (const node of nodes) {
            result[node.id] = {
                x: Math.max(19, Math.min(81, node.x)),
                y: Math.max(13, Math.min(75, node.y)),
            };
        }
        setPositions(result);
    }, [sectors, connections, enabled]);

    return positions;
}

function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

// Subtle grid lines rendered in edit mode
function AdminGrid() {
    const lines = [];
    for (let x = 20; x <= 80; x += GRID_SIZE) {
        lines.push(<line key={`gx${x}`} x1={x} y1={13} x2={x} y2={75} stroke="#8B5CF6" strokeWidth="0.08" opacity="0.15" />);
    }
    for (let y = 14; y <= 74; y += GRID_SIZE) {
        lines.push(<line key={`gy${y}`} x1={19} y1={y} x2={81} y2={y} stroke="#8B5CF6" strokeWidth="0.08" opacity="0.15" />);
    }
    return <g>{lines}</g>;
}

export default function BlueprintViewer() {
    const { blueprintId } = useParams();
    const { t, tKey, isRTL, monoFont, headFont } = useLang();
    const navigate = useNavigate();
    const location = useLocation();
    const [bpPickerOpen, setBpPickerOpen] = useState(false);
    const bpPickerRef = useRef(null);
    const [selected, setSelected] = useState(null);
    const [panelVisible, setPanelVisible] = useState(false);
    const [panelOrigin, setPanelOrigin] = useState(null);
    const [hoveredConn, setHoveredConn] = useState(null);
    const [showLayer, setShowLayer] = useState(null);
    const [view, setView] = useState("map");
    const { cols: hexCols, hexW } = useHexLayout();
    const svgRef = useRef(null);

    // Admin layout editor state
    const { isAdmin, session } = useAuth();
    const [editPositions, setEditPositions] = useState(null); // non-null = edit mode active
    const [dragging, setDragging] = useState(null);    // { sectorId, offsetX, offsetY }

    const activeBlueprintId = blueprintId || 'decentralized';
    const isDecentralized = activeBlueprintId === 'decentralized';
    const localBlueprint = BLUEPRINTS[activeBlueprintId];

    const { data: dbBlueprint, isLoading: dbLoading } = useBlueprint(activeBlueprintId, localBlueprint);
    const { data: dbLayout = {} } = useBlueprintLayout(activeBlueprintId);
    const { mutate: saveLayout, isPending: saving } = useSaveBlueprintLayout();

    const activeBlueprint = localBlueprint || dbBlueprint;

    // Stable references so useForceLayout's useEffect doesn't fire every render when blueprint is null
    const sectors = useMemo(() => activeBlueprint?.sectors ?? [], [activeBlueprint]);
    const connections = useMemo(() => activeBlueprint?.connections ?? [], [activeBlueprint]);
    const sharedLayers = useMemo(() => activeBlueprint?.sharedLayers ?? [], [activeBlueprint]);

    const positions = useForceLayout(sectors, connections, activeBlueprint?.useForceLayout);

    // The positions actually used for rendering: edit mode > DB override > computed
    const renderPositions = useMemo(() => {
        if (editPositions) return editPositions;
        return { ...positions, ...dbLayout };
    }, [editPositions, positions, dbLayout]);

    // --- Admin drag handlers ---
    function svgPoint(e) {
        const svg = svgRef.current;
        if (!svg) return null;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    }

    function handleNodeDragStart(e, sectorId) {
        if (!editPositions) return;
        e.stopPropagation();
        e.preventDefault();
        const coords = svgPoint(e);
        if (!coords) return;
        const pos = editPositions[sectorId] ?? positions[sectorId];
        setDragging({ sectorId, offsetX: coords.x - pos.x, offsetY: coords.y - pos.y });
    }

    function handleSVGMouseMove(e) {
        if (!dragging) return;
        const coords = svgPoint(e);
        if (!coords) return;
        setEditPositions(prev => ({
            ...prev,
            [dragging.sectorId]: {
                x: clamp(coords.x - dragging.offsetX, BOUNDS.xMin, BOUNDS.xMax),
                y: clamp(coords.y - dragging.offsetY, BOUNDS.yMin, BOUNDS.yMax),
            },
        }));
    }

    function handleSVGMouseUp() {
        if (!dragging) return;
        const pos = editPositions[dragging.sectorId];
        if (pos) {
            setEditPositions(prev => ({
                ...prev,
                [dragging.sectorId]: {
                    x: clamp(snap(pos.x, GRID_SIZE), BOUNDS.xMin, BOUNDS.xMax),
                    y: clamp(snap(pos.y, GRID_SIZE), BOUNDS.yMin, BOUNDS.yMax),
                },
            }));
        }
        setDragging(null);
    }

    function handleStartEdit() {
        setEditPositions({ ...positions, ...dbLayout });
        setSelected(null);
        setPanelVisible(false);
    }

    function handleCancelEdit() {
        setEditPositions(null);
        setDragging(null);
    }

    function handleSaveLayout() {
        saveLayout(
            { blueprintId: activeBlueprintId, positions: editPositions },
            { onSuccess: () => setEditPositions(null) }
        );
    }
    // --------------------------

    const handleNodeClick = useCallback((sectorId, isSelected) => {
        if (editPositions) return; // no click-select in edit mode
        if (isSelected) { setSelected(null); setPanelVisible(false); return; }
        const svg = svgRef.current;
        if (svg) {
            const pos = renderPositions[sectorId];
            if (pos) {
                const pt = svg.createSVGPoint();
                pt.x = pos.x;
                pt.y = pos.y;
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
        if (window.innerWidth > 900) setPanelVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectors, renderPositions, editPositions]);

    useEffect(() => {
        if (!selected) { setPanelVisible(false); return; }
        if (window.innerWidth > 900) return;
        const timer = setTimeout(() => setPanelVisible(true), 120);
        return () => clearTimeout(timer);
    }, [selected]);

    useEffect(() => {
        if (view !== 'map' || !selected) { if (view === 'list') setPanelVisible(false); return; }
        const timer = setTimeout(() => setPanelVisible(true), 280);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view]);

    useEffect(() => {
        if (!bpPickerOpen) return;
        function handleOutside(e) {
            if (bpPickerRef.current && !bpPickerRef.current.contains(e.target)) setBpPickerOpen(false);
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [bpPickerOpen]);

    const handleBlueprintSwitch = (id) => {
        setBpPickerOpen(false);
        const subpath = location.pathname.match(/\/blueprint\/gov\/[^/]+(\/.*)?/)?.[1] || '';
        navigate(`/blueprint/gov/${id}${subpath}`);
    };

    // Reset selection when blueprint changes
    useEffect(() => {
        setSelected(null);
        setPanelVisible(false);
        setShowLayer(null);
        setEditPositions(null);
        setDragging(null);
    }, [activeBlueprintId]);

    // Global mouseup to end drag even if cursor leaves SVG
    useEffect(() => {
        if (!dragging) return;
        const up = () => handleSVGMouseUp();
        window.addEventListener('mouseup', up);
        return () => window.removeEventListener('mouseup', up);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragging, editPositions]);

    const selectedSector = useMemo(
        () => sectors.find((s) => s.id === selected),
        [selected, sectors]
    );

    const relatedConnections = useMemo(() => {
        if (!selected) return [];
        return connections.filter((c) => c.from === selected || c.to === selected);
    }, [selected, connections]);

    const relatedIds = useMemo(() => {
        const ids = new Set();
        relatedConnections.forEach((c) => { ids.add(c.from); ids.add(c.to); });
        return ids;
    }, [relatedConnections]);

    const getSectorPos = useCallback((id) => {
        return renderPositions[id] ?? { x: 50, y: 50 };
    }, [renderPositions]);

    const svgViewBox = "15 8 70 72";

    const meshLines = useMemo(() => {
        const lines = [];
        const threshold = 26;
        for (let i = 0; i < sectors.length; i++) {
            for (let j = i + 1; j < sectors.length; j++) {
                const a = renderPositions[sectors[i].id] ?? sectors[i];
                const b = renderPositions[sectors[j].id] ?? sectors[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < threshold) {
                    lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, dist });
                }
            }
        }
        return lines;
    }, [sectors, renderPositions]);

    // Early returns AFTER all hooks (Rules of Hooks compliance)
    if (!localBlueprint && dbLoading) return <div className="blueprint-loading" />;
    if (!activeBlueprint) return <Navigate to="/blueprint/gov/decentralized" replace />;

    return (
        <div
            className="container"
            style={{ fontFamily: headFont }}
        >
            {isDecentralized && (
                <div className="blockchain-overlay">
                    <div className="blockchain-aurora" />
                    <BlockchainOverlay />
                </div>
            )}

            <div className="blueprint-hero">
                <p className="blueprint-hero-title" style={{ fontFamily: headFont }}>
                    {tKey('blueprint.hero')}
                </p>
                <p className="blueprint-hero-sub" style={{ fontFamily: headFont }}>
                    {tKey('blueprint.heroSub')}
                </p>
            </div>

            <div className="app-header">
                <div>
                    <div className={`app-kicker ${!isRTL ? "is-ltr" : ""}`}>
                        {tKey('blueprint.kicker')}
                    </div>
                    <h1
                        className="app-title"
                        style={{ fontFamily: headFont }}
                    >
                        {t(activeBlueprint.name)}
                    </h1>
                </div>

                <div className="app-controls">
                    <div className="bv-controls-col">
                        <div className="control-group">
                            <button className={`btn-base ${view === "map" ? "btn-active" : ""}`}
                                    onClick={() => setView("map")}>{tKey('blueprint.map')}</button>
                            <button className={`btn-base ${view === "list" ? "btn-active" : ""}`}
                                    onClick={() => setView("list")}>{tKey('blueprint.list')}</button>
                            <button className={`btn-base ${view === "tree" ? "btn-active" : ""}`}
                                    onClick={() => setView("tree")}>TREE</button>
                        </div>

                        <div className="bv-bp-picker" ref={bpPickerRef}>
                            <button
                                className="bv-bp-picker-btn"
                                onClick={() => setBpPickerOpen(o => !o)}
                                style={{ fontFamily: headFont }}
                            >
                                <span>{t(activeBlueprint.name)}</span>
                                <span className="bv-bp-picker-caret">{bpPickerOpen ? '▲' : '▼'}</span>
                            </button>
                            {bpPickerOpen && (
                                <div className="bv-bp-picker-dropdown">
                                    {Object.values(BLUEPRINTS).map(bp => (
                                        <button
                                            key={bp.id}
                                            className={`bv-bp-picker-option${blueprintId === bp.id ? ' is-active' : ''}`}
                                            style={{ fontFamily: headFont }}
                                            onClick={() => handleBlueprintSwitch(bp.id)}
                                        >
                                            {t(bp.name)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {isAdmin && view === 'map' && (
                        editPositions ? (
                            <div className="control-group" style={{ gap: 6 }}>
                                <span style={{ fontFamily: monoFont, fontSize: 10, color: '#ffa726', letterSpacing: '0.08em', alignSelf: 'center' }}>
                                    {tKey('blueprint.editMode')}
                                </span>
                                <button
                                    className="btn-base btn-active"
                                    onClick={handleSaveLayout}
                                    disabled={saving}
                                    style={{ background: 'rgba(255,167,38,0.12)', borderColor: '#ffa72660' }}
                                >
                                    {saving ? '...' : tKey('blueprint.saveLayout')}
                                </button>
                                <button className="btn-base" onClick={handleCancelEdit}>
                                    {tKey('blueprint.cancelEdit')}
                                </button>
                            </div>
                        ) : (
                            <button className="btn-base" onClick={handleStartEdit} style={{ fontFamily: monoFont }}>
                                {tKey('blueprint.editLayout')}
                            </button>
                        )
                    )}
                </div>
            </div>

            {view === "tree" ? (
                <GovTree blueprint={activeBlueprint} />
            ) : view === "map" ? (
                <div className="map-shell">
                    <div className="map-stage">
                        <svg
                            ref={svgRef}
                            viewBox={svgViewBox}
                            className="arch-map-svg"
                            preserveAspectRatio="xMidYMid meet"
                            onMouseDown={e => { if (!editPositions) e.preventDefault(); }}
                            onMouseMove={handleSVGMouseMove}
                            onMouseUp={handleSVGMouseUp}
                            style={{ cursor: editPositions ? (dragging ? 'grabbing' : 'default') : undefined }}
                        >
                            <defs>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="0.3" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                {!isDecentralized && (
                                    <marker id="arrow" markerWidth="2.5" markerHeight="2.5" refX="2.2" refY="1.25" orient="auto" markerUnits="userSpaceOnUse">
                                        <path d="M0,0 L0,2.5 L2.5,1.25 z" fill="#4a7faa" opacity="0.5" />
                                    </marker>
                                )}
                            </defs>

                            {editPositions && <AdminGrid />}

                            {isDecentralized && meshLines.map((line, i) => (
                                <line
                                    key={`mesh-${i}`}
                                    className="mesh-line"
                                    x1={line.x1} y1={line.y1}
                                    x2={line.x2} y2={line.y2}
                                    stroke="#4a7faa"
                                    strokeWidth="0.15"
                                    opacity={0.15 + 0.25 * (1 - line.dist / 25)}
                                    style={{ animation: `meshPulse ${3 + (i % 5)}s ${(i * 0.6).toFixed(1)}s ease-in-out infinite` }}
                                />
                            ))}

                            {connections.map((conn, i) => {
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
                                const pathD = isDecentralized
                                    ? `M ${from.x} ${from.y} Q ${midX + offsetX} ${midY + offsetY} ${to.x} ${to.y}`
                                    : `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
                                const idleStyle = isDecentralized && !isRelated && !dimmed && !isHovered ? {
                                    animation: `${i % 2 === 0 ? "edgeLightning" : "edgeIdle"} ${3 + (i % 7)}s ${(i * 0.37 + (i % 3) * 1.1).toFixed(2)}s infinite`
                                } : {};
                                const bits = ["1","0","1","1","0","0","1","0"];
                                const chars = ["L","A","W","S","T","A","T","E"];

                                return (
                                    <g key={`conn-${i}`}
                                       onMouseEnter={() => !editPositions && setHoveredConn(i)}
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
                                            markerEnd={!isDecentralized ? "url(#arrow)" : undefined}
                                        />
                                        {isDecentralized && isRelated && bits.map((bit, b) => (
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
                                        {!isDecentralized && isRelated && chars.map((_, b) => (
                                            <g key={b} opacity="0.75">
                                                <animateMotion
                                                    dur={`${5 + (b % 4) * 1.2}s`}
                                                    begin={`${b * 0.7}s`}
                                                    repeatCount="indefinite"
                                                    path={pathD}
                                                />
                                                {/* envelope body */}
                                                <rect x="-1.1" y="-0.75" width="2.2" height="1.5" rx="0.12" fill="rgba(15,25,40,0.7)" stroke="#7a9ab8" strokeWidth="0.13" />
                                                {/* flap V */}
                                                <path d="M -1.1,-0.75 L 0,0.15 L 1.1,-0.75" fill="none" stroke="#7a9ab8" strokeWidth="0.11" />
                                                {/* bottom crease lines */}
                                                <line x1="-1.1" y1="0.75" x2="-0.1" y2="0.05" stroke="#7a9ab8" strokeWidth="0.09" opacity="0.5" />
                                                <line x1="1.1" y1="0.75" x2="0.1" y2="0.05" stroke="#7a9ab8" strokeWidth="0.09" opacity="0.5" />
                                            </g>
                                        ))}
                                        {(isHovered || isRelated) && !editPositions && (
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

                            {sectors.map((sector) => {
                                const isSelected = selected === sector.id;
                                const isRelated = relatedIds.has(sector.id);
                                const dimmed = selected && !isRelated && !isSelected;
                                const r = sector.tier === "core" ? 4 : sector.tier === "primary" ? 3.4 : 2.8;
                                const pos = getSectorPos(sector.id);
                                const isDraggingThis = dragging?.sectorId === sector.id;

                                return (
                                    <g
                                        key={sector.id}
                                        className="sector-node"
                                        onClick={() => handleNodeClick(sector.id, isSelected)}
                                        onMouseDown={editPositions ? (e) => handleNodeDragStart(e, sector.id) : e => e.preventDefault()}
                                        opacity={dimmed ? 0.2 : 1}
                                        style={{
                                            outline: 'none',
                                            cursor: editPositions ? (isDraggingThis ? 'grabbing' : 'grab') : 'pointer',
                                        }}
                                    >
                                        {/* Drag target ring in edit mode */}
                                        {editPositions && (
                                            <circle
                                                cx={pos.x} cy={pos.y} r={r + 2}
                                                fill="none"
                                                stroke="#ffa726"
                                                strokeWidth="0.2"
                                                opacity={isDraggingThis ? 0.9 : 0.35}
                                                strokeDasharray="0.6 0.4"
                                            />
                                        )}
                                        <circle cx={pos.x} cy={pos.y} r={r + 0.5} fill="none" stroke={isSelected ? "#8B5CF6" : sector.border} strokeWidth={isSelected ? 0.2 : 0.08} opacity={isSelected ? 0.8 : 0.3} strokeDasharray={isSelected ? "none" : "0.3 0.2"} />
                                        <circle className={`sector-node-circle ${isSelected ? "is-selected" : ""}`} cx={pos.x} cy={pos.y} r={r} stroke={isSelected ? "#8B5CF6" : sector.border} strokeWidth={isSelected ? 0.18 : 0.1} filter={isSelected ? "url(#glow)" : "none"} />
                                        {sector.subIcon
                                            ? <>
                                                <text x={pos.x} y={pos.y - r * 0.2} fontSize={r * 0.9} textAnchor="middle" dominantBaseline="middle" opacity={0.75}>{sector.icon}</text>
                                                <text x={pos.x} y={pos.y + r * 0.55} fontSize={r * 0.8} textAnchor="middle" dominantBaseline="middle">{sector.subIcon}</text>
                                              </>
                                            : <text x={pos.x} y={pos.y + 0.3} fontSize={r * 1.33} textAnchor="middle" dominantBaseline="middle">{sector.icon}</text>
                                        }
                                        <text className={`sector-node-label ${isSelected ? "is-selected" : ""}`} x={pos.x} y={pos.y + r + 1.6} fontSize="1.4" textAnchor="middle" fontFamily={isRTL ? "Vazirmatn" : "Inter"} fontWeight={isSelected ? "600" : "500"}>
                                            {t(sector.label)}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>

                        {panelVisible && selectedSector && !editPositions && (
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
                                <p className="side-panel-desc">{t(selectedSector.desc)}</p>

                                <Link
                                    to={`/blueprint/gov/${activeBlueprintId}/sectors/${selectedSector.id}`}
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
                                    {tKey('blueprint.learnMore')}
                                </Link>

                                <div className={`panel-section-label ${!isRTL ? "is-ltr" : ""}`}>
                                    {tKey('blueprint.internalSystems')}
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
                                            {tKey('blueprint.connections', { count: relatedConnections.length })}
                                        </div>
                                        {relatedConnections.map((conn, i) => {
                                            const other = conn.from === selected ? conn.to : conn.from;
                                            const otherSec = sectors.find((s) => s.id === other);
                                            return (
                                                <div key={i} className="panel-connection-row">
                                                    <span>{otherSec?.icon} {t(otherSec?.label)}</span>
                                                    <span className="panel-connection-pill">{t(conn.label)}</span>
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
                            {tKey('blueprint.map')}
                        </button>
                        <button className={`tab-btn${view === "list" ? " tab-active" : ""}`} onClick={() => setView("list")}>
                            <span className="tab-icon">⬡</span>
                            {tKey('blueprint.list')}
                        </button>
                    </div>

                    <div className="shared-footer">
                        <div className={`shared-footer-title ${!isRTL ? "is-ltr" : ""}`}>
                            {tKey('blueprint.sharedLayers')}
                        </div>
                        <div className="shared-chip-row">
                            {sharedLayers.map((layer, i) => (
                                <div key={i} className="layer-chip" onClick={() => setShowLayer(showLayer === i ? null : i)}
                                     style={{ padding: "7px 11px", background: showLayer === i ? "rgba(139,92,246,0.08)" : "rgba(9,13,19,0.72)", border: `1px solid ${showLayer === i ? "#8B5CF640" : "rgba(91,103,120,0.22)"}`, borderRadius: 0, fontSize: 11, color: showLayer === i ? "#7fd8ff" : "#667384", display: "flex", alignItems: "center", gap: 6 }}>
                                    <span>{layer.icon}</span> <span>{t(layer.name)}</span>
                                </div>
                            ))}
                        </div>
                        {showLayer !== null && (
                            <div className="shared-chip-desc">{t(sharedLayers[showLayer].desc)}</div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="list-view">
                    <div className="mobile-tab-bar mobile-tab-bar--list">
                        <button className={`tab-btn${view === "map" ? " tab-active" : ""}`} onClick={() => setView("map")}>
                            <span className="tab-icon">🗺️</span>
                            {tKey('blueprint.map')}
                        </button>
                        <button className={`tab-btn${view === "list" ? " tab-active" : ""}`} onClick={() => setView("list")}>
                            <span className="tab-icon">⬡</span>
                            {tKey('blueprint.list')}
                        </button>
                    </div>
                    <div className="hex-honeycomb" style={{
                        "--hex-w": `${hexW}px`,
                        gridTemplateColumns: `repeat(${hexCols}, var(--hex-w))`,
                    }}>
                        {sectors.map((sector, i) => {
                            const row = Math.floor(i / hexCols);
                            const isOffsetRow = row % 2 === 1;
                            const isFirstRow = row === 0;
                            return (
                                <div
                                    key={sector.id}
                                    className={`hex-card-wrap${isOffsetRow ? " hex-row-offset" : ""}`}
                                    style={{ gridRow: row + 1, marginTop: isFirstRow ? 0 : undefined }}
                                    onClick={() => { setSelected(sector.id); setView("map"); }}
                                    onMouseDown={e => e.preventDefault()}
                                >
                                    <div className="list-card hex-shape" style={{ "--card-accent": sector.border }}>
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
                                            <p className="list-card-desc">{t(sector.desc)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {session && sessionStorage.getItem('irdao_age_ok') === 'true' && (
                <Link to="/vote" className="bv-vote-fab" title={isRTL ? 'رأی دهید' : 'Cast Your Vote'}>
                    {isRTL ? '✊ رأی' : '✊ VOTE'}
                </Link>
            )}

        </div>
    );
}
