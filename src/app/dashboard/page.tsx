'use client';

/**
 * Palenque Dashboard
 * Dashboard for palenque users to view their leads and metrics
 */

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import LeadsTimelineChart from '@/components/dashboard/LeadsTimelineChart';
import FunnelChart from '@/components/dashboard/FunnelChart';
import OriginPieChart from '@/components/dashboard/OriginPieChart';
import AttentionRequired from '@/components/dashboard/AttentionRequired';
import LeadQuickActions from '@/components/dashboard/LeadQuickActions';
import ActiveFilters from '@/components/dashboard/ActiveFilters';

interface Metrics {
  palenque: string;
  plan: string;
  totalLeads: number;
  leadsThisMonth: number;
  conversionRate: string;
  funnel: {
    nuevo: number;
    contactado: number;
    respondio: number;
    convertido: number;
    inactivo: number;
    opt_out: number;
  };
  leadsByOrigin: Array<{ origen: string; count: number }>;
  leadsOverTime: Array<{ fecha: string; count: number }>;
  alerts: {
    newToday: number;
    waitingResponse: number;
    highRatingUnconverted: number;
  };
  revenue: {
    thisMonth: number;
    lastMonth: number;
    momChange: number;
    bestHour: string;
    bestDay: string;
  };
}

interface Lead {
  id: number;
  uuid: string;
  nombre: string;
  telefono: string;
  email: string;
  ciudad: string;
  mezcal_probado: string;
  experiencia_calificacion: number;
  origen: string;
  fecha_captura: string;
  estado: string;
  fecha_ultima_interaccion: string;
  acepto_ofertas: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [origenFilter, setOrigenFilter] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchMetrics();
      fetchLeads();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchLeads();
    }
  }, [search, estadoFilter, origenFilter]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/dashboard/metrics');
      if (!response.ok) throw new Error('Error al cargar métricas');

      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (estadoFilter) params.append('estado', estadoFilter);
      if (origenFilter) params.append('origen', origenFilter);

      const response = await fetch(`/api/dashboard/leads?${params}`);
      if (!response.ok) throw new Error('Error al cargar leads');

      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLeadsLoading(false);
    }
  };

  // Alert filter handlers
  const handleFilterNewToday = () => {
    setEstadoFilter('nuevo');
    setSearch('');
    setOrigenFilter('');
    // Scroll to leads table
    document.querySelector('#leads-table')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterWaitingResponse = () => {
    setEstadoFilter('contactado');
    setSearch('');
    setOrigenFilter('');
    document.querySelector('#leads-table')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterHighRating = () => {
    setEstadoFilter('');
    setSearch('');
    setOrigenFilter('');
    // Note: This will show all leads, user can manually filter by 5 stars
    // To do this properly we'd need to add a rating filter
    document.querySelector('#leads-table')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Status change handler
  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/dashboard/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      // Refresh leads and metrics
      await Promise.all([fetchLeads(), fetchMetrics()]);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el estado del lead');
    }
  };

  // Filter removal handlers
  const handleRemoveSearch = () => setSearch('');
  const handleRemoveEstado = () => setEstadoFilter('');
  const handleRemoveOrigen = () => setOrigenFilter('');
  const handleClearAllFilters = () => {
    setSearch('');
    setEstadoFilter('');
    setOrigenFilter('');
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      alert('No hay leads para exportar');
      return;
    }

    // CSV headers
    const headers = ['Nombre', 'Teléfono', 'Email', 'Ciudad', 'Origen', 'Estado', 'Fecha Captura', 'Calificación'];

    // CSV rows
    const rows = leads.map(lead => [
      lead.nombre,
      lead.telefono,
      lead.email || '',
      lead.ciudad || '',
      lead.origen.replace('_', ' '),
      lead.estado,
      new Date(lead.fecha_captura).toLocaleDateString('es-MX'),
      lead.experiencia_calificacion || '',
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const totalFunnelLeads =
    (metrics?.funnel.nuevo || 0) +
    (metrics?.funnel.contactado || 0) +
    (metrics?.funnel.respondio || 0) +
    (metrics?.funnel.convertido || 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{metrics?.palenque}</h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Plan: <span className="font-medium capitalize">{metrics?.plan}</span>
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm sm:text-base"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
            <span className="sm:hidden">Salir</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Attention Required Section */}
        {metrics?.alerts && (
          <AttentionRequired
            newToday={metrics.alerts.newToday}
            waitingResponse={metrics.alerts.waitingResponse}
            highRatingUnconverted={metrics.alerts.highRatingUnconverted}
            onFilterNew={handleFilterNewToday}
            onFilterWaiting={handleFilterWaitingResponse}
            onFilterHighRating={handleFilterHighRating}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue This Month */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Ingresos este Mes</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${metrics?.revenue?.thisMonth.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || 0}
                </p>
                {metrics?.revenue && (
                  <p className={`text-xs mt-1 flex items-center ${
                    metrics.revenue.momChange > 0 ? 'text-green-600' : metrics.revenue.momChange < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {metrics.revenue.momChange > 0 ? '↑' : metrics.revenue.momChange < 0 ? '↓' : '→'}
                    <span className="ml-1">
                      {Math.abs(metrics.revenue.momChange)}% vs mes anterior
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Leads This Month */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Leads este Mes</p>
                <p className="text-3xl font-bold text-gray-900">{metrics?.leadsThisMonth || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics?.totalLeads || 0} totales
                </p>
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Tasa Conversión</p>
                <p className="text-3xl font-bold text-gray-900">{metrics?.conversionRate || 0}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics?.funnel?.convertido || 0} convertidos
                </p>
              </div>
            </div>
          </div>

          {/* Best Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Mejor Hora</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.revenue?.bestHour || 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics?.revenue?.bestDay || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Chart */}
        {metrics?.leadsOverTime && metrics.leadsOverTime.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
              <span className="text-sm sm:text-base">Leads en el Tiempo (30 días)</span>
            </h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[300px]">
                <LeadsTimelineChart data={metrics.leadsOverTime} />
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Funnel Chart */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <FunnelIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-amber-600" />
              <span className="text-sm sm:text-base">Embudo Visual</span>
            </h2>
            <FunnelChart funnel={metrics?.funnel || { nuevo: 0, contactado: 0, respondio: 0, convertido: 0, inactivo: 0, opt_out: 0 }} />
          </div>

          {/* Origin Pie Chart */}
          {metrics?.leadsByOrigin && metrics.leadsByOrigin.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                Distribución por Origen
              </h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[250px]">
                  <OriginPieChart data={metrics.leadsByOrigin} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sales Funnel Cards */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <FunnelIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-amber-600" />
            <span className="text-sm sm:text-base">Embudo de Ventas Detallado</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Nuevo */}
            <div className="relative">
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-1">Nuevos</p>
                <p className="text-3xl font-bold text-blue-900">{metrics?.funnel.nuevo || 0}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {totalFunnelLeads > 0
                    ? ((metrics?.funnel.nuevo || 0) / totalFunnelLeads * 100).toFixed(0)
                    : 0}% del total
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                <div className="text-gray-400">→</div>
              </div>
            </div>

            {/* Contactado */}
            <div className="relative">
              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                <p className="text-sm font-medium text-yellow-800 mb-1">Contactados</p>
                <p className="text-3xl font-bold text-yellow-900">{metrics?.funnel.contactado || 0}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  {totalFunnelLeads > 0
                    ? ((metrics?.funnel.contactado || 0) / totalFunnelLeads * 100).toFixed(0)
                    : 0}% del total
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                <div className="text-gray-400">→</div>
              </div>
            </div>

            {/* Respondió */}
            <div className="relative">
              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                <p className="text-sm font-medium text-orange-800 mb-1">Respondieron</p>
                <p className="text-3xl font-bold text-orange-900">{metrics?.funnel.respondio || 0}</p>
                <p className="text-xs text-orange-600 mt-1">
                  {totalFunnelLeads > 0
                    ? ((metrics?.funnel.respondio || 0) / totalFunnelLeads * 100).toFixed(0)
                    : 0}% del total
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                <div className="text-gray-400">→</div>
              </div>
            </div>

            {/* Convertido */}
            <div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <p className="text-sm font-medium text-green-800 mb-1">Convertidos</p>
                <p className="text-3xl font-bold text-green-900">{metrics?.funnel.convertido || 0}</p>
                <p className="text-xs text-green-600 mt-1">
                  {totalFunnelLeads > 0
                    ? ((metrics?.funnel.convertido || 0) / totalFunnelLeads * 100).toFixed(0)
                    : 0}% del total
                </p>
              </div>
            </div>
          </div>

          {/* Inactive/Opt-out */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs font-medium text-gray-600">Inactivos</p>
              <p className="text-xl font-bold text-gray-700">{metrics?.funnel.inactivo || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs font-medium text-gray-600">Opt-out</p>
              <p className="text-xl font-bold text-gray-700">{metrics?.funnel.opt_out || 0}</p>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div id="leads-table" className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Mis Leads</h2>
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar CSV
            </button>
          </div>

          {/* Filters */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, teléfono o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-search"
                />
              </div>

              {/* Estado Filter */}
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="select-field"
              >
                <option value="">Todos los estados</option>
                <option value="nuevo">Nuevo</option>
                <option value="contactado">Contactado</option>
                <option value="respondio">Respondió</option>
                <option value="convertido">Convertido</option>
                <option value="inactivo">Inactivo</option>
                <option value="opt_out">Opt-out</option>
              </select>

              {/* Origen Filter */}
              <select
                value={origenFilter}
                onChange={(e) => setOrigenFilter(e.target.value)}
                className="select-field"
              >
                <option value="">Todos los orígenes</option>
                <option value="qr_barra">QR Barra</option>
                <option value="qr_mesa">QR Mesa</option>
                <option value="manual">Manual</option>
                <option value="evento">Evento</option>
                <option value="web">Web</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="px-4 sm:px-6 py-2">
            <ActiveFilters
              search={search}
              estadoFilter={estadoFilter}
              origenFilter={origenFilter}
              onRemoveSearch={handleRemoveSearch}
              onRemoveEstado={handleRemoveEstado}
              onRemoveOrigen={handleRemoveOrigen}
              onClearAll={handleClearAllFilters}
            />
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Origen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha Captura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Calificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!leadsLoading && leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.nombre}</div>
                        {lead.ciudad && <div className="text-sm text-gray-500">{lead.ciudad}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.telefono}</div>
                        {lead.email && <div className="text-sm text-gray-500">{lead.email}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">
                          {lead.origen.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          lead.estado === 'convertido'
                            ? 'bg-green-100 text-green-800'
                            : lead.estado === 'respondio'
                            ? 'bg-orange-100 text-orange-800'
                            : lead.estado === 'contactado'
                            ? 'bg-yellow-100 text-yellow-800'
                            : lead.estado === 'nuevo'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.estado === 'respondio' ? 'Respondió' : lead.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.fecha_captura).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.experiencia_calificacion ? (
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-1">
                              {lead.experiencia_calificacion}
                            </span>
                            <span className="text-yellow-400">★</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <LeadQuickActions
                          lead={lead}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                    </tr>
                  ))
                ) : leadsLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron leads
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {!leadsLoading && leads.length > 0 ? (
              leads.map((lead) => (
                <div key={lead.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{lead.nombre}</h3>
                      {lead.ciudad && <p className="text-sm text-gray-500">{lead.ciudad}</p>}
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      lead.estado === 'convertido'
                        ? 'bg-green-100 text-green-800'
                        : lead.estado === 'respondio'
                        ? 'bg-orange-100 text-orange-800'
                        : lead.estado === 'contactado'
                        ? 'bg-yellow-100 text-yellow-800'
                        : lead.estado === 'nuevo'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.estado === 'respondio' ? 'Respondió' : lead.estado}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Teléfono:</span>
                      <span className="font-medium text-gray-900">{lead.telefono}</span>
                    </div>
                    {lead.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900 truncate ml-2">{lead.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origen:</span>
                      <span className="text-gray-900 capitalize">{lead.origen.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="text-gray-900">{new Date(lead.fecha_captura).toLocaleDateString('es-MX')}</span>
                    </div>
                    {lead.experiencia_calificacion && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calificación:</span>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 mr-1">{lead.experiencia_calificacion}</span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <LeadQuickActions
                      lead={lead}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                </div>
              ))
            ) : leadsLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                No se encontraron leads
              </div>
            )}
          </div>

          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              {leads.length} lead{leads.length !== 1 ? 's' : ''} encontrado{leads.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
