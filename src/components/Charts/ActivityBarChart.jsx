import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import './Charts.css';

function formatXLabel(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityBarChart({ data = [] }) {
    const chartData = data.map((item) => ({
        ...item,
        label: formatXLabel(item.date),
    }));

    return (
        <div className="ch-card">
            <p className="ch-card-title">PARTICIPATION TREND</p>
            {chartData.length === 0 ? (
                <div className="ch-empty">No data yet</div>
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                        <CartesianGrid
                            stroke="rgba(255,255,255,0.05)"
                            strokeDasharray="3 3"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="label"
                            tick={{ fill: '#666', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fill: '#666', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(232,80,122,0.08)' }}
                            contentStyle={{
                                background: '#0d1117',
                                border: '1px solid rgba(232,80,122,0.3)',
                                borderRadius: 6,
                                fontSize: 11,
                                color: '#CCE3F0',
                            }}
                            labelStyle={{ color: '#8aa8bc' }}
                            itemStyle={{ color: '#e8507a' }}
                        />
                        <Bar
                            dataKey="score"
                            fill="#e8507a"
                            radius={[3, 3, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
