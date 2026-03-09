import { useState, useEffect, useRef } from 'react';
import { useLang } from '../../contexts/LangContext';
import './EntryGate.css';

const STORAGE_KEY = 'iran-dec-entered';

function GateParticles() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        function resize() {
            canvas.width = canvas.offsetWidth * devicePixelRatio;
            canvas.height = canvas.offsetHeight * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        const nodes = Array.from({ length: 24 }, () => ({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            pulse: Math.random() * Math.PI * 2,
        }));

        function draw() {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                n.pulse += 0.018;
                if (n.x < 0 || n.x > canvas.offsetWidth) n.vx *= -1;
                if (n.y < 0 || n.y > canvas.offsetHeight) n.vy *= -1;
            }
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        const alpha = (1 - dist / 180) * 0.1;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(79,195,247,${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            for (const n of nodes) {
                const glow = (Math.sin(n.pulse) + 1) / 2;
                ctx.beginPath();
                ctx.arc(n.x, n.y, 1.5 + glow, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(79,195,247,${0.12 + glow * 0.2})`;
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

    return <canvas ref={canvasRef} className="gate-canvas" />;
}

export default function EntryGate({ children }) {
    // Read localStorage synchronously so there is no flash on return visits
    const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));
    const [leaving, setLeaving] = useState(false);
    const { lang, setLang, isRTL } = useLang();

    function enter() {
        localStorage.setItem(STORAGE_KEY, '1');
        setLeaving(true);
        setTimeout(() => setVisible(false), 700);
    }

    return (
        <>
            {/* Render app behind the gate so it loads while the user reads */}
            {children}

            {visible && (
                <div className={`gate-overlay${leaving ? ' gate-overlay--leaving' : ''}`}>
                    <GateParticles />
                    <div className="gate-bg-grid" />
                    <div className="gate-scanline" />

                    <div className="gate-inner" dir={isRTL ? 'rtl' : 'ltr'}>
                        <div className="gate-eyebrow">
                            {isRTL ? 'در حال راه‌اندازی شبکه' : 'INITIALIZING NETWORK'}
                        </div>

                        <div className="gate-title-block">
                            <h1 className="gate-title-en">IranDAO</h1>
                            <h2 className="gate-title-fa">ایران دائو</h2>
                        </div>

                        <p className="gate-tagline">
                            {isRTL
                                ? 'معماری غیرمتمرکز برای حاکمیت آینده ایران'
                                : 'Decentralized architecture for the future governance of Iran'}
                        </p>

                        <button className="gate-enter-btn" onClick={enter}>
                            <svg viewBox="0 0 64 64" className="gate-hex-svg">
                                <polygon
                                    points="32,2 62,17 62,47 32,62 2,47 2,17"
                                    fill="rgba(10,14,21,0.95)"
                                    stroke="rgba(79,195,247,0.4)"
                                    strokeWidth="1"
                                />
                            </svg>
                            <span className="gate-enter-label">
                                {isRTL ? 'ورود' : 'ENTER'}
                            </span>
                        </button>

                        <div className="gate-lang">
                            <button
                                className={`gate-lang-btn${lang === 'fa' ? ' is-active' : ''}`}
                                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                                onClick={() => setLang('fa')}
                            >فارسی</button>
                            <span className="gate-lang-sep">|</span>
                            <button
                                className={`gate-lang-btn${lang === 'en' ? ' is-active' : ''}`}
                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                onClick={() => setLang('en')}
                            >EN</button>
                        </div>

                        <div className="gate-hint">
                            {isRTL
                                ? 'پلتفرم غیرمتمرکز دولت مجازی و سازماندهی سیاسی'
                                : 'Decentralized Virtual Government and Political Organization Platform'}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}