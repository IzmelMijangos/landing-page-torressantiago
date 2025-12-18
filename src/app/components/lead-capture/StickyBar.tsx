'use client'

import { useState, useEffect, FormEvent } from 'react'

interface StickyBarProps {
  message?: string
  ctaText?: string
  showAfterScroll?: number // Pixels de scroll antes de mostrar
  variant?: 'top' | 'bottom'
  closable?: boolean
}

export default function StickyBar({
  message = 'Recibe 1 tip de tecnología cada semana',
  ctaText = 'Suscríbete gratis',
  showAfterScroll = 300,
  variant = 'top',
  closable = true
}: StickyBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  // Verificar si ya se cerró antes (localStorage)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const closed = localStorage.getItem('sticky_bar_closed')
      if (closed === 'true') {
        setIsClosed(true)
      }
    }
  }, [])

  // Detectar scroll para mostrar/ocultar
  useEffect(() => {
    if (isClosed) return

    const handleScroll = () => {
      if (window.scrollY > showAfterScroll) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setShowForm(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check inicial

    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll, isClosed])

  const handleClose = () => {
    setIsClosed(true)
    if (typeof window !== 'undefined' && closable) {
      localStorage.setItem('sticky_bar_closed', 'true')
    }
  }

  const handleCTAClick = () => {
    setShowForm(true)

    // Google Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'sticky_bar_click', {
        event_category: 'Lead Capture',
        event_label: 'sticky_bar_cta',
        value: 1
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus('error')
      setStatusMessage('Por favor ingresa tu email')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/leads/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'sticky-bar',
          page: typeof window !== 'undefined' ? window.location.pathname : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setStatusMessage(data.message || '¡Gracias por suscribirte!')
        setEmail('')

        // Google Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'sticky_bar_subscribe', {
            event_category: 'Lead Capture',
            event_label: 'sticky_bar',
            value: 1
          })
        }

        // Cerrar después de 2 segundos
        setTimeout(() => {
          handleClose()
        }, 2000)
      } else {
        setStatus('error')
        setStatusMessage(data.error || 'Error al suscribirse')
      }
    } catch (error) {
      setStatus('error')
      setStatusMessage('Error de conexión. Intenta de nuevo.')
    }
  }

  if (isClosed || !isVisible) return null

  const positionClasses = variant === 'top' ? 'top-0' : 'bottom-0'

  return (
    <div
      className={`fixed ${positionClasses} left-0 right-0 z-30 bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg transform transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : variant === 'top' ? '-translate-y-full' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">✅</span>
            <p className="font-semibold">{statusMessage}</p>
          </div>
        ) : showForm ? (
          <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-sm font-semibold">📧 {message}</span>

            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="px-4 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-white text-sm min-w-[200px]"
                disabled={status === 'loading'}
                autoFocus
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-white text-orange-600 font-bold px-6 py-2 rounded hover:bg-orange-50 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-white hover:text-orange-100 px-2"
                aria-label="Cancelar"
              >
                ✕
              </button>
            </div>

            {status === 'error' && (
              <p className="text-sm text-orange-100 w-full text-center">{statusMessage}</p>
            )}
          </form>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-2xl hidden sm:block">📬</span>
              <p className="text-sm sm:text-base font-semibold">{message}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCTAClick}
                className="bg-white text-orange-600 font-bold px-6 py-2 rounded hover:bg-orange-50 transition-colors text-sm whitespace-nowrap"
              >
                {ctaText} →
              </button>

              {closable && (
                <button
                  onClick={handleClose}
                  className="text-white hover:text-orange-100 px-2"
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
