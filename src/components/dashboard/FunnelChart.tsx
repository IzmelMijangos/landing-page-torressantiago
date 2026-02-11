'use client';

/**
 * Funnel Chart
 * Bar chart showing the sales funnel stages
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FunnelChartProps {
  funnel: {
    nuevo: number;
    contactado: number;
    respondio: number;
    convertido: number;
    inactivo: number;
    opt_out: number;
  };
}

const COLORS = {
  nuevo: '#3b82f6',
  contactado: '#eab308',
  respondio: '#f97316',
  convertido: '#10b981',
  inactivo: '#6b7280',
  opt_out: '#ef4444',
};

const LABELS = {
  nuevo: 'Nuevos',
  contactado: 'Contactados',
  respondio: 'Respondieron',
  convertido: 'Convertidos',
  inactivo: 'Inactivos',
  opt_out: 'Opt-out',
};

export default function FunnelChart({ funnel }: FunnelChartProps) {
  // Prepare data for chart
  const data = [
    { name: 'Nuevos', value: funnel.nuevo, color: COLORS.nuevo },
    { name: 'Contactados', value: funnel.contactado, color: COLORS.contactado },
    { name: 'Respondieron', value: funnel.respondio, color: COLORS.respondio },
    { name: 'Convertidos', value: funnel.convertido, color: COLORS.convertido },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis
          dataKey="name"
          type="category"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
          }}
          cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
