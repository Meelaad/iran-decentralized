import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { useAuth } from '../../hooks/useAuth';
import { SHOW_VOTE_COUNTS } from '../../config';
import {
    usePlan,
    usePlanGeoStats,
    usePlanAmendments,
    useEndorsePlan,
    useVoteAmendment,
    useProposeAmendment,
} from '../../hooks/usePlans';
import PlanStockGraph from '../../components/PlanStockGraph/PlanStockGraph';
import ShadowCabinetTree from '../../components/ShadowCabinetTree/ShadowCabinetTree';
import DiasporaMap from '../../components/DiasporaMap/DiasporaMap';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { PageMeta } from '../../components/PageMeta/PageMeta';
import './PlanPage.css';

export default function PlanPage() {
    const { slug } = useParams();
    const { tKey, isRTL, headFont } = useLang();
    const { session } = useAuth();

    const { data: plan, isLoading, isError } = usePlan(slug);
    const [activeTab, setActiveTab] = useState('overview');
    const [endorsed, setEndorsed] = useState(false);

    // Amendments tab state
    const { data: amendmentsData } = usePlanAmendments(plan?.id);
    const amendments = amendmentsData?.amendments || [];
    const [proposeOpen, setProposeOpen] = useState(false);
    const [proposeTitle, setProposeTitle] = useState('');
    const [proposeBody, setProposeBody] = useState('');

    // Demographics tab
    const { data: geoData } = usePlanGeoStats(plan?.id);
    const geoRows = geoData?.geo || [];

    const endorseMutation = useEndorsePlan();
    const voteAmendMutation = useVoteAmendment();
    const proposeMutation = useProposeAmendment();

    // Define tabs with translation keys in Arena Plans
    const tabs = [
        { id: 'overview',    label: tKey('plan.overview') },
      //  { id: 'fullDetails',label: tKey('plan.fullDetails') },
        { id: 'sectors',     label: tKey('plan.sectorsExperts') },
        { id: 'amendments',  label: tKey('plan.amendments') },
        { id: 'demographics',label: tKey('plan.demographics') },
    ];

    if (isLoading) return (
        <div className="plan-page" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <Skeleton lines={6} />
        </div>
    );
    if (isError || !plan) return (
        <div className="plan-page" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <EmptyState title={tKey('common.notFound')} message={tKey('common.error')} />
        </div>
    );

    const endorsementCount = plan.latestStats?.endorsement_count || 0;

    async function handleEndorse() {
        if (!session) return;
        try {
            await endorseMutation.mutateAsync({ planId: plan.id });
            setEndorsed(true);
        } catch (e) { /* ignore */ }
    }

    async function handleAmendVote(amendmentId, vote) {
        if (!session) return;
        try { await voteAmendMutation.mutateAsync({ amendmentId, vote }); } catch (e) { /* ignore */ }
    }

    async function handlePropose(e) {
        e.preventDefault();
        if (!proposeTitle || !proposeBody) return;
        try {
            await proposeMutation.mutateAsync({ planId: plan.id, title: proposeTitle, text: proposeBody });
            setProposeOpen(false);
            setProposeTitle('');
            setProposeBody('');
        } catch (e) { /* ignore */ }
    }

    const planTitle = isRTL ? plan.name?.fa : plan.name?.en || plan.slug;
    const planDesc = isRTL ? plan.summary?.fa : plan.summary?.en;

    return (
        <div className="plan-page" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <PageMeta
                title={planTitle}
                description={planDesc}
                lang={isRTL ? 'fa' : 'en'}
            />
            <header className="plan-header" style={{ borderColor: plan.coverColor || '#8B5CF6' }}>
                {plan.isOfficial && (
                    <span className="plan-official-badge">{tKey('plan.officialBadge')}</span>
                )}
                <h1 className="plan-title">
                    {isRTL ? plan.name?.fa : plan.name?.en || plan.slug}
                </h1>
                <p className="plan-summary">
                    {isRTL ? plan.summary?.fa : plan.summary?.en}
                </p>
                {plan.fullDocUrl && (
                    <a className="plan-source-link" href={plan.fullDocUrl} target="_blank" rel="noopener noreferrer">
                        {tKey('plan.sourceLink')}
                    </a>
                )}
            </header>

            {/* Endorsement bar */}
            <section className="plan-endorse-bar">
                {SHOW_VOTE_COUNTS && (
                    <div className="plan-endorse-count">
                        <strong>{endorsementCount.toLocaleString()}</strong>
                        <span> {tKey('plan.endorsements')}</span>
                    </div>
                )}
                {session && (
                    <button
                        className={`plan-endorse-btn ${endorsed ? 'is-endorsed' : ''}`}
                        onClick={handleEndorse}
                        disabled={endorsed || endorseMutation.isPending}
                    >
                        {endorsed ? '✓ ' + tKey('arena.endorsed') : tKey('plan.endorseThis')}
                    </button>
                )}
            </section>

            {/* Mini stats */}
            <div className="plan-mini-stats">
                <span>{tKey('plan.sectors')}: <strong>{plan.sectors?.length || 0}</strong></span>
                <span>{tKey('plan.experts')}: <strong>{plan.experts?.length || 0}</strong></span>
                <span>{tKey('plan.amendmentsOpen')}: <strong>{amendments.filter(a => a.status === 'open' || !a.status).length}</strong></span>
            </div>

            {/* 30-day chart */}
            <div className="plan-graph">
                <PlanStockGraph
                    plans={[{ id: plan.id, coverColor: plan.coverColor, stats: plan.stats || [], name: plan.name }]}
                />
            </div>

            {/* Tabs */}
            <div className="plan-tabs" role="tablist">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`plan-tab ${activeTab === tab.id ? 'is-active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
                <section className="plan-body">
                    <p>{isRTL ? plan.summary?.fa : plan.summary?.en}</p>
                    {plan.fullDocUrl && (
                        <a className="plan-source-link" href={plan.fullDocUrl} target="_blank" rel="noopener noreferrer">
                            {tKey('plan.sourceLink')}
                        </a>
                    )}
                </section>
            )}
             {/* FULL DETAILS */}
            {activeTab === 'fullDetails' && (
                <section className="plan-body">
                    <p>{isRTL ? plan.fullDetails?.fa : plan.fullDetails?.en}</p>
                    {plan.fullDocUrl && (
                        <a className="plan-source-link" href={plan.fullDocUrl} target="_blank" rel="noopener noreferrer">
                            {tKey('plan.sourceLink')}
                        </a>
                    )}
                </section>
            )}

            {/* SECTORS & EXPERTS */}
            {activeTab === 'sectors' && (
                <section className="plan-body">
                    {plan.sectors?.length === 0
                        ? <EmptyState title={tKey('plan.noSectors')} />
                        : <ShadowCabinetTree plan={plan} />
                    }
                </section>
            )}

            {/* AMENDMENTS */}
            {activeTab === 'amendments' && (
                <section className="plan-body">
                    {session && (
                        <div className="plan-propose-row">
                            <button className="plan-propose-btn" onClick={() => setProposeOpen(v => !v)}>
                                {tKey('plan.proposeAmendment')}
                            </button>
                        </div>
                    )}
                    {proposeOpen && (
                        <form className="plan-propose-form" onSubmit={handlePropose}>
                            <input
                                className="plan-propose-input"
                                placeholder={tKey('plan.amendmentTitle')}
                                value={proposeTitle}
                                onChange={e => setProposeTitle(e.target.value)}
                                required
                            />
                            <textarea
                                className="plan-propose-textarea"
                                placeholder={tKey('plan.amendmentBody')}
                                value={proposeBody}
                                onChange={e => setProposeBody(e.target.value)}
                                required
                                rows={4}
                            />
                            <div className="plan-propose-actions">
                                <button type="submit" className="plan-propose-submit" disabled={proposeMutation.isPending}>
                                    {tKey('common.submit')}
                                </button>
                                <button type="button" className="plan-propose-cancel" onClick={() => setProposeOpen(false)}>
                                    {tKey('common.cancel')}
                                </button>
                            </div>
                        </form>
                    )}
                    {amendments.length === 0
                        ? <EmptyState title={tKey('plan.noAmendments')} />
                        : amendments.map(a => (
                            <article key={a.id} className="amendment-card">
                                <div className="amendment-header">
                                    <span className="amendment-title">{a.title}</span>
                                    <span className={`amendment-status amendment-status--${a.status || 'open'}`}>
                                        {tKey(`plan.${a.status || 'open'}`)}
                                    </span>
                                </div>
                                <p className="amendment-body">{a.text || a.body_en}</p>
                                <div className="amendment-votes">
                                    {SHOW_VOTE_COUNTS && (
                                        <>
                                            <span className="amendment-yes">{tKey('plan.yesVotes')}: {a.yes_votes || 0}</span>
                                            <span className="amendment-no">{tKey('plan.noVotes')}: {a.no_votes || 0}</span>
                                        </>
                                    )}
                                    {session && (a.status === 'open' || !a.status) && (
                                        <div className="amendment-vote-btns">
                                            <button
                                                className="amend-yes-btn"
                                                onClick={() => handleAmendVote(a.id, 'yes')}
                                                disabled={voteAmendMutation.isPending}
                                            >
                                                {tKey('plan.voteYes')}
                                            </button>
                                            <button
                                                className="amend-no-btn"
                                                onClick={() => handleAmendVote(a.id, 'no')}
                                                disabled={voteAmendMutation.isPending}
                                            >
                                                {tKey('plan.voteNo')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))
                    }
                </section>
            )}

            {/* DEMOGRAPHICS */}
            {activeTab === 'demographics' && (
                <section className="plan-body">
                    {SHOW_VOTE_COUNTS && (
                        <div className="plan-demo-stats">
                            <div className="plan-demo-stat">
                                <span className="demo-label">{tKey('plan.totalEndorsers')}</span>
                                <strong>{endorsementCount.toLocaleString()}</strong>
                            </div>
                        </div>
                    )}
                    {geoRows.length === 0
                        ? <EmptyState title={tKey('plan.noGeoData')} />
                        : (
                            <>
                                <DiasporaMap geoData={geoRows} />
                                <div className="plan-country-list">
                                    <h3 className="plan-country-title">{tKey('plan.byCountry')}</h3>
                                    {[...geoRows]
                                        .sort((a, b) => b.vote_count - a.vote_count)
                                        .slice(0, 10)
                                        .map(row => (
                                            <div key={row.country_code} className="plan-country-row">
                                                <span className="plan-country-code">{row.country_code}</span>
                                                <div className="plan-country-bar-wrap">
                                                    <div
                                                        className="plan-country-bar"
                                                        style={{ width: `${Math.round((row.vote_count / geoRows[0].vote_count) * 100)}%` }}
                                                    />
                                                </div>
                                                {SHOW_VOTE_COUNTS && (
                                                    <span className="plan-country-count">{row.vote_count}</span>
                                                )}
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                        )
                    }
                </section>
            )}
        </div>
    );
}
