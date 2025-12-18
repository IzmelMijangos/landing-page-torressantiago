"use client"

import { useState, useEffect } from 'react'
import { Users, TrendingUp, MessageSquare, Clock, Award, Flame, Snowflake } from 'lucide-react'

interface Lead {
  id: string
  timestamp: string
  source: string
  score: number
  name?: string
  email?: string
  phone?: string
  service?: string
  conversation: any[]
  notified: boolean
}

interface Stats {
  total: number
  hot: number
  warm: number
  cold: number
  sources: {
    chatbot: number
    form: number
    whatsapp: number
  }
  today: number
}

export default function LeadsAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')

  useEffect(() => {
    fetchLeads()
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchLeads, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads(data.leads || [])
      setStats(data.stats || null)
      setLoading(false)
    } catch (error) {
      console.error('Error al obtener leads:', error)
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    if (filter === 'hot') return lead.score >= 80
    if (filter === 'warm') return lead.score >= 50 && lead.score < 80
    if (filter === 'cold') return lead.score < 50
    return true
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Caliente', color: 'bg-red-100 text-red-800', icon: Flame }
    if (score >= 50) return { label: 'Tibio', color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp }
    return { label: 'Frío', color: 'bg-blue-100 text-blue-800', icon: Snowflake }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Leads</h1>
          <p className="text-gray-600 mt-2">Panel de control para gestionar y analizar leads capturados</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <Users className="w-12 h-12 text-accent opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Leads Calientes</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{stats.hot}</p>
                </div>
                <Flame className="w-12 h-12 text-red-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Leads Tibios</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.warm}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-yellow-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hoy</p>
                  <p className="text-3xl font-bold text-accent mt-1">{stats.today}</p>
                </div>
                <Clock className="w-12 h-12 text-accent opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-accent text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos ({leads.length})
          </button>
          <button
            onClick={() => setFilter('hot')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'hot'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🔥 Calientes ({leads.filter(l => l.score >= 80).length})
          </button>
          <button
            onClick={() => setFilter('warm')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'warm'
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⚡ Tibios ({leads.filter(l => l.score >= 50 && l.score < 80).length})
          </button>
          <button
            onClick={() => setFilter('cold')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'cold'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ❄️ Fríos ({leads.filter(l => l.score < 50).length})
          </button>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Información
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fuente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No hay leads con este filtro
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const badge = getScoreBadge(lead.score)
                    const Icon = badge.icon
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(lead.timestamp).toLocaleString('es-MX', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {lead.name && <p className="font-medium text-gray-900">{lead.name}</p>}
                            {lead.email && <p className="text-gray-600">{lead.email}</p>}
                            {lead.phone && <p className="text-gray-600">{lead.phone}</p>}
                            {!lead.name && !lead.email && !lead.phone && (
                              <p className="text-gray-400 italic">Sin información de contacto</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {lead.service || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                              <Icon className="w-3 h-3" />
                              {lead.score}/100
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {lead.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a
                            href={`https://wa.me/529513183885?text=Hola,%20vi%20tu%20consulta%20del%20${new Date(lead.timestamp).toLocaleDateString('es-MX')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            WhatsApp →
                          </a>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fuentes */}
        {stats && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Fuente</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-sm text-gray-600">Chatbot</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.sources.chatbot}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Formulario</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.sources.form}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">WhatsApp</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.sources.whatsapp}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
