'use client';

/**
 * Origin Pie Chart
 * Pie chart showing distribution of leads by origin
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OriginPieChartProps {
  data: Array<{ origen: string; count: number }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ORIGIN_LABELS: { [key: string]: string } = {
  qr_barra: 'QR Barra',
  qr_mesa: 'QR Mesa',
  manual: 'Manual',
  evento: 'Evento',
  web: 'Web',
};

export default function OriginPieChart({ data }: OriginPieChartProps) {
  // Format data for chart
  const chartData = data.map((item) => ({
    name: ORIGIN_LABELS[item.origen] || item.origen,
    value: item.count,
  }));

  // Custom label
  const renderLabel = (entry: any) => {
    const percent = ((entry.value / data.reduce((acc, curr) => acc + curr.count, 0)) * 100).toFixed(0);
    return `${entry.name} (${percent}%)`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
