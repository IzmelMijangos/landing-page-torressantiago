'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LeadStats {
  newsletter: {
    total: number
    active: number
    today: number
    thisWeek: number
    bySource: Record<string, number>
  }
  leadMagnets: {
    total: number
    today: number
    thisWeek: number
    byResource: Record<string, number>
  }
  chatbot: {
    total: number
    hot: number
    warm: number
    cold: number
    today: number
  }
}

export default function LeadsDashboardPage() {
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch newsletter stats
      const newsletterRes = await fetch('/api/leads/subscribe')
      const newsletterData = await newsletterRes.json()

      // Fetch lead magnet stats
      const leadMagnetRes = await fetch('/api/leads/download')
      const leadMagnetData = await leadMagnetRes.json()

      // Fetch chatbot leads stats
      const chatbotRes = await fetch('/api/leads')
      const chatbotData = await chatbotRes.json()

      setStats({
        newsletter: newsletterData.stats || {},
        leadMagnets: leadMagnetData.stats || {},
        chatbot: chatbotData.stats || {}
      })
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-bold mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const totalLeads = (stats?.newsletter.total || 0) + (stats?.leadMagnets.total || 0) + (stats?.chatbot.total || 0)
  const todayLeads = (stats?.newsletter.today || 0) + (stats?.leadMagnets.today || 0) + (stats?.chatbot.today || 0)

  const handleExport = async (format: 'csv' | 'json' | 'brevo', type: 'newsletter' | 'all' = 'newsletter') => {
    try {
      const response = await fetch(`/api/leads/export?format=${format}&type=${type}`)

      if (format === 'csv') {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `suscriptores-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `leads-${format}-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error al exportar:', error)
      alert('Error al exportar datos')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Leads</h1>
              <p className="text-gray-600 mt-1">Monitoreo de captura de leads</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/newsletter"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📧 Enviar Newsletter
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
        {/* Export Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Exportar Suscriptores</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExport('csv', 'newsletter')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar CSV (Excel)
            </button>

            <button
              onClick={() => handleExport('json', 'newsletter')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Descargar JSON
            </button>

            <button
              onClick={() => handleExport('brevo', 'newsletter')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Formato Brevo
            </button>

            <button
              onClick={() => handleExport('csv', 'all')}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              Exportar Todo
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            💡 <strong>Tip:</strong> Usa "Formato Brevo" para importar contactos directamente a tu cuenta de Brevo
          </p>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Leads</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
            <p className="text-sm text-gray-500 mt-1">Todos los canales</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Newsletter</h3>
              <span className="text-2xl">📧</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats?.newsletter.active || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Suscriptores activos</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Lead Magnets</h3>
              <span className="text-2xl">📥</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats?.leadMagnets.total || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Descargas totales</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Hoy</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{todayLeads}</p>
            <p className="text-sm text-gray-500 mt-1">Leads capturados</p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Newsletter Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Newsletter - Por Canal</h2>
            <div className="space-y-3">
              {Object.entries(stats?.newsletter.bySource || {}).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{source.replace('-', ' ')}</span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {count}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Esta semana:</span>
                <span className="font-semibold text-gray-900">{stats?.newsletter.thisWeek || 0}</span>
              </div>
            </div>
          </div>

          {/* Lead Magnets Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lead Magnets - Por Recurso</h2>
            <div className="space-y-3">
              {Object.entries(stats?.leadMagnets.byResource || {}).map(([resource, count]) => (
                <div key={resource} className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">{resource}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {count}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Esta semana:</span>
                <span className="font-semibold text-gray-900">{stats?.leadMagnets.thisWeek || 0}</span>
              </div>
            </div>
          </div>

          {/* Chatbot Leads Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Chatbot - Por Temperatura</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">🔥 Hot Leads (80+)</span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {stats?.chatbot.hot || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">🌡️ Warm Leads (50-79)</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {stats?.chatbot.warm || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">❄️ Cold Leads (&lt;50)</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {stats?.chatbot.cold || 0}
                </span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-gray-900">{stats?.chatbot.total || 0}</span>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Funnel de Conversión</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Visitantes → Newsletter</span>
                  <span className="font-medium">{stats?.newsletter.active || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Newsletter → Lead Magnet</span>
                  <span className="font-medium">{stats?.leadMagnets.total || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Lead Magnet → Chatbot</span>
                  <span className="font-medium">{stats?.chatbot.total || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Chatbot → Hot Lead</span>
                  <span className="font-medium">{stats?.chatbot.hot || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchStats}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar Estadísticas
          </button>
        </div>
      </div>
    </div>
  )
}
