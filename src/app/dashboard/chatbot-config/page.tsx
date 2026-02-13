'use client';

/**
 * Chatbot Configuration Page
 * Allows palenques to configure their chatbot settings
 */

import { useEffect, useState } from 'react';
import {
  CogIcon,
  BoltIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface ChatbotConfig {
  id: number;
  palenque_id: number;
  modo: 'pasivo' | 'activo';
  activo: boolean;
  horario_activo: {
    inicio: string;
    fin: string;
    dias: number[];
  };
  mensaje_bienvenida: string;
  mensaje_fuera_horario: string;
  tiempo_espera_respuesta: number;
  metodos_pago: string[];
  costos_envio: {
    local: number;
    nacional: number;
    internacional: number;
  };
  zona_envio_gratis_min: number;
  temperatura_ia: number;
  personalidad: string;
}

export default function ChatbotConfigPage() {
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const diasSemana = [
    { value: 0, label: 'Dom' },
    { value: 1, label: 'Lun' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Mié' },
    { value: 4, label: 'Jue' },
    { value: 5, label: 'Vie' },
    { value: 6, label: 'Sáb' },
  ];

  const metodoPagoOptions = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'mercadopago', label: 'Mercado Pago' },
  ];

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/chatbot/config');
      if (!response.ok) throw new Error('Error al cargar configuración');

      const data = await response.json();
      setConfig(data.config);
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Error al cargar configuración' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/chatbot/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('Error al guardar configuración');

      const data = await response.json();
      setConfig(data.config);
      setMessage({ type: 'success', text: '✅ Configuración guardada exitosamente' });
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: '❌ Error al guardar configuración' });
    } finally {
      setSaving(false);
    }
  };

  const handleDiaToggle = (dia: number) => {
    if (!config) return;

    const dias = config.horario_activo.dias.includes(dia)
      ? config.horario_activo.dias.filter((d) => d !== dia)
      : [...config.horario_activo.dias, dia].sort();

    setConfig({
      ...config,
      horario_activo: {
        ...config.horario_activo,
        dias,
      },
    });
  };

  const handleMetodoPagoToggle = (metodo: string) => {
    if (!config) return;

    const metodos = config.metodos_pago.includes(metodo)
      ? config.metodos_pago.filter((m) => m !== metodo)
      : [...config.metodos_pago, metodo];

    setConfig({
      ...config,
      metodos_pago: metodos,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">No se pudo cargar la configuración</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CogIcon className="h-8 w-8 text-amber-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Asistente Virtual de WhatsApp
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Activa tu chatbot inteligente y elige cómo quieres que funcione
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <p>{message.text}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Estado y Modo */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <BoltIcon className="h-6 w-6 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-900">Configuración del Chatbot</h2>
          </div>

          <div className="space-y-4">
            {/* Activar/Desactivar */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Chatbot Activo</p>
                <p className="text-sm text-gray-600">Activar o desactivar el asistente virtual</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, activo: !config.activo })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  config.activo ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    config.activo ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Modo Pasivo vs Activo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Modo de Operación
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Modo Pasivo */}
                <button
                  onClick={() => setConfig({ ...config, modo: 'pasivo' })}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    config.modo === 'pasivo'
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        config.modo === 'pasivo' ? 'border-amber-600' : 'border-gray-300'
                      }`}
                    >
                      {config.modo === 'pasivo' && (
                        <div className="h-3 w-3 rounded-full bg-amber-600"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Modo Pasivo</p>
                      <p className="text-sm text-gray-600 mt-1">
                        El bot solo saluda y reenvía los mensajes a ti. Tú manejas todas las ventas
                        manualmente.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Modo Activo */}
                <button
                  onClick={() => setConfig({ ...config, modo: 'activo' })}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    config.modo === 'activo'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        config.modo === 'activo' ? 'border-green-600' : 'border-gray-300'
                      }`}
                    >
                      {config.modo === 'activo' && (
                        <div className="h-3 w-3 rounded-full bg-green-600"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Modo Activo 🚀</p>
                      <p className="text-sm text-gray-600 mt-1">
                        El bot maneja ventas completas: muestra catálogo, toma pedidos y cierra
                        ventas. Solo te notifica cuando hay un pedido confirmado.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIONES OCULTAS - Mantener para futura habilitación */}
        {false && (
        <>
        {/* Horarios */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="h-6 w-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Horario de Atención</h2>
          </div>

          <div className="space-y-4">
            {/* Horas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  value={config.horario_activo.inicio}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      horario_activo: {
                        ...config.horario_activo,
                        inicio: e.target.value,
                      },
                    })
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Fin</label>
                <input
                  type="time"
                  value={config.horario_activo.fin}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      horario_activo: {
                        ...config.horario_activo,
                        fin: e.target.value,
                      },
                    })
                  }
                  className="input-field"
                />
              </div>
            </div>

            {/* Días */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Días Activos
              </label>
              <div className="flex flex-wrap gap-2">
                {diasSemana.map((dia) => (
                  <button
                    key={dia.value}
                    onClick={() => handleDiaToggle(dia.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      config.horario_activo.dias.includes(dia.value)
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dia.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes Personalizados */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Mensajes Personalizados</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje de Bienvenida
              </label>
              <textarea
                value={config.mensaje_bienvenida}
                onChange={(e) => setConfig({ ...config, mensaje_bienvenida: e.target.value })}
                rows={3}
                className="input-field"
                placeholder="Hola! Gracias por contactarnos..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Primer mensaje que verán tus clientes al contactarte
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje Fuera de Horario
              </label>
              <textarea
                value={config.mensaje_fuera_horario}
                onChange={(e) => setConfig({ ...config, mensaje_fuera_horario: e.target.value })}
                rows={3}
                className="input-field"
                placeholder="Gracias por tu mensaje. Nuestro horario es..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Respuesta automática cuando escriben fuera del horario
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personalidad del Bot
              </label>
              <input
                type="text"
                value={config.personalidad}
                onChange={(e) => setConfig({ ...config, personalidad: e.target.value })}
                className="input-field"
                placeholder="amigable y conocedor"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ejemplo: "amigable y profesional", "casual y cercano", "formal y experto"
              </p>
            </div>
          </div>
        </div>

        {/* Configuración de Ventas (Solo Modo Activo) */}
        {config.modo === 'activo' && (
          <>
            {/* Métodos de Pago */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCardIcon className="h-6 w-6 text-amber-600" />
                <h2 className="text-lg font-semibold text-gray-900">Métodos de Pago</h2>
              </div>

              <div className="space-y-2">
                {metodoPagoOptions.map((metodo) => (
                  <label
                    key={metodo.value}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={config.metodos_pago.includes(metodo.value)}
                      onChange={() => handleMetodoPagoToggle(metodo.value)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-900">{metodo.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Costos de Envío */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <TruckIcon className="h-6 w-6 text-amber-600" />
                <h2 className="text-lg font-semibold text-gray-900">Costos de Envío</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Envío Local (MXN)
                    </label>
                    <input
                      type="number"
                      value={config.costos_envio.local}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          costos_envio: {
                            ...config.costos_envio,
                            local: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="input-field"
                      min="0"
                      step="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Envío Nacional (MXN)
                    </label>
                    <input
                      type="number"
                      value={config.costos_envio.nacional}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          costos_envio: {
                            ...config.costos_envio,
                            nacional: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="input-field"
                      min="0"
                      step="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Envío Internacional (MXN)
                    </label>
                    <input
                      type="number"
                      value={config.costos_envio.internacional}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          costos_envio: {
                            ...config.costos_envio,
                            internacional: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="input-field"
                      min="0"
                      step="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compra Mínima para Envío Gratis (MXN)
                  </label>
                  <input
                    type="number"
                    value={config.zona_envio_gratis_min}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        zona_envio_gratis_min: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="input-field"
                    min="0"
                    step="100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Monto mínimo para ofrecer envío gratis
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Configuración Avanzada */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <CogIcon className="h-6 w-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Configuración Avanzada</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creatividad de la IA (0-1)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={Number(config.temperatura_ia)}
                  onChange={(e) =>
                    setConfig({ ...config, temperatura_ia: parseFloat(e.target.value) })
                  }
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 w-12">
                  {Number(config.temperatura_ia).toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Menor = más conservador, Mayor = más creativo
              </p>
            </div>
          </div>
        </div>
        </>
        )}
        {/* FIN SECCIONES OCULTAS */}

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={fetchConfig}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Descartar Cambios
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
