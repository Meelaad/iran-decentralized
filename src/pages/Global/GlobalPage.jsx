import React, { useEffect, useRef, useState } from 'react';
import { geoMercator } from 'd3-geo';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import {
  topCountries,
  countryColors,
  regionMarkers,
  placeholderStats,
  formatNumber,
} from '../../data/globalData';
import dottedMapData from '../../data/dotted-map-data.json';
import './GlobalPage.css';

// ─── Map dimensions ────────────────────────────────────────────────────────────
const MAP_W = 1000;
const MAP_H = 560;

const projection = geoMercator()
  .scale(140)
  .center([15, 25])
  .rotate([0, 0, 0])
  .translate([MAP_W / 2, MAP_H / 2]);

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value }) {
  return (
    <div className="gm-stat-card">
      <div className="gm-stat-card-title">{title}</div>
      <div className="gm-stat-card-value">{formatNumber(value)}</div>
    </div>
  );
}

// ─── World dot map ─────────────────────────────────────────────────────────────
function WorldDotMap() {
  const [tooltip, setTooltip] = useState({ text: '', x: 0, y: 0, show: false });
  const containerRef = useRef(null);

  const dots = [];
  const animatedDots = [];

  for (const [code, cities] of Object.entries(dottedMapData)) {
    const color = countryColors[code];
    const limit = color ? 8 : 2;
    const shown = cities.slice(0, Math.max(limit, cities.length));

    shown.forEach((city, idx) => {
      const projected = projection([city.lon, city.lat]);
      if (!projected) return;
      const [x, y] = projected;
      if (x < 0 || x > MAP_W || y < 0 || y > MAP_H) return;

      if (color && idx < 8) {
        animatedDots.push(
          <rect
            key={`${code}-${idx}-a`}
            x={x - 1.5}
            y={y - 1.5}
            width={3}
            height={3}
            fill={color}
            className="gm-pulse"
            style={{ animationDelay: `${(idx * 0.25) % 2}s` }}
          />
        );
      } else {
        dots.push(
          <rect
            key={`${code}-${idx}-s`}
            x={x - 1.5}
            y={y - 1.5}
            width={3}
            height={3}
            fill="rgba(255,255,255,0.12)"
          />
        );
      }
    });
  }

  function handleMarkerEnter(e, marker) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      text: marker.name,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true,
    });
  }

  function handleMarkerLeave() {
    setTooltip((prev) => ({ ...prev, show: false }));
  }

  return (
    <div className="gm-map-wrap" ref={containerRef}>
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Static background dots */}
        {dots}

        {/* Colored animated dots for top countries */}
        {animatedDots}

        {/* Region markers */}
        {regionMarkers.map((marker) => {
          const projected = projection(marker.coordinates);
          if (!projected) return null;
          const [mx, my] = projected;
          if (mx < 0 || mx > MAP_W || my < 0 || my > MAP_H) return null;
          return (
            <g
              key={marker.id}
              transform={`translate(${mx}, ${my})`}
              className="gm-marker"
              onMouseEnter={(e) => handleMarkerEnter(e, marker)}
              onMouseLeave={handleMarkerLeave}
            >
              <polygon
                points="0,-5 -3.5,3 3.5,3"
                fill="#e8507a"
                stroke="#0b0b18"
                strokeWidth="0.8"
              />
              <circle cx={0} cy={0} r={7} fill="transparent" />
            </g>
          );
        })}
      </svg>

      {tooltip.show && (
        <div
          className="gm-map-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

// ─── Supabase stats fetch ──────────────────────────────────────────────────────
function useGlobalStats() {
  const [stats, setStats] = useState(placeholderStats);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('votes').select('*', { count: 'exact', head: true }),
      supabase
        .from('transitional_plans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'arena'),
    ])
      .then(([profiles, votes, plans]) => {
        setStats({
          totalMembers: profiles.count ?? 0,
          votesCast: votes.count ?? 0,
          plansEndorsed: plans.count ?? 0,
          countriesRepresented: Object.keys(countryColors).length,
          civicActions: (votes.count ?? 0) + (profiles.count ?? 0),
        });
      })
      .catch(() => {});
  }, []);

  return stats;
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function GlobalPage() {
  const { isRTL, t } = useLang();
  const stats = useGlobalStats();

  return (
    <div className="gm-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="gm-bg-grid" />

      <div className="gm-inner">
        {/* Header */}
        <div className="gm-header">
          <div className="gm-eyebrow">
            {t({ en: 'GLOBAL ACTIVITY', fa: 'فعالیت جهانی' })}
          </div>
          <h1 className="gm-title">
            {t({ en: 'IranDAO Global', fa: 'ایران‌دائو جهانی' })}
          </h1>
          <p className="gm-subtitle">
            {t({
              en: 'Real-time member distribution and activity across the world',
              fa: 'توزیع اعضا و فعالیت‌های زنده در سراسر جهان',
            })}
          </p>
        </div>

        {/* Map + left stats row */}
        <div className="gm-map-section">
          <div className="gm-map-left">
            <div className="gm-total-block">
              <div className="gm-total-label">
                {t({ en: 'TOTAL MEMBERS', fa: 'کل اعضا' })}
              </div>
              <div className="gm-total-value">
                {formatNumber(stats.totalMembers)}
              </div>
            </div>

            <div className="gm-countries-list">
              <div className="gm-countries-title">
                {t({ en: 'TOP COUNTRIES', fa: 'کشورهای برتر' })}
              </div>
              <ul>
                {topCountries.map((c) => (
                  <li key={c.code} className="gm-country-row">
                    <span style={{ color: c.color }}>■</span>
                    <span className="gm-country-code" style={{ color: c.color }}>
                      {c.code}
                    </span>
                    <span className="gm-country-members">
                      {formatNumber(c.members)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <WorldDotMap />
        </div>

        {/* Stats grid */}
        <div className="gm-stats-grid">
          <StatCard
            title={t({ en: 'VOTES CAST', fa: 'آرای ثبت‌شده' })}
            value={stats.votesCast}
          />
          <StatCard
            title={t({ en: 'PLANS ENDORSED', fa: 'طرح‌های تأیید‌شده' })}
            value={stats.plansEndorsed}
          />
          <StatCard
            title={t({ en: 'COUNTRIES', fa: 'کشورها' })}
            value={stats.countriesRepresented}
          />
          <StatCard
            title={t({ en: 'CIVIC ACTIONS', fa: 'اقدامات مدنی' })}
            value={stats.civicActions}
          />
        </div>

        {/* Data note */}
        <p className="gm-data-note">
          {t({
            en: 'Member counts are real-time from the IranDAO registry. Data updates on page load. Country distribution based on registration location.',
            fa: 'تعداد اعضا به‌صورت زنده از ثبت ایران‌دائو گرفته می‌شود. داده‌ها هنگام بارگذاری صفحه به‌روز می‌شوند. توزیع کشوری بر اساس محل ثبت‌نام است.',
          })}
        </p>
      </div>
    </div>
  );
}
