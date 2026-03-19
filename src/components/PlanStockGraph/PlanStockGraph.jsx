import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLang } from '../../contexts/LangContext';
import './PlanStockGraph.css';

function formatDate(d) {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
}

export default function PlanStockGraph({ plans = [] }) {
  const { isRTL } = useLang();
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const tickColor = isLight ? '#4a6275' : '#9fb9c9';
  const tooltipBg = isLight ? '#f0f4f8' : '#0d1f2d';
  const tooltipBorder = isLight ? '1px solid #d0dce8' : 'none';

  const dates = new Set();
  plans.forEach(p => (p.stats || []).forEach(s => dates.add(s.stat_date)));
  const sortedDates = Array.from(dates).sort();
  const data = sortedDates.map(date => {
    const row = { date };
    plans.forEach(p => {
      const s = (p.stats || []).find(x => x.stat_date === date);
      row[p.id] = s ? s.endorsement_count : null;
    });
    return row;
  });

  const legendFormatter = (value) => {
    const plan = plans.find(p => p.id === value);
    const name = isRTL ? plan?.name?.fa : plan?.name?.en;
    return <span style={{ color: tickColor, fontSize: 12 }}>{name || value}</span>;
  };

  return (
    <div className="psg-root">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fill: tickColor, fontSize: 11 }} />
          <YAxis tick={{ fill: tickColor, fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            wrapperStyle={{ background: tooltipBg, border: tooltipBorder, borderRadius: 6, fontSize: 12 }}
            labelFormatter={formatDate}
          />
          <Legend formatter={legendFormatter} />
          {plans.map(p => (
            <Line
              key={p.id}
              type="monotone"
              dataKey={p.id}
              stroke={p.coverColor || '#8B5CF6'}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
