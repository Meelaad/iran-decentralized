import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import { useBlueprintVoteCounts } from '../../hooks/useDestination';
import { SHOW_VOTE_COUNTS } from '../../config';
import { PageMeta } from '../../components/PageMeta/PageMeta';
import CONTENT from '../../locales/pages/destination.json';
import './DestinationPage.css';

const BP_LIST = Object.values(BLUEPRINTS);

function VoteSkeleton() {
  return (
    <div className="dest-vote-skeleton">
      {BP_LIST.map((_, i) => (
        <div key={i} className="dest-vote-skel-row" style={{ width: `${60 + (i * 7) % 35}%` }} />
      ))}
    </div>
  );
}

export default function DestinationPage() {
  const { t, isRTL, headFont } = useLang();
  const { data: voteData, isLoading: votesLoading } = useBlueprintVoteCounts();

  const votes = voteData?.votes ?? {};
  const total = voteData?.total ?? 0;

  return (
    <div className="destination-page" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
      <PageMeta
        title={t(CONTENT.metaTitle)}
        description={t(CONTENT.metaDescription)}
        lang={isRTL ? 'fa' : 'en'}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="dest-hero">
        <p className="dest-hero-eyebrow">
          {t(CONTENT.heroEyebrow)}
        </p>
        <h1 className="dest-hero-title">
          {t(CONTENT.heroTitle)}
        </h1>
        <p className="dest-hero-subtitle">
          {t(CONTENT.heroSubtitle)}
        </p>
      </section>

      {/* ── Live vote summary ─────────────────────────────────────────── */}
      <section className="dest-section">
        <p className="dest-section-heading">
          {t(CONTENT.voteSectionHeading)}
        </p>
        <p className="dest-section-sub">
          {t(CONTENT.voteSectionSub)}
        </p>

        {votesLoading ? (
          <VoteSkeleton />
        ) : (
          <div className="dest-vote-bars">
            {BP_LIST.map((bp) => {
              const count = votes[bp.id] ?? 0;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={bp.id} className="dest-vote-row">
                  <span className="dest-vote-label">{t(bp.name)}</span>
                  <div className="dest-vote-bar-track">
                    <div
                      className="dest-vote-bar-fill"
                      style={{ width: `${pct}%` }}
                      title={`${pct.toFixed(1)}%`}
                    />
                  </div>
                  {SHOW_VOTE_COUNTS ? (
                    count > 0 ? (
                      <span className="dest-vote-count">{count.toLocaleString()}</span>
                    ) : (
                      <span className="dest-vote-zero">—</span>
                    )
                  ) : (
                    <span className="dest-vote-zero">—</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <Link to="/vote" className="dest-vote-link">
          {t(CONTENT.voteLink)}
        </Link>
      </section>

      {/* ── Blueprint cards ───────────────────────────────────────────── */}
      <section className="dest-section">
        <p className="dest-section-heading">
          {t(CONTENT.blueprintsSectionHeading)}
        </p>
        <p className="dest-section-sub">
          {t(CONTENT.blueprintsSectionSub)}
        </p>

        <div className="dest-cards-grid">
          {BP_LIST.map((bp) => {
            const count = votes[bp.id] ?? 0;
            const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';

            return (
              <div key={bp.id} className="dest-card">
                <div className="dest-card-name">{t(bp.name)}</div>

                <div className="dest-card-stats">
                  {SHOW_VOTE_COUNTS && (
                    <>
                      <span className="dest-card-stat">
                        {t(CONTENT.votesLabel)}&nbsp;
                        <span className="dest-card-stat-value">{count.toLocaleString()}</span>
                      </span>
                      <span className="dest-card-stat">
                        {t(CONTENT.shareLabel)}&nbsp;
                        <span className="dest-card-stat-pct">{pct}%</span>
                      </span>
                    </>
                  )}
                  <span className="dest-card-stat">
                    {t(CONTENT.sectorsLabel)}&nbsp;
                    <span className="dest-card-stat-value">{bp.sectors.length}</span>
                  </span>
                </div>

                <div className="dest-card-actions">
                  <Link
                    to={`/blueprint/gov/${bp.id}`}
                    className="dest-card-action primary"
                  >
                    {t(CONTENT.exploreButton)}
                  </Link>
                  <Link
                    to={`/blueprint/gov/${bp.id}/sectors`}
                    className="dest-card-action secondary"
                  >
                    {t(CONTENT.sectorsButton)}
                  </Link>
                  <Link
                    to={`/compare?a=${bp.id}`}
                    className="dest-card-action tertiary"
                  >
                    {t(CONTENT.compareButton)}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="dest-section">
        <p className="dest-section-heading">
          {t(CONTENT.howWorksHeading)}
        </p>
        <p className="dest-section-sub">
          {t(CONTENT.howWorksSub)}
        </p>

        <div className="dest-how-steps">
          <div className="dest-how-step">
            <span className="dest-how-step-num">
              {t(CONTENT.step1Num)}
            </span>
            <div className="dest-how-step-title">
              {t(CONTENT.step1Title)}
            </div>
            <div className="dest-how-step-desc">
              {t(CONTENT.step1Desc)}
            </div>
          </div>

          <div className="dest-how-step">
            <span className="dest-how-step-num">
              {t(CONTENT.step2Num)}
            </span>
            <div className="dest-how-step-title">
              {t(CONTENT.step2Title)}
            </div>
            <div className="dest-how-step-desc">
              {t(CONTENT.step2Desc)}
            </div>
          </div>

          <div className="dest-how-step">
            <span className="dest-how-step-num">
              {t(CONTENT.step3Num)}
            </span>
            <div className="dest-how-step-title">
              {t(CONTENT.step3Title)}
            </div>
            <div className="dest-how-step-desc">
              {t(CONTENT.step3Desc)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
