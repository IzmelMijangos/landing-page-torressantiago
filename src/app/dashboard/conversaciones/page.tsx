'use client';

/**
 * Conversations Dashboard
 * View and respond to WhatsApp conversations
 */

import { useEffect, useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface Mensaje {
  id: number;
  direccion: 'entrante' | 'saliente';
  contenido: string;
  timestamp: string;
  leido_at?: string;
  estado: string;
}

interface Conversacion {
  id: number;
  telefono: string;
  nombre_cliente?: string;
  estado: string;
  ultima_interaccion: string;
  intencion_principal?: string;
  total_mensajes: number;
  mensajes_no_leidos: number;
}

export default function ConversacionesPage() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [selectedConv, setSelectedConv] = useState<number | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversaciones();
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchConversaciones, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMensajes(selectedConv);
    }
  }, [selectedConv]);

  const fetchConversaciones = async () => {
    try {
      const response = await fetch('/api/chatbot/conversaciones');
      if (!response.ok) throw new Error('Error al cargar conversaciones');

      const data = await response.json();
      setConversaciones(data.conversaciones || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMensajes = async (convId: number) => {
    try {
      const response = await fetch(`/api/chatbot/conversaciones/${convId}`);
      if (!response.ok) throw new Error('Error al cargar mensajes');

      const data = await response.json();
      setMensajes(data.mensajes || []);

      // Scroll to bottom
      setTimeout(() => {
        const container = document.getElementById('mensajes-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEnviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !selectedConv) return;

    setSending(true);

    try {
      const response = await fetch(`/api/chatbot/conversaciones/${selectedConv}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: nuevoMensaje }),
      });

      if (!response.ok) throw new Error('Error al enviar mensaje');

      setNuevoMensaje('');
      fetchMensajes(selectedConv);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando conversaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row">
      {/* Sidebar - Lista de Conversaciones */}
      <div className="w-full lg:w-1/3 xl:w-1/4 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Conversaciones</h2>
          </div>
          <input
            type="text"
            placeholder="Buscar por teléfono o nombre..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {conversaciones.length === 0 ? (
            <div className="p-8 text-center">
              <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 text-sm">No hay conversaciones aún</p>
            </div>
          ) : (
            conversaciones.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv.id)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition text-left ${
                  selectedConv === conv.id ? 'bg-amber-50 border-l-4 border-l-amber-600' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    <p className="font-medium text-gray-900 text-sm">
                      {conv.nombre_cliente || conv.telefono}
                    </p>
                  </div>
                  {conv.mensajes_no_leidos > 0 && (
                    <span className="bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {conv.mensajes_no_leidos}
                    </span>
                  )}
                </div>

                {conv.intencion_principal && (
                  <p className="text-xs text-amber-600 font-medium mb-1">
                    {conv.intencion_principal.replace(/_/g, ' ')}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {new Date(conv.ultima_interaccion).toLocaleDateString('es-MX', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      conv.estado === 'activa'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {conv.estado}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {conversaciones.find((c) => c.id === selectedConv)?.nombre_cliente ||
                      conversaciones.find((c) => c.id === selectedConv)?.telefono}
                  </p>
                  <p className="text-sm text-gray-500">
                    {conversaciones.find((c) => c.id === selectedConv)?.telefono}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <div
              id="mensajes-container"
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ maxHeight: 'calc(100vh - 280px)' }}
            >
              {mensajes.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={`flex ${mensaje.direccion === 'saliente' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      mensaje.direccion === 'saliente'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{mensaje.contenido}</p>
                    <div
                      className={`flex items-center gap-1 mt-1 text-xs ${
                        mensaje.direccion === 'saliente'
                          ? 'text-amber-100 justify-end'
                          : 'text-gray-500'
                      }`}
                    >
                      <span>
                        {new Date(mensaje.timestamp).toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {mensaje.direccion === 'saliente' && (
                        <>
                          {mensaje.estado === 'leido' || mensaje.leido_at ? (
                            <CheckCircleIcon className="h-3 w-3" />
                          ) : (
                            <ClockIcon className="h-3 w-3" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleEnviarMensaje();
                    }
                  }}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={sending}
                />
                <button
                  onClick={handleEnviarMensaje}
                  disabled={sending || !nuevoMensaje.trim()}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5" />
                      Enviar
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Al responder manualmente, el modo automático se desactiva para esta conversación
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Selecciona una conversación para comenzar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
