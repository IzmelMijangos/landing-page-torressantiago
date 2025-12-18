'use client'

import { useState, FormEvent } from 'react'

type Variant = 'sidebar' | 'inline' | 'footer'

interface NewsletterSubscribeProps {
  variant?: Variant
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  showBenefits?: boolean
  compact?: boolean
}

export default function NewsletterSubscribe({
  variant = 'inline',
  title,
  description,
  placeholder = 'tu@email.com',
  buttonText = 'Suscribirme',
  showBenefits = true,
  compact = false
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

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
          source: variant,
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
          (window as any).gtag('event', 'newsletter_subscribe', {
            event_category: 'Lead Capture',
            event_label: variant,
            value: 1
          })
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Error al suscribirse')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error de conexión. Intenta de nuevo.')
    }
  }

  // Variante Sidebar
  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200 shadow-sm">
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">📧</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {title || 'Únete a nuestra comunidad'}
          </h3>
          <p className="text-sm text-gray-600">
            {description || 'Recibe tips de tecnología cada semana'}
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-sm font-medium text-green-800">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {!compact && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre (opcional)"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                disabled={status === 'loading'}
              />
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              disabled={status === 'loading'}
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Enviando...' : buttonText}
            </button>

            {status === 'error' && (
              <p className="text-xs text-red-600 text-center">{message}</p>
            )}
          </form>
        )}

        {showBenefits && status !== 'success' && (
          <ul className="mt-4 space-y-2 text-xs text-gray-600">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>1 email semanal con insights</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Casos de éxito reales</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Sin spam, cancela cuando quieras</span>
            </li>
          </ul>
        )}
      </div>
    )
  }

  // Variante Footer
  if (variant === 'footer') {
    return (
      <div className="bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              {title || 'Mantente actualizado'}
            </h3>
            <p className="text-gray-400 text-sm">
              {description || 'Recibe tips de tecnología directo en tu inbox'}
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-900 border border-green-700 rounded-lg p-4 max-w-md mx-auto text-center">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-sm font-medium text-green-100">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  required
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
                >
                  {status === 'loading' ? 'Enviando...' : buttonText}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-400 text-center mt-2">{message}</p>
              )}

              <p className="text-xs text-gray-500 text-center mt-3">
                Sin spam. Cancela cuando quieras.
              </p>
            </form>
          )}
        </div>
      </div>
    )
  }

  // Variante Inline (default)
  return (
    <div className="bg-white border-2 border-orange-200 rounded-xl p-6 my-8 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="text-4xl">📬</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title || '¿Te gustó este contenido?'}
          </h3>
          <p className="text-gray-600 mb-4">
            {description || 'Suscríbete para recibir más artículos como este directo en tu inbox'}
          </p>

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <p className="text-sm font-medium text-green-800">{message}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {!compact && (
                  <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre (opcional)"
                  className="sm:w-1/3 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={status === 'loading'}
                  />
                )}

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  required
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={status === 'loading'}
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {status === 'loading' ? 'Enviando...' : buttonText}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-600">{message}</p>
              )}

              {showBenefits && (
                <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="text-green-600">✓</span> 1 email/semana
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-green-600">✓</span> Casos de éxito
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-green-600">✓</span> Sin spam
                  </span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
