'use client';

/**
 * Lead Capture Form - IMPROVED UX/UI Version
 * Multi-step form optimized for mobile and conversion
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, SparklesIcon, GiftIcon, LockClosedIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

// Mezcal options with emojis
const MEZCALES = [
  { id: 'espadin', name: 'Espadín', emoji: '🌿', description: 'Clásico y suave' },
  { id: 'tobala', name: 'Tobalá', emoji: '🍃', description: 'Premium silvestre' },
  { id: 'madrecuishe', name: 'Madrecuishe', emoji: '🌵', description: 'Intenso y único' },
  { id: 'ensamble', name: 'Ensamble', emoji: '🎭', description: 'Mezcla especial' },
  { id: 'otro', name: 'Otro', emoji: '✨', description: 'Cuéntanos cuál' },
];

function LeadCaptureFormImproved() {
  const searchParams = useSearchParams();
  const palenqueId = searchParams.get('palenque');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    ciudad: '',
    mezcal_probado: '',
    mezcal_otro: '',
    experiencia_calificacion: 5,
    acepto_terminos: false,
    acepto_ofertas: true,
  });

  const [palenqueInfo, setPalenqueInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  // Auto-format phone number
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `+${numbers}`;
    if (numbers.length <= 4) return `+${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    if (numbers.length <= 7) return `+${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5)}`;
    if (numbers.length <= 10) return `+${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8)}`;
    return `+${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 12)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = e.currentTarget.checked;

    let newValue = type === 'checkbox' ? checked : value;

    // Auto-format phone
    if (name === 'telefono') {
      newValue = formatPhoneNumber(value);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.nombre.trim()) errors.nombre = 'Tu nombre es necesario';
      if (!formData.telefono.trim()) errors.telefono = 'Tu WhatsApp es necesario';
      if (formData.telefono.replace(/\D/g, '').length < 12) {
        errors.telefono = 'Número incompleto (ej: +52 951 123 4567)';
      }
    }

    if (step === 2) {
      if (!formData.mezcal_probado) errors.mezcal_probado = 'Selecciona un mezcal';
    }

    if (step === 3) {
      if (!formData.acepto_terminos) errors.acepto_terminos = 'Debes aceptar los términos';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          telefono: formData.telefono.replace(/\s/g, ''), // Eliminar espacios
          mezcal_probado: formData.mezcal_probado === 'otro' ? formData.mezcal_otro : formData.mezcal_probado,
          palenque_id: parseInt(palenqueId!),
          origen: 'qr_mesa',
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

  // Error screen
  if (!palenqueId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">QR Code Inválido</h1>
          <p className="text-gray-600 mb-6">
            Por favor escanea un código QR válido proporcionado por el palenque.
          </p>
        </div>
      </div>
    );
  }

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="relative">
            <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto animate-bounce" />
            <SparklesIcon className="h-8 w-8 text-yellow-400 absolute top-0 right-1/4 animate-pulse" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Felicidades! 🎉</h1>
            <p className="text-lg text-green-600 font-semibold mb-4">
              Ya eres parte del Club VIP
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 space-y-3">
            <GiftIcon className="h-12 w-12 text-amber-600 mx-auto" />
            <p className="text-gray-800 font-medium">
              Tu cupón de 10% de descuento va en camino
            </p>
            <p className="text-sm text-gray-600">
              Revisa tu WhatsApp en los próximos minutos 📱
            </p>
          </div>

          <div className="pt-4 space-y-2 text-sm text-gray-600">
            <p>✨ Ofertas exclusivas cada semana</p>
            <p>🎁 Regalos sorpresa para miembros VIP</p>
            <p>🥃 Acceso anticipado a nuevos mezcales</p>
          </div>

          <div className="pt-6 border-t">
            <p className="text-xs text-gray-500">
              {palenqueInfo?.nombre || 'Nos'} vemos pronto 👋
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Progress indicator
  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4 shadow-lg">
            <span className="text-4xl">🥃</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {palenqueInfo?.nombre || '¡Gracias por visitarnos!'}
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Únete al <span className="font-bold text-amber-600">Club VIP</span> y recibe:
          </p>

          {/* Benefits */}
          <div className="flex justify-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <GiftIcon className="h-5 w-5 text-amber-600" />
              <span>10% descuento</span>
            </div>
            <div className="flex items-center gap-1">
              <SparklesIcon className="h-5 w-5 text-amber-600" />
              <span>Ofertas VIP</span>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <LockClosedIcon className="h-4 w-4" />
              <span>Datos seguros</span>
            </div>
            <div className="flex items-center gap-1">
              <UserGroupIcon className="h-4 w-4" />
              <span>500+ miembros</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Paso {currentStep} de 3</span>
            <span className="text-xs text-gray-500">Solo 60 segundos ⚡</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 animate-shake">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Empecemos 👋</h2>
                <p className="text-gray-600">Cuéntanos cómo contactarte</p>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Cómo te llamas?
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  autoFocus
                  className={`w-full px-4 py-4 text-lg border-2 rounded-2xl transition focus:ring-4 focus:ring-amber-200 focus:border-amber-500 ${
                    fieldErrors.nombre ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Juan Pérez"
                />
                {fieldErrors.nombre && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.nombre}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tu WhatsApp 📱
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  inputMode="numeric"
                  className={`w-full px-4 py-4 text-lg border-2 rounded-2xl transition focus:ring-4 focus:ring-amber-200 focus:border-amber-500 ${
                    fieldErrors.telefono ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+52 951 123 4567"
                />
                {fieldErrors.telefono && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.telefono}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  📲 Aquí recibirás tu cupón de descuento
                </p>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg py-4 px-6 rounded-2xl transition transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* Step 2: Experience */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu experiencia 🥃</h2>
                <p className="text-gray-600">Queremos saber qué te pareció</p>
              </div>

              {/* Mezcal Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  ¿Qué mezcal probaste hoy?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {MEZCALES.map((mezcal) => (
                    <button
                      key={mezcal.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, mezcal_probado: mezcal.name });
                        setFieldErrors({ ...fieldErrors, mezcal_probado: '' });
                      }}
                      className={`p-4 border-2 rounded-2xl text-center transition transform hover:scale-105 active:scale-95 ${
                        formData.mezcal_probado === mezcal.name
                          ? 'border-amber-500 bg-amber-50 shadow-lg'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">{mezcal.emoji}</div>
                      <div className="font-semibold text-gray-900">{mezcal.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{mezcal.description}</div>
                    </button>
                  ))}
                </div>

                {formData.mezcal_probado === 'Otro' && (
                  <input
                    type="text"
                    name="mezcal_otro"
                    value={formData.mezcal_otro}
                    onChange={(e) => setFormData({ ...formData, mezcal_otro: e.target.value })}
                    className="w-full mt-3 px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500"
                    placeholder="¿Cuál mezcal probaste?"
                  />
                )}

                {fieldErrors.mezcal_probado && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.mezcal_probado}</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  ¿Cómo fue tu experiencia?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, experiencia_calificacion: star })}
                      className="transition transform hover:scale-125 active:scale-110"
                    >
                      <StarIcon
                        className={`h-12 w-12 ${
                          star <= formData.experiencia_calificacion
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-500 mt-3">
                  {formData.experiencia_calificacion === 5 && '¡Excelente! 🎉'}
                  {formData.experiencia_calificacion === 4 && 'Muy buena 😊'}
                  {formData.experiencia_calificacion === 3 && 'Buena 👍'}
                  {formData.experiencia_calificacion === 2 && 'Regular 😐'}
                  {formData.experiencia_calificacion === 1 && 'Podemos mejorar 🙏'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition"
                >
                  ← Atrás
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl transition transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Último paso! 🎁</h2>
                <p className="text-gray-600">Confirma tu registro</p>
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-green-500 rounded-full p-2">
                    <span className="text-white text-xl">📱</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Recibirás en WhatsApp:</p>
                    <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
                      <p className="text-sm text-gray-800">
                        ¡Hola {formData.nombre}! 👋
                        <br /><br />
                        Gracias por visitarnos. Aquí está tu cupón de <strong>10% de descuento</strong> para tu próxima compra 🎁
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Ciudad (opcional)
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500"
                    placeholder="Ej: Oaxaca"
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-3 pt-4 border-t">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="acepto_terminos"
                    checked={formData.acepto_terminos}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto los{' '}
                    <a href="/politica-privacidad" target="_blank" className="text-amber-600 hover:text-amber-700 underline">
                      términos y condiciones
                    </a>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="acepto_ofertas"
                    checked={formData.acepto_ofertas}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Quiero recibir ofertas exclusivas vía WhatsApp
                  </span>
                </label>

                {fieldErrors.acepto_terminos && (
                  <p className="text-sm text-red-600">{fieldErrors.acepto_terminos}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition"
                >
                  ← Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg py-4 px-6 rounded-2xl transition transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    <>Recibir mi regalo 🎁</>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-gray-500">
            🔒 Tus datos están seguros y protegidos
          </p>
          <p className="text-xs text-gray-400">
            Powered by <span className="font-semibold">Torres Santiago</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Wrapper with Suspense
export default function LeadCapturePageImproved() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4 animate-pulse">
              <span className="text-3xl">🥃</span>
            </div>
            <p className="text-gray-600 font-medium">Cargando experiencia VIP...</p>
          </div>
        </div>
      }
    >
      <LeadCaptureFormImproved />
    </Suspense>
  );
}
