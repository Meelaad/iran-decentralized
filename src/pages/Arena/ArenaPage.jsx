import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { useAuth } from '../../hooks/useAuth';
import { SHOW_VOTE_COUNTS } from '../../config';
import {
    useArenaPlans,
    useStatsOverview,
    useEndorsePlan,
    useSignPlan,
} from '../../hooks/usePlans';
import PlanStockGraph from '../../components/PlanStockGraph/PlanStockGraph';
import ConsensusMeter from '../../components/ConsensusMeter/ConsensusMeter';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { PageMeta } from '../../components/PageMeta/PageMeta';
import './ArenaPage.css';

export default function ArenaPage() {
    const { tKey, isRTL } = useLang();
    const { session } = useAuth();
    const { data: plans = [], isLoading, isError } = useArenaPlans();
    const { data: overview = {} } = useStatsOverview();
    const endorseMutation = useEndorsePlan();
    const signMutation = useSignPlan();
    const [endorsedIds, setEndorsedIds] = useState(new Set());
    const [signedIds, setSignedIds] = useState(new Set());

    const arenaPlans = plans.filter(p => p.status === 'arena' || !p.status);
    const incubatorPlans = plans.filter(p => p.status === 'incubator');

    async function handleEndorse(planId) {
        if (!session) { alert(tKey('arena.loginToEndorse')); return; }
        try {
            await endorseMutation.mutateAsync({ planId });
            setEndorsedIds(prev => new Set([...prev, planId]));
        } catch (e) {
            alert(e.message || tKey('arena.endorseError'));
        }
    }

    async function handleSign(planId) {
        if (!session) { alert(tKey('arena.loginToEndorse')); return; }
        try {
            await signMutation.mutateAsync({ planId });
            setSignedIds(prev => new Set([...prev, planId]));
        } catch (e) {
            alert(e.message || tKey('arena.endorseError'));
        }
    }

    return (
        <div className="arena-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <PageMeta
                title={isRTL ? 'آرنای انتقال' : 'The Arena'}
                description={isRTL ? 'طرح‌های انتقالی فعال — تأیید و بحث' : 'Active transitional plans — endorse, debate, and shape Iran\'s future.'}
                lang={isRTL ? 'fa' : 'en'}
            />
            <header className="arena-hero">
                <p className="arena-hero-kicker">{tKey('arena.heroKicker')}</p>
                <h1 className="arena-hero-title">{tKey('arena.heroTitle')}</h1>
                <p className="arena-hero-sub">{tKey('arena.heroSub')}</p>
            </header>

            <section className="arena-top">
                <ConsensusMeter
                    totalUsers={overview.totalUsers || 0}
                    totalEndorsed={overview.totalEndorsed || 0}
                    targetPct={0.67}
                />
                {arenaPlans.length > 0 && (
                    <div className="arena-graph">
                        <PlanStockGraph
                            plans={arenaPlans.map(p => ({
                                id: p.id,
                                coverColor: p.coverColor,
                                stats: p.stats || [],
                                name: p.name,
                            }))}
                        />
                    </div>
                )}
            </section>

            {/* Arena plan cards */}
            <section className="arena-section">
                {isLoading && <Skeleton lines={3} />}
                {isError && <p className="arena-error">{tKey('common.error')}</p>}
                {!isLoading && !isError && arenaPlans.length === 0 && (
                    <EmptyState title={tKey('arena.noPlans')} />
                )}
                <div className="arena-grid">
                    {arenaPlans.map(plan => {
                        const endorsementCount = plan.latestStats?.endorsement_count || 0;
                        const delta = plan.latestStats?.endorsement_delta || 0;
                        const isEndorsed = endorsedIds.has(plan.id);
                        return (
                            <article
                                key={plan.id}
                                className="plan-card"
                                style={{ borderColor: plan.coverColor || '#8B5CF6' }}
                            >
                                {plan.isOfficial && (
                                    <span className="plan-official-badge">{tKey('plan.officialBadge')}</span>
                                )}
                                <h3 className="plan-card-name">
                                    {plan.name?.fa && isRTL ? plan.name.fa : plan.name?.en || plan.slug}
                                </h3>
                                <p className="plan-card-summary">
                                    {isRTL ? plan.summary?.fa : plan.summary?.en}
                                </p>
                                {SHOW_VOTE_COUNTS && (
                                    <div className="plan-card-meta">
                                        <span>
                                            {tKey('arena.planEndorsements')}: <strong>{endorsementCount.toLocaleString()}</strong>
                                            {delta > 0 && (
                                                <span className="plan-delta">
                                                    {tKey('arena.planDelta', { n: delta.toLocaleString() })}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="plan-card-actions">
                                    <Link className="plan-view-btn" to={`/arena/${plan.slug}`}>
                                        {tKey('arena.viewPlan')}
                                    </Link>
                                    <button
                                        className={`plan-endorse-btn ${isEndorsed ? 'is-endorsed' : ''}`}
                                        onClick={() => handleEndorse(plan.id)}
                                        disabled={isEndorsed || endorseMutation.isPending}
                                    >
                                        {isEndorsed ? tKey('arena.endorsed') : tKey('arena.endorse')}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* Incubator section */}
            {incubatorPlans.length > 0 && (
                <section className="arena-section arena-incubator">
                    <h2 className="arena-section-title">{tKey('arena.incubatorTitle')}</h2>
                    <p className="arena-section-sub">
                        {tKey('arena.incubatorSub', { n: 10000 })}
                    </p>
                    <div className="incubator-grid">
                        {incubatorPlans.map(plan => {
                            const count = plan.signatureCount || 0;
                            const threshold = plan.signatureThreshold || 10000;
                            const pct = Math.min(100, Math.round((count / threshold) * 100));
                            const isSigned = signedIds.has(plan.id);
                            return (
                                <article key={plan.id} className="incubator-card">
                                    <h3 className="incubator-card-name">
                                        {isRTL ? plan.name?.fa : plan.name?.en || plan.slug}
                                    </h3>
                                    {SHOW_VOTE_COUNTS && (
                                        <p className="incubator-sig-label">
                                            {tKey('arena.signProgress', { count: count.toLocaleString(), threshold: threshold.toLocaleString() })}
                                        </p>
                                    )}
                                    <div className="incubator-progress-bar">
                                        <div className="incubator-progress-fill" style={{ width: SHOW_VOTE_COUNTS ? `${pct}%` : '0%' }} />
                                    </div>
                                    <button
                                        className={`incubator-sign-btn ${isSigned ? 'is-signed' : ''}`}
                                        onClick={() => handleSign(plan.id)}
                                        disabled={isSigned || signMutation.isPending}
                                    >
                                        {isSigned ? tKey('arena.signed') : tKey('arena.sign')}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Featured reference plans */}
            <section className="arena-section arena-featured">
                <h2 className="arena-section-title">{isRTL ? 'طرح‌های مرجع' : 'REFERENCE PLANS'}</h2>
                <p className="arena-section-sub">{isRTL ? 'طرح‌های مستند و تحلیل‌شده برای دوران انتقال' : 'Documented and analysed transitional frameworks'}</p>
                <div className="arena-featured-grid">
                    <Link to="/transitional/plan/mirhosein-mousavi" className="arena-featured-card" style={{ borderColor: '#69d98c' }}>
                        <span className="arena-featured-badge" style={{ color: '#69d98c', borderColor: '#69d98c33' }}>{isRTL ? 'طرح فعال' : 'ACTIVE PLAN'}</span>
                        <div className="arena-featured-name">{isRTL ? 'موسوی — «برای نجات ایران»' : 'Mousavi — "To Save Iran"'}</div>
                        <div className="arena-featured-meta">{isRTL ? 'میر حسین موسوی · فوریه ۲۰۲۳' : 'Mir Hossein Mousavi · Feb 2023'}</div>
                        <div className="arena-featured-cta">{isRTL ? 'مشاهده تحلیل کامل ←' : 'VIEW FULL ANALYSIS →'}</div>
                    </Link>
                    <Link to="/transitional/plan/nufdi" className="arena-featured-card" style={{ borderColor: '#7c72e8' }}>
                        <span className="arena-featured-badge" style={{ color: '#7c72e8', borderColor: '#7c72e833' }}>{isRTL ? 'سند مرجع' : 'REFERENCE DOC'}</span>
                        <div className="arena-featured-name">{isRTL ? 'طرح NUFDI' : 'NUFDI Blueprint'}</div>
                        <div className="arena-featured-meta">{isRTL ? 'جبهه ملی متحد دموکرات‌های ایران' : 'National United Front of Democrats of Iran'}</div>
                        <div className="arena-featured-cta">{isRTL ? 'مشاهده سند ←' : 'VIEW DOCUMENT →'}</div>
                    </Link>
                    <Link to="/transitional/plan/itc" className="arena-featured-card" style={{ borderColor: '#ff9a42' }}>
                        <span className="arena-featured-badge" style={{ color: '#ff9a42', borderColor: '#ff9a4233' }}>{isRTL ? 'سند مرجع' : 'REFERENCE DOC'}</span>
                        <div className="arena-featured-name">{isRTL ? 'شورای انتقال ایران (ITC)' : 'Iran Transition Council (ITC)'}</div>
                        <div className="arena-featured-meta">{isRTL ? 'دولت سایه و واحد برنامه‌ریزی انتقالی · ۲۰۱۹' : 'Shadow Government & Transitional Planning Unit · 2019'}</div>
                        <div className="arena-featured-cta">{isRTL ? 'مشاهده سند ←' : 'VIEW DOCUMENT →'}</div>
                    </Link>
                    <Link to="/transitional/plan/cpild" className="arena-featured-card" style={{ borderColor: '#f59e0b' }}>
                        <span className="arena-featured-badge" style={{ color: '#f59e0b', borderColor: '#f59e0b33' }}>{isRTL ? 'سند مرجع' : 'REFERENCE DOC'}</span>
                        <div className="arena-featured-name">{isRTL ? 'حزب مشروطه ایران (لیبرال دموکرات)' : 'Constitutionalist Party of Iran (CPILD)'}</div>
                        <div className="arena-featured-meta">{isRTL ? 'حزب مشروطه ایران — لیبرال دموکرات' : 'Constitutionalist Party of Iran — Liberal Democrat'}</div>
                        <div className="arena-featured-cta">{isRTL ? 'مشاهده سند ←' : 'VIEW DOCUMENT →'}</div>
                    </Link>
                    <Link to="/transitional/plan/jmi" className="arena-featured-card" style={{ borderColor: '#e8c840' }}>
                        <span className="arena-featured-badge" style={{ color: '#e8c840', borderColor: '#e8c84033' }}>{isRTL ? 'سند مرجع' : 'REFERENCE DOC'}</span>
                        <div className="arena-featured-name">{isRTL ? 'جبهه ملی ایران (JMI)' : 'Jebhe Melli Iran (JMI)'}</div>
                        <div className="arena-featured-meta">{isRTL ? 'جبهه ملی ایران · تأسیس ۱۹۴۹ توسط دکتر مصدق' : 'National Front of Iran · Founded 1949 by Dr. Mossadegh'}</div>
                        <div className="arena-featured-cta">{isRTL ? 'مشاهده سند ←' : 'VIEW DOCUMENT →'}</div>
                    </Link>
                    <Link to="/transitional/plan/cpfik" className="arena-featured-card" style={{ borderColor: '#26d9b2' }}>
                        <span className="arena-featured-badge" style={{ color: '#26d9b2', borderColor: '#26d9b233' }}>{isRTL ? 'عملیات فعال' : 'ACTIVE OPS'}</span>
                        <div className="arena-featured-name">{isRTL ? 'CPFIK — طرح فدرال کردستان' : 'CPFIK — Kurdish Federal Blueprint'}</div>
                        <div className="arena-featured-meta">{isRTL ? 'ائتلاف نیروهای سیاسی کردستان ایران · ۲۰۲۶' : 'Coalition of Political Forces of Iranian Kurdistan · 2026'}</div>
                        <div className="arena-featured-cta">{isRTL ? 'مشاهده سند ←' : 'VIEW DOCUMENT →'}</div>
                    </Link>
                    <Link to="/transitional/plan/uri" className="arena-featured-card" style={{ borderColor: '#e8507a' }}>
                        <span className="arena-featured-badge" style={{ color: '#e8507a', borderColor: '#e8507a33' }}>{isRTL ? 'ائتلاف فعال' : 'ACTIVE COALITION'}</span>
                        <div className="arena-featured-name">{isRTL ? 'ائتلاف URI / همگامی' : 'URI / Hamgami Coalition'}</div>
                        <div className="arena-featured-meta">{isRTL ? 'جمهوری‌خواهان متحد ایران · تأسیس ۲۰۰۴' : 'United Republicans of Iran · Founded 2004'}</div>
                        <div className="arena-featured-cta">{isRTL ? 'مشاهده سند ←' : 'VIEW DOCUMENT →'}</div>
                    </Link>
                    <Link to="/transitional/plan/civil-society" className="arena-featured-card" style={{ borderColor: '#ffd166' }}>
                        <span className="arena-featured-badge" style={{ color: '#ffd166', borderColor: '#ffd16633' }}>{isRTL ? 'سند مرجع' : 'REFERENCE DOC'}</span>
                        <div className="arena-featured-name">{isRTL ? 'منشور جامعه مدنی ایران' : 'Iran Civil Society Charter'}</div>
                        <div className="arena-featured-meta">{isRTL ? 'شبکه پژوهش و حمایت جامعه مدنی' : 'Civil Society Research & Advocacy Network'}</div>
                        <div className="arena-featured-cta">{isRTL ? 'مشاهده سند ←' : 'VIEW DOCUMENT →'}</div>
                    </Link>
                    <Link to="/compare/transition" className="arena-featured-card" style={{ borderColor: '#8B5CF6' }}>
                        <span className="arena-featured-badge" style={{ color: '#8B5CF6', borderColor: '#8B5CF633' }}>{isRTL ? 'مقایسه' : 'COMPARE'}</span>
                        <div className="arena-featured-name">{isRTL ? 'مقایسه طرح‌های انتقالی' : 'Compare All Plans'}</div>
                        <div className="arena-featured-meta">{isRTL ? 'مقایسه جانبی طرح‌های پیشنهادی' : 'Side-by-side comparison of suggested frameworks'}</div>
                        <div className="arena-featured-cta">{isRTL ? 'مقایسه ←' : 'COMPARE →'}</div>
                    </Link>
                </div>
            </section>

            {/* Submit plan CTA — shown only to logged-in users */}
            {session && (
                <section className="arena-section arena-submit-cta">
                    <h2 className="arena-section-title">{tKey('arena.submitTitle')}</h2>
                    <p className="arena-section-sub">{tKey('arena.submitSub')}</p>
                    <Link className="arena-submit-btn" to="/arena/submit">
                        {tKey('arena.submitCTA')}
                    </Link>
                </section>
            )}
        </div>
    );
}
