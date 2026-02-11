'use client';

/**
 * Palenques List Page
 * Lists all palenques with search and filters
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface Palenque {
  id: number;
  uuid: string;
  nombre: string;
  ubicacion: string;
  telefono_contacto: string;
  email_contacto: string;
  whatsapp_phone_number: string;
  plan: string;
  activo: boolean;
  fecha_registro: string;
  total_leads: number;
}

export default function PalenquesPage() {
  const [palenques, setPalenques] = useState<Palenque[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [activoFilter, setActivoFilter] = useState('');

  useEffect(() => {
    fetchPalenques();
  }, [search, planFilter, activoFilter]);

  const fetchPalenques = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (planFilter) params.append('plan', planFilter);
      if (activoFilter) params.append('activo', activoFilter);

      const response = await fetch(`/api/admin/palenques?${params}`);
      if (!response.ok) throw new Error('Error al cargar palenques');

      const data = await response.json();
      setPalenques(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de desactivar el palenque "${nombre}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/palenques/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al desactivar palenque');

      fetchPalenques();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al desactivar palenque');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando palenques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Palenques</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Gestiona todos los palenques registrados</p>
        </div>
        <Link
          href="/admin/palenques/nuevo"
          className="flex items-center justify-center sm:justify-start px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition whitespace-nowrap"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Registrar Palenque</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-search"
              />
            </div>
          </div>

          {/* Plan Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan
            </label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="select-field"
            >
              <option value="">Todos</option>
              <option value="basico">Básico</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={activoFilter}
              onChange={(e) => setActivoFilter(e.target.value)}
              className="select-field"
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {palenques.length} palenque{palenques.length !== 1 ? 's' : ''} encontrado{palenques.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Palenque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {palenques.length > 0 ? (
                palenques.map((palenque) => (
                  <tr key={palenque.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{palenque.nombre}</div>
                      <div className="text-sm text-gray-500">{palenque.ubicacion || 'Sin ubicación'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{palenque.email_contacto}</div>
                      <div className="text-sm text-gray-500">{palenque.telefono_contacto || 'Sin teléfono'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        palenque.plan === 'enterprise'
                          ? 'bg-purple-100 text-purple-800'
                          : palenque.plan === 'premium'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {palenque.plan.charAt(0).toUpperCase() + palenque.plan.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {palenque.total_leads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        palenque.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {palenque.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(palenque.fecha_registro).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/palenques/${palenque.id}`}
                          className="text-amber-600 hover:text-amber-900"
                          title="Editar"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(palenque.id, palenque.nombre)}
                          className="text-red-600 hover:text-red-900"
                          title="Desactivar"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FunnelIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">No se encontraron palenques</p>
                      <p className="mt-2">Intenta ajustar los filtros o registra un nuevo palenque</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {palenques.length > 0 ? (
          palenques.map((palenque) => (
            <div key={palenque.id} className="bg-white rounded-lg shadow p-4">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{palenque.nombre}</h3>
                  <p className="text-sm text-gray-500">{palenque.ubicacion || 'Sin ubicación'}</p>
                </div>
                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                  palenque.activo
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {palenque.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {/* Info Grid */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900 font-medium">{palenque.email_contacto}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Teléfono:</span>
                  <span className="text-gray-900">{palenque.telefono_contacto || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plan:</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    palenque.plan === 'enterprise'
                      ? 'bg-purple-100 text-purple-800'
                      : palenque.plan === 'premium'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {palenque.plan.charAt(0).toUpperCase() + palenque.plan.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Leads:</span>
                  <span className="text-gray-900 font-semibold">{palenque.total_leads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fecha registro:</span>
                  <span className="text-gray-900">{new Date(palenque.fecha_registro).toLocaleDateString('es-MX')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <Link
                  href={`/admin/palenques/${palenque.id}`}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(palenque.id, palenque.nombre)}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Desactivar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FunnelIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-900">No se encontraron palenques</p>
            <p className="mt-2 text-sm text-gray-500">Intenta ajustar los filtros o registra un nuevo palenque</p>
          </div>
        )}
      </div>
    </div>
  );
}
