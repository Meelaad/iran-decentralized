import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { useAuth } from '../../hooks/useAuth';
import { SHOW_VOTE_COUNTS } from '../../config';

import {
    useArenaPlans,
    useStatsOverview,
    useEndorsePlan,
    useSignPlan,
    useUserEndorsement,
} from '../../hooks/usePlans';
import PlanStockGraph from '../../components/PlanStockGraph/PlanStockGraph';
import ConsensusMeter from '../../components/ConsensusMeter/ConsensusMeter';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { PageMeta } from '../../components/PageMeta/PageMeta';
import './ArenaPage.css';
import CONTENT from '../../locales/pages/arena.json';

export default function ArenaPage() {
    const { t, tKey, isRTL, monoFont, headFont } = useLang();
    const { session } = useAuth();
    const userId = session?.user?.id;
    const { data: plans = [], isLoading, isError } = useArenaPlans();
    const { data: overview = {} } = useStatsOverview();
    const { data: savedVotePlanId } = useUserEndorsement(userId);
    const endorseMutation = useEndorsePlan();
    const signMutation = useSignPlan();
    const [myVotePlanId, setMyVotePlanId] = useState(undefined);
    const [signedIds, setSignedIds] = useState(new Set());

    // Use DB value until user casts a new vote in this session
    const currentVotePlanId = myVotePlanId !== undefined ? myVotePlanId : (savedVotePlanId ?? null);

    const arenaPlans = plans.filter(p => p.status === 'arena' || !p.status);
    const incubatorPlans = plans.filter(p => p.status === 'incubator');

    const rateLimitMsg = t(CONTENT.rateLimitMsg);


    async function handleVote(planId) {
        if (!session) {
            Swal.fire({
                title: tKey('arena.loginTitle'),
                text: tKey('arena.loginToEndorse'),
                icon: 'info',
                confirmButtonText: tKey('arena.understoodBtn'),
                confirmButtonColor: '#8B5CF6'
            });
            return;
        }
        if (planId === currentVotePlanId) return; // already voted for this one
        try {
            await endorseMutation.mutateAsync({ planId });
            setMyVotePlanId(planId);
        } catch (e) {
            const isRateLimit = e.status === 429;
            Swal.fire({
                title: isRateLimit ? tKey('arena.limitTitle') : tKey('arena.errorTitle'),
                text: isRateLimit ? rateLimitMsg : (e.message || tKey('arena.endorseError')),
                icon: isRateLimit ? 'warning' : 'error',
                confirmButtonText: tKey('arena.closeBtn'),
                confirmButtonColor: '#8B5CF6'
            });
        }
    }

    async function handleSign(planId) {
        if (!session) {
            Swal.fire({
                title: tKey('arena.loginTitle'),
                text: tKey('arena.loginToEndorse'),
                icon: 'info',
                confirmButtonText: tKey('arena.understoodBtn'), // Matches JSON
                confirmButtonColor: '#8B5CF6' // irdao brand color
            });
            return;
        }
        try {
            await signMutation.mutateAsync({ planId });
            setSignedIds(prev => new Set([...prev, planId]));
        } catch (e) {
            alert(e.status === 429 ? rateLimitMsg : (e.message || tKey('arena.endorseError')));
        }
    }

    return (
        <div className="arena-page" dir={isRTL ? 'rtl' : 'ltr'}>
            <PageMeta
                title={t(CONTENT.metaTitle)}
                description={t(CONTENT.metaDescription)}
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
                {currentVotePlanId && (
                    <p className="arena-vote-hint">{tKey('arena.changeVotePlan')}</p>
                )}
                <div className="arena-grid">
                    {arenaPlans.map(plan => {
                        const endorsementCount = plan.latestStats?.endorsement_count || 0;
                        const delta = plan.latestStats?.endorsement_delta || 0;
                        const isMyVote = plan.id === currentVotePlanId;
                        return (
                            <article
                                key={plan.id}
                                className={`plan-card${isMyVote ? ' plan-card--voted' : ''}`}
                                style={{ borderColor: plan.coverColor || '#8B5CF6' }}
                            >
                                {plan.isOfficial && (
                                    <span className="plan-official-badge">{tKey('plan.officialBadge')}</span>
                                )}
                                {isMyVote && (
                                    <span className="plan-your-vote-badge">{tKey('arena.voted')}</span>
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
                                        className={`plan-vote-btn${isMyVote ? ' is-voted' : ''}`}
                                        onClick={() => handleVote(plan.id)}
                                        disabled={isMyVote || endorseMutation.isPending}
                                    >
                                        {isMyVote ? tKey('arena.voted') : tKey('arena.vote')}
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
                                    {SHOW_VOTE_COUNTS && (
                                        <div className="incubator-progress-bar">
                                            <div className="incubator-progress-fill" style={{ width: `${pct}%` }} />
                                        </div>
                                    )}
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

            {/* Compare all plans — above reference grid */}
            <section className="arena-section arena-compare-cta">
                <Link to="/compare/transition" className="arena-compare-banner">
                    <span className="arena-compare-banner-label" style={{ fontFamily: monoFont }}>{t(CONTENT.compareLabel)}</span>
                    <span className="arena-compare-banner-title" style={{ fontFamily: headFont }}>{t(CONTENT.compareTitle)}</span>
                    <span className="arena-compare-banner-sub" style={{ fontFamily: headFont }}>{t(CONTENT.compareSub)}</span>
                    <span className="arena-compare-banner-cta" style={{ fontFamily: monoFont }}>{t(CONTENT.compareCTA)}</span>
                </Link>
            </section>

            {/* Featured reference plans */}
            <section className="arena-section arena-featured">
                <h2 className="arena-section-title">{t(CONTENT.referencePlansTitle)}</h2>
                <p className="arena-section-sub">{t(CONTENT.referencePlansSub)}</p>
                <div className="arena-featured-grid">
                    <Link to="/transitional/plan/mirhosein-mousavi" className="arena-featured-card" style={{ borderColor: '#69d98c' }}>
                        <span className="arena-featured-badge" style={{ color: '#69d98c', borderColor: '#69d98c33', fontFamily: monoFont }}>{t(CONTENT.badgeActivePlan)}</span>
                        <div className="arena-featured-name" style={{ fontFamily: headFont }}>{t(CONTENT.mousaviName)}</div>
                        <div className="arena-featured-meta" style={{ fontFamily: headFont }}>{t(CONTENT.mousaviMeta)}</div>
                        <div className="arena-featured-cta" style={{ fontFamily: monoFont }}>{t(CONTENT.viewFullAnalysis)}</div>
                    </Link>
                    <Link to="/transitional/plan/nufdi" className="arena-featured-card" style={{ borderColor: '#7c72e8' }}>
                        <span className="arena-featured-badge" style={{ color: '#7c72e8', borderColor: '#7c72e833', fontFamily: monoFont }}>{t(CONTENT.badgeReferenceDoc)}</span>
                        <div className="arena-featured-name" style={{ fontFamily: headFont }}>{t(CONTENT.nufdiName)}</div>
                        <div className="arena-featured-meta" style={{ fontFamily: headFont }}>{t(CONTENT.nufdiMeta)}</div>
                        <div className="arena-featured-cta" style={{ fontFamily: monoFont }}>{t(CONTENT.viewDocument)}</div>
                    </Link>
                    <Link to="/transitional/plan/itc" className="arena-featured-card" style={{ borderColor: '#ff9a42' }}>
                        <span className="arena-featured-badge" style={{ color: '#ff9a42', borderColor: '#ff9a4233', fontFamily: monoFont }}>{t(CONTENT.badgeReferenceDoc)}</span>
                        <div className="arena-featured-name" style={{ fontFamily: headFont }}>{t(CONTENT.itcName)}</div>
                        <div className="arena-featured-meta" style={{ fontFamily: headFont }}>{t(CONTENT.itcMeta)}</div>
                        <div className="arena-featured-cta" style={{ fontFamily: monoFont }}>{t(CONTENT.viewDocument)}</div>
                    </Link>
                    <Link to="/transitional/plan/cpild" className="arena-featured-card" style={{ borderColor: '#f59e0b' }}>
                        <span className="arena-featured-badge" style={{ color: '#f59e0b', borderColor: '#f59e0b33', fontFamily: monoFont }}>{t(CONTENT.badgeReferenceDoc)}</span>
                        <div className="arena-featured-name" style={{ fontFamily: headFont }}>{t(CONTENT.cpildName)}</div>
                        <div className="arena-featured-meta" style={{ fontFamily: headFont }}>{t(CONTENT.cpildMeta)}</div>
                        <div className="arena-featured-cta" style={{ fontFamily: monoFont }}>{t(CONTENT.viewDocument)}</div>
                    </Link>
                    <Link to="/transitional/plan/jmi" className="arena-featured-card" style={{ borderColor: '#e8c840' }}>
                        <span className="arena-featured-badge" style={{ color: '#e8c840', borderColor: '#e8c84033', fontFamily: monoFont }}>{t(CONTENT.badgeReferenceDoc)}</span>
                        <div className="arena-featured-name" style={{ fontFamily: headFont }}>{t(CONTENT.jmiName)}</div>
                        <div className="arena-featured-meta" style={{ fontFamily: headFont }}>{t(CONTENT.jmiMeta)}</div>
                        <div className="arena-featured-cta" style={{ fontFamily: monoFont }}>{t(CONTENT.viewDocument)}</div>
                    </Link>
                    <Link to="/transitional/plan/cpfik" className="arena-featured-card" style={{ borderColor: '#26d9b2' }}>
                        <span className="arena-featured-badge" style={{ color: '#26d9b2', borderColor: '#26d9b233', fontFamily: monoFont }}>{t(CONTENT.badgeActiveOps)}</span>
                        <div className="arena-featured-name" style={{ fontFamily: headFont }}>{t(CONTENT.cpfikName)}</div>
                        <div className="arena-featured-meta" style={{ fontFamily: headFont }}>{t(CONTENT.cpfikMeta)}</div>
                        <div className="arena-featured-cta" style={{ fontFamily: monoFont }}>{t(CONTENT.viewDocument)}</div>
                    </Link>
                    <Link to="/transitional/plan/uri" className="arena-featured-card" style={{ borderColor: '#e8507a' }}>
                        <span className="arena-featured-badge" style={{ color: '#e8507a', borderColor: '#e8507a33', fontFamily: monoFont }}>{t(CONTENT.badgeActiveCoalition)}</span>
                        <div className="arena-featured-name" style={{ fontFamily: headFont }}>{t(CONTENT.uriName)}</div>
                        <div className="arena-featured-meta" style={{ fontFamily: headFont }}>{t(CONTENT.uriMeta)}</div>
                        <div className="arena-featured-cta" style={{ fontFamily: monoFont }}>{t(CONTENT.viewDocument)}</div>
                    </Link>
                    <Link to="/transitional/plan/civil-society" className="arena-featured-card" style={{ borderColor: '#ffd166' }}>
                        <span className="arena-featured-badge" style={{ color: '#ffd166', borderColor: '#ffd16633', fontFamily: monoFont }}>{t(CONTENT.badgeReferenceDoc)}</span>
                        <div className="arena-featured-name" style={{ fontFamily: headFont }}>{t(CONTENT.civilSocietyName)}</div>
                        <div className="arena-featured-meta" style={{ fontFamily: headFont }}>{t(CONTENT.civilSocietyMeta)}</div>
                        <div className="arena-featured-cta" style={{ fontFamily: monoFont }}>{t(CONTENT.viewDocument)}</div>
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
