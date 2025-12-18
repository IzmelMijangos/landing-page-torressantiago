import { NextResponse } from 'next/server'
import axios from 'axios'

// Helper function para escapar caracteres especiales de Telegram Markdown
function escapeTelegramMarkdown(text: string): string {
  if (!text) return text
  // En Telegram Markdown v1, solo necesitamos escapar _ * [ ] ( ) ` en el contenido
  return text
    .replace(/\_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\`/g, '\\`')
}

export async function POST(req: Request) {
  try {
    const { lead } = await req.json()
    console.log('📬 [Notify API] Recibido lead para notificar:', {
      score: lead.score,
      confidence: lead.confidence,
      name: lead.name,
      email: lead.email,
      phone: lead.phone
    })

    const notifications: Promise<any>[] = []

    // 1. Notificación por Telegram (si está configurado)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      console.log('📱 [Telegram] Enviando notificación...')

      // Determinar emoji de urgencia
      const urgencyEmoji = lead.urgency === 'alta' ? '🚨' : lead.urgency === 'media' ? '⚡' : '📌'

      // Determinar prioridad
      const priority = lead.score >= 100 ? 'ALTA' : lead.score >= 70 ? 'MEDIA' : 'NORMAL'
      const priorityEmoji = lead.score >= 100 ? '🔴' : lead.score >= 70 ? '🟡' : '🟢'

      // Escapar contenido dinámico
      const safeName = escapeTelegramMarkdown(lead.name || 'No proporcionado')
      const safeEmail = escapeTelegramMarkdown(lead.email || 'No proporcionado')
      const safePhone = escapeTelegramMarkdown(lead.phone || 'No proporcionado')
      const safeService = escapeTelegramMarkdown(lead.service || 'No especificado')
      const safeCompany = lead.company ? escapeTelegramMarkdown(lead.company) : null
      const safeReason = escapeTelegramMarkdown(lead.reason || 'Lead caliente confirmado')

      const telegramMessage = `
${urgencyEmoji} *LEAD CALIENTE DETECTADO* ${urgencyEmoji}

━━━━━━━━━━━━━━━━━━━━━
${priorityEmoji} *Prioridad: ${priority}*
━━━━━━━━━━━━━━━━━━━━━

📊 *Puntuación:* ${lead.score}/170 puntos
💯 *Confianza:* ${lead.confidence}%
⏱️ *Urgencia:* ${(lead.urgency || 'baja').toUpperCase()}

👤 *INFORMACIÓN DE CONTACTO*
━━━━━━━━━━━━━━━━━━━━━
• *Nombre:* ${safeName}
• *Email:* ${safeEmail}
• *Teléfono:* ${safePhone}
${safeCompany ? `• *Empresa:* ${safeCompany}` : ''}

🎯 *INTERÉS*
━━━━━━━━━━━━━━━━━━━━━
• *Servicio:* ${safeService}

${lead.signals ? `
🚦 *SEÑALES DETECTADAS*
━━━━━━━━━━━━━━━━━━━━━
${lead.signals.showsIntent ? '✅' : '❌'} Intención de compra
${lead.signals.showsUrgency ? '✅' : '❌'} Urgencia
${lead.signals.mentionsBudget ? '✅' : '❌'} Mencionó presupuesto
${lead.signals.mentionsService ? '✅' : '❌'} Mencionó servicio específico
${lead.signals.isQualified ? '✅' : '❌'} Lead calificado
` : ''}

📝 *ANÁLISIS*
━━━━━━━━━━━━━━━━━━━━━
${safeReason}

📊 *CONTEXTO*
━━━━━━━━━━━━━━━━━━━━━
• *Fuente:* ${lead.source}
• *Mensajes:* ${lead.conversationLength || 'N/A'}
• *Hora:* ${new Date(lead.timestamp).toLocaleString('es-MX', {
  dateStyle: 'short',
  timeStyle: 'short'
})}

💬 *ÚLTIMOS MENSAJES*
━━━━━━━━━━━━━━━━━━━━━
${(lead.lastMessages || lead.conversation?.slice(-3) || []).map((m: any, idx: number) => {
  const content = m.content.length > 100 ? m.content.substring(0, 100) + '...' : m.content
  const safeContent = escapeTelegramMarkdown(content.replace(/\n/g, ' '))
  return `${idx + 1}. ${m.role === 'user' ? '👤' : '🤖'} ${safeContent}`
}).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━
⚡ *PRÓXIMOS PASOS*
━━━━━━━━━━━━━━━━━━━━━
1. Contactar en las próximas ${lead.urgency === 'alta' ? '2 horas' : lead.urgency === 'media' ? '24 horas' : '48 horas'}
2. Usar el nombre para personalizar
3. Mencionar el interés en el servicio

📱 *ACCIONES RÁPIDAS*
• WhatsApp: https://wa.me/529513183885
${lead.email ? `• Email: ${safeEmail}` : ''}
${lead.phone ? `• Llamar: ${safePhone}` : ''}

━━━━━━━━━━━━━━━━━━━━━
🤖 Generado por Alex Chatbot
      `.trim()

      notifications.push(
        axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'Markdown'
          }
        )
        .then(res => {
          console.log('✅ [Telegram] Notificación enviada exitosamente')
          return res
        })
        .catch(err => {
          console.error('❌ [Telegram] Error al enviar:', err.response?.data || err.message)
          throw err
        })
      )
    }

    // 2. Notificación por Email (Brevo)
    if (process.env.BREVO_API_KEY) {
      const priority = lead.score >= 100 ? 'ALTA' : lead.score >= 70 ? 'MEDIA' : 'NORMAL'
      const urgencyBadge = lead.urgency === 'alta' ? '🚨 URGENTE' : lead.urgency === 'media' ? '⚡ MEDIA' : '📌 BAJA'

      const emailPayload = {
        sender: {
          name: "Alex Chatbot - Torres Santiago",
          email: "chatbot@torressantiago.com"
        },
        to: [{
          email: "contacto.torressantiago@gmail.com",
          name: "Torres Santiago"
        }],
        subject: `${priority === 'ALTA' ? '🔴' : priority === 'MEDIA' ? '🟡' : '🟢'} Lead ${priority} - ${lead.name || 'Nuevo Lead'} - ${lead.score}/170 pts`,
        htmlContent: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #c17207 0%, #f59e0b 100%); color: white; padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🔥 Lead Caliente Detectado</h1>
              <p style="margin: 10px 0 5px 0; font-size: 18px; opacity: 0.95;">Prioridad: <strong>${priority}</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">Score: ${lead.score}/170 puntos | Confianza: ${lead.confidence}%</p>
            </div>

            <!-- Main Content -->
            <div style="background: #f9fafb; padding: 25px; border: 1px solid #e5e7eb; border-top: none;">

              <!-- Información de Contacto -->
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #c17207;">
                <h2 style="color: #111827; margin: 0 0 15px 0; font-size: 20px;">👤 Información de Contacto</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 10px 0; font-weight: bold; color: #6b7280; width: 120px;">Nombre:</td><td style="font-size: 16px;">${lead.name || '❌ No proporcionado'}</td></tr>
                  <tr><td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Email:</td><td style="font-size: 16px;">${lead.email ? `<a href="mailto:${lead.email}" style="color: #c17207;">${lead.email}</a>` : '❌ No proporcionado'}</td></tr>
                  <tr><td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Teléfono:</td><td style="font-size: 16px;">${lead.phone ? `<a href="tel:${lead.phone}" style="color: #c17207;">${lead.phone}</a>` : '❌ No proporcionado'}</td></tr>
                  ${lead.company ? `<tr><td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Empresa:</td><td style="font-size: 16px;">${lead.company}</td></tr>` : ''}
                  <tr><td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Servicio:</td><td style="font-size: 16px;">${lead.service || 'No especificado'}</td></tr>
                </table>
              </div>

              <!-- Análisis del Lead -->
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                <h2 style="color: #111827; margin: 0 0 15px 0; font-size: 20px;">📊 Análisis del Lead</h2>
                <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                  <p style="margin: 0; color: #92400e;"><strong>Urgencia:</strong> ${urgencyBadge}</p>
                  <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">${lead.reason || 'Lead caliente confirmado por el sistema'}</p>
                </div>
                ${lead.signals ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                  <div style="background: ${lead.signals.showsIntent ? '#d1fae5' : '#fee2e2'}; padding: 10px; border-radius: 6px; text-align: center;">
                    <span style="font-size: 20px;">${lead.signals.showsIntent ? '✅' : '❌'}</span>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #374151;">Intención</p>
                  </div>
                  <div style="background: ${lead.signals.showsUrgency ? '#d1fae5' : '#fee2e2'}; padding: 10px; border-radius: 6px; text-align: center;">
                    <span style="font-size: 20px;">${lead.signals.showsUrgency ? '✅' : '❌'}</span>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #374151;">Urgencia</p>
                  </div>
                  <div style="background: ${lead.signals.mentionsBudget ? '#d1fae5' : '#fee2e2'}; padding: 10px; border-radius: 6px; text-align: center;">
                    <span style="font-size: 20px;">${lead.signals.mentionsBudget ? '✅' : '❌'}</span>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #374151;">Presupuesto</p>
                  </div>
                  <div style="background: ${lead.signals.isQualified ? '#d1fae5' : '#fee2e2'}; padding: 10px; border-radius: 6px; text-align: center;">
                    <span style="font-size: 20px;">${lead.signals.isQualified ? '✅' : '❌'}</span>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #374151;">Calificado</p>
                  </div>
                </div>
                ` : ''}
              </div>

              <!-- Próximos Pasos -->
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981;">
                <h2 style="color: #111827; margin: 0 0 15px 0; font-size: 20px;">⚡ Próximos Pasos</h2>
                <ol style="margin: 0; padding-left: 20px; color: #374151;">
                  <li style="margin-bottom: 10px;">Contactar en las próximas <strong>${lead.urgency === 'alta' ? '2 horas' : lead.urgency === 'media' ? '24 horas' : '48 horas'}</strong></li>
                  <li style="margin-bottom: 10px;">Usar el nombre <strong>"${lead.name}"</strong> para personalizar el contacto</li>
                  <li style="margin-bottom: 10px;">Mencionar el interés en: <strong>${lead.service || 'servicios de tecnología'}</strong></li>
                </ol>
              </div>

              <!-- Conversación -->
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #111827; margin: 0 0 15px 0; font-size: 20px;">💬 Últimos Mensajes (${lead.conversationLength || 'N/A'} total)</h2>
                <div style="max-height: 300px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px;">
                  ${(lead.lastMessages || lead.conversation?.slice(-4) || []).map((msg: any) => `
                    <div style="margin-bottom: 12px; padding: 12px; background: ${msg.role === 'user' ? 'linear-gradient(135deg, #c17207 0%, #f59e0b 100%)' : '#f3f4f6'}; color: ${msg.role === 'user' ? 'white' : '#111827'}; border-radius: 8px; ${msg.role === 'user' ? 'margin-left: 20px;' : 'margin-right: 20px;'}">
                      <strong style="font-size: 13px;">${msg.role === 'user' ? '👤 Usuario' : '🤖 Alex'}:</strong>
                      <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 1.5;">${msg.content}</p>
                    </div>
                  `).join('')}
                </div>
                <p style="margin: 15px 0 0 0; font-size: 12px; color: #6b7280;"><strong>Fuente:</strong> ${lead.source} | <strong>Hora:</strong> ${new Date(lead.timestamp).toLocaleString('es-MX')}</p>
              </div>

              <!-- Action Buttons -->
              <div style="text-align: center; margin-top: 25px;">
                <a href="https://wa.me/529513183885${lead.phone ? `?text=Hola%20${encodeURIComponent(lead.name || '')},%20vi%20tu%20interés%20en%20${encodeURIComponent(lead.service || 'nuestros servicios')}` : ''}"
                   style="display: inline-block; background: #25D366; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 0 10px 10px 0;">
                  📱 Contactar por WhatsApp
                </a>
                ${lead.email ? `
                <a href="mailto:${lead.email}?subject=${encodeURIComponent('Seguimiento - Torres Santiago')}"
                   style="display: inline-block; background: #3b82f6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 0 10px 10px 0;">
                  📧 Enviar Email
                </a>
                ` : ''}
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #111827; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; font-size: 14px;">🤖 Generado automáticamente por <strong style="color: #c17207;">Alex Chatbot</strong></p>
              <p style="margin: 10px 0 0 0; font-size: 12px;">Torres Santiago - Soluciones de Software Inteligente</p>
              ${process.env.NEXT_PUBLIC_BASE_URL ? `<p style="margin: 10px 0 0 0;"><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/leads" style="color: #c17207; text-decoration: none;">Ver todos los leads →</a></p>` : ''}
            </div>
          </div>
        `,
        textContent: `
🔥 LEAD CALIENTE DETECTADO

Prioridad: ${priority}
Score: ${lead.score}/170 puntos
Confianza: ${lead.confidence}%
Urgencia: ${lead.urgency?.toUpperCase() || 'NO ESPECIFICADA'}

INFORMACIÓN DE CONTACTO
━━━━━━━━━━━━━━━━━━━━━
Nombre: ${lead.name || 'No proporcionado'}
Email: ${lead.email || 'No proporcionado'}
Teléfono: ${lead.phone || 'No proporcionado'}
${lead.company ? `Empresa: ${lead.company}\n` : ''}Servicio de interés: ${lead.service || 'No especificado'}

ANÁLISIS
━━━━━━━━━━━━━━━━━━━━━
${lead.reason || 'Lead caliente confirmado por el sistema'}

SEÑALES
━━━━━━━━━━━━━━━━━━━━━
${lead.signals ? `
• Intención de compra: ${lead.signals.showsIntent ? 'SÍ' : 'NO'}
• Urgencia: ${lead.signals.showsUrgency ? 'SÍ' : 'NO'}
• Mencionó presupuesto: ${lead.signals.mentionsBudget ? 'SÍ' : 'NO'}
• Lead calificado: ${lead.signals.isQualified ? 'SÍ' : 'NO'}
` : ''}

PRÓXIMOS PASOS
━━━━━━━━━━━━━━━━━━━━━
1. Contactar en las próximas ${lead.urgency === 'alta' ? '2 horas' : lead.urgency === 'media' ? '24 horas' : '48 horas'}
2. Usar el nombre "${lead.name}" para personalizar
3. Mencionar el interés en: ${lead.service || 'servicios de tecnología'}

CONVERSACIÓN (${lead.conversationLength || 'N/A'} mensajes total)
━━━━━━━━━━━━━━━━━━━━━
${(lead.lastMessages || lead.conversation?.slice(-3) || []).map((m: any, idx: number) =>
  `${idx + 1}. ${m.role === 'user' ? '[Usuario]' : '[Alex]'}: ${m.content.substring(0, 150)}${m.content.length > 150 ? '...' : ''}`
).join('\n\n')}

DATOS ADICIONALES
━━━━━━━━━━━━━━━━━━━━━
Fuente: ${lead.source}
Fecha: ${new Date(lead.timestamp).toLocaleString('es-MX')}

CONTACTAR
━━━━━━━━━━━━━━━━━━━━━
WhatsApp: https://wa.me/529513183885
${lead.email ? `Email: ${lead.email}` : ''}
${lead.phone ? `Teléfono: ${lead.phone}` : ''}

━━━━━━━━━━━━━━━━━━━━━
🤖 Generado por Alex Chatbot - Torres Santiago
        `
      }

      notifications.push(
        axios.post('https://api.brevo.com/v3/smtp/email', emailPayload, {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY || ''
          }
        }).catch(err => console.error('Error Brevo:', err))
      )
    }

    // 3. Webhook personalizado (si lo configuras después)
    if (process.env.CUSTOM_WEBHOOK_URL) {
      notifications.push(
        axios.post(process.env.CUSTOM_WEBHOOK_URL, { lead })
          .catch(err => console.error('Error Webhook:', err))
      )
    }

    // Ejecutar todas las notificaciones en paralelo
    await Promise.all(notifications)

    console.log(`✅ [Notify API] ${notifications.length} notificación(es) enviada(s)`)
    return NextResponse.json({ success: true, notificationsSent: notifications.length })
  } catch (error: any) {
    console.error('Error en notificaciones:', error)
    return NextResponse.json(
      { error: 'Error al enviar notificaciones', details: error.message },
      { status: 500 }
    )
  }
}
