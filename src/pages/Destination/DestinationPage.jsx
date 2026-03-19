import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import { useBlueprintVoteCounts } from '../../hooks/useDestination';
import { SHOW_VOTE_COUNTS } from '../../config';
import { PageMeta } from '../../components/PageMeta/PageMeta';
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
  const { t, isRTL } = useLang();
  const { data: voteData, isLoading: votesLoading } = useBlueprintVoteCounts();

  const votes = voteData?.votes ?? {};
  const total = voteData?.total ?? 0;

  return (
    <div className="destination-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageMeta
        title={isRTL ? 'مرکز مقصد' : 'Destination Hub'}
        description={isRTL ? 'مرور طرح‌های حکومتی و آمار زنده رأی' : 'Compare governance blueprints and track live vote counts for Iran\'s permanent system of government.'}
        lang={isRTL ? 'fa' : 'en'}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="dest-hero">
        <p className="dest-hero-eyebrow">
          {t({ en: 'STAGE 2 OF 2 · POST-TRANSITION', fa: 'مرحله ۲ از ۲ · پس از انتقال' })}
        </p>
        <h1 className="dest-hero-title">
          {t({ en: 'The Destination', fa: 'مقصد' })}
        </h1>
        <p className="dest-hero-subtitle">
          {t({
            en: 'After the transition is complete, Iranians choose their permanent system of government. This is where the diaspora and citizens worldwide weigh in on what Iran becomes.',
            fa: 'پس از اتمام دوره انتقال، ایرانیان نظام حکومتی دائمی خود را انتخاب می‌کنند. اینجاست که دیاسپورا و شهروندان جهان در مورد آینده ایران نظر می‌دهند.',
          })}
        </p>
      </section>

      {/* ── Live vote summary ─────────────────────────────────────────── */}
      <section className="dest-section">
        <p className="dest-section-heading">
          {t({ en: 'Where does the diaspora stand?', fa: 'دیاسپورا کجا ایستاده است؟' })}
        </p>
        <p className="dest-section-sub">
          {t({ en: 'Live blueprint vote distribution', fa: 'توزیع زنده آرای طرح‌های حکومتی' })}
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
          {t({ en: 'Cast your vote →', fa: 'رأی خود را ثبت کنید ←' })}
        </Link>
      </section>

      {/* ── Blueprint cards ───────────────────────────────────────────── */}
      <section className="dest-section">
        <p className="dest-section-heading">
          {t({ en: 'Governance Blueprints', fa: 'طرح‌های حکومتی' })}
        </p>
        <p className="dest-section-sub">
          {t({ en: 'Six proposed systems for Iran\'s permanent government', fa: 'شش نظام پیشنهادی برای حکومت دائمی ایران' })}
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
                        {t({ en: 'Votes:', fa: 'آرا:' })}&nbsp;
                        <span className="dest-card-stat-value">{count.toLocaleString()}</span>
                      </span>
                      <span className="dest-card-stat">
                        {t({ en: 'Share:', fa: 'سهم:' })}&nbsp;
                        <span className="dest-card-stat-pct">{pct}%</span>
                      </span>
                    </>
                  )}
                  <span className="dest-card-stat">
                    {t({ en: 'Sectors:', fa: 'بخش‌ها:' })}&nbsp;
                    <span className="dest-card-stat-value">{bp.sectors.length}</span>
                  </span>
                </div>

                <div className="dest-card-actions">
                  <Link
                    to={`/blueprint/gov/${bp.id}`}
                    className="dest-card-action primary"
                  >
                    {t({ en: 'EXPLORE →', fa: 'کاوش ←' })}
                  </Link>
                  <Link
                    to={`/blueprint/gov/${bp.id}/sectors`}
                    className="dest-card-action secondary"
                  >
                    {t({ en: 'SECTORS →', fa: 'بخش‌ها ←' })}
                  </Link>
                  <Link
                    to={`/compare?a=${bp.id}`}
                    className="dest-card-action tertiary"
                  >
                    {t({ en: 'COMPARE →', fa: 'مقایسه ←' })}
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
          {t({ en: 'How it works', fa: 'نحوه عملکرد' })}
        </p>
        <p className="dest-section-sub">
          {t({ en: 'Two stages. One referendum.', fa: 'دو مرحله. یک همه‌پرسی.' })}
        </p>

        <div className="dest-how-steps">
          <div className="dest-how-step">
            <span className="dest-how-step-num">
              {t({ en: 'STEP 1', fa: 'مرحله ۱' })}
            </span>
            <div className="dest-how-step-title">
              {t({ en: 'Arena decides the transition', fa: 'میدان دوره انتقال را تعیین می‌کند' })}
            </div>
            <div className="dest-how-step-desc">
              {t({
                en: 'Plans competing in the Transition Arena define how power transfers, which institutions dissolve, and what temporary governance looks like.',
                fa: 'طرح‌های رقیب در میدان انتقال تعیین می‌کنند که چگونه قدرت منتقل می‌شود، کدام نهادها منحل می‌شوند و حکومت موقت چگونه خواهد بود.',
              })}
            </div>
          </div>

          <div className="dest-how-step">
            <span className="dest-how-step-num">
              {t({ en: 'STEP 2', fa: 'مرحله ۲' })}
            </span>
            <div className="dest-how-step-title">
              {t({ en: 'Destination decides the end state', fa: 'مقصد وضعیت نهایی را تعیین می‌کند' })}
            </div>
            <div className="dest-how-step-desc">
              {t({
                en: 'The six governance blueprints on this page represent the candidate permanent systems. Citizens vote on which one Iran should adopt permanently.',
                fa: 'شش طرح حکومتی در این صفحه نمایانگر نظام‌های دائمی نامزد هستند. شهروندان رأی می‌دهند که ایران کدام نظام را به طور دائمی بپذیرد.',
              })}
            </div>
          </div>

          <div className="dest-how-step">
            <span className="dest-how-step-num">
              {t({ en: 'STEP 3', fa: 'مرحله ۳' })}
            </span>
            <div className="dest-how-step-title">
              {t({ en: 'Both feed into the referendum', fa: 'هر دو به همه‌پرسی ختم می‌شوند' })}
            </div>
            <div className="dest-how-step-desc">
              {t({
                en: 'The winning transition plan and the leading destination blueprint are presented together in a national referendum — the first free vote in Iran\'s modern history.',
                fa: 'طرح انتقالی برنده و طرح مقصد پیشرو با هم در یک همه‌پرسی ملی ارائه می‌شوند — اولین رأی‌گیری آزاد در تاریخ معاصر ایران.',
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
