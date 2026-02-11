'use client';

/**
 * Edit Palenque Page
 * Form to edit an existing palenque
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface PalenqueData {
  id: number;
  nombre: string;
  ubicacion: string;
  telefono_contacto: string;
  email_contacto: string;
  whatsapp_phone_number: string;
  plan: string;
  activo: boolean;
  usuario_email: string;
  usuario_nombre: string;
  usuario_activo: boolean;
  total_leads: number;
}

export default function EditPalenquePage() {
  const router = useRouter();
  const params = useParams();
  const palenqueId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [palenque, setPalenque] = useState<PalenqueData | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    telefono_contacto: '',
    email_contacto: '',
    whatsapp_phone_number: '',
    plan: 'basico',
    activo: true,
  });

  useEffect(() => {
    fetchPalenque();
  }, [palenqueId]);

  const fetchPalenque = async () => {
    try {
      const response = await fetch(`/api/admin/palenques/${palenqueId}`);
      if (!response.ok) throw new Error('Error al cargar palenque');

      const data = await response.json();
      setPalenque(data);
      setFormData({
        nombre: data.nombre,
        ubicacion: data.ubicacion || '',
        telefono_contacto: data.telefono_contacto || '',
        email_contacto: data.email_contacto,
        whatsapp_phone_number: data.whatsapp_phone_number || '',
        plan: data.plan,
        activo: data.activo,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/palenques/${palenqueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar palenque');
      }

      // Success - redirect to list
      router.push('/admin/palenques');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando palenque...</p>
        </div>
      </div>
    );
  }

  if (!palenque) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Palenque no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <Link
          href="/admin/palenques"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver a Palenques
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Editar Palenque</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">{palenque.nombre}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Total Leads</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{palenque.total_leads}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Usuario</p>
          <p className="text-lg font-medium text-gray-900 mt-2">
            {palenque.usuario_email || 'Sin usuario'}
          </p>
          {palenque.usuario_email && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
              palenque.usuario_activo
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {palenque.usuario_activo ? 'Activo' : 'Inactivo'}
            </span>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Plan Actual</p>
          <p className="text-lg font-medium text-gray-900 mt-2 capitalize">
            {palenque.plan}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          {/* Información del Palenque */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Palenque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Palenque <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* Ubicación */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* Email Contacto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de Contacto <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email_contacto"
                  required
                  value={formData.email_contacto}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  name="telefono_contacto"
                  value={formData.telefono_contacto}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Business
                </label>
                <input
                  type="tel"
                  name="whatsapp_phone_number"
                  value={formData.whatsapp_phone_number}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan <span className="text-red-500">*</span>
                </label>
                <select
                  name="plan"
                  required
                  value={formData.plan}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="basico">Básico</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              {/* Estado */}
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-700">
                    Palenque activo
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Desactivar un palenque también desactivará su usuario asociado
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <Link
            href="/admin/palenques"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
