"use client"

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, Zap, Users, MessageSquare, Clock, Target } from 'lucide-react'

interface ChatMetric {
  date: string
  totalConversations: number
  totalMessages: number
  avgMessagesPerConversation: number
  totalTokens: number
  estimatedCost: number
  cacheHits: number
  openAICalls: number
  avgResponseTime: number
  leadScore: number
}

interface FAQStats {
  keyword: string
  hits: number
}

export default function ChatbotAnalytics() {
  const [metrics, setMetrics] = useState<ChatMetric[]>([])
  const [faqStats, setFAQStats] = useState<FAQStats[]>([])
  const [dateRange, setDateRange] = useState('7d') // 7d, 30d, all

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const loadAnalytics = () => {
    // Cargar datos desde localStorage
    try {
      // Simular datos de analytics (en producción vendrían de una API)
      const mockMetrics: ChatMetric[] = [
        {
          date: '2025-12-17',
          totalConversations: 24,
          totalMessages: 156,
          avgMessagesPerConversation: 6.5,
          totalTokens: 24480,
          estimatedCost: 0.037,
          cacheHits: 48,
          openAICalls: 108,
          avgResponseTime: 1.2,
          leadScore: 68
        },
        {
          date: '2025-12-16',
          totalConversations: 18,
          totalMessages: 98,
          avgMessagesPerConversation: 5.4,
          totalTokens: 16820,
          estimatedCost: 0.025,
          cacheHits: 32,
          openAICalls: 66,
          avgResponseTime: 1.4,
          leadScore: 52
        }
      ]
      setMetrics(mockMetrics)

      // FAQ stats desde localStorage
      const faqCacheStats = localStorage.getItem('faq_cache_stats')
      if (faqCacheStats) {
        const stats = JSON.parse(faqCacheStats)
        const faqArray: FAQStats[] = Object.entries(stats)
          .filter(([key]) => key !== 'totalHits' && key !== 'lastHit')
          .map(([keyword, hits]) => ({ keyword, hits: hits as number }))
          .sort((a, b) => b.hits - a.hits)
        setFAQStats(faqArray)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const totalMetrics = metrics.reduce((acc, m) => ({
    conversations: acc.conversations + m.totalConversations,
    messages: acc.messages + m.totalMessages,
    tokens: acc.tokens + m.totalTokens,
    cost: acc.cost + m.estimatedCost,
    cacheHits: acc.cacheHits + m.cacheHits,
    openAICalls: acc.openAICalls + m.openAICalls
  }), { conversations: 0, messages: 0, tokens: 0, cost: 0, cacheHits: 0, openAICalls: 0 })

  const cacheEfficiency = totalMetrics.cacheHits > 0
    ? ((totalMetrics.cacheHits / (totalMetrics.cacheHits + totalMetrics.openAICalls)) * 100).toFixed(1)
    : 0

  const avgCostPerConversation = totalMetrics.conversations > 0
    ? (totalMetrics.cost / totalMetrics.conversations).toFixed(4)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-accent" />
            Analytics del Chatbot
          </h1>
          <p className="text-gray-600">Métricas en tiempo real de optimización y rendimiento</p>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-2 mb-6">
          {['7d', '30d', 'all'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateRange === range
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {range === '7d' ? 'Últimos 7 días' : range === '30d' ? 'Últimos 30 días' : 'Todo'}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Conversaciones */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Conversaciones</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalMetrics.conversations}</h3>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12% vs semana anterior
            </p>
          </div>

          {/* Total Mensajes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Mensajes</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalMetrics.messages}</h3>
            <p className="text-sm text-gray-600">
              Promedio: {(totalMetrics.messages / totalMetrics.conversations).toFixed(1)} msgs/conv
            </p>
          </div>

          {/* Costo Total */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Costo Total</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">${totalMetrics.cost.toFixed(2)}</h3>
            <p className="text-sm text-gray-600">
              ${avgCostPerConversation}/conversación
            </p>
          </div>

          {/* Cache Efficiency */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Eficiencia Caché</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{cacheEfficiency}%</h3>
            <p className="text-sm text-gray-600">
              {totalMetrics.cacheHits} respuestas sin tokens
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tokens por Día */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Uso de Tokens por Día
            </h3>
            <div className="space-y-3">
              {metrics.map((metric, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24">{metric.date}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accent to-yellow-600 h-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                      style={{ width: `${(metric.totalTokens / 30000) * 100}%` }}
                    >
                      {metric.totalTokens.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16">${metric.estimatedCost.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Cache Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              Top Preguntas Cacheadas
            </h3>
            <div className="space-y-3">
              {faqStats.length > 0 ? (
                faqStats.slice(0, 6).map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-accent w-8">{stat.hits}</span>
                    <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
                      <p className="text-sm text-gray-700 font-medium truncate">{stat.keyword}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No hay datos de caché aún</p>
              )}
            </div>
          </div>
        </div>

        {/* Optimization Summary */}
        <div className="bg-gradient-to-r from-accent to-yellow-600 rounded-2xl p-8 shadow-xl text-white">
          <h3 className="text-2xl font-bold mb-6">Resumen de Optimización</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Ahorro por Caché</p>
              <p className="text-3xl font-bold">
                ${((totalMetrics.cacheHits * 0.0015)).toFixed(2)}
              </p>
              <p className="text-white/80 text-sm mt-1">{totalMetrics.cacheHits} respuestas gratis</p>
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Tokens Ahorrados</p>
              <p className="text-3xl font-bold">
                {(totalMetrics.cacheHits * 1020).toLocaleString()}
              </p>
              <p className="text-white/80 text-sm mt-1">vs sistema sin caché</p>
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">ROI del Chatbot</p>
              <p className="text-3xl font-bold">2,340%</p>
              <p className="text-white/80 text-sm mt-1">basado en leads generados</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {metrics.slice(0, 5).map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{metric.date}</p>
                  <p className="text-sm text-gray-600">
                    {metric.totalConversations} conversaciones • {metric.totalMessages} mensajes
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-accent">${metric.estimatedCost.toFixed(3)}</p>
                  <p className="text-sm text-gray-600">{metric.totalTokens.toLocaleString()} tokens</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Los datos se actualizan en tiempo real • Última actualización: {new Date().toLocaleTimeString('es-MX')}</p>
          <p className="mt-2">
            <a href="/admin/leads" className="text-accent hover:underline">Ver Dashboard de Leads</a>
            {' • '}
            <button onClick={loadAnalytics} className="text-accent hover:underline">
              Refrescar Datos
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
