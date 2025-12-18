import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Ruta donde se guardarán los leads (temporal, cambiar a DB después)
const LEADS_DIR = path.join(process.cwd(), 'data')
const LEADS_FILE = path.join(LEADS_DIR, 'leads.json')

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

async function ensureDataDir() {
  if (!existsSync(LEADS_DIR)) {
    await mkdir(LEADS_DIR, { recursive: true })
  }
  if (!existsSync(LEADS_FILE)) {
    await writeFile(LEADS_FILE, JSON.stringify([]))
  }
}

async function getLeads(): Promise<Lead[]> {
  await ensureDataDir()
  const data = await readFile(LEADS_FILE, 'utf-8')
  return JSON.parse(data)
}

async function saveLeads(leads: Lead[]) {
  await ensureDataDir()
  await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
}

export async function POST(req: Request) {
  try {
    const leadData = await req.json()

    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      source: leadData.source || 'unknown',
      score: leadData.score || 0,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      service: leadData.service,
      conversation: leadData.lastMessages || leadData.conversation || [],
      notified: false
    }

    // Guardar lead
    const leads = await getLeads()
    leads.push(lead)
    await saveLeads(leads)

    // Si es lead caliente, notificar (score >= 50 con datos de contacto)
    if (lead.score >= 50) {
      console.log(`🔔 [Leads API] Lead caliente (score: ${lead.score}), enviando notificación...`)
      try {
        // Pasar TODOS los datos originales al endpoint de notificación
        const notifyResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead: {
              ...leadData,  // Pasar todos los datos originales (incluye confidence, lastMessages, signals, etc.)
              id: lead.id,
              timestamp: lead.timestamp
            }
          })
        })

        if (notifyResponse.ok) {
          console.log('✅ [Leads API] Notificación enviada exitosamente')
        } else {
          console.error('❌ [Leads API] Error en respuesta de notificación:', await notifyResponse.text())
        }

        lead.notified = true
        await saveLeads(leads)
      } catch (notifyError) {
        console.error('❌ [Leads API] Error al notificar:', notifyError)
      }
    } else {
      console.log(`⏭️ [Leads API] Lead no caliente (score: ${lead.score}), sin notificación`)
    }

    return NextResponse.json({ success: true, lead })
  } catch (error: any) {
    console.error('Error al guardar lead:', error)
    return NextResponse.json(
      { error: 'Error al guardar lead', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const leads = await getLeads()

    // Estadísticas
    const stats = {
      total: leads.length,
      hot: leads.filter(l => l.score >= 80).length,
      warm: leads.filter(l => l.score >= 50 && l.score < 80).length,
      cold: leads.filter(l => l.score < 50).length,
      sources: {
        chatbot: leads.filter(l => l.source === 'chatbot').length,
        form: leads.filter(l => l.source === 'contact_form').length,
        whatsapp: leads.filter(l => l.source === 'whatsapp').length
      },
      today: leads.filter(l => {
        const leadDate = new Date(l.timestamp)
        const today = new Date()
        return leadDate.toDateString() === today.toDateString()
      }).length
    }

    return NextResponse.json({ leads, stats })
  } catch (error: any) {
    console.error('Error al obtener leads:', error)
    return NextResponse.json(
      { error: 'Error al obtener leads', details: error.message },
      { status: 500 }
    )
  }
}
