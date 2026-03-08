import React, { useRef, useEffect } from "react";
import { useLang } from "../../components/Layout/Layout";
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
                        ctx.fillStyle = `rgba(79,195,247,${(brightness - 0.7) * 0.5 * depth})`;
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

const PRINCIPLES = [
    {
        icon: "🔗",
        title: { en: "Decentralization", fa: "عدم تمرکز" },
        desc: { en: "No single point of failure or control in governance systems.", fa: "بدون نقطه شکست یا کنترل واحد در سیستم‌های حاکمیتی." }
    },
    {
        icon: "🔍",
        title: { en: "Transparency", fa: "شفافیت" },
        desc: { en: "All decisions and transactions recorded on-chain for public audit.", fa: "تمام تصمیمات و تراکنش‌ها روی زنجیره ثبت می‌شوند." }
    },
    {
        icon: "🗳️",
        title: { en: "Direct Democracy", fa: "دموکراسی مستقیم" },
        desc: { en: "Citizens participate directly in governance through secure voting.", fa: "شهروندان مستقیماً در حاکمیت از طریق رأی‌گیری امن مشارکت می‌کنند." }
    },
    {
        icon: "🛡️",
        title: { en: "Security", fa: "امنیت" },
        desc: { en: "Cryptographic guarantees protect sovereignty and citizen data.", fa: "تضمین‌های رمزنگاری از حاکمیت و داده‌های شهروندان محافظت می‌کنند." }
    },
    {
        icon: "🌐",
        title: { en: "Interoperability", fa: "قابلیت همکاری" },
        desc: { en: "Cross-sector protocols enable seamless coordination.", fa: "پروتکل‌های بین‌بخشی هماهنگی یکپارچه را ممکن می‌سازند." }
    },
    {
        icon: "⚖️",
        title: { en: "Accountability", fa: "پاسخگویی" },
        desc: { en: "Smart contracts enforce rules automatically and impartially.", fa: "قراردادهای هوشمند قوانین را خودکار و بی‌طرف اجرا می‌کنند." }
    },
];

export default function AboutPage() {
    const { t, isRTL } = useLang();

    return (
        <div className="about-page">
            <WaveGrid />
            <div className="about-page-scanline" />
            <div className="about-inner">
                <h1
                    className="about-title"
                    style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                >
                    {isRTL ? "درباره این پروژه" : "About This Project"}
                </h1>
                <p className="about-subtitle">
                    {isRTL
                        ? "یک چارچوب حاکمیت غیرمتمرکز مبتنی بر بلاکچین برای آینده ایران"
                        : "A blockchain-based decentralized governance framework for the future of Iran"
                    }
                </p>

                <div className="about-section">
                    <div className="about-section-title">
                        {isRTL ? "چشم‌انداز" : "VISION"}
                    </div>
                    <div className="about-section-body">
                        <p>
                            {isRTL
                                ? "این پروژه معماری یک سیستم حاکمیت غیرمتمرکز را ترسیم می‌کند که در آن شهروندان مستقیماً در تصمیم‌گیری‌ها مشارکت دارند. با استفاده از فناوری بلاکچین، شفافیت، امنیت و پاسخگویی تضمین می‌شود."
                                : "This project maps the architecture of a decentralized governance system where citizens participate directly in decision-making. Using blockchain technology, transparency, security, and accountability are guaranteed."
                            }
                        </p>
                    </div>
                </div>

                <div className="about-section">
                    <div className="about-section-title">
                        {isRTL ? "اصول بنیادین" : "CORE PRINCIPLES"}
                    </div>
                    <div className="about-principles">
                        {PRINCIPLES.map((p, i) => (
                            <div
                                key={i}
                                className="about-principle"
                                style={{ animationDelay: `${i * 0.08}s` }}
                            >
                                <svg className="about-hex-border" viewBox="0 0 180 200" preserveAspectRatio="none">
                                    <polygon
                                        points="90,2 178,50 178,150 90,198 2,150 2,50"
                                        fill="none"
                                        stroke="rgba(79,195,247,0.15)"
                                        strokeWidth="1"
                                    />
                                </svg>
                                <div className="about-principle-icon">{p.icon}</div>
                                <div
                                    className="about-principle-title"
                                    style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
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
                        {isRTL ? "فناوری" : "TECHNOLOGY"}
                    </div>
                    <div className="about-section-body">
                        <p>
                            {isRTL
                                ? "این سیستم بر پایه شبکه‌های بلاکچین لایه ۱ و ۲، قراردادهای هوشمند، پروتکل‌های رأی‌گیری رمزنگاری‌شده و سیستم‌های هویت غیرمتمرکز طراحی شده است."
                                : "The system is built on Layer 1 & 2 blockchain networks, smart contracts, cryptographic voting protocols, and decentralized identity systems."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
