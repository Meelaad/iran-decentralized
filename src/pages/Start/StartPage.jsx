import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import './StartPage.css';

function useLiveStats() {
    const [stats, setStats] = useState(null);
    useEffect(() => {
        Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('transitional_plans').select('*', { count: 'exact', head: true }).eq('status', 'arena'),
            supabase.from('votes').select('*', { count: 'exact', head: true }),
        ]).then(([users, plans, votes]) => {
            setStats({
                users: users.count ?? 0,
                plans: plans.count ?? 0,
                votes: votes.count ?? 0,
            });
        }).catch(() => {}); // graceful — stats bar is non-critical
    }, []);
    return stats;
}

// ─── Feature panels data ─────────────────────────────────────────────────────
const LEFT_FEATURES = [
    { icon: '🏛', title: { en: 'Transitional Plans', fa: 'طرح‌های انتقالی' }, desc: { en: 'Endorse real frameworks like the Mahsa Charter already active on the Main Stage.', fa: 'طرح‌های واقعی مانند منشور مهسا را بر روی صحنه اصلی تأیید کنید.' } },
    { icon: '🗳', title: { en: 'Amendment Floor', fa: 'کف اصلاحات' }, desc: { en: 'Propose and vote on line-item edits to any active plan in real time.', fa: 'پیشنهاد و رأی‌گیری برای تغییرات خط‌به‌خط در طرح‌های فعال.' } },
    { icon: '🌱', title: { en: 'Plan Incubator', fa: 'پرورشگاه طرح' }, desc: { en: 'New grassroots plans earn a Main Stage spot after 10,000 verified signatures.', fa: 'طرح‌های جدید مردمی پس از ۱۰,۰۰۰ امضای تأیید‌شده به صحنه اصلی می‌رسند.' } },
    { icon: '📈', title: { en: 'Live Consensus', fa: 'اجماع زنده' }, desc: { en: 'Stock-style graphs track daily momentum shifts across all competing plans.', fa: 'نمودارهای سهام‌وار تغییرات روزانه اجماع در تمام طرح‌ها را نشان می‌دهند.' } },
    { icon: '🤝', title: { en: 'Web of Trust', fa: 'شبکه اعتماد' }, desc: { en: 'Join via invite-only codes shared by people you trust — no bots allowed.', fa: 'از طریق کدهای دعوت‌نامه از افراد مورد اعتماد بپیوندید — ربات مجاز نیست.' } },
    { icon: '🔐', title: { en: 'Privacy First', fa: 'حریم خصوصی اول' }, desc: { en: 'No government ID required. Verify freely with institutional email or passkey.', fa: 'نیازی به شناسه دولتی نیست. با ایمیل دانشگاهی یا کلید تأیید کنید.' } },
];

const RIGHT_FEATURES = [
    { icon: '⚖️', title: { en: 'Shadow Cabinet', fa: 'کابینه سایه' }, desc: { en: 'Nominate and elect experts into sector roles using ranked-choice voting.', fa: 'کارشناسان را برای نقش‌های بخشی با رأی‌گیری ترجیحی منصوب و انتخاب کنید.' } },
    { icon: '🌍', title: { en: 'Diaspora Map', fa: 'نقشه دیاسپورا' }, desc: { en: 'See where Iranian voices are concentrated across the globe in real time.', fa: 'ببینید صداهای ایرانی در سراسر جهان کجا متمرکز شده‌اند.' } },
    { icon: '🏆', title: { en: 'Civic Score', fa: 'امتیاز مدنی' }, desc: { en: '3-tier system: higher score means more weight in governance votes.', fa: 'سیستم ۳ سطحی: امتیاز بالاتر یعنی وزن بیشتر در رأی‌گیری‌های حاکمیتی.' } },
    { icon: '🗺', title: { en: 'Blueprint Explorer', fa: 'کاوشگر طرح‌ها' }, desc: { en: 'Compare every proposed system of government side-by-side in detail.', fa: 'هر سیستم پیشنهادی حکومت را به طور مفصل در کنار هم مقایسه کنید.' } },
    { icon: '🔥', title: { en: 'Activity Grid', fa: 'شبکه فعالیت' }, desc: { en: '365-day contribution heatmap on your profile — like GitHub, but for democracy.', fa: 'نقشه حرارتی ۳۶۵ روزه مشارکت در پروفایل شما — مثل گیت‌هاب، برای دموکراسی.' } },
    { icon: '📜', title: { en: 'Permanent Constitution', fa: 'قانون اساسی دائمی' }, desc: { en: 'Phase 2 destination: a ratified post-collapse constitution built from the ground up.', fa: 'مرحله دوم: قانون اساسی دائمی پس از فروپاشی که از پایه ساخته می‌شود.' } },
];

// ─── Auto-scrolling column ────────────────────────────────────────────────────
function FeatureColumn({ items, reverse }) {
    const { t } = useLang();
    // Duplicate for seamless infinite scroll
    const doubled = [...items, ...items];

    return (
        <div className={`sp-col ${reverse ? 'sp-col--rev' : ''}`}>
            <div className={`sp-col-track ${reverse ? 'sp-col-track--rev' : ''}`}>
                {doubled.map((f, i) => (
                    <div key={i} className="sp-card">
                        <span className="sp-card-icon">{f.icon}</span>
                        <div>
                            <div className="sp-card-title">{t(f.title)}</div>
                            <div className="sp-card-desc">{t(f.desc)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Hex logo with rotating ring + pulse ─────────────────────────────────────
function LogoMark() {
    return (
        <div className="sp-logo-wrap">
            {/* outer rotating ring */}
            <svg className="sp-logo-ring" viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4fc3f7" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#7c72e8" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#4fc3f7" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon
                    points="60,4 112,32 112,88 60,116 8,88 8,32"
                    fill="none"
                    stroke="url(#ringGrad)"
                    strokeWidth="1.5"
                />
            </svg>

            {/* inner hex body */}
            <div className="sp-logo-hex">
                <svg viewBox="0 0 100 100" className="sp-logo-hex-svg">
                    <polygon
                        points="50,4 96,27 96,73 50,96 4,73 4,27"
                        fill="rgba(7,16,26,0.96)"
                        stroke="rgba(79,195,247,0.35)"
                        strokeWidth="1"
                    />
                </svg>
                <div className="sp-logo-inner">
                    <span className="sp-logo-en">IranDAO</span>
                    <span className="sp-logo-fa">ایران دائو</span>
                </div>
            </div>

            {/* glow pulse */}
            <div className="sp-logo-pulse" />
            <div className="sp-logo-pulse sp-logo-pulse--2" />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StartPage() {
    const { isRTL } = useLang();
    const navigate = useNavigate();
    const stats = useLiveStats();

    return (
        <div className="sp-root" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Scanline + grid bg */}
            <div className="sp-bg-grid" />
            <div className="sp-scanline" />

            {/* Three-column layout */}
            <div className="sp-stage">
                <FeatureColumn items={LEFT_FEATURES} reverse={false} />

                {/* Centre column */}
                <div className="sp-center">
                    <div className="sp-eyebrow">IRAN · DAO</div>
                    <LogoMark />
                    <p className="sp-tagline">
                        {isRTL
                            ? 'اتحاد ایرانیان برای تعیین سرنوشت سیاسی خود'
                            : 'Unite the diaspora. Build the future.'}
                    </p>
                    <button
                        className="sp-cta"
                        onClick={() => navigate('/choose')}
                    >
                        {isRTL ? 'شروع سفر سیاسی' : 'Begin Your Journey'}
                        <svg className="sp-cta-arrow" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="sp-hint">
                        {isRTL ? 'ورود با کد دعوت' : 'Entry via invite code'}
                    </div>
                    {stats && (
                        <div className="sp-stats">
                            <span>{stats.users.toLocaleString()} {isRTL ? 'ایرانی ثبت‌نام کرده' : 'Iranians registered'}</span>
                            <span className="sp-stats-dot">·</span>
                            <span>{stats.plans} {isRTL ? 'طرح فعال' : 'active plans'}</span>
                            <span className="sp-stats-dot">·</span>
                            <span>{stats.votes.toLocaleString()} {isRTL ? 'رأی' : 'votes cast'}</span>
                        </div>
                    )}
                </div>

                <FeatureColumn items={RIGHT_FEATURES} reverse={true} />
            </div>
        </div>
    );
}
