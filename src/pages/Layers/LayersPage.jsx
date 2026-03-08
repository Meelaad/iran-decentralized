import React from "react";
import { useLang } from "../../components/Layout/Layout";
import { SHARED_LAYERS, SECTORS } from "../../data";
import './LayersPage.css';

const LAYER_DETAILS = [
    {
        sectors: ["governance", "citizens", "economy", "justice"],
        features: {
            en: ["Tamper-proof voting records", "Budget allocation audit trails", "Cross-provincial sync"],
            fa: ["سوابق رأی‌گیری ضدتقلب", "ردیابی تخصیص بودجه", "همگام‌سازی بین استان‌ها"]
        }
    },
    {
        sectors: ["citizens", "healthcare", "social", "justice"],
        features: {
            en: ["Anonymous credential verification", "Medical record privacy", "Selective disclosure proofs"],
            fa: ["تأیید مدارک ناشناس", "حریم خصوصی پرونده پزشکی", "اثبات‌های افشای انتخابی"]
        }
    },
    {
        sectors: ["citizens", "education", "healthcare", "housing"],
        features: {
            en: ["Citizen-owned data vaults", "Temporary access delegation", "Cross-sector data portability"],
            fa: ["صندوق داده‌های متعلق به شهروندان", "واگذاری دسترسی موقت", "قابلیت انتقال داده بین‌بخشی"]
        }
    },
    {
        sectors: ["economy", "resources", "business", "governance"],
        features: {
            en: ["Real-time budget anomaly alerts", "Procurement fraud detection", "Public spending dashboards"],
            fa: ["هشدار ناهنجاری بودجه بلادرنگ", "تشخیص تقلب در تدارکات", "داشبوردهای هزینه عمومی"]
        }
    },
    {
        sectors: ["infrastructure", "media", "environment", "culture"],
        features: {
            en: ["Standardized API contracts", "Provincial DAO connectors", "Cross-chain bridge protocols"],
            fa: ["قراردادهای API استاندارد", "اتصال‌دهنده‌های DAO استانی", "پروتکل‌های پل بین‌زنجیره‌ای"]
        }
    },
];

export default function LayersPage() {
    const { t, isRTL } = useLang();

    return (
        <div className="layers-page">
            <div className="layers-page-scanline" />
            <div className="layers-bg-grid" />
            <div className="layers-inner">
                <h1
                    className="layers-title"
                    style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                >
                    {isRTL ? "لایه‌های زیرساخت مشترک" : "Shared Infrastructure Layers"}
                </h1>
                <p className="layers-subtitle">
                    {isRTL
                        ? "لایه‌های بنیادینی که تمام بخش‌های حاکمیت غیرمتمرکز را به هم پیوند می‌دهند"
                        : "Foundational layers connecting all decentralized governance sectors"
                    }
                </p>

                <div className="layers-stack">
                    {SHARED_LAYERS.map((layer, i) => {
                        const details = LAYER_DETAILS[i];
                        const connectedSectors = details.sectors
                            .map(id => SECTORS.find(s => s.id === id))
                            .filter(Boolean);

                        return (
                            <div
                                key={i}
                                className="layer-card"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="layer-card-index">L{i + 1}</div>
                                <div className="layer-card-main">
                                    <div className="layer-card-header">
                                        <span className="layer-card-icon">{layer.icon}</span>
                                        <h2
                                            className="layer-card-name"
                                            style={{ fontFamily: isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif" }}
                                        >
                                            {t(layer.name)}
                                        </h2>
                                    </div>
                                    <p className="layer-card-desc">{t(layer.desc)}</p>

                                    <div className="layer-card-features">
                                        <div className="layer-features-label">
                                            {isRTL ? "قابلیت‌های کلیدی" : "KEY CAPABILITIES"}
                                        </div>
                                        <ul className="layer-features-list">
                                            {(isRTL ? details.features.fa : details.features.en).map((f, j) => (
                                                <li key={j}>{f}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="layer-card-sectors">
                                        <div className="layer-sectors-label">
                                            {isRTL ? "بخش‌های متصل" : "CONNECTED SECTORS"}
                                        </div>
                                        <div className="layer-sector-chips">
                                            {connectedSectors.map(s => (
                                                <span
                                                    key={s.id}
                                                    className="layer-sector-chip"
                                                    style={{ borderColor: s.border, color: s.border }}
                                                >
                                                    {s.icon} {t(s.label)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
