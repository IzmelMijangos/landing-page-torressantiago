'use client'

import { useState, FormEvent } from 'react'

interface ContentUpgradeCardProps {
  upgradeType: 'pdf' | 'checklist' | 'video' | 'template'
  title: string
  description: string
  resourceId: string
  articleTitle?: string
}

const upgradeIcons = {
  pdf: '📄',
  checklist: '✅',
  video: '🎥',
  template: '📋'
}

const upgradeLabels = {
  pdf: 'Versión PDF',
  checklist: 'Checklist',
  video: 'Video Explicativo',
  template: 'Plantilla'
}

export default function ContentUpgradeCard({
  upgradeType,
  title,
  description,
  resourceId,
  articleTitle
}: ContentUpgradeCardProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const icon = upgradeIcons[upgradeType]
  const label = upgradeLabels[upgradeType]

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
          resource: resourceId,
          source: typeof window !== 'undefined' ? window.location.pathname : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || '¡Revisa tu email!')
        setEmail('')

        // Google Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'content_upgrade_download', {
            event_category: 'Lead Capture',
            event_label: resourceId,
            upgrade_type: upgradeType,
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

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 my-6 shadow-sm">
      {status === 'success' ? (
        <div className="text-center py-4">
          <div className="text-5xl mb-3">✅</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">¡Perfecto!</h3>
          <p className="text-green-700">{message}</p>
          <p className="text-sm text-gray-600 mt-2">
            Te enviamos {label.toLowerCase()} a tu email
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">{icon}</div>
            <div className="flex-1">
              <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                CONTENIDO PREMIUM
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-700">{description}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-xs font-semibold text-gray-600 uppercase">
                Descarga Gratis
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={status === 'loading'}
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                >
                  {status === 'loading' ? 'Enviando...' : `Obtener ${label}`}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-600">{message}</p>
              )}

              <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="text-green-600">✓</span> Descarga instant ánea
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-600">✓</span> Sin spam
                </span>
              </div>
            </form>
          </div>

          {articleTitle && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Complemento del artículo: "{articleTitle}"
            </p>
          )}
        </>
      )}
    </div>
  )
}
