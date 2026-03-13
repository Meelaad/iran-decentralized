import React from 'react';
import { useParams } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import './RoadmapPage.css';

const DECENTRALIZED_PHASES = [
    {
        phase: { en: "Phase 1 — Foundation", fa: "فاز ۱ — بنیاد" },
        color: "#4fc3f7",
        items: [
            {
                en: "Deploy Sovereign Digital Identity (SSI) pilot with diaspora volunteers",
                fa: "راه‌اندازی آزمایشی هویت دیجیتال مستقل با داوطلبان دیاسپورا"
            },
            {
                en: "Launch censorship-resistant mesh network in 3 provinces",
                fa: "راه‌اندازی شبکه مقاوم در برابر سانسور در ۳ استان"
            },
            {
                en: "Establish Censorship-Resistant Ledger (Layer 1) testnet",
                fa: "ایجاد شبکه آزمایشی دفتر کل مقاوم در برابر سانسور (لایه ۱)"
            },
            {
                en: "Zero-Knowledge Privacy module prototype",
                fa: "نمونه اولیه ماژول حریم خصوصی دانش صفر"
            },
        ]
    },
    {
        phase: { en: "Phase 2 — Core Services", fa: "فاز ۲ — خدمات هسته‌ای" },
        color: "#66bb6a",
        items: [
            {
                en: "Provincial Shora (Council) DAO deployment — first 5 provinces",
                fa: "استقرار DAO شوراهای استانی — ۵ استان اول"
            },
            {
                en: "Algorithmic National Currency (Post-Rial CBDC) testnet",
                fa: "شبکه آزمایشی ارز ملی الگوریتمی (جایگزین ریال)"
            },
            {
                en: "Tokenized National Resource tracking for oil & gas reserves",
                fa: "ردیابی توکن‌شده ذخایر نفت و گاز"
            },
            {
                en: "Transitional Justice Immutable Ledger — truth commission integration",
                fa: "دفتر کل عدالت انتقالی — یکپارچه‌سازی با کمیسیون حقیقت‌یاب"
            },
            {
                en: "AI Anti-Corruption Engine v1 — budget monitoring",
                fa: "موتور ضد فساد هوش مصنوعی نسخه ۱ — نظارت بر بودجه"
            },
        ]
    },
    {
        phase: { en: "Phase 3 — Expansion", fa: "فاز ۳ — گسترش" },
        color: "#ffa726",
        items: [
            {
                en: "Healthcare patient-record sovereignty across all provinces",
                fa: "حاکمیت پرونده بیمار در تمام استان‌ها"
            },
            {
                en: "On-Chain Land Registry & tokenized property titles",
                fa: "ثبت اسناد املاک روی زنجیره و اسناد مالکیت توکن‌شده"
            },
            {
                en: "Education Credential NFTs — university integration",
                fa: "NFT مدارک تحصیلی — یکپارچه‌سازی با دانشگاه‌ها"
            },
            {
                en: "Social Services benefits engine with AI-driven eligibility",
                fa: "موتور خدمات اجتماعی با تشخیص صلاحیت مبتنی بر هوش مصنوعی"
            },
            {
                en: "Environment & Climate — water crisis management protocol",
                fa: "محیط زیست و اقلیم — پروتکل مدیریت بحران آب"
            },
            {
                en: "Decentralized News Verification Protocol launch",
                fa: "راه‌اندازی پروتکل تأیید اخبار غیرمتمرکز"
            },
        ]
    },
    {
        phase: { en: "Phase 4 — Full Integration", fa: "فاز ۴ — یکپارچه‌سازی کامل" },
        color: "#ab47bc",
        items: [
            {
                en: "All 31 provincial DAOs online with cross-chain interoperability",
                fa: "تمام ۳۱ DAO استانی آنلاین با قابلیت همکاری بین‌زنجیره‌ای"
            },
            {
                en: "Culture & Heritage tokenization — Persepolis, Isfahan, and beyond",
                fa: "توکن‌سازی میراث فرهنگی — تخت‌جمشید، اصفهان و فراتر"
            },
            {
                en: "Instant Business Registration (On-Chain) for all enterprise types",
                fa: "ثبت فوری کسب‌وکار (روی زنجیره) برای تمام انواع شرکت‌ها"
            },
            {
                en: "Defense & Cybersecurity Operations Center fully decentralized",
                fa: "مرکز عملیات دفاعی و امنیت سایبری کاملاً غیرمتمرکز"
            },
            {
                en: "Interoperability Gateway — all sector APIs standardized",
                fa: "درگاه یکپارچه‌سازی — استانداردسازی تمام APIهای بخشی"
            },
            {
                en: "Full citizen participation: every adult with sovereign digital identity",
                fa: "مشارکت کامل شهروندی: هر فرد بالغ با هویت دیجیتال مستقل"
            },
        ]
    },
];

const TIER_CONFIG = {
    core: {
        phase: { en: "Phase 1 — Foundational Layer", fa: "فاز ۱ — لایه بنیادین" },
        color: "#4fc3f7",
    },
    primary: {
        phase: { en: "Phase 2 — Core Services", fa: "فاز ۲ — خدمات هسته‌ای" },
        color: "#66bb6a",
    },
    secondary: {
        phase: { en: "Phase 3 — Expansion", fa: "فاز ۳ — گسترش" },
        color: "#ffa726",
    },
    tertiary: {
        phase: { en: "Phase 4 — Full Integration", fa: "فاز ۴ — یکپارچه‌سازی کامل" },
        color: "#ab47bc",
    },
};

export default function RoadmapPage() {
    const { t, isRTL } = useLang();
    const { blueprintId } = useParams();
    const blueprint = BLUEPRINTS[blueprintId] || BLUEPRINTS.decentralized;

    const phases = React.useMemo(() => {
        if (blueprint.id === 'decentralized') {
            return DECENTRALIZED_PHASES;
        }

        const grouped = { core: [], primary: [], secondary: [], tertiary: [] };
        for (const sector of blueprint.sectors) {
            if (grouped[sector.tier]) {
                grouped[sector.tier].push(sector);
            }
        }

        return Object.entries(grouped)
            .filter(([, sectors]) => sectors.length > 0)
            .map(([tier, sectors]) => ({
                ...TIER_CONFIG[tier],
                items: sectors.map(s => s.label),
            }));
    }, [blueprint]);

    return (
        <div className="roadmap-page">
            <div className="roadmap-page-scanline" />
            <div className="roadmap-bg-grid" />
            <div className="roadmap-inner">
                <h1
                    className="roadmap-title"
                    style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                >
                    {t({ en: "Implementation Roadmap", fa: "نقشه راه پیاده‌سازی" })}
                </h1>
                <p className="roadmap-subtitle">
                    {t({
                        en: `A phased path for the ${t(blueprint.name)} blueprint.`,
                        fa: `مسیر گام‌به‌گام برای طرح ${t(blueprint.name)}.`
                    })}
                </p>

                <div className="roadmap-timeline">
                    <div className="roadmap-timeline-line" />
                    {phases.map((phase, i) => (
                        <div
                            key={i}
                            className="roadmap-phase"
                            style={{ animationDelay: `${i * 0.12}s` }}
                        >
                            <div className="roadmap-phase-dot" style={{ borderColor: phase.color, boxShadow: `0 0 12px ${phase.color}40` }} />
                            <div className="roadmap-phase-content">
                                <h2
                                    className="roadmap-phase-title"
                                    style={{
                                        color: phase.color,
                                        fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif"
                                    }}
                                >
                                    {t(phase.phase)}
                                </h2>
                                <ul className="roadmap-phase-items">
                                    {phase.items.map((item, j) => (
                                        <li
                                            key={j}
                                            className="roadmap-item"
                                            style={{ animationDelay: `${i * 0.12 + j * 0.05}s` }}
                                        >
                                            <span className="roadmap-item-bullet" style={{ background: phase.color }} />
                                            <span>{t(item)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}