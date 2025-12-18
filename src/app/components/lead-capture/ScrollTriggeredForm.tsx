'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useScrollTrigger } from '@/app/lib/hooks/useScrollTrigger'

interface ScrollTriggeredFormProps {
  triggerId?: string
  percentage?: number
  delay?: number
  showOnce?: boolean
  enabled?: boolean
  variant?: 'consultation' | 'newsletter'
  headline?: string
  description?: string
}

export default function ScrollTriggeredForm({
  triggerId = 'scroll-form',
  percentage = 70,
  delay = 5000,
  showOnce = true,
  enabled = true,
  variant = 'consultation',
  headline,
  description
}: ScrollTriggeredFormProps) {
  const { shouldShow, setShouldShow, scrollPercentage } = useScrollTrigger(triggerId, {
    enabled,
    percentage,
    delay,
    showOnce
  })

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (shouldShow) {
      // Pequeño delay para la animación
      setTimeout(() => setIsVisible(true), 100)
    } else {
      setIsVisible(false)
    }
  }, [shouldShow])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => setShouldShow(false), 300)
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
          phone: phone || undefined,
          source: `scroll-trigger-${variant}`,
          page: typeof window !== 'undefined' ? window.location.pathname : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || '¡Gracias! Te contactaremos pronto.')
        setEmail('')
        setName('')
        setPhone('')

        // Google Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'scroll_trigger_submit', {
            event_category: 'Lead Capture',
            event_label: variant,
            value: 1
          })
        }

        // Cerrar después de 3 segundos
        setTimeout(() => {
          handleClose()
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Error al enviar')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error de conexión. Intenta de nuevo.')
    }
  }

  if (!shouldShow) return null

  // Variante Newsletter
  if (variant === 'newsletter') {
    return (
      <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full mx-4 sm:mx-0">
        <div
          className={`bg-white rounded-lg shadow-2xl border-2 border-orange-500 transform transition-all duration-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📬</span>
              <h3 className="font-bold">
                {headline || '¿Te gusta el contenido?'}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Cerrar"
            >
              <svg
                className="w-5 h-5"
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
          </div>

          <div className="p-4">
            {status === 'success' ? (
              <div className="text-center py-3">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-green-700 font-medium">{message}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  {description || 'Suscríbete para recibir más artículos como este'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={status === 'loading'}
                  />

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded transition-colors disabled:opacity-50 text-sm"
                  >
                    {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
                  </button>

                  {status === 'error' && (
                    <p className="text-xs text-red-600">{message}</p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Variante Consultation (default)
  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-md w-full mx-4 sm:mx-0">
      <div
        className={`bg-white rounded-lg shadow-2xl border-2 border-orange-500 transform transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            <h3 className="font-bold">
              {headline || '¿Tienes 30 minutos esta semana?'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Cerrar"
          >
            <svg
              className="w-5 h-5"
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
        </div>

        <div className="p-4">
          {status === 'success' ? (
            <div className="text-center py-3">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-700 font-medium">{message}</p>
              <p className="text-xs text-gray-600 mt-1">Nos comunicaremos pronto</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">
                {description || 'Agenda una consultoría gratuita sobre este tema'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={status === 'loading'}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={status === 'loading'}
                />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Teléfono (opcional)"
                  className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={status === 'loading'}
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded transition-colors disabled:opacity-50 text-sm"
                >
                  {status === 'loading' ? 'Enviando...' : 'Agendar consultoría'}
                </button>

                {status === 'error' && (
                  <p className="text-xs text-red-600">{message}</p>
                )}

                <p className="text-xs text-gray-500 text-center">
                  Sin compromiso · Respuesta en 24hrs
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
