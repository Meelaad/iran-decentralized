import React from 'react';
import { useLang } from '../../contexts/LangContext';
import './Charts.css';

const TIER_COLORS = {
    NONE: '#9e9e9e',
    LOW:  '#8B5CF6',
    MID:  '#ffd54f',
    HIGH: '#69d98c',
};

export default function StatsRow({ civicScore, participationScore, streakDays, trustTier }) {
    const { isRTL } = useLang();

    const tierColor = TIER_COLORS[trustTier] || TIER_COLORS.NONE;

    return (
        <div className="ch-stats-row" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="ch-stat-card">
                <div className="ch-stat-value" style={{ color: '#8B5CF6' }}>
                    {civicScore ?? '—'}
                </div>
                <div className="ch-stat-label">
                    {isRTL ? 'امتیاز مدنی' : 'CIVIC SCORE'}
                </div>
            </div>

            <div className="ch-stat-card">
                <div className="ch-stat-value" style={{ color: '#e8507a' }}>
                    {participationScore ?? '—'}
                </div>
                <div className="ch-stat-label">
                    {isRTL ? 'مشارکت' : 'PARTICIPATION'}
                </div>
            </div>

            <div className="ch-stat-card">
                <div className="ch-stat-value" style={{ color: '#69d98c' }}>
                    {streakDays ?? 0}<span className="ch-stat-suffix">d</span>
                </div>
                <div className="ch-stat-label">
                    {isRTL ? 'روزهای متوالی' : 'STREAK'}
                </div>
            </div>

            <div className="ch-stat-card">
                <div className="ch-stat-value" style={{ color: tierColor }}>
                    {trustTier ?? 'NONE'}
                </div>
                <div className="ch-stat-label">
                    {isRTL ? 'سطح اعتماد' : 'TRUST TIER'}
                </div>
            </div>
        </div>
    );
}
