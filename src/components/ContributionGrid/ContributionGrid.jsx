import React, { useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLang } from '../../contexts/LangContext';
import './ContributionGrid.css';

const WEEKS = 52;
const DAYS = 7;

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS = [
    { index: 1, label: 'Mon' },
    { index: 3, label: 'Wed' },
    { index: 5, label: 'Fri' },
];

function formatDate(date) {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function cellColor(count, maxCount) {
    if (!count) return 'rgba(255,255,255,0.04)';
    const intensity = Math.max(0.15, Math.min(1, count / (maxCount || 1)));
    return `rgba(232, 80, 122, ${intensity})`;
}

function computeStreak(grid) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    const cursor = new Date(today);
    while (true) {
        const key = cursor.toISOString().slice(0, 10);
        if ((grid[key] || 0) > 0) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

export default function ContributionGrid({ grid = {} }) {
    const { tKey, isRTL } = useLang();
    const [tooltip, setTooltip] = useState(null); // { text, x, y }

    const stats = useMemo(() => {
        const counts = Object.values(grid).filter(v => v > 0);
        const activeDays = counts.length;
        const peakDay = counts.length ? Math.max(...counts) : 0;
        const streak = computeStreak(grid);
        const maxCount = peakDay;
        return { activeDays, peakDay, streak, maxCount };
    }, [grid]);

    const matrix = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(today);
        start.setDate(today.getDate() - (WEEKS * DAYS) + 1);
        start.setDate(start.getDate() - start.getDay()); // align to Sunday

        const weeks = [];
        let cursor = new Date(start);

        for (let w = 0; w < WEEKS; w++) {
            const week = [];
            for (let d = 0; d < DAYS; d++) {
                const dateStr = cursor.toISOString().slice(0, 10);
                const isFuture = cursor > today;
                week.push({
                    dateStr,
                    count: isFuture ? null : (grid[dateStr] || 0),
                    date: new Date(cursor),
                    isFuture,
                });
                cursor.setDate(cursor.getDate() + 1);
            }
            weeks.push(week);
        }
        return weeks;
    }, [grid]);

    // Build month labels: for each week, check if the first day is in a new month
    const monthLabels = useMemo(() => {
        const labels = [];
        let lastMonth = -1;
        matrix.forEach((week, wi) => {
            const firstDay = week[0];
            if (!firstDay.isFuture) {
                const m = firstDay.date.getMonth();
                if (m !== lastMonth) {
                    labels.push({ wi, label: MONTH_ABBR[m] });
                    lastMonth = m;
                }
            }
        });
        return labels;
    }, [matrix]);

    const handleMouseEnter = useCallback((e, cell) => {
        if (cell.isFuture) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const text = cell.count
            ? tKey('contribution.tooltip', { count: cell.count, date: formatDate(cell.date) })
            : `${tKey('contribution.noActivity')} — ${formatDate(cell.date)}`;
        setTooltip({
            text,
            x: rect.left + rect.width / 2,
            y: rect.top - 6,
        });
    }, [tKey]);

    const handleMouseLeave = useCallback(() => setTooltip(null), []);

    const CELL_SIZE = 11;
    const CELL_GAP = 2;
    const STEP = CELL_SIZE + CELL_GAP;

    return (
        <div className="cg-root">
            {/* Title — matches energy dashboard style */}
            <div className="cg-header">
                <div className="cg-title-row">
                    <svg className="cg-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="cg-title">{isRTL ? 'فعالیت مشارکتی' : 'Participation Activity'}</span>
                </div>
                <p className="cg-subtitle">{isRTL ? 'الگوی مشارکت هفتگی در طول سال گذشته' : 'Weekly engagement patterns over the past year'}</p>
            </div>

            <div className="cg-stats-row">
                <div className="cg-stat-box">
                    <div className="cg-stat-value">{stats.activeDays}</div>
                    <div className="cg-stat-label">ACTIVE DAYS</div>
                </div>
                <div className="cg-stat-box">
                    <div className="cg-stat-value">{stats.peakDay}</div>
                    <div className="cg-stat-label">PEAK DAY</div>
                </div>
                <div className="cg-stat-box">
                    <div className="cg-stat-value">{stats.streak}</div>
                    <div className="cg-stat-label">STREAK</div>
                </div>
            </div>

            <p className="cg-section-title">{tKey('contribution.activityGrid')}</p>

            <div className="cg-chart-area">
                <div className="cg-day-labels">
                    {DAY_LABELS.map(({ index, label }) => (
                        <div
                            key={label}
                            className="cg-day-label"
                            style={{ top: index * STEP }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <div className="cg-scroll-area">
                    <div className="cg-month-labels">
                        {monthLabels.map(({ wi, label }) => (
                            <div
                                key={`${wi}-${label}`}
                                className="cg-month-label"
                                style={{ left: wi * STEP }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="cg-grid">
                        {matrix.map((week, wi) => (
                            <div key={wi} className="cg-week">
                                {week.map((cell, di) => (
                                    <div
                                        key={di}
                                        className="cg-cell"
                                        style={{
                                            background: cell.isFuture
                                                ? 'transparent'
                                                : cellColor(cell.count, stats.maxCount),
                                        }}
                                        aria-label={
                                            cell.isFuture
                                                ? ''
                                                : cell.count
                                                    ? tKey('contribution.tooltip', { count: cell.count, date: formatDate(cell.date) })
                                                    : tKey('contribution.noActivity')
                                        }
                                        onMouseEnter={(e) => handleMouseEnter(e, cell)}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Color legend — Low [...] High */}
            <div className="cg-legend">
                <span className="cg-legend-label">{isRTL ? 'کم' : 'Low'}</span>
                <div className="cg-legend-swatches">
                    {[0.1, 0.3, 0.5, 0.7, 0.9].map(op => (
                        <div key={op} className="cg-legend-swatch" style={{ background: `rgba(232,80,122,${op})` }} />
                    ))}
                </div>
                <span className="cg-legend-label">{isRTL ? 'زیاد' : 'High'}</span>
            </div>

            {tooltip && createPortal(
                <div
                    className="cg-tooltip"
                    style={{
                        position: 'fixed',
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translate(-50%, -100%)',
                        pointerEvents: 'none',
                    }}
                >
                    {tooltip.text}
                </div>,
                document.body
            )}
        </div>
    );
}
