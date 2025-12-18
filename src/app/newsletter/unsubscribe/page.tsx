'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [status, setStatus] = useState<'loading' | 'confirm' | 'success' | 'error' | 'already-unsubscribed'>('loading')
  const [email, setEmail] = useState('')
  const [subscribedAt, setSubscribedAt] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!id) {
      setStatus('error')
      setMessage('Link de cancelación inválido')
      return
    }

    loadSubscriberInfo()
  }, [id])

  const loadSubscriberInfo = async () => {
    try {
      const res = await fetch(`/api/newsletter/unsubscribe?id=${id}`)
      const data = await res.json()

      if (res.ok && data.success) {
        setEmail(data.subscriber.email)
        setSubscribedAt(new Date(data.subscriber.subscribedAt).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }))

        if (data.subscriber.status === 'unsubscribed') {
          setStatus('already-unsubscribed')
          setMessage('Ya te habías dado de baja anteriormente')
        } else {
          setStatus('confirm')
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'No se pudo encontrar tu suscripción')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error de conexión. Intenta de nuevo más tarde.')
    }
  }

  const handleUnsubscribe = async () => {
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.error || 'Error al cancelar la suscripción')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error de conexión. Intenta de nuevo más tarde.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold text-orange-600">Torres Santiago</h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Cancelar Suscripción
          </h2>
          <p className="text-gray-600">
            Gestiona tus preferencias de newsletter
          </p>
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información...</p>
          </div>
        )}

        {/* Confirm */}
        {status === 'confirm' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Estás seguro?
              </h3>
              <p className="text-gray-600">
                Estás a punto de cancelar tu suscripción al newsletter
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Suscrito desde:</span>
                <span className="font-medium text-gray-900">{subscribedAt}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>Te perderás:</strong>
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Tips semanales de tecnología</li>
                <li>• Casos de éxito y estudios reales</li>
                <li>• Recursos exclusivos y lead magnets</li>
                <li>• Ofertas especiales para suscriptores</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleUnsubscribe}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Sí, darme de baja
              </button>
              <Link
                href="/"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors text-center"
              >
                No, mantener suscripción
              </Link>
            </div>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Suscripción Cancelada
            </h3>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-900">
                <strong>{email}</strong> ha sido eliminado de nuestra lista de newsletter.
              </p>
              <p className="text-xs text-green-700 mt-2">
                Ya no recibirás emails nuestros.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                ¿Cambiaste de opinión?
              </p>
              <Link
                href="/"
                className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors text-center"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        )}

        {/* Already Unsubscribed */}
        {status === 'already-unsubscribed' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">ℹ️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Ya Estabas Dado de Baja
            </h3>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>{email}</strong> ya no está en nuestra lista de newsletter.
              </p>
            </div>
            <Link
              href="/"
              className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors text-center"
            >
              Volver al Inicio
            </Link>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Error
            </h3>
            <p className="text-red-600 mb-6">
              {message}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-900">
                <strong>Posibles causas:</strong>
              </p>
              <ul className="text-sm text-red-800 mt-2 space-y-1 text-left">
                <li>• El link de cancelación es inválido o expiró</li>
                <li>• La suscripción ya no existe</li>
                <li>• Problema de conexión al servidor</li>
              </ul>
            </div>
            <div className="space-y-3">
              <button
                onClick={loadSubscriberInfo}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Reintentar
              </button>
              <Link
                href="/"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors text-center"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda?{' '}
            <a
              href="https://wa.me/529515831593"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Contáctanos por WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
