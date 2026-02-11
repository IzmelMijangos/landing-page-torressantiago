'use client';

/**
 * Admin Reports Page
 * Analytics and reports for the entire system
 */

import { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface ReportMetrics {
  totalPalenques: number;
  totalLeads: number;
  leadsThisMonth: number;
  leadsLastMonth: number;
  conversionRate: string;
  topPalenques: Array<{
    id: number;
    nombre: string;
    total_leads: number;
    convertidos: number;
  }>;
}

export default function ReportesPage() {
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/admin/metrics');
      if (!response.ok) throw new Error('Error al cargar reportes');

      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type: 'csv' | 'pdf') => {
    alert(`Exportando reporte como ${type.toUpperCase()}...\nEsta funcionalidad estará disponible próximamente.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reportes y Analíticas</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Métricas generales del sistema</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-3 sm:gap-0">
          <button
            onClick={() => exportReport('csv')}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Exportar PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Período de Análisis
        </label>
        <div className="flex space-x-3">
          {[
            { value: 'week', label: 'Última Semana' },
            { value: 'month', label: 'Último Mes' },
            { value: 'quarter', label: 'Último Trimestre' },
            { value: 'year', label: 'Último Año' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                dateRange === option.value
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BuildingStorefrontIcon className="h-10 w-10 text-amber-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Palenques Activos</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalPalenques || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-10 w-10 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalLeads || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CalendarIcon className="h-10 w-10 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Leads Este Mes</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.leadsThisMonth || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-10 w-10 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Tasa Conversión</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.conversionRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Palenques */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Palenques con Mejor Rendimiento</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Palenque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Leads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Convertidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tasa Conversión
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics?.recentPalenques && metrics.recentPalenques.length > 0 ? (
                metrics.recentPalenques.slice(0, 5).map((palenque) => {
                  const totalLeads = parseInt(palenque.total_leads?.toString() || '0');
                  const conversionRate = totalLeads > 0 ? ((0 / totalLeads) * 100).toFixed(1) : '0';

                  return (
                    <tr key={palenque.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{palenque.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {totalLeads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{conversionRate}%</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-3">
          {metrics?.recentPalenques && metrics.recentPalenques.length > 0 ? (
            metrics.recentPalenques.slice(0, 5).map((palenque) => {
              const totalLeads = parseInt(palenque.total_leads?.toString() || '0');
              const conversionRate = totalLeads > 0 ? ((0 / totalLeads) * 100).toFixed(1) : '0';

              return (
                <div key={palenque.id} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{palenque.nombre}</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Leads</p>
                      <p className="text-lg font-bold text-gray-900">{totalLeads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Convertidos</p>
                      <p className="text-lg font-bold text-gray-900">0</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Conversión</p>
                      <p className="text-lg font-bold text-gray-900">{conversionRate}%</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
          )}
        </div>
      </div>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Actividad</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Leads Nuevos (Este Mes)</span>
              <span className="text-lg font-bold text-green-600">+{metrics?.leadsThisMonth || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Leads Mes Anterior</span>
              <span className="text-lg font-bold text-gray-900">{metrics?.leadsLastMonth || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Crecimiento</span>
              <span className="text-lg font-bold text-blue-600">
                {metrics?.leadsLastMonth
                  ? `${(((metrics.leadsThisMonth - metrics.leadsLastMonth) / metrics.leadsLastMonth) * 100).toFixed(1)}%`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Reportes</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Reporte Mensual - Próximamente</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Análisis de Tendencias - Próximamente</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Reportes Personalizados - Próximamente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
