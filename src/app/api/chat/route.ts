import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { buildDynamicPrompt, estimateTokens, detectIntent } from '@/app/lib/chatbot-prompts'
import { analyzeConversation, formatLeadForNotification } from '@/app/lib/lead-analyzer'
// import { findFAQMatch } from '@/app/lib/faq-cache' // FAQ Cache desactivado

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'OpenAI API key no configurada',
          hint: 'Configura OPENAI_API_KEY en .env.local'
        },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // OPTIMIZACIÓN: Ventana de contexto - solo últimos 10 mensajes
    const contextWindow = 10
    const recentMessages = messages.slice(-contextWindow)

    // Obtener el último mensaje del usuario para detectar intención
    const lastUserMessage = messages[messages.length - 1]?.content || ''

    // ⚡ FAQ CACHE DESACTIVADO - Todas las respuestas pasan por OpenAI
    // const faqMatch = findFAQMatch(lastUserMessage)
    // if (faqMatch) { ... }

    // OPTIMIZACIÓN: Prompt dinámico - solo secciones relevantes
    const dynamicPrompt = buildDynamicPrompt(lastUserMessage, messages)
    const intent = detectIntent(lastUserMessage, messages)

    // Calcular tokens estimados del prompt
    const estimatedPromptTokens = estimateTokens(dynamicPrompt)

    // Determinar qué secciones se inyectaron
    const injectedSections: string[] = []
    if (intent.needsPricing) injectedSections.push('Pricing')
    if (intent.needsContact) injectedSections.push('Contact')
    if (intent.needsCaseStudies) injectedSections.push('Case Studies')
    if (intent.needsObjections) injectedSections.push('Objections')
    if (intent.needsFlow) injectedSections.push('Conversation Flow')
    if (intent.isHotLead) injectedSections.push('Hot Lead')

    // Preparar mensajes para Chat Completions API
    const formattedMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: dynamicPrompt },
      ...recentMessages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    // Llamada a Chat Completions API con STREAMING
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.8, // Personalidad amigable
      max_tokens: 200, // Limitar respuestas largas (ahorro adicional)
      presence_penalty: 0.6, // Evitar repetición
      frequency_penalty: 0.3,
      stream: true, // 🚀 STREAMING HABILITADO
    })

    // Crear encoder para streaming
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        let fullText = ''

        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullText += content

              // Enviar chunk al cliente
              const data = JSON.stringify({
                type: 'chunk',
                content
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }

          // Analizar conversación completa con sistema mejorado
          const leadAnalysis = analyzeConversation(messages, fullText)

          // Enviar metadata final
          const finalData = JSON.stringify({
            type: 'done',
            isHotLead: leadAnalysis.isHot,
            leadScore: leadAnalysis.score,
            leadInfo: leadAnalysis.info,
            leadSignals: leadAnalysis.signals,
            leadConfidence: leadAnalysis.confidence,
            _debug: {
              totalTokens: estimateTokens(fullText),
              promptTokens: estimatedPromptTokens,
              completionTokens: estimateTokens(fullText),
              model: 'gpt-4o-mini',
              messagesInContext: recentMessages.length,
              optimization: 'Chat Completions API + Context Window + Dynamic Prompt + Streaming',
              dynamicPromptTokens: estimatedPromptTokens,
              sectionsInjected: injectedSections.length > 0 ? injectedSections : ['Base only'],
              source: 'openai-stream',
              leadAnalysis: {
                score: leadAnalysis.score,
                maxScore: 170,
                confidence: leadAnalysis.confidence,
                reason: leadAnalysis.reason
              }
            }
          })
          controller.enqueue(encoder.encode(`data: ${finalData}\n\n`))

          // Guardar lead si es caliente
          if (leadAnalysis.isHot && leadAnalysis.info) {
            console.log('🔥 Lead caliente detectado!')
            console.log('📊 Score:', leadAnalysis.score)
            console.log('💯 Confianza:', `${leadAnalysis.confidence}%`)
            console.log('📝 Razón:', leadAnalysis.reason)

            // Formatear lead para notificación
            const leadData = formatLeadForNotification(
              leadAnalysis,
              [...messages, { role: 'assistant', content: fullText }]
            )

            // Guardar lead (esto se ejecuta en background)
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/leads`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(leadData)
            })
            .then(() => console.log('✅ Lead guardado y notificado exitosamente'))
            .catch(err => console.error('❌ Error guardando lead:', err))
          } else if (leadAnalysis.score >= 35) {
            // Lead tibio - log para análisis pero no notificar
            console.log('🌡️ Lead tibio detectado (no notificar aún)')
            console.log('📊 Score:', leadAnalysis.score)
            console.log('📝 Razón:', leadAnalysis.reason)
          }

          controller.close()
        } catch (error) {
          console.error('Error en streaming:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  } catch (error: any) {
    console.error('Error en chat con OpenAI:', error)

    let errorMessage = 'Error al procesar mensaje'
    let errorHint = error.message

    if (error.status === 401) {
      errorMessage = 'API key de OpenAI inválida'
      errorHint = 'Verifica OPENAI_API_KEY en https://platform.openai.com/api-keys'
    } else if (error.status === 429) {
      errorMessage = 'Límite de cuota excedido'
      errorHint = 'Verifica tu saldo en OpenAI'
    } else if (error.code === 'insufficient_quota') {
      errorMessage = 'Sin créditos en OpenAI'
      errorHint = 'Agrega créditos en https://platform.openai.com/account/billing'
    }

    return NextResponse.json(
      { error: errorMessage, details: errorHint },
      { status: 500 }
    )
  }
}

// Función removida - ahora usamos el módulo lead-analyzer.ts
// que proporciona análisis más robusto y completo
