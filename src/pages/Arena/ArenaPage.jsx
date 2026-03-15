import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { useAuth } from '../../hooks/useAuth';
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
                                style={{ borderColor: plan.coverColor || '#4fc3f7' }}
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
                                    <p className="incubator-sig-label">
                                        {tKey('arena.signProgress', { count: count.toLocaleString(), threshold: threshold.toLocaleString() })}
                                    </p>
                                    <div className="incubator-progress-bar">
                                        <div className="incubator-progress-fill" style={{ width: `${pct}%` }} />
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
                    <Link to="/compare/transition" className="arena-featured-card" style={{ borderColor: '#4fc3f7' }}>
                        <span className="arena-featured-badge" style={{ color: '#4fc3f7', borderColor: '#4fc3f733' }}>{isRTL ? 'مقایسه' : 'COMPARE'}</span>
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
