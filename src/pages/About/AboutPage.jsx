import React, { useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import CONTENT from '../../locales/pages/about.json';
import './AboutPage.css';

function WaveGrid() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;
        let t = 0;

        const cols = 50;
        const rows = 30;
        const perspective = 600;
        const cameraY = -180;
        const cameraZ = 280;
        const gridSpacing = 28;

        function resize() {
            canvas.width = canvas.offsetWidth * devicePixelRatio;
            canvas.height = canvas.offsetHeight * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        resize();
        window.addEventListener("resize", resize);

        function project(x, y, z) {
            const dy = y - cameraY;
            const dz = z - cameraZ;
            const scale = perspective / (perspective + dz);
            const sx = canvas.offsetWidth / 2 + x * scale;
            const sy = canvas.offsetHeight / 2 + dy * scale;
            return { sx, sy, scale };
        }

        function wave(x, z, time) {
            return (
                Math.sin(x * 0.06 + time * 1.2) * 12 +
                Math.sin(z * 0.08 + time * 0.9) * 10 +
                Math.sin((x + z) * 0.04 + time * 0.7) * 8
            );
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            t += 0.012;

            const points = [];
            for (let row = 0; row < rows; row++) {
                points[row] = [];
                for (let col = 0; col < cols; col++) {
                    const x = (col - cols / 2) * gridSpacing;
                    const z = row * gridSpacing;
                    const y = wave(x, z, t);
                    points[row][col] = { x, y, z };
                }
            }

            // Draw from back to front
            for (let row = 0; row < rows - 1; row++) {
                for (let col = 0; col < cols - 1; col++) {
                    const p00 = project(points[row][col].x, points[row][col].y, points[row][col].z);
                    const p10 = project(points[row][col + 1].x, points[row][col + 1].y, points[row][col + 1].z);
                    const p01 = project(points[row + 1][col].x, points[row + 1][col].y, points[row + 1][col].z);
                    // p11 reserved for future diagonal lines
                    project(points[row + 1][col + 1].x, points[row + 1][col + 1].y, points[row + 1][col + 1].z);

                    const avgY= (points[row][col].y + points[row][col + 1].y + points[row + 1][col].y + points[row + 1][col + 1].y) / 4;
                    const brightness = Math.max(0, Math.min(1, (avgY + 30) / 60));
                    const depth = 1 - row / rows;
                    const alpha = (0.08 + brightness * 0.35) * depth;

                    const r = Math.round(40 + brightness * 39);
                    const g = Math.round(140 + brightness * 77);
                    const b = Math.round(200 + brightness * 55);

                    // Horizontal line
                    ctx.beginPath();
                    ctx.moveTo(p00.sx, p00.sy);
                    ctx.lineTo(p10.sx, p10.sy);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
                    ctx.lineWidth = 0.6 + brightness * 0.6;
                    ctx.stroke();

                    // Vertical line
                    ctx.beginPath();
                    ctx.moveTo(p00.sx, p00.sy);
                    ctx.lineTo(p01.sx, p01.sy);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.7})`;
                    ctx.lineWidth = 0.4 + brightness * 0.4;
                    ctx.stroke();

                    // Glow on peaks
                    if (brightness > 0.7) {
                        ctx.beginPath();
                        ctx.arc(p00.sx, p00.sy, 1.5 + brightness * 2, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(139,92,246,${(brightness - 0.7) * 0.5 * depth})`;
                        ctx.fill();
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="wave-grid-canvas" />;
}

export default function AboutPage() {
    const { t, headFont } = useLang();

    return (
        <div className="about-page">
            <WaveGrid />
            <div className="about-page-scanline" />
            <div className="about-inner">
                <h1
                    className="about-title"
                    style={{ fontFamily: headFont }}
                >
                    {t(CONTENT.title)}
                </h1>
                <p className="about-subtitle">
                    {t(CONTENT.subtitle)}
                </p>

                <div className="about-section">
                    <div className="about-section-title">
                        {t(CONTENT.visionTitle)}
                    </div>
                    <div className="about-section-body">
                        <p>
                            {t(CONTENT.visionBody)}
                        </p>
                    </div>
                </div>

                <div className="about-section">
                    <div className="about-section-title">
                        {t(CONTENT.principlesTitle)}
                    </div>
                    <div className="about-principles">
                        {CONTENT.principles.map((p, i) => (
                            <div
                                key={i}
                                className="about-principle"
                                style={{ animationDelay: `${i * 0.08}s` }}
                            >
                                <svg className="about-hex-border" viewBox="0 0 180 200" preserveAspectRatio="none">
                                    <polygon
                                        points="90,2 178,50 178,150 90,198 2,150 2,50"
                                        fill="none"
                                        stroke="rgba(139,92,246,0.15)"
                                        strokeWidth="1"
                                    />
                                </svg>
                                <div className="about-principle-icon">{p.icon}</div>
                                <div
                                    className="about-principle-title"
                                    style={{ fontFamily: headFont }}
                                >
                                    {t(p.title)}
                                </div>
                                <p className="about-principle-desc">{t(p.desc)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="about-section">
                    <div className="about-section-title">
                        {t(CONTENT.technologyTitle)}
                    </div>
                    <div className="about-section-body">
                        <p>
                            {t(CONTENT.technologyBody)}
                        </p>
                    </div>
                </div>

                <div className="about-section">
                    <div className="about-section-title">
                        {t(CONTENT.contactTitle)}
                    </div>
                    <div className="about-section-body">
                        <p>
                            {t(CONTENT.contactBody)}
                        </p>
                        <Link
                            to="/contact"
                            className="about-contact-btn"
                            style={{ fontFamily: headFont }}
                        >
                            {t(CONTENT.contactButton)}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
