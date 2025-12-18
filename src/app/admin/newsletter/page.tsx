'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  category: string
}

interface SentNewsletter {
  id: string
  timestamp: string
  subject: string
  postSlugs: string[]
  recipientCount: number
  successCount: number
  failCount: number
  status: 'sending' | 'completed' | 'failed'
}

export default function NewsletterDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [subject, setSubject] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'preview' | 'sending' | 'sent' | 'error'>('idle')
  const [previewHTML, setPreviewHTML] = useState('')
  const [message, setMessage] = useState('')
  const [sentNewsletters, setSentNewsletters] = useState<SentNewsletter[]>([])
  const [subscriberCount, setSubscriberCount] = useState(0)

  useEffect(() => {
    loadPosts()
    loadSentNewsletters()
    loadSubscriberCount()
  }, [])

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/blog/posts?limit=20')
      const data = await res.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    }
  }

  const loadSentNewsletters = async () => {
    try {
      const res = await fetch('/api/newsletter/send')
      const data = await res.json()
      setSentNewsletters(data.newsletters || [])
    } catch (error) {
      console.error('Error loading sent newsletters:', error)
    }
  }

  const loadSubscriberCount = async () => {
    try {
      const res = await fetch('/api/leads/subscribe')
      const data = await res.json()
      setSubscriberCount(data.stats?.active || 0)
    } catch (error) {
      console.error('Error loading subscriber count:', error)
    }
  }

  const togglePost = (slug: string) => {
    setSelectedPosts(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    )
  }

  const handlePreview = async () => {
    if (selectedPosts.length === 0) {
      setMessage('Selecciona al menos un post')
      return
    }

    setStatus('preview')
    try {
      const res = await fetch('/api/newsletter/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlugs: selectedPosts,
          subject: subject || undefined,
          customMessage: customMessage || undefined
        })
      })

      const data = await res.json()

      if (res.ok) {
        setPreviewHTML(data.html)
        setSubject(data.subject)
      } else {
        setMessage(data.error || 'Error al generar preview')
        setStatus('error')
      }
    } catch (error) {
      setMessage('Error de conexión')
      setStatus('error')
    }
  }

  const handleSend = async (testMode: boolean = false) => {
    if (selectedPosts.length === 0) {
      setMessage('Selecciona al menos un post')
      return
    }

    const confirmMessage = testMode
      ? '¿Enviar newsletter en MODO TEST (solo primeros 3 suscriptores)?'
      : `¿Enviar newsletter a ${subscriberCount} suscriptores?`

    if (!confirm(confirmMessage)) return

    setStatus('sending')
    setMessage('Enviando emails...')

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlugs: selectedPosts,
          subject: subject || undefined,
          customMessage: customMessage || undefined,
          testMode
        })
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('sent')
        setMessage(data.message)
        setSelectedPosts([])
        setSubject('')
        setCustomMessage('')
        setPreviewHTML('')
        loadSentNewsletters()
      } else {
        setStatus('error')
        setMessage(data.error || 'Error al enviar newsletter')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error de conexión. Intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📧 Enviar Newsletter</h1>
              <p className="text-gray-600 mt-1">Selecciona posts y envía a tus suscriptores</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/leads-dashboard"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Ver Leads
              </Link>
              <Link
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                ← Volver
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Suscriptores Activos</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">{subscriberCount}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Posts Seleccionados</h3>
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{selectedPosts.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Newsletters Enviados</h3>
              <span className="text-2xl">📨</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{sentNewsletters.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Post Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Configuración del Email</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto del Email
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Nuevos artículos de Torres Santiago"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje Personalizado (Opcional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Agrega un mensaje personal para tus suscriptores..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Post Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Selecciona Posts ({selectedPosts.length} seleccionados)
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {posts.map(post => (
                  <div
                    key={post.slug}
                    onClick={() => togglePost(post.slug)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPosts.includes(post.slug)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.slug)}
                        onChange={() => togglePost(post.slug)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{post.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">{post.category}</span>
                          <span>{new Date(post.date).toLocaleDateString('es-MX')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Preview & Actions */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones</h2>

              <div className="space-y-3">
                <button
                  onClick={handlePreview}
                  disabled={selectedPosts.length === 0 || status === 'sending'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  👁️ Preview del Email
                </button>

                <button
                  onClick={() => handleSend(true)}
                  disabled={selectedPosts.length === 0 || status === 'sending'}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🧪 Enviar Test (3 personas)
                </button>

                <button
                  onClick={() => handleSend(false)}
                  disabled={selectedPosts.length === 0 || status === 'sending' || subscriberCount === 0}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📧 Enviar a Todos ({subscriberCount})
                </button>
              </div>

              {message && (
                <div className={`mt-4 p-4 rounded-lg ${
                  status === 'sent' ? 'bg-green-50 text-green-800' :
                  status === 'error' ? 'bg-red-50 text-red-800' :
                  'bg-blue-50 text-blue-800'
                }`}>
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}

              {status === 'sending' && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Enviando...</p>
                </div>
              )}
            </div>

            {/* Recent Newsletters */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Últimos Envíos</h2>

              {sentNewsletters.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay newsletters enviados aún</p>
              ) : (
                <div className="space-y-3">
                  {sentNewsletters.slice(0, 5).map(newsletter => (
                    <div key={newsletter.id} className="border border-gray-200 rounded-lg p-3">
                      <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {newsletter.subject}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                        <span>{new Date(newsletter.timestamp).toLocaleDateString('es-MX')}</span>
                        <span className={`px-2 py-1 rounded ${
                          newsletter.status === 'completed' ? 'bg-green-100 text-green-800' :
                          newsletter.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {newsletter.successCount}/{newsletter.recipientCount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {status === 'preview' && previewHTML && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={() => setStatus('idle')}>
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Preview del Email</h3>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
              </div>

              <div className="flex gap-3 p-4 border-t border-gray-200">
                <button
                  onClick={() => setStatus('idle')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleSend(true)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Enviar Test
                </button>
                <button
                  onClick={() => handleSend(false)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Enviar a Todos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
