import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import { supabase } from '../../lib/supabase';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch';
import { SHOW_VOTE_COUNTS } from '../../config';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { FeatureSlider, RIGHT_FEATURES } from '../../components/FeatureSlider/FeatureSlider';
import './StartSelection.css';

function useLiveVoteCounts() {
    const [votes, setVotes] = useState({});
    useEffect(() => {
        supabase.rpc('get_blueprint_vote_counts').then(({ data }) => {
            const map = {};
            for (const row of data ?? []) map[row.blueprint_id] = Number(row.votes);
            setVotes(map);
        });
    }, []);
    return votes;
}

export default function StartSelection() {
    const { isRTL, t, lang, setLang, monoFont, headFont } = useLang();
    const votes = useLiveVoteCounts();
    const [activeStage, setActiveStage] = useState(1);
    const [menuOpen, setMenuOpen] = useState(false);

    const blueprints = Object.values(BLUEPRINTS);

    return (
        <div className="ss-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <div className="ss-bg-grid" style={{ viewTransitionName: 'standalone-bg' }} />

            {/* Language switcher + theme toggle */}
            {/* <div className="ss-lang" style={{ viewTransitionName: 'standalone-topbar' }}>
                <ThemeSwitch />
                <button className={`ss-lang-btn${lang === 'fa' ? ' is-active' : ''}`} onClick={() => setLang('fa')} style={{ fontFamily: headFont }}>فارسی</button>
                <button className={`ss-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => setLang('en')}>EN</button>
            </div> */}

            {/* Mobile menu button */}
            {/* <div className="ss-mobile-menu">
                <button className="ss-mobile-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
                    {menuOpen
                        ? <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" /></svg>
                        : <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" /></svg>
                    }
                </button>
                {menuOpen && (
                    <div className="ss-mobile-menu-dropdown">
                        <ThemeSwitch />
                        <div className="ss-mobile-lang">
                            <button className={`ss-lang-btn${lang === 'fa' ? ' is-active' : ''}`} onClick={() => { setLang('fa'); setMenuOpen(false); }} style={{ fontFamily: headFont }}>فارسی</button>
                            <button className={`ss-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => { setLang('en'); setMenuOpen(false); }}>EN</button>
                        </div>
                    </div>
                )}
            </div> */}

            <header className="ss-header">
                <BrandMark size="sm" />
                <h1 className="ss-title">
                    {isRTL ? 'مسیر خود را انتخاب کنید' : 'Choose Your Path'}
                </h1>
                <p className="ss-sub">
                    {isRTL
                        ? 'دو مرحله‌ی تاریخی — گذار و مقصدنهایی'
                        : 'Two historical phases — the transition and the destination'}
                </p>
            </header>

            {/* ── Mobile stage switcher — pill segmented (hidden on desktop) ── */}
            <div className="ss-stage-tabs">
                <div className="ss-pill-track">
                    <div className={`ss-pill-thumb${activeStage === 1 ? ' left' : ' right'}`} />
                    <button
                        className={`ss-pill-btn${activeStage === 1 ? ' is-active' : ''}`}
                        onClick={() => setActiveStage(1)}
                        style={{ fontFamily: headFont }}
                    >
                        {isRTL ? 'مرحله گذار' : 'The Transition'}
                    </button>
                    <button
                        className={`ss-pill-btn${activeStage === 2 ? ' is-active' : ''}`}
                        onClick={() => setActiveStage(2)}
                        style={{ fontFamily: headFont }}
                    >
                        {isRTL ? 'دولت مقصد' : 'The Destination'}
                    </button>
                </div>
            </div>

            <div className="ss-zones">
                {/* ── Zone 1: Pre-Collapse ───────────────────────────────── */}
                <div className={`ss-zone ss-zone--pre${activeStage !== 1 ? ' ss-zone--inactive' : ''}`}>
                    <div className="ss-zone-header">
                        <h2 className="ss-zone-title">
                            {isRTL ? 'مرحله گذار' : 'The Transition'}
                        </h2>
                        <p className="ss-zone-desc">
                            {isRTL
                                ? 'قبل از فروپاشی رژیم طرح‌های انتقالی را مورد بحث و تأیید قرار دهید'
                                : 'Before regime collapse — debate and endorse transitional plans'}
                        </p>
                    </div>
                    <div className="ss-zone-links">
                        <Link to="/arena" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">⚡</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'گودِ گذار' : 'THE ARENA'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'طرح‌های فعال — تأیید و بحث' : 'Active plans — endorse & debate'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/plans" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">📜</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'طرح های پیشنهادی ' : 'PROPOSED BLUEPRINTS'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'سندهای کامل پیشنهادی فعال دوره گذار' : 'Proposed transitional state reference documents'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/pre" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">🗺</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'مرور کلی پیش‌انتقال' : 'PRE-TRANSITION OVERVIEW'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'چهار مرحله گذار' : 'The four phases of transition'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/compare/transition" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">⚖️</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'مقایسه طرح‌های گذار' : 'COMPARE PLANS'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'مقایسه طرح‌های پیشنهادی برای دوره گذار' : 'Compare suggested transitional blueprints'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/vote" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">🗳</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'رأی‌گیری' : 'VOTE'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'پلتفرم مستقل رأی‌گیری امن' : 'Independent secure voting platform'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/global" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">🌍</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'نقشه جهانی' : 'GLOBAL MAP'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'توزیع اعضا و فعالیت در سراسر جهان' : 'Member distribution and activity worldwide'}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* ── Zone 2: Post-Collapse ──────────────────────────────── */}
                <div className={`ss-zone ss-zone--post${activeStage !== 2 ? ' ss-zone--inactive' : ''}`}>
                    <div className="ss-zone-header">
                        <h2 className="ss-zone-title">
                            {isRTL ? 'دولت مقصد' : 'The Destination'}
                        </h2>
                        <p className="ss-zone-desc">
                            {isRTL
                                ? 'پس از فروپاشی انتخاب سیستم دائمی حکومت'
                                : 'After regime collapse — choosing the permanent system of government'}
                        </p>
                    </div>
                    <div className="ss-zone-links">
                        <Link to="/destination" className="ss-link ss-link--post">
                            <span className="ss-link-icon">🏛</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'مرکز دولت مقصد' : 'DESTINATION HUB'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'مرور طرح‌های حکومتی و آمار زنده' : 'Blueprint overview & live stats'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/blueprint/gov/decentralized" className="ss-link ss-link--post">
                            <span className="ss-link-icon">🗺</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'نمایش نقشه' : 'MAP VIEW'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'معماری بصری طرح‌های حکومتی' : 'Visual architecture of governance blueprints'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/compare" className="ss-link ss-link--post">
                            <span className="ss-link-icon">⚖️</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'مقایسه طرح‌ها' : 'COMPARE'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'مقایسه جانبی مدل‌های حکومتی' : 'Side-by-side governance model comparison'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/vote" className="ss-link ss-link--post">
                            <span className="ss-link-icon">🗳</span>
                            <div>
                                <div className="ss-link-title" style={{ fontFamily: monoFont }}>
                                    {isRTL ? 'رأی دهید' : 'VOTE'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'انتخاب طرح مورد نظر شما' : 'Cast your blueprint preference'}
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Live blueprint vote mini-summary */}
                    {SHOW_VOTE_COUNTS && Object.keys(votes).length > 0 && (
                        <div className="ss-vote-summary">
                            <div className="ss-vote-summary-label" style={{ fontFamily: monoFont }}>
                                {isRTL ? 'آمار زنده رأی' : 'LIVE VOTE SNAPSHOT'}
                            </div>
                            {blueprints.slice(0, 3).map(bp => {
                                const count = votes[bp.id] ?? 0;
                                const total = Object.values(votes).reduce((a, b) => a + b, 0);
                                const pct = total ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={bp.id} className="ss-vote-row">
                                        <span className="ss-vote-name">{t(bp.name)}</span>
                                        <div className="ss-vote-bar-wrap">
                                            <div className="ss-vote-bar" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="ss-vote-pct" style={{ fontFamily: monoFont }}>{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="ss-footer">
                <Link to="/" className="ss-back" style={{ fontFamily: monoFont }}>← {isRTL ? 'بازگشت به نحوه دسترسی' : 'Back to access mode'}</Link>
            </div>

            <FeatureSlider items={RIGHT_FEATURES} />
        </div>
    );
}
