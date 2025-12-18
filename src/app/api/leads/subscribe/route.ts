import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Ruta donde se guardarán las suscripciones
const DATA_DIR = path.join(process.cwd(), 'data')
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'newsletter-subscribers.json')

interface Subscriber {
  id: string
  email: string
  name?: string
  timestamp: string
  source: 'sidebar' | 'inline' | 'footer' | 'popup' | 'sticky-bar'
  page?: string
  status: 'active' | 'unsubscribed'
  emailsSent: number
}

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
  if (!existsSync(SUBSCRIBERS_FILE)) {
    await writeFile(SUBSCRIBERS_FILE, JSON.stringify([]))
  }
}

async function getSubscribers(): Promise<Subscriber[]> {
  await ensureDataDir()
  const data = await readFile(SUBSCRIBERS_FILE, 'utf-8')
  return JSON.parse(data)
}

async function saveSubscribers(subscribers: Subscriber[]) {
  await ensureDataDir()
  await writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))
}

// Validación simple de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// POST: Crear nueva suscripción
export async function POST(req: Request) {
  try {
    const { email, name, source, page } = await req.json()

    // Validaciones
    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const subscribers = await getSubscribers()

    // Verificar si ya existe
    const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Reactivar suscripción
        existing.status = 'active'
        existing.timestamp = new Date().toISOString()
        await saveSubscribers(subscribers)

        return NextResponse.json({
          success: true,
          message: 'Suscripción reactivada',
          subscriber: existing
        })
      }

      return NextResponse.json(
        { error: 'Este email ya está suscrito' },
        { status: 409 }
      )
    }

    // Crear nuevo suscriptor
    const newSubscriber: Subscriber = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase().trim(),
      name: name?.trim(),
      timestamp: new Date().toISOString(),
      source: source || 'inline',
      page: page,
      status: 'active',
      emailsSent: 0
    }

    subscribers.push(newSubscriber)
    await saveSubscribers(subscribers)

    // Enviar email de bienvenida vía Brevo
    try {
      await sendWelcomeEmail(newSubscriber)
    } catch (emailError) {
      console.error('Error al enviar email de bienvenida:', emailError)
      // No fallar la suscripción si el email falla
    }

    console.log(`📧 [Newsletter] Nueva suscripción: ${email} desde ${source}`)

    return NextResponse.json({
      success: true,
      message: '¡Gracias por suscribirte!',
      subscriber: newSubscriber
    })
  } catch (error: any) {
    console.error('Error en newsletter subscribe:', error)
    return NextResponse.json(
      { error: 'Error al procesar suscripción', details: error.message },
      { status: 500 }
    )
  }
}

// GET: Obtener estadísticas de suscriptores
export async function GET() {
  try {
    const subscribers = await getSubscribers()

    const stats = {
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
      bySource: {
        sidebar: subscribers.filter(s => s.source === 'sidebar').length,
        inline: subscribers.filter(s => s.source === 'inline').length,
        footer: subscribers.filter(s => s.source === 'footer').length,
        popup: subscribers.filter(s => s.source === 'popup').length,
        stickyBar: subscribers.filter(s => s.source === 'sticky-bar').length,
      },
      today: subscribers.filter(s => {
        const subDate = new Date(s.timestamp)
        const today = new Date()
        return subDate.toDateString() === today.toDateString()
      }).length,
      thisWeek: subscribers.filter(s => {
        const subDate = new Date(s.timestamp)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return subDate >= weekAgo
      }).length
    }

    return NextResponse.json({
      subscribers: subscribers.filter(s => s.status === 'active'),
      stats
    })
  } catch (error: any) {
    console.error('Error al obtener suscriptores:', error)
    return NextResponse.json(
      { error: 'Error al obtener suscriptores', details: error.message },
      { status: 500 }
    )
  }
}

// Función para enviar email de bienvenida vía Brevo
async function sendWelcomeEmail(subscriber: Subscriber) {
  const brevoApiKey = process.env.BREVO_API_KEY

  if (!brevoApiKey) {
    console.warn('⚠️ BREVO_API_KEY no configurada, no se enviará email de bienvenida')
    return
  }

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
    subject: '¡Bienvenido a Torres Santiago! 🚀',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c17207; margin: 0;">¡Bienvenido! 🚀</h1>
          </div>

          <div style="color: #333; line-height: 1.6;">
            <p>Hola${subscriber.name ? ` ${subscriber.name}` : ''},</p>

            <p>¡Gracias por suscribirte a nuestro newsletter!</p>

            <p>Cada semana recibirás:</p>
            <ul style="color: #555;">
              <li>✓ Tips prácticos de tecnología para empresas</li>
              <li>✓ Casos de éxito reales</li>
              <li>✓ Tendencias en desarrollo y transformación digital</li>
              <li>✓ Recursos y guías exclusivas</li>
            </ul>

            <div style="background-color: #fff5e6; border-left: 4px solid #c17207; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #666;">
                <strong>🎁 Regalo de bienvenida:</strong> Próximamente recibirás acceso exclusivo a nuestro checklist
                "10 Puntos para Evaluar Proveedores de Desarrollo Web"
              </p>
            </div>

            <p>Si tienes alguna pregunta o necesitas ayuda con un proyecto, no dudes en responder este email.</p>

            <p>¡Nos vemos en tu inbox!</p>

            <p style="margin-top: 30px;">
              <strong>El equipo de Torres Santiago</strong><br>
              <span style="color: #666; font-size: 14px;">Soluciones tecnológicas en Oaxaca</span>
            </p>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
            <p>
              Torres Santiago - Oaxaca, México<br>
              <a href="https://www.torressantiago.com" style="color: #c17207; text-decoration: none;">www.torressantiago.com</a>
            </p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.torressantiago.com'}/newsletter/unsubscribe?id=${subscriber.id}"
                 style="color: #999; text-decoration: underline;">Cancelar suscripción</a>
            </p>
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
        throw new Error(`Error al enviar email de bienvenida: ${errorText}`)
      }

      console.log(`📨 Email de bienvenida enviado a ${subscriber.email}`)
      return // Éxito, salir del loop
    } catch (error: any) {
      lastError = error
      console.warn(`⚠️ Intento ${attempt}/${maxRetries} falló para ${subscriber.email}:`, error.message)

      // Si no es el último intento, esperar antes de reintentar
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt)) // 2s, 4s, 6s
      }
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  throw lastError
}
