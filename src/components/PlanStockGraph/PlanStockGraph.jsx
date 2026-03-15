import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './PlanStockGraph.css';

export default function PlanStockGraph({ plans = [] }) {
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

  return (
    <div className="psg-root">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fill: '#9fb9c9' }} />
          <YAxis tick={{ fill: '#9fb9c9' }} />
          <Tooltip wrapperStyle={{ background: '#0d1f2d', border: 'none' }} />
          <Legend />
          {plans.map(p => (
            <Line
              key={p.id}
              type="monotone"
              dataKey={p.id}
              stroke={p.coverColor || '#4fc3f7'}
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
