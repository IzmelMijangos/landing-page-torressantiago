'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useExitIntent } from '@/app/lib/hooks/useExitIntent'

interface ExitIntentPopupProps {
  headline?: string
  subheadline?: string
  offerTitle?: string
  offerDescription?: string
  ctaText?: string
  delay?: number
  showOnce?: boolean
  enabled?: boolean
}

export default function ExitIntentPopup({
  headline = '¡Espera! Antes de irte...',
  subheadline = 'Suscríbete y recibe recursos exclusivos sobre tecnología',
  offerTitle = 'Recibe gratis:',
  offerDescription,
  ctaText = 'Quiero suscribirme',
  delay = 3000,
  showOnce = true,
  enabled = true
}: ExitIntentPopupProps) {
  const { shouldShow, setShouldShow } = useExitIntent({
    enabled,
    delay,
    showOnce
  })

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (shouldShow) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [shouldShow])

  const handleClose = () => {
    setShouldShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus('error')
      setMessage('Por favor ingresa tu email')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/leads/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source: 'popup',
          page: typeof window !== 'undefined' ? window.location.pathname : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || '¡Gracias por suscribirte!')
        setEmail('')
        setName('')

        // Google Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'exit_intent_subscribe', {
            event_category: 'Lead Capture',
            event_label: 'exit_intent_popup',
            value: 1
          })
        }

        // Cerrar después de 2 segundos
        setTimeout(() => {
          handleClose()
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Error al suscribirse')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error de conexión. Intenta de nuevo.')
    }
  }

  if (!shouldShow) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">¡Perfecto!</h3>
            <p className="text-green-700">{message}</p>
            <p className="text-sm text-gray-600 mt-2">Cerrando...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 text-center">
              <div className="text-4xl mb-3">👋</div>
              <h2 className="text-2xl font-bold mb-2">{headline}</h2>
              <p className="text-orange-100">{subheadline}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {offerDescription && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">{offerTitle}</h3>
                  <p className="text-gray-700 text-sm">{offerDescription}</p>
                </div>
              )}

              {!offerDescription && (
                <div className="mb-6 space-y-2">
                  <h3 className="font-bold text-gray-900 mb-3">{offerTitle}</h3>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Tips semanales de tecnología</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Casos de éxito reales</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Guías y recursos descargables</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre (opcional)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={status === 'loading'}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={status === 'loading'}
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Enviando...' : ctaText}
                </button>

                {status === 'error' && (
                  <p className="text-sm text-red-600 text-center">{message}</p>
                )}

                <p className="text-xs text-gray-500 text-center">
                  Sin spam. Cancela cuando quieras.
                </p>
              </form>

              <button
                onClick={handleClose}
                className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                No gracias, continuar leyendo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
