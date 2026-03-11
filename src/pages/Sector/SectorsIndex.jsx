import React, { useRef, useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS, SECTORS } from "../../data";
import './SectorsIndex.css';

const TIERS = [
    { key: "core", label: { en: "CORE LAYER", fa: "لایه هسته" }, color: "#4fc3f7" },
    { key: "primary", label: { en: "PRIMARY SECTORS", fa: "بخش‌های اولیه" }, color: "#66bb6a" },
    { key: "secondary", label: { en: "SECONDARY SECTORS", fa: "بخش‌های ثانویه" }, color: "#ffa726" },
    { key: "tertiary", label: { en: "SUPPORTING SECTORS", fa: "بخش‌های پشتیبان" }, color: "#ab47bc" },
];

const HEX_R = 16;
const HEX_GAP = 4;

function hexCorners(cx, cy, r) {
    return Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 180) * (60 * i - 30);
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
}

function buildHexGrid(w, h) {
    const hexes = [];
    const colW = HEX_R * 2 + HEX_GAP;
    const rowH = HEX_R * 1.732 + HEX_GAP;
    const cols = Math.ceil(w / colW) + 2;
    const rows = Math.ceil(h / rowH) + 2;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cx = col * colW + (row % 2 === 1 ? colW / 2 : 0);
            const cy = row * rowH;
            hexes.push({ cx, cy });
        }
    }
    return hexes;
}

function HexBg({ accentColor }) {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -200, y: -200 });
    const hexesRef = useRef([]);
    const animRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        function resize() {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            hexesRef.current = buildHexGrid(w, h);
        }
        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        function draw() {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            for (const hex of hexesRef.current) {
                const dx = hex.cx - mx;
                const dy = hex.cy - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 90;
                const intensity = Math.max(0, 1 - dist / maxDist);

                const corners = hexCorners(hex.cx, hex.cy, HEX_R);
                ctx.beginPath();
                ctx.moveTo(corners[0][0], corners[0][1]);
                for (let i = 1; i < 6; i++) ctx.lineTo(corners[i][0], corners[i][1]);
                ctx.closePath();

                if (intensity > 0) {
                    const alpha = intensity * 0.18;
                    ctx.fillStyle = accentColor
                        ? accentColor.replace(")", `,${alpha})`).replace("rgb(", "rgba(")
                        : `rgba(79,195,247,${alpha})`;
                    ctx.fill();
                    ctx.strokeStyle = accentColor
                        ? accentColor.replace(")", `,${0.15 + intensity * 0.4})`).replace("rgb(", "rgba(")
                        : `rgba(79,195,247,${0.15 + intensity * 0.4})`;
                } else {
                    ctx.strokeStyle = "rgba(79,195,247,0.06)";
                }
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            animRef.current = requestAnimationFrame(draw);
        }
        draw();

        return () => {
            cancelAnimationFrame(animRef.current);
            ro.disconnect();
        };
    }, [accentColor]);

    const onMouseMove = useCallback((e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    const onMouseLeave = useCallback(() => {
        mouseRef.current = { x: -200, y: -200 };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="hex-card-canvas"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        />
    );
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r},${g},${b})`;
}

function HexCard({ sector, isRTL, t, delay, sectorBase }) {
    return (
        <Link
            to={`${sectorBase}/${sector.id}`}
            className="sectors-card"
            style={{ borderLeftColor: sector.border, animationDelay: `${delay}s` }}
        >
            <HexBg accentColor={hexToRgb(sector.border)} />
            <span className="sectors-card-icon">{sector.icon}</span>
            <div className="sectors-card-body">
                <div
                    className="sectors-card-title"
                    style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                >
                    {t(sector.label)}
                </div>
                <p className="sectors-card-desc">{t(sector.desc)}</p>
            </div>
            <span className="sectors-card-arrow">{isRTL ? "←" : "→"}</span>
        </Link>
    );
}

export default function SectorsIndex() {
    const { t, tKey, isRTL } = useLang();
    const { blueprintId } = useParams();
    const activeSectors = (blueprintId && BLUEPRINTS[blueprintId]?.sectors) || SECTORS;
    const sectorBase = blueprintId ? `/blueprint/${blueprintId}/sectors` : '/sectors';

    return (
        <div className="sectors-index">
            <div className="sectors-index-retro-grid" />
            <div className="sectors-index-inner">
                <h1
                    className="sectors-index-title"
                    style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                >
                    {tKey('sectors.title')}
                </h1>
                <p className="sectors-index-sub">
                    {tKey('sectors.subtitle')}
                </p>

                {TIERS.map(tier => {
                    const sectors = activeSectors.filter(s => s.tier === tier.key);
                    if (sectors.length === 0) return null;

                    return (
                        <div key={tier.key} className="sectors-tier">
                            <div
                                className="sectors-tier-label"
                                style={{ color: tier.color, borderBottomColor: `${tier.color}30` }}
                            >
                                {t(tier.label)}
                            </div>
                            <div className="sectors-tier-grid">
                                {sectors.map((sector, i) => (
                                    <HexCard
                                        key={sector.id}
                                        sector={sector}
                                        isRTL={isRTL}
                                        t={t}
                                        delay={i * 0.06}
                                        sectorBase={sectorBase}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
