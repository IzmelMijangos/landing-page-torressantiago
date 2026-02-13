'use client';

/**
 * New Palenque Page
 * Form to register a new palenque
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NuevoPalenquePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createUser, setCreateUser] = useState(true);

  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    telefono_contacto: '',
    email_contacto: '',
    whatsapp_phone_number: '',
    plan: 'basico',
    usuario_email: '',
    usuario_nombre: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare data
      const data: any = {
        nombre: formData.nombre,
        ubicacion: formData.ubicacion,
        telefono_contacto: formData.telefono_contacto,
        email_contacto: formData.email_contacto,
        whatsapp_phone_number: formData.whatsapp_phone_number,
        plan: formData.plan,
      };

      // Add user data if checkbox is checked
      if (createUser) {
        if (!formData.usuario_email) {
          setError('Email de usuario es requerido');
          setLoading(false);
          return;
        }

        data.crear_usuario = true;
        data.usuario_email = formData.usuario_email;
        data.usuario_nombre = formData.usuario_nombre || formData.nombre;
      }

      const response = await fetch('/api/admin/palenques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear palenque');
      }

      // Success - redirect to list
      router.push('/admin/palenques');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Registrar Nuevo Palenque</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Complete la información del palenque</p>
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
                  placeholder="Ej: Palenque Don Agustín"
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
                  placeholder="Ej: Oaxaca, México"
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
                  placeholder="contacto@palenque.com"
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
                  placeholder="+52 951 123 4567"
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
                  placeholder="+52 951 123 4567"
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
            </div>
          </div>

          {/* Crear Usuario */}
          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="createUser"
                checked={createUser}
                onChange={(e) => setCreateUser(e.target.checked)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="createUser" className="ml-2 block text-sm font-medium text-gray-700">
                Crear usuario de acceso para este palenque
              </label>
            </div>

            {createUser && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Credenciales de Usuario</h2>

                {/* Info Alert */}
                <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>El sistema generará automáticamente una contraseña temporal</strong> y la enviará por email al usuario.
                        El usuario deberá cambiar esta contraseña en su primer inicio de sesión.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Usuario */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Usuario <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="usuario_email"
                      required={createUser}
                      value={formData.usuario_email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="usuario@palenque.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Este será el email para iniciar sesión y recibirá la contraseña temporal
                    </p>
                  </div>

                  {/* Nombre Usuario */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo (opcional)
                    </label>
                    <input
                      type="text"
                      name="usuario_nombre"
                      value={formData.usuario_nombre}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Si no se proporciona, se usará el nombre del palenque"
                    />
                  </div>
                </div>
              </>
            )}
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
            disabled={loading}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Registrar Palenque'}
          </button>
        </div>
      </form>
    </div>
  );
}
