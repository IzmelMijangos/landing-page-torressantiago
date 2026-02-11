'use client';

/**
 * Leads Timeline Chart
 * Line chart showing leads captured over time
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LeadsTimelineChartProps {
  data: Array<{
    fecha: string;
    count: number;
    convertidos: number;
  }>;
}

export default function LeadsTimelineChart({ data }: LeadsTimelineChartProps) {
  // Format data for chart
  const chartData = data.map((item) => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
    'Total Leads': item.count,
    'Convertidos': item.convertidos,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="fecha"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '14px' }}
        />
        <Line
          type="monotone"
          dataKey="Total Leads"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Convertidos"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
