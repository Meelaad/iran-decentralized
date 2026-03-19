import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import { supabase } from '../../lib/supabase';
import { PageMeta } from '../../components/PageMeta/PageMeta';
import './ComparePage.css';

const TIERS = [
    { key: 'core',      label: { en: 'CORE LAYER',        fa: 'لایه هسته' },       color: '#8B5CF6' },
    { key: 'primary',   label: { en: 'PRIMARY SECTORS',   fa: 'بخش‌های اولیه' },   color: '#66bb6a' },
    { key: 'secondary', label: { en: 'SECONDARY SECTORS', fa: 'بخش‌های ثانویه' }, color: '#ffa726' },
    { key: 'tertiary',  label: { en: 'SUPPORTING',        fa: 'بخش‌های پشتیبان' }, color: '#ab47bc' },
];

export default function ComparePage() {
    const { t, isRTL, headFont } = useLang();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetch('/api/public/civic/score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({ event_type: 'daily_login' }),
                }).catch(() => {});
            }
        });
    }, []);

    const blueprintKeys = Object.keys(BLUEPRINTS);
    const [aId, setAId] = useState(searchParams.get('a') || blueprintKeys[0]);
    const [bId, setBId] = useState(searchParams.get('b') || blueprintKeys[1]);

    const bpA = BLUEPRINTS[aId];
    const bpB = BLUEPRINTS[bId];

    function handleChange(side, id) {
        const next = { a: aId, b: bId, [side]: id };
        navigate(`/compare?a=${next.a}&b=${next.b}`, { replace: true });
        if (side === 'a') setAId(id);
        else setBId(id);
    }

    return (
        <div className="compare-page" style={{ fontFamily: headFont }}>
            <PageMeta
                title={isRTL ? 'مقایسه طرح‌های حکومتی' : 'Compare Governance Blueprints'}
                description={isRTL ? 'مقایسه جانبی مدل‌های حکومتی پیشنهادی برای ایران' : 'Side-by-side comparison of all proposed governance models for Iran\'s future.'}
                lang={isRTL ? 'fa' : 'en'}
            />
            <div className="compare-retro-grid" />

            <div className="compare-inner">
                <div className={`compare-kicker ${!isRTL ? 'is-ltr' : ''}`}>
                    {isRTL ? 'مقایسه طرح‌های حاکمیتی' : 'GOVERNANCE BLUEPRINT COMPARISON'}
                </div>
                <h1 className="compare-title" style={{ fontFamily: headFont }}>
                    {isRTL ? 'مقایسه مدل‌ها' : 'Compare Models'}
                </h1>

                {/* Selectors */}
                <div className="compare-selectors">
                    <div className="compare-selector-group">
                        <div className="compare-selector-label compare-a-color">A</div>
                        <select
                            className="compare-select"
                            value={aId}
                            onChange={e => handleChange('a', e.target.value)}
                            style={{ fontFamily: headFont }}
                        >
                            {blueprintKeys.map(k => (
                                <option key={k} value={k}>{t(BLUEPRINTS[k].name)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="compare-vs">vs</div>

                    <div className="compare-selector-group">
                        <div className="compare-selector-label compare-b-color">B</div>
                        <select
                            className="compare-select"
                            value={bId}
                            onChange={e => handleChange('b', e.target.value)}
                            style={{ fontFamily: headFont }}
                        >
                            {blueprintKeys.map(k => (
                                <option key={k} value={k}>{t(BLUEPRINTS[k].name)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="compare-stats-bar">
                    <div className="compare-stat-block compare-a-border">
                        <span className="compare-stat-num compare-a-color">{bpA.sectors.length}</span>
                        <span className="compare-stat-label">{isRTL ? 'بخش' : 'Sectors'}</span>
                    </div>
                    <div className="compare-stat-block compare-a-border">
                        <span className="compare-stat-num compare-a-color">{bpA.connections.length}</span>
                        <span className="compare-stat-label">{isRTL ? 'ارتباط' : 'Connections'}</span>
                    </div>
                    <div className="compare-stat-block compare-a-border">
                        <span className="compare-stat-num compare-a-color">{bpA.sharedLayers.length}</span>
                        <span className="compare-stat-label">{isRTL ? 'لایه مشترک' : 'Shared Layers'}</span>
                    </div>

                    <div className="compare-stat-divider" />

                    <div className="compare-stat-block compare-b-border">
                        <span className="compare-stat-num compare-b-color">{bpB.sectors.length}</span>
                        <span className="compare-stat-label">{isRTL ? 'بخش' : 'Sectors'}</span>
                    </div>
                    <div className="compare-stat-block compare-b-border">
                        <span className="compare-stat-num compare-b-color">{bpB.connections.length}</span>
                        <span className="compare-stat-label">{isRTL ? 'ارتباط' : 'Connections'}</span>
                    </div>
                    <div className="compare-stat-block compare-b-border">
                        <span className="compare-stat-num compare-b-color">{bpB.sharedLayers.length}</span>
                        <span className="compare-stat-label">{isRTL ? 'لایه مشترک' : 'Shared Layers'}</span>
                    </div>
                </div>

                {/* Tier-grouped side-by-side columns */}
                <div className="compare-columns">
                    <div className="compare-col-header compare-a-border">
                        <span className="compare-col-badge compare-a-bg">A</span>
                        <span style={{ fontFamily: headFont }}>{t(bpA.name)}</span>
                    </div>
                    <div className="compare-col-header compare-b-border">
                        <span className="compare-col-badge compare-b-bg">B</span>
                        <span style={{ fontFamily: headFont }}>{t(bpB.name)}</span>
                    </div>
                </div>

                {TIERS.map(tier => {
                    const aSectors = bpA.sectors.filter(s => s.tier === tier.key);
                    const bSectors = bpB.sectors.filter(s => s.tier === tier.key);
                    if (!aSectors.length && !bSectors.length) return null;
                    const rows = Math.max(aSectors.length, bSectors.length);

                    return (
                        <div key={tier.key} className="compare-tier-block">
                            <div className="compare-tier-label" style={{ color: tier.color, borderBottomColor: `${tier.color}25` }}>
                                {t(tier.label)}
                            </div>
                            <div className="compare-columns">
                                <div className="compare-col">
                                    {Array.from({ length: rows }, (_, i) => {
                                        const s = aSectors[i];
                                        return s ? (
                                            <div key={s.id} className="compare-sector-card compare-a-card">
                                                <span className="compare-sector-icon">{s.icon}</span>
                                                <div className="compare-sector-body">
                                                    <div className="compare-sector-name" style={{ fontFamily: headFont, color: s.border }}>
                                                        {t(s.label)}
                                                    </div>
                                                    <div className="compare-sector-tier-badge" style={{ color: tier.color }}>
                                                        {t(tier.label)}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={`empty-a-${i}`} className="compare-sector-empty" />
                                        );
                                    })}
                                </div>
                                <div className="compare-col-divider" />
                                <div className="compare-col">
                                    {Array.from({ length: rows }, (_, i) => {
                                        const s = bSectors[i];
                                        return s ? (
                                            <div key={s.id} className="compare-sector-card compare-b-card">
                                                <span className="compare-sector-icon">{s.icon}</span>
                                                <div className="compare-sector-body">
                                                    <div className="compare-sector-name" style={{ fontFamily: headFont, color: s.border }}>
                                                        {t(s.label)}
                                                    </div>
                                                    <div className="compare-sector-tier-badge" style={{ color: tier.color }}>
                                                        {t(tier.label)}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={`empty-b-${i}`} className="compare-sector-empty" />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Shared layers comparison */}
                <div className="compare-layers-section">
                    <div className="compare-layers-title">
                        {isRTL ? 'لایه‌های زیرساخت مشترک' : 'SHARED INFRASTRUCTURE LAYERS'}
                    </div>
                    <div className="compare-columns">
                        <div className="compare-col">
                            {bpA.sharedLayers.map((layer, i) => (
                                <div key={i} className="compare-layer-chip compare-a-chip">
                                    <span>{layer.icon}</span>
                                    <span style={{ fontFamily: headFont }}>{t(layer.name)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="compare-col-divider" />
                        <div className="compare-col">
                            {bpB.sharedLayers.map((layer, i) => (
                                <div key={i} className="compare-layer-chip compare-b-chip">
                                    <span>{layer.icon}</span>
                                    <span style={{ fontFamily: headFont }}>{t(layer.name)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Connections summary */}
                <div className="compare-connections-section">
                    <div className="compare-layers-title">
                        {isRTL ? 'توزیع قدرت ارتباطات' : 'CONNECTION STRENGTH DISTRIBUTION'}
                    </div>
                    <div className="compare-columns">
                        <div className="compare-col">
                            {[3, 2, 1].map(strength => {
                                const count = bpA.connections.filter(c => c.strength === strength).length;
                                const pct = Math.round((count / bpA.connections.length) * 100);
                                const label = strength === 3
                                    ? (isRTL ? 'قوی' : 'Strong')
                                    : strength === 2 ? (isRTL ? 'متوسط' : 'Medium') : (isRTL ? 'ضعیف' : 'Weak');
                                return (
                                    <div key={strength} className="compare-conn-row">
                                        <span className="compare-conn-label">{label}</span>
                                        <div className="compare-conn-bar-wrap">
                                            <div className="compare-conn-bar compare-a-bg" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="compare-conn-count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="compare-col-divider" />
                        <div className="compare-col">
                            {[3, 2, 1].map(strength => {
                                const count = bpB.connections.filter(c => c.strength === strength).length;
                                const pct = Math.round((count / bpB.connections.length) * 100);
                                const label = strength === 3
                                    ? (isRTL ? 'قوی' : 'Strong')
                                    : strength === 2 ? (isRTL ? 'متوسط' : 'Medium') : (isRTL ? 'ضعیف' : 'Weak');
                                return (
                                    <div key={strength} className="compare-conn-row">
                                        <span className="compare-conn-label">{label}</span>
                                        <div className="compare-conn-bar-wrap">
                                            <div className="compare-conn-bar compare-b-bg" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="compare-conn-count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
