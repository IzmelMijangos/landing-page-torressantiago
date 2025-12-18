import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DOWNLOADS_FILE = path.join(DATA_DIR, 'lead-magnet-downloads.json')

interface LeadMagnetDownload {
  id: string
  email: string
  name?: string
  resource: string // ID del recurso descargado
  timestamp: string
  source: string // página desde donde descargó
  emailSent: boolean
}

interface LeadMagnet {
  id: string
  title: string
  description: string
  filename: string // Nombre del archivo PDF
  emailSubject: string
  emailBody: string
}

// Catálogo de lead magnets disponibles
const LEAD_MAGNETS: Record<string, LeadMagnet> = {
  'checklist-desarrollo-web': {
    id: 'checklist-desarrollo-web',
    title: 'Checklist: 10 Puntos para Evaluar Proveedores de Desarrollo Web',
    description: 'Guía completa para tomar la mejor decisión al contratar desarrollo web',
    filename: 'checklist-desarrollo-web.pdf',
    emailSubject: '📥 Tu Checklist de Desarrollo Web está lista',
    emailBody: 'Descarga tu guía para evaluar proveedores de desarrollo web profesional.'
  },
  'guia-roi-chatbots': {
    id: 'guia-roi-chatbots',
    title: 'Guía: ROI de Chatbots - Calculadora incluida',
    description: 'Descubre cómo calcular el retorno de inversión de implementar un chatbot',
    filename: 'guia-roi-chatbots.pdf',
    emailSubject: '🤖 Tu Guía de ROI de Chatbots + Calculadora',
    emailBody: 'Accede a la calculadora de ROI y guía completa de chatbots.'
  },
  'plan-ciberseguridad-pymes': {
    id: 'plan-ciberseguridad-pymes',
    title: 'Template: Plan de Ciberseguridad para PyMEs',
    description: 'Plantilla lista para usar con checklist de seguridad',
    filename: 'plan-ciberseguridad-pymes.pdf',
    emailSubject: '🔒 Tu Plan de Ciberseguridad para PyMEs',
    emailBody: 'Descarga tu plantilla de plan de ciberseguridad lista para implementar.'
  }
}

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
  if (!existsSync(DOWNLOADS_FILE)) {
    await writeFile(DOWNLOADS_FILE, JSON.stringify([]))
  }
}

async function getDownloads(): Promise<LeadMagnetDownload[]> {
  await ensureDataDir()
  const data = await readFile(DOWNLOADS_FILE, 'utf-8')
  return JSON.parse(data)
}

async function saveDownloads(downloads: LeadMagnetDownload[]) {
  await ensureDataDir()
  await writeFile(DOWNLOADS_FILE, JSON.stringify(downloads, null, 2))
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// POST: Solicitar descarga de lead magnet
export async function POST(req: Request) {
  try {
    const { email, name, resource, source } = await req.json()

    // Validaciones
    if (!email || !resource) {
      return NextResponse.json(
        { error: 'Email y recurso son requeridos' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const leadMagnet = LEAD_MAGNETS[resource]
    if (!leadMagnet) {
      return NextResponse.json(
        { error: 'Recurso no encontrado' },
        { status: 404 }
      )
    }

    const downloads = await getDownloads()

    // Crear registro de descarga
    const newDownload: LeadMagnetDownload = {
      id: `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase().trim(),
      name: name?.trim(),
      resource: resource,
      timestamp: new Date().toISOString(),
      source: source || 'unknown',
      emailSent: false
    }

    downloads.push(newDownload)
    await saveDownloads(downloads)

    // Enviar email con el recurso
    try {
      await sendLeadMagnetEmail(newDownload, leadMagnet)
      newDownload.emailSent = true
      await saveDownloads(downloads)
    } catch (emailError) {
      console.error('Error al enviar email con lead magnet:', emailError)
      return NextResponse.json(
        { error: 'Error al enviar el recurso por email' },
        { status: 500 }
      )
    }

    console.log(`📥 [Lead Magnet] Descarga: ${leadMagnet.title} por ${email}`)

    return NextResponse.json({
      success: true,
      message: '¡Revisa tu email! Te hemos enviado el recurso.',
      download: newDownload
    })
  } catch (error: any) {
    console.error('Error en lead magnet download:', error)
    return NextResponse.json(
      { error: 'Error al procesar descarga', details: error.message },
      { status: 500 }
    )
  }
}

// GET: Obtener estadísticas de descargas
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const resource = searchParams.get('resource')

    const downloads = await getDownloads()

    let filteredDownloads = downloads
    if (resource) {
      filteredDownloads = downloads.filter(d => d.resource === resource)
    }

    const stats = {
      total: filteredDownloads.length,
      byResource: Object.keys(LEAD_MAGNETS).reduce((acc, key) => {
        acc[key] = downloads.filter(d => d.resource === key).length
        return acc
      }, {} as Record<string, number>),
      today: filteredDownloads.filter(d => {
        const downloadDate = new Date(d.timestamp)
        const today = new Date()
        return downloadDate.toDateString() === today.toDateString()
      }).length,
      thisWeek: filteredDownloads.filter(d => {
        const downloadDate = new Date(d.timestamp)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return downloadDate >= weekAgo
      }).length
    }

    return NextResponse.json({
      downloads: filteredDownloads,
      stats,
      availableResources: LEAD_MAGNETS
    })
  } catch (error: any) {
    console.error('Error al obtener descargas:', error)
    return NextResponse.json(
      { error: 'Error al obtener descargas', details: error.message },
      { status: 500 }
    )
  }
}

// Función para enviar email con lead magnet
async function sendLeadMagnetEmail(download: LeadMagnetDownload, leadMagnet: LeadMagnet) {
  const brevoApiKey = process.env.BREVO_API_KEY

  if (!brevoApiKey) {
    throw new Error('BREVO_API_KEY no configurada')
  }

  // URL pública del PDF (asumiendo que los PDFs estarán en /public/lead-magnets/)
  const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.torressantiago.com'}/lead-magnets/${leadMagnet.filename}`

  const emailData = {
    sender: {
      name: 'Torres Santiago',
      email: 'noreply@torressantiago.com'
    },
    to: [
      {
        email: download.email,
        name: download.name || download.email
      }
    ],
    subject: leadMagnet.emailSubject,
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
            <h1 style="color: #c17207; margin: 0;">¡Tu recurso está listo! 📥</h1>
          </div>

          <div style="color: #333; line-height: 1.6;">
            <p>Hola${download.name ? ` ${download.name}` : ''},</p>

            <p>Gracias por tu interés en <strong>${leadMagnet.title}</strong>.</p>

            <div style="background-color: #fff5e6; border-left: 4px solid #c17207; padding: 20px; margin: 30px 0; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 16px;">
                <strong>${leadMagnet.description}</strong>
              </p>
              <a href="${downloadUrl}"
                 download
                 style="display: inline-block; background-color: #c17207; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                📥 Descargar ahora
              </a>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3 style="color: #c17207; margin-top: 0;">💡 ¿Necesitas ayuda para implementarlo?</h3>
              <p style="margin-bottom: 0;">
                En Torres Santiago ayudamos a empresas como la tuya a implementar soluciones tecnológicas
                que impulsan el crecimiento. Si quieres platicar sobre tu proyecto, responde este email
                o contáctanos por WhatsApp.
              </p>
            </div>

            <p style="margin-top: 30px;">
              <strong>Tip:</strong> No olvides suscribirte a nuestro newsletter para recibir más recursos
              como este cada semana.
            </p>

            <p style="margin-top: 30px;">
              ¡Saludos!<br>
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
              WhatsApp: <a href="https://wa.me/529515831593" style="color: #c17207; text-decoration: none;">+52 951 583 1593</a>
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
        throw new Error(`Error al enviar email: ${errorText}`)
      }

      console.log(`📨 Lead magnet enviado a ${download.email}: ${leadMagnet.title}`)
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
