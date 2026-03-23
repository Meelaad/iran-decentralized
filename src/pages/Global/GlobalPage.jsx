import React, { useEffect, useState } from 'react';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import {
  topCountries,
  countryColors,
  placeholderStats,
  formatNumber,
} from '../../data/globalData';
import WorldDotMap from '../../components/WorldDotMap/WorldDotMap';
import CONTENT from '../../locales/pages/global.json';
import './GlobalPage.css';

// ─── Public map markers hook (anon SELECT — RLS allows public read) ────────────
function useMapMarkersPublic() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    supabase
      .from('map_markers')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => setMarkers(data || []))
      .catch(() => {});
  }, []);

  return markers;
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value }) {
  return (
    <div className="gm-stat-card">
      <div className="gm-stat-card-title">{title}</div>
      <div className="gm-stat-card-value">{MASK_STATS ? '—' : formatNumber(value)}</div>
    </div>
  );
}

// ─── City detail panel ─────────────────────────────────────────────────────────
function CityPanel({ city, onClose }) {
  if (!city) return null;
  return (
    <div className="gm-city-panel-backdrop" onClick={onClose}>
      <div className="gm-city-panel" onClick={(e) => e.stopPropagation()}>
        <button className="gm-city-panel-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="gm-city-panel-region">{city.region || ''}</div>
        <h2 className="gm-city-panel-name">{city.label || city.name}</h2>
        <div className="gm-city-panel-row">
          <span className="gm-city-panel-label">IRANIAN POPULATION</span>
          <span className="gm-city-panel-value">{city.pop_estimate ?? city.pop ?? 'Data unavailable'}</span>
        </div>
        <p className="gm-city-panel-note">{city.description || city.note || ''}</p>
        <p className="gm-city-panel-source">Source: U.S. Census ACS / Statistics Canada / national statistics agencies. Figures reflect diaspora estimates and may not capture undocumented residents.</p>
      </div>
    </div>
  );
}

// ─── TEMPORARY: set to false once membership grows ─────────────────────────────
const MASK_STATS = true;

// ─── Supabase stats fetch ──────────────────────────────────────────────────────
function useGlobalStats() {
  const [stats, setStats] = useState(placeholderStats);

  useEffect(() => {
    if (MASK_STATS) return;
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
  const markers = useMapMarkersPublic();
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div className="gm-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <CityPanel city={selectedCity} onClose={() => setSelectedCity(null)} />
      <div className="gm-bg-grid" />

      <div className="gm-inner">
        {/* Header */}
        <div className="gm-header">
          <div className="gm-eyebrow">
            {t(CONTENT.eyebrow)}
          </div>
          <h1 className="gm-title">
            {t(CONTENT.title)}
          </h1>
          <p className="gm-subtitle">
            {t(CONTENT.subtitle)}
          </p>
        </div>

        {/* Map + left stats row */}
        <div className="gm-map-section">
          <div className="gm-map-left">
            <div className="gm-total-block">
              <div className="gm-total-label">
                {t(CONTENT.totalMembersLabel)}
              </div>
              <div className="gm-total-value">
                {MASK_STATS ? '—' : formatNumber(stats.totalMembers)}
              </div>
            </div>

            <div className="gm-countries-list">
              <div className="gm-countries-title">
                {t(CONTENT.topCountriesLabel)}
              </div>
              <ul>
                {topCountries.map((c) => (
                  <li key={c.code} className="gm-country-row">
                    <span style={{ color: c.color }}>■</span>
                    <span className="gm-country-code" style={{ color: c.color }}>
                      <span className="gm-country-name-full">{t(c.name)}</span>
                      <span className="gm-country-name-short">{c.code}</span>
                    </span>
                    <span className="gm-country-members">
                      {MASK_STATS ? '—' : formatNumber(c.members)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <WorldDotMap
            markers={markers}
            onMarkerClick={setSelectedCity}
          />
        </div>

        <p className="gm-under-construction">
          {t(CONTENT.underConstructionText)}
        </p>

        {/* Stats grid */}
        <div className="gm-stats-grid">
          <StatCard
            title={t(CONTENT.statCardTitles.votesCast)}
            value={stats.votesCast}
          />
          <StatCard
            title={t(CONTENT.statCardTitles.plansEndorsed)}
            value={stats.plansEndorsed}
          />
          <StatCard
            title={t(CONTENT.statCardTitles.countries)}
            value={stats.countriesRepresented}
          />
          <StatCard
            title={t(CONTENT.statCardTitles.civicActions)}
            value={stats.civicActions}
          />
        </div>

        {/* Data note */}
        <p className="gm-data-note">
          {t(CONTENT.dataNote)}
        </p>
      </div>
    </div>
  );
}
