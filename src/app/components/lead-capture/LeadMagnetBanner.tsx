'use client'

import { useState, FormEvent } from 'react'

interface LeadMagnetBannerProps {
  resourceId: string
  title: string
  description: string
  ctaText?: string
  icon?: string
  variant?: 'default' | 'compact' | 'prominent'
}

export default function LeadMagnetBanner({
  resourceId,
  title,
  description,
  ctaText = 'Descargar ahora',
  icon = '📥',
  variant = 'default'
}: LeadMagnetBannerProps) {
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
      const response = await fetch('/api/leads/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          resource: resourceId,
          source: typeof window !== 'undefined' ? window.location.pathname : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || '¡Revisa tu email!')
        setEmail('')
        setName('')

        // Google Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'lead_magnet_download', {
            event_category: 'Lead Capture',
            event_label: resourceId,
            value: 1
          })
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Error al procesar descarga')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error de conexión. Intenta de nuevo.')
    }
  }

  // Variante Compact
  if (variant === 'compact') {
    return (
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6 rounded-r-lg">
        {status === 'success' ? (
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-800">¡Listo!</p>
              <p className="text-sm text-green-700">{message}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{icon}</span>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
            </div>

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
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Enviando...' : ctaText}
              </button>

              {status === 'error' && (
                <p className="text-xs text-red-600">{message}</p>
              )}
            </form>
          </>
        )}
      </div>
    )
  }

  // Variante Prominent
  if (variant === 'prominent') {
    return (
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-8 my-8 shadow-lg text-white">
        {status === 'success' ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-2">¡Excelente!</h3>
            <p className="text-orange-100">{message}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="text-2xl font-bold mb-3">{title}</h3>
              <p className="text-orange-100 max-w-2xl mx-auto">{description}</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre (opcional)"
                  className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  disabled={status === 'loading'}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  disabled={status === 'loading'}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-white text-orange-600 font-bold py-3 px-6 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Enviando...' : ctaText}
              </button>

              {status === 'error' && (
                <p className="text-sm text-orange-100 text-center">{message}</p>
              )}

              <p className="text-xs text-orange-100 text-center">
                Recibirás el recurso por email en segundos
              </p>
            </form>
          </>
        )}
      </div>
    )
  }

  // Variante Default
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 my-8 shadow-sm">
      {status === 'success' ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">¡Listo!</h3>
          <p className="text-green-700">{message}</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-6xl">{icon}</div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-700 mb-4">{description}</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre (opcional)"
                  className="sm:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={status === 'loading'}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={status === 'loading'}
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {status === 'loading' ? 'Enviando...' : ctaText}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-600">{message}</p>
              )}

              <p className="text-xs text-gray-600">
                📧 Te enviaremos el recurso por email • Sin spam
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
