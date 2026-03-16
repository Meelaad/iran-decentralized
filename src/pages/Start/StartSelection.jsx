import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import { supabase } from '../../lib/supabase';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch';
import { SHOW_VOTE_COUNTS } from '../../config';
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
    const { isRTL, t, lang, setLang } = useLang();
    const votes = useLiveVoteCounts();

    const blueprints = Object.values(BLUEPRINTS);

    return (
        <div className="ss-root" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="ss-bg-grid" />

            {/* Language switcher + theme toggle */}
            <div className="ss-lang">
                <ThemeSwitch />
                <button className={`ss-lang-btn${lang === 'fa' ? ' is-active' : ''}`} onClick={() => setLang('fa')} style={{ fontFamily: "'Vazirmatn', sans-serif" }}>فارسی</button>
                <button className={`ss-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => setLang('en')}>EN</button>
            </div>

            <header className="ss-header">
                <div className="ss-eyebrow">IRAN · DAO</div>
                <h1 className="ss-title">
                    {isRTL ? 'مسیر خود را انتخاب کنید' : 'Choose Your Path'}
                </h1>
                <p className="ss-sub">
                    {isRTL
                        ? 'دو مرحله‌ی تاریخی — انتقال و مقصد'
                        : 'Two historical phases — the transition and the destination'}
                </p>
            </header>

            <div className="ss-zones">
                {/* ── Zone 1: Pre-Collapse ───────────────────────────────── */}
                <div className="ss-zone ss-zone--pre">
                    <div className="ss-zone-header">
                        <span className="ss-zone-tag ss-zone-tag--pre">STAGE 1</span>
                        <h2 className="ss-zone-title">
                            {isRTL ? 'مرحله انتقال' : 'The Transition'}
                        </h2>
                        <p className="ss-zone-desc">
                            {isRTL
                                ? 'قبل از فروپاشی رژیم — طرح‌های انتقالی را مورد بحث و تأیید قرار دهید'
                                : 'Before regime collapse — debate and endorse transitional plans'}
                        </p>
                    </div>
                    <div className="ss-zone-links">
                        <Link to="/arena" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">⚡</span>
                            <div>
                                <div className="ss-link-title">
                                    {isRTL ? 'آرنای انتقال' : 'THE ARENA'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'طرح‌های فعال — تأیید و بحث' : 'Active plans — endorse & debate'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/transitional/plan/nufdi" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">📜</span>
                            <div>
                                <div className="ss-link-title">
                                    {isRTL ? 'طرح NUFDI' : 'NUFDI BLUEPRINT'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'سند مرجع کامل انتقال' : 'Full transitional reference document'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/pre" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">🗺</span>
                            <div>
                                <div className="ss-link-title">
                                    {isRTL ? 'مرور کلی پیش‌انتقال' : 'PRE-TRANSITION OVERVIEW'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'چهار مرحله انتقال' : 'The four phases of transition'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/compare/transition" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">⚖️</span>
                            <div>
                                <div className="ss-link-title">
                                    {isRTL ? 'مقایسه طرح‌های انتقالی' : 'COMPARE PLANS'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'مقایسه طرح‌های پیشنهادی برای دوره انتقال' : 'Compare suggested transitional blueprints'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/vote" className="ss-link ss-link--pre">
                            <span className="ss-link-icon">🗳</span>
                            <div>
                                <div className="ss-link-title">
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
                                <div className="ss-link-title">
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
                <div className="ss-zone ss-zone--post">
                    <div className="ss-zone-header">
                        <span className="ss-zone-tag ss-zone-tag--post">STAGE 2</span>
                        <h2 className="ss-zone-title">
                            {isRTL ? 'مقصد' : 'The Destination'}
                        </h2>
                        <p className="ss-zone-desc">
                            {isRTL
                                ? 'پس از فروپاشی — انتخاب سیستم دائمی حکومت'
                                : 'After regime collapse — choosing the permanent system of government'}
                        </p>
                    </div>
                    <div className="ss-zone-links">
                        <Link to="/destination" className="ss-link ss-link--post">
                            <span className="ss-link-icon">🏛</span>
                            <div>
                                <div className="ss-link-title">
                                    {isRTL ? 'مرکز مقصد' : 'DESTINATION HUB'}
                                </div>
                                <div className="ss-link-desc">
                                    {isRTL ? 'مرور طرح‌های حکومتی و آمار زنده' : 'Blueprint overview & live stats'}
                                </div>
                            </div>
                        </Link>
                        <Link to="/blueprint/gov/decentralized" className="ss-link ss-link--post">
                            <span className="ss-link-icon">🗺</span>
                            <div>
                                <div className="ss-link-title">
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
                                <div className="ss-link-title">
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
                                <div className="ss-link-title">
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
                            <div className="ss-vote-summary-label">
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
                                        <span className="ss-vote-pct">{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="ss-footer">
                <Link to="/" className="ss-back">← {isRTL ? 'بازگشت' : 'Back'}</Link>
            </div>
        </div>
    );
}
