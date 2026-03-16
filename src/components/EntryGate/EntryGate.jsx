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

function GateHex({ onEnter, isRTL }) {
    return (
        <button className="gate-hex-btn" onClick={onEnter} aria-label="Enter">
            {/* rotating outer ring */}
            <svg className="gate-hex-ring" viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="gateRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stopColor="#239F40" stopOpacity="0.95" />
                        <stop offset="50%"  stopColor="#ffffff" stopOpacity="0.7"  />
                        <stop offset="100%" stopColor="#DA0000" stopOpacity="0.85" />
                    </linearGradient>
                </defs>
                <polygon
                    points="60,4 112,32 112,88 60,116 8,88 8,32"
                    fill="none"
                    stroke="url(#gateRingGrad)"
                    strokeWidth="1.5"
                />
            </svg>

            {/* inner hex body */}
            <div className="gate-hex-body">
                <svg viewBox="0 0 100 100" className="gate-hex-body-svg">
                    <polygon
                        points="50,4 96,27 96,73 50,96 4,73 4,27"
                        fill="rgba(7,16,26,0.96)"
                        stroke="rgba(35,159,64,0.4)"
                        strokeWidth="1"
                    />
                </svg>
                <div className="gate-hex-inner">
                    <span className="gate-hex-enter-en">ENTER</span>
                    <span className="gate-hex-enter-fa">ورود</span>
                </div>
            </div>

            {/* pulse halos */}
            <div className="gate-hex-pulse" />
            <div className="gate-hex-pulse gate-hex-pulse--2" />
        </button>
    );
}

export default function EntryGate({ children }) {
    const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));
    const [leaving, setLeaving] = useState(false);
    const { lang, setLang, tKey, isRTL } = useLang();

    function enter() {
        localStorage.setItem(STORAGE_KEY, '1');
        setLeaving(true);
        setTimeout(() => setVisible(false), 700);
    }

    return (
        <>
            {children}

            {visible && (
                <div className={`gate-overlay${leaving ? ' gate-overlay--leaving' : ''}`}>
                    <GateParticles />
                    <div className="gate-bg-grid" />
                    <div className="gate-scanline" />

                    <div className="gate-inner" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: isRTL ? "'Irancell', sans-serif" : "'intelone-mono', monospace" }}>
                        <div className="gate-eyebrow">
                            {tKey('entryGate.initializing')}
                        </div>

                        <div className="gate-title-block">
                            <h1 className="gate-title-en">IranDAO</h1>
                            <h2 className="gate-title-fa">ایران دائو</h2>
                        </div>

                        <p className="gate-tagline" style={{ fontFamily: isRTL ? "'Markazi Text', serif" : "'intelone-mono', monospace" }}>
                            {tKey('entryGate.tagline')}
                        </p>

                        <GateHex onEnter={enter} isRTL={isRTL} />

                        <div className="gate-lang">
                            <button
                                className={`gate-lang-btn${lang === 'fa' ? ' is-active' : ''}`}
                                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                                onClick={() => setLang('fa')}
                            >فارسی</button>
                            <span className="gate-lang-sep">|</span>
                            <button
                                className={`gate-lang-btn${lang === 'en' ? ' is-active' : ''}`}
                                style={{ fontFamily: "'intelone-mono', monospace" }}
                                onClick={() => setLang('en')}
                            >EN</button>
                        </div>

                        <div className="gate-hint" style={{ fontFamily: isRTL ? "'Markazi Text', serif" : "'intelone-mono', monospace" }}>
                            {tKey('entryGate.hint')}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}