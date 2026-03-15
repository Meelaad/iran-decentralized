import React, { useMemo, useState } from 'react';
import { useLang } from '../../contexts/LangContext';
import './ContributionGrid.css';

const WEEKS = 52;
const DAYS  = 7; // 0=Sun … 6=Sat

function cellColor(count) {
    if (!count) return '#0d1117';
    if (count >= 5) return '#69d98c';
    if (count >= 3) return '#7c72e8';
    if (count >= 1) return '#4fc3f7';
    return '#0d1117';
}

function formatDate(date) {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ContributionGrid({ grid = {} }) {
    const { tKey } = useLang();
    const [tooltip, setTooltip] = useState(null); // { text, x, y }

    // Build a 52×7 matrix of { dateStr, count }
    const matrix = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Align start to the Sunday 52 weeks ago
        const start = new Date(today);
        start.setDate(today.getDate() - (WEEKS * DAYS) + 1);
        // Move start back to previous Sunday
        start.setDate(start.getDate() - start.getDay());

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

    return (
        <div className="cg-root">
            <p className="cg-label">{tKey('contribution.activityGrid')}</p>
            <div className="cg-grid">
                {matrix.map((week, wi) => (
                    <div key={wi} className="cg-week">
                        {week.map((cell, di) => (
                            <div
                                key={di}
                                className="cg-cell"
                                style={{ background: cell.isFuture ? 'transparent' : cellColor(cell.count) }}
                                aria-label={
                                    cell.isFuture
                                        ? ''
                                        : cell.count
                                            ? tKey('contribution.tooltip', { count: cell.count, date: formatDate(cell.date) })
                                            : tKey('contribution.noActivity')
                                }
                                onMouseEnter={(e) => {
                                    if (cell.isFuture) return;
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const parentRect = e.currentTarget.closest('.cg-root').getBoundingClientRect();
                                    const text = cell.count
                                        ? tKey('contribution.tooltip', { count: cell.count, date: formatDate(cell.date) })
                                        : `${tKey('contribution.noActivity')} — ${formatDate(cell.date)}`;
                                    setTooltip({
                                        text,
                                        x: rect.left - parentRect.left + rect.width / 2,
                                        y: rect.top  - parentRect.top  - 6,
                                    });
                                }}
                                onMouseLeave={() => setTooltip(null)}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {tooltip && (
                <div
                    className="cg-tooltip"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    );
}
