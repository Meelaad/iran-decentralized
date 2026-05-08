import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import CONTENT from '../../locales/pages/not-found.json';
import './NotFoundPage.css';

function GlitchGrid() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let t = 0;

        function resize() {
            canvas.width = canvas.offsetWidth * devicePixelRatio;
            canvas.height = canvas.offsetHeight * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        resize();
        window.addEventListener('resize', resize);

        const nodes = Array.from({ length: 28 }, () => ({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            pulse: Math.random() * Math.PI * 2,
        }));

        function draw() {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            t += 0.008;

            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                n.pulse += 0.02;
                if (n.x < 0 || n.x > canvas.offsetWidth) n.vx *= -1;
                if (n.y < 0 || n.y > canvas.offsetHeight) n.vy *= -1;
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 160) {
                        const alpha = (1 - dist / 160) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            for (const n of nodes) {
                const glow = (Math.sin(n.pulse) + 1) / 2;
                ctx.beginPath();
                ctx.arc(n.x, n.y, 1.5 + glow, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139,92,246,${0.15 + glow * 0.25})`;
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="nf-canvas" />;
}

export default function NotFoundPage() {
    const { t, isRTL, monoFont, headFont } = useLang();

    return (
        <div className="nf-page" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <GlitchGrid />
            <div className="nf-bg-grid" />
            <div className="nf-scanline" />

            <div className="nf-inner">
                <div className="nf-eyebrow" style={{ fontFamily: monoFont }}>
                    {t(CONTENT.eyebrow)}
                </div>

                <div className="nf-code-block">
                    <span className="nf-four">4</span>
                    <span className="nf-zero">
                        <svg viewBox="0 0 80 80" className="nf-hex-svg">
                            <polygon
                                points="40,2 78,21 78,59 40,78 2,59 2,21"
                                fill="rgba(10,14,21,0.9)"
                                stroke="rgba(139,92,246,0.35)"
                                strokeWidth="1.5"
                            />
                            <text x="40" y="47" textAnchor="middle" fontSize="30" fontWeight="700"
                                fill="#8B5CF6" fontFamily="intelone-mono, monospace">0</text>
                        </svg>
                    </span>
                    <span className="nf-four">4</span>
                </div>

                <h1 className="nf-title" style={{ fontFamily: headFont }}>
                    {t(CONTENT.title)}
                </h1>
                <p className="nf-subtitle" style={{ fontFamily: monoFont }}>
                    {t(CONTENT.subtitle)}
                </p>

                <div className="nf-status-row" style={{ fontFamily: monoFont }}>
                    <span className="nf-status-dot" />
                    <span className="nf-status-text">
                        {t(CONTENT.status)}
                    </span>
                </div>

                <Link to="/" className="nf-home-btn" style={{ fontFamily: monoFont }}>
                    {t(CONTENT.homeBtn)}
                </Link>
            </div>
        </div>
    );
}