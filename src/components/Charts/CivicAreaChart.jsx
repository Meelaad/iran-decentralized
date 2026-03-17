import React from 'react';
import {
    AreaChart,
    Area,
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

export default function CivicAreaChart({ data = [] }) {
    const chartData = data.map((item) => ({
        ...item,
        label: formatXLabel(item.date),
    }));

    return (
        <div className="ch-card">
            <p className="ch-card-title">CIVIC SCORE TREND</p>
            {chartData.length === 0 ? (
                <div className="ch-empty">No data yet</div>
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="civicGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
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
                            cursor={{ stroke: 'rgba(139,92,246,0.2)', strokeWidth: 1 }}
                            contentStyle={{
                                background: '#0d1117',
                                border: '1px solid rgba(232,80,122,0.3)',
                                borderRadius: 6,
                                fontSize: 11,
                                color: '#CCE3F0',
                            }}
                            labelStyle={{ color: '#8aa8bc' }}
                            itemStyle={{ color: '#8B5CF6' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            fill="url(#civicGradient)"
                            dot={false}
                            activeDot={{ r: 4, fill: '#8B5CF6', strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
