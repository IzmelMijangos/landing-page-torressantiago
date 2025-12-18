import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'

interface Subscriber {
  id: number
  email: string
  name?: string
  status: 'active' | 'unsubscribed'
}

interface NewsletterSend {
  newsletter_id: string
  subject: string
  post_slugs: string[]
  recipient_count: number
  success_count: number
  fail_count: number
  status: 'sending' | 'completed' | 'failed'
  test_mode: boolean
}

async function getActiveSubscribers(): Promise<Subscriber[]> {
  const result = await query(
    'SELECT id, email, name, status FROM newsletter_subscribers WHERE status = $1',
    ['active']
  )
  return result.rows
}

async function saveSentNewsletter(newsletter: NewsletterSend) {
  await query(
    `INSERT INTO sent_newsletters
      (newsletter_id, subject, post_slugs, recipient_count, success_count, fail_count, status, test_mode)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      newsletter.newsletter_id,
      newsletter.subject,
      newsletter.post_slugs,
      newsletter.recipient_count,
      newsletter.success_count,
      newsletter.fail_count,
      newsletter.status,
      newsletter.test_mode
    ]
  )
}

// POST: Enviar newsletter
export async function POST(req: Request) {
  try {
    const { postSlugs, subject, customMessage, testMode } = await req.json()

    if (!postSlugs || postSlugs.length === 0) {
      return NextResponse.json(
        { error: 'Debes seleccionar al menos un post' },
        { status: 400 }
      )
    }

    const brevoApiKey = process.env.BREVO_API_KEY

    if (!brevoApiKey || brevoApiKey === 'TU_API_KEY_REAL_AQUI') {
      return NextResponse.json(
        { error: 'BREVO_API_KEY no configurada. Configura tu API key en .env.local' },
        { status: 500 }
      )
    }

    // Obtener suscriptores activos
    const subscribers = await getActiveSubscribers()

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No hay suscriptores activos' },
        { status: 400 }
      )
    }

    // En modo test, solo enviar a los primeros 3 suscriptores
    const recipients = testMode ? subscribers.slice(0, 3) : subscribers

    console.log(`📧 [Newsletter] Enviando a ${recipients.length} suscriptores (test: ${testMode})`)

    // Crear registro de envío
    const newsletterSend: NewsletterSend = {
      newsletter_id: `newsletter_${Date.now()}`,
      subject: subject || 'Nuevos artículos de Torres Santiago',
      post_slugs: postSlugs,
      recipient_count: recipients.length,
      success_count: 0,
      fail_count: 0,
      status: 'sending',
      test_mode: testMode || false
    }

    let successCount = 0
    let failCount = 0

    // Obtener información de los posts (simulado - deberías obtenerlo de tu sistema)
    const posts = postSlugs.map((slug: string) => ({
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.torressantiago.com'}/blog/${slug}`
    }))

    // Enviar emails en lotes para no sobrecargar
    const BATCH_SIZE = 10
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE)

      const promises = batch.map(async (subscriber) => {
        try {
          await sendNewsletterEmail(subscriber, {
            subject: newsletterSend.subject,
            posts,
            customMessage
          })
          successCount++
          console.log(`✅ Email enviado a ${subscriber.email}`)
        } catch (error) {
          failCount++
          console.error(`❌ Error enviando a ${subscriber.email}:`, error)
        }
      })

      await Promise.all(promises)

      // Pequeña pausa entre lotes
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    newsletterSend.success_count = successCount
    newsletterSend.fail_count = failCount
    newsletterSend.status = failCount === 0 ? 'completed' : 'failed'

    await saveSentNewsletter(newsletterSend)

    console.log(`📊 [Newsletter] Completado: ${successCount} éxitos, ${failCount} fallos`)

    return NextResponse.json({
      success: true,
      message: `Newsletter enviado a ${successCount} suscriptores`,
      newsletterSend
    })
  } catch (error: any) {
    console.error('Error al enviar newsletter:', error)
    return NextResponse.json(
      { error: 'Error al enviar newsletter', details: error.message },
      { status: 500 }
    )
  }
}

// GET: Obtener historial de newsletters enviados
export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM sent_newsletters ORDER BY timestamp DESC LIMIT 50'
    )

    return NextResponse.json({
      newsletters: result.rows.map(n => ({
        id: n.newsletter_id,
        timestamp: n.timestamp,
        subject: n.subject,
        postSlugs: n.post_slugs,
        recipientCount: n.recipient_count,
        successCount: n.success_count,
        failCount: n.fail_count,
        status: n.status,
        testMode: n.test_mode
      }))
    })
  } catch (error: any) {
    console.error('Error al obtener newsletters:', error)
    return NextResponse.json(
      { error: 'Error al obtener newsletters', details: error.message },
      { status: 500 }
    )
  }
}

// Función para enviar email de newsletter
async function sendNewsletterEmail(
  subscriber: Subscriber,
  content: {
    subject: string
    posts: Array<{ slug: string; title: string; url: string }>
    customMessage?: string
  }
) {
  const brevoApiKey = process.env.BREVO_API_KEY

  if (!brevoApiKey) {
    throw new Error('BREVO_API_KEY no configurada')
  }

  const postsHTML = content.posts.map(post => `
    <div style="background-color: #f9f9f9; border-left: 4px solid #c17207; padding: 15px; margin: 15px 0; border-radius: 5px;">
      <h3 style="margin: 0 0 10px 0; color: #333;">
        <a href="${post.url}" style="color: #c17207; text-decoration: none;">
          ${post.title}
        </a>
      </h3>
      <a href="${post.url}" style="color: #c17207; text-decoration: none; font-size: 14px;">
        Leer artículo →
      </a>
    </div>
  `).join('')

  const emailData = {
    sender: {
      name: 'Torres Santiago',
      email: 'noreply@torressantiago.com'
    },
    to: [
      {
        email: subscriber.email,
        name: subscriber.name || subscriber.email
      }
    ],
    subject: content.subject,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #c17207 0%, #f59e0b 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Torres Santiago</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Soluciones Tecnológicas</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 20px;">
            <p style="color: #333; line-height: 1.6; font-size: 16px;">
              Hola${subscriber.name ? ` ${subscriber.name}` : ''},
            </p>

            ${content.customMessage ? `
              <div style="background-color: #fff5e6; border-left: 4px solid #c17207; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 15px;">
                  ${content.customMessage}
                </p>
              </div>
            ` : ''}

            <p style="color: #333; line-height: 1.6; font-size: 16px;">
              Tenemos nuevo contenido que creemos te va a interesar:
            </p>

            <!-- Posts -->
            ${postsHTML}

            <!-- CTA -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.torressantiago.com'}/blog"
                 style="display: inline-block; background-color: #c17207; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Ver todos los artículos
              </a>
            </div>

            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              ¿Necesitas ayuda con un proyecto de tecnología? Responde este email o contáctanos por WhatsApp.
            </p>

            <p style="color: #333; margin-top: 30px;">
              ¡Saludos!<br>
              <strong>El equipo de Torres Santiago</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9f9f9; padding: 30px 20px; border-top: 1px solid #eee;">
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 0 0 10px 0;">
                Torres Santiago - Oaxaca, México<br>
                <a href="https://www.torressantiago.com" style="color: #c17207; text-decoration: none;">www.torressantiago.com</a>
              </p>
              <p style="margin: 10px 0;">
                WhatsApp: <a href="https://wa.me/529513183885" style="color: #c17207; text-decoration: none;">+52 951 318 3885</a>
              </p>
              <p style="margin: 15px 0 0 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.torressantiago.com'}/newsletter/unsubscribe?id=${subscriber.id}"
                   style="color: #999; text-decoration: underline; font-size: 11px;">
                  Cancelar suscripción
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Retry logic con timeout aumentado
  let lastError: any
  const maxRetries = 3

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Crear AbortController con timeout de 30 segundos
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify(emailData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al enviar email: ${errorText}`)
      }

      return // Éxito, salir del loop
    } catch (error: any) {
      lastError = error

      // Si no es el último intento, esperar antes de reintentar
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)) // 1s, 2s, 3s
      }
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  throw lastError
}
