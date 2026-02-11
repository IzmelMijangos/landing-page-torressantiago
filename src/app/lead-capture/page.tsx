'use client';

/**
 * Lead Capture Page
 * Página de captura de leads desde QR codes de palenques
 * URL: /lead-capture?palenque=ID
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function LeadCapturePage() {
  const searchParams = useSearchParams();
  const palenqueId = searchParams.get('palenque');

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    ciudad: '',
    mezcal_probado: '',
    experiencia_calificacion: '5',
    acepto_terminos: false,
    acepto_ofertas: true,
  });

  const [palenqueInfo, setPalenqueInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Cargar información del palenque
  useEffect(() => {
    if (palenqueId) {
      fetchPalenqueInfo();
    }
  }, [palenqueId]);

  const fetchPalenqueInfo = async () => {
    try {
      const response = await fetch(`/api/palenques/${palenqueId}/info`);
      if (response.ok) {
        const data = await response.json();
        setPalenqueInfo(data);
      }
    } catch (err) {
      console.error('Error cargando info del palenque:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!palenqueId) {
      setError('QR Code inválido. Por favor escanea el código nuevamente.');
      return;
    }

    if (!formData.acepto_terminos) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Enviar a la API local que luego redirige a n8n
      const response = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          palenque_id: parseInt(palenqueId),
          origen: 'qr_code',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar tu información');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el formulario. Intenta nuevamente.');
      setLoading(false);
    }
  };

  // Pantalla de error si no hay palenque_id
  if (!palenqueId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">QR Code Inválido</h1>
          <p className="text-gray-600 mb-6">
            Por favor escanea un código QR válido proporcionado por el palenque.
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de éxito
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircleIcon className="h-20 w-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Gracias por registrarte!</h1>
          <p className="text-gray-600 mb-6">
            {palenqueInfo?.nombre && `${palenqueInfo.nombre} `}
            se pondrá en contacto contigo muy pronto vía WhatsApp.
          </p>
          <p className="text-sm text-gray-500">
            Revisa tu WhatsApp en los próximos minutos 📱
          </p>
        </div>
      </div>
    );
  }

  // Formulario principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 rounded-full mb-4">
            <span className="text-3xl">🥃</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {palenqueInfo?.nombre || 'Registro de Contacto'}
          </h1>
          <p className="text-gray-600">
            Déjanos tus datos y recibe información exclusiva sobre nuestros mezcales
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (WhatsApp) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="telefono"
              required
              value={formData.telefono}
              onChange={handleChange}
              className="input-field"
              placeholder="+52 951 123 4567"
              pattern="[\+]?[0-9]{10,15}"
            />
            <p className="mt-1 text-xs text-gray-500">
              Incluye código de país. Ej: +52 para México
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="tu@email.com"
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ciudad"
              required
              value={formData.ciudad}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: Oaxaca"
            />
          </div>

          {/* Mezcal Probado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Qué mezcal probaste hoy? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {['Espadín', 'Tobalá', 'Madrecuishe', 'Ensamble', 'Otro'].map((mezcal) => (
                <label key={mezcal} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="mezcal_probado"
                    value={mezcal}
                    required
                    checked={formData.mezcal_probado === mezcal}
                    onChange={handleChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700 group-hover:text-gray-900">
                    {mezcal}
                  </span>
                </label>
              ))}
            </div>
            {formData.mezcal_probado === 'Otro' && (
              <input
                type="text"
                name="mezcal_otro"
                placeholder="¿Cuál mezcal probaste?"
                className="input-field mt-3"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    mezcal_probado: e.target.value || 'Otro'
                  });
                }}
              />
            )}
          </div>

          {/* Calificación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo fue tu experiencia? <span className="text-red-500">*</span>
            </label>
            <select
              name="experiencia_calificacion"
              value={formData.experiencia_calificacion}
              onChange={handleChange}
              className="select-field"
            >
              <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
              <option value="4">⭐⭐⭐⭐ Muy buena</option>
              <option value="3">⭐⭐⭐ Buena</option>
              <option value="2">⭐⭐ Regular</option>
              <option value="1">⭐ Mala</option>
            </select>
          </div>

          {/* Términos y Condiciones */}
          <div className="border-t pt-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="acepto_terminos"
                name="acepto_terminos"
                checked={formData.acepto_terminos}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="acepto_terminos" className="ml-3 text-sm text-gray-700">
                Acepto los{' '}
                <a href="/politica-privacidad" target="_blank" className="text-amber-600 hover:text-amber-700 underline">
                  términos y condiciones
                </a>{' '}
                y la política de privacidad <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                id="acepto_ofertas"
                name="acepto_ofertas"
                checked={formData.acepto_ofertas}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="acepto_ofertas" className="ml-3 text-sm text-gray-700">
                Acepto recibir ofertas y promociones especiales vía WhatsApp
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enviando...
              </span>
            ) : (
              '¡Registrarme y recibir ofertas! 🎁'
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Al registrarte, recibirás un mensaje de bienvenida en WhatsApp
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Powered by <span className="font-semibold">Torres Santiago</span>
        </p>
      </div>
    </div>
  );
}
