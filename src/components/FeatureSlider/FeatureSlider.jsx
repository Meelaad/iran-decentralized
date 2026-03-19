import { useState, useEffect } from 'react';
import { useLang } from '../../contexts/LangContext';
import './FeatureSlider.css';

export const LEFT_FEATURES = [
    { icon: '🏛', title: { en: 'Transitional Plans', fa: 'طرح‌های انتقالی' }, desc: { en: 'Endorse real frameworks like the Mahsa Charter already active on the Main Stage.', fa: 'طرح‌های واقعی مانند منشور مهسا را بر روی صحنه اصلی تأیید کنید.' } },
    { icon: '🗳', title: { en: 'Amendment Floor', fa: 'پیشنهاد اصلاحی در صحن' }, desc: { en: 'Propose and vote on line-item edits to any active plan in real time.', fa: 'پیشنهاد و رأی‌گیری برای تغییرات خط‌به‌خط در طرح‌های فعال.' } },
    { icon: '🌱', title: { en: 'Plan Incubator', fa: 'پرورشگاه طرح' }, desc: { en: 'New grassroots plans earn a Main Stage spot after 10,000 verified signatures.', fa: 'طرح‌های جدید مردمی پس از ۱۰,۰۰۰ امضای تأیید‌شده به صحنه اصلی می‌رسند.' } },
    { icon: '📈', title: { en: 'Live Consensus', fa: 'اجماع زنده' }, desc: { en: 'Stock-style graphs track daily momentum shifts across all competing plans.', fa: 'نمودارهای سهام‌وار تغییرات روزانه اجماع در تمام طرح‌ها را نشان می‌دهند.' } },
    { icon: '🤝', title: { en: 'Web of Trust', fa: 'شبکه اعتماد' }, desc: { en: 'Join via invite-only codes shared by people you trust — no bots allowed.', fa: 'از طریق کدهای دعوت‌نامه از افراد مورد اعتماد بپیوندید — ربات مجاز نیست.' } },
    { icon: '🔐', title: { en: 'Privacy First', fa: 'اولویت با حریم خصوصی' }, desc: { en: 'No government ID required. Verify freely with institutional email or passkey.', fa: 'نیازی به شناسه دولتی نیست. با ایمیل دانشگاهی یا کلید تأیید کنید.' } },
];

export const RIGHT_FEATURES = [
    { icon: '⚖️', title: { en: 'Shadow Cabinet', fa: 'دولت سایه' }, desc: { en: 'Nominate and elect experts into sector roles using ranked-choice voting.', fa: 'کارشناسان را برای نقش‌های بخشی با رأی‌گیری ترجیحی منصوب و انتخاب کنید.' } },
    { icon: '🌍', title: { en: 'Diaspora Map', fa: 'نقشه دیاسپورا' }, desc: { en: 'See where Iranian voices are concentrated across the globe in real time.', fa: 'ببینید صداهای ایرانی در سراسر جهان کجا متمرکز شده‌اند.' } },
    { icon: '🏆', title: { en: 'Civic Score', fa: 'امتیاز مدنی' }, desc: { en: '3-tier system: higher score means more weight in governance votes.', fa: 'سیستم ۳ سطحی: امتیاز بالاتر یعنی وزن بیشتر در رأی‌گیری‌های حاکمیتی.' } },
    { icon: '🗺', title: { en: 'Blueprint Explorer', fa: 'کاوشگر طرح‌ها' }, desc: { en: 'Compare every proposed system of government side-by-side in detail.', fa: 'هر سیستم پیشنهادی حکومت را به طور مفصل در کنار هم مقایسه کنید.' } },
    { icon: '🔥', title: { en: 'Activity Grid', fa: 'شبکه فعالیت' }, desc: { en: '365-day contribution heatmap on your profile — like GitHub, but for democracy.', fa: 'نقشه حرارتی ۳۶۵ روزه مشارکت در پروفایل شما — مثل گیت‌هاب، برای دموکراسی.' } },
    { icon: '📜', title: { en: 'Permanent Constitution', fa: 'قانون اساسی دائمی' }, desc: { en: 'Phase 2 destination: a ratified post-collapse constitution built from the ground up.', fa: 'مرحله دوم: قانون اساسی دائمی پس از فروپاشی که از پایه ساخته می‌شود.' } },
];

function getMetrics() {
    const vw = window.innerWidth;
    if (vw < 640) {
        // Mobile: card nearly fills the viewport, showing a sliver of the next
        return { cardW: vw - 72, gap: 16 };
    }
    // Desktop: wider card, centered
    return { cardW: Math.min(480, Math.round(vw * 0.35)), gap: 24 };
}

export function FeatureSlider({ items }) {
    const { t, monoFont, headFont } = useLang();
    const total = items.length;

    const [metrics, setMetrics] = useState(getMetrics);
    const [current, setCurrent] = useState(() => Math.floor(total / 2));
    const [paused, setPaused]   = useState(false);

    // Update card dimensions on resize
    useEffect(() => {
        const onResize = () => setMetrics(getMetrics());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Auto-advance
    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setCurrent(c => (c + 1) % total), 4500);
        return () => clearInterval(id);
    }, [paused, total]);

    const go = idx => setCurrent(((idx % total) + total) % total);

    const cdist = i => {
        const d = i - current;
        if (d > total / 2) return d - total;
        if (d < -total / 2) return d + total;
        return d;
    };

    const { cardW, gap } = metrics;
    const trackStyle = {
        transform: `translateX(calc(50vw - ${cardW / 2}px - ${current * (cardW + gap)}px))`,
        gap: `${gap}px`,
    };

    return (
        <div
            className={`fs-slider${paused ? ' is-paused' : ''}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <button className="fs-slider-btn fs-slider-btn--prev" onClick={() => go(current - 1)} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>
            <button className="fs-slider-btn fs-slider-btn--next" onClick={() => go(current + 1)} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>

            <div className="fs-slider-viewport">
                <div className="fs-slider-track" style={trackStyle}>
                    {items.map((item, i) => {
                        const d = Math.abs(cdist(i));
                        return (
                            <div
                                key={i}
                                className={`fs-scard${d === 0 ? ' is-active' : ''}`}
                                style={{
                                    width:         `${cardW}px`,
                                    opacity:       d === 0 ? 1 : d === 1 ? 0.42 : 0.08,
                                    transform:     `scale(${d === 0 ? 1 : d === 1 ? 0.88 : 0.76})`,
                                    pointerEvents: d === 0 ? 'auto' : 'none',
                                }}
                            >
                                <span className="fs-scard-icon">{item.icon}</span>
                                <div className="fs-scard-body">
                                    <div className="fs-scard-title" style={{ fontFamily: monoFont }}>{t(item.title)}</div>
                                    <div className="fs-scard-desc" style={{ fontFamily: headFont }}>{t(item.desc)}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="fs-slider-dots">
                {items.map((_, i) => (
                    <button
                        key={i}
                        className={`fs-sdot${i === current ? ' is-active' : ''}`}
                        onClick={() => go(i)}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
