import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'

interface Lead {
  id: number
  lead_id: string
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

export async function POST(req: Request) {
  try {
    const leadData = await req.json()

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Insertar lead en la base de datos
    const insertQuery = `
      INSERT INTO leads
        (lead_id, source, score, name, email, phone, service, conversation, notified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE)
      RETURNING *
    `
    const insertResult = await query(insertQuery, [
      leadId,
      leadData.source || 'unknown',
      leadData.score || 0,
      leadData.name || null,
      leadData.email || null,
      leadData.phone || null,
      leadData.service || null,
      JSON.stringify(leadData.lastMessages || leadData.conversation || [])
    ])

    const lead = insertResult.rows[0]

    // Si es lead caliente, notificar (score >= 50)
    if (lead.score >= 50) {
      console.log(`🔔 [Leads API] Lead caliente (score: ${lead.score}), enviando notificación...`)
      try {
        const notifyResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead: {
              ...leadData,
              id: lead.lead_id,
              timestamp: lead.timestamp
            }
          })
        })

        if (notifyResponse.ok) {
          console.log('✅ [Leads API] Notificación enviada exitosamente')

          // Marcar como notificado
          await query(
            'UPDATE leads SET notified = TRUE WHERE lead_id = $1',
            [lead.lead_id]
          )
        } else {
          console.error('❌ [Leads API] Error en respuesta de notificación:', await notifyResponse.text())
        }
      } catch (notifyError) {
        console.error('❌ [Leads API] Error al notificar:', notifyError)
      }
    } else {
      console.log(`⏭️ [Leads API] Lead no caliente (score: ${lead.score}), sin notificación`)
    }

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.lead_id,
        timestamp: lead.timestamp,
        source: lead.source,
        score: lead.score,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        service: lead.service,
        notified: lead.notified
      }
    })
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
    // Obtener todos los leads
    const leadsQuery = 'SELECT * FROM leads ORDER BY timestamp DESC'
    const leadsResult = await query(leadsQuery)
    const leads = leadsResult.rows

    // Estadísticas
    const statsQuery = `
      SELECT
        COUNT(*)::int as total,
        COUNT(CASE WHEN score >= 80 THEN 1 END)::int as hot,
        COUNT(CASE WHEN score >= 50 AND score < 80 THEN 1 END)::int as warm,
        COUNT(CASE WHEN score < 50 THEN 1 END)::int as cold,
        COUNT(CASE WHEN source = 'chatbot' THEN 1 END)::int as chatbot,
        COUNT(CASE WHEN source = 'contact_form' THEN 1 END)::int as contact_form,
        COUNT(CASE WHEN source = 'whatsapp' THEN 1 END)::int as whatsapp,
        COUNT(CASE WHEN DATE(timestamp) = CURRENT_DATE THEN 1 END)::int as today
      FROM leads
    `
    const statsResult = await query(statsQuery)
    const statsRow = statsResult.rows[0]

    const stats = {
      total: statsRow.total,
      hot: statsRow.hot,
      warm: statsRow.warm,
      cold: statsRow.cold,
      sources: {
        chatbot: statsRow.chatbot,
        form: statsRow.contact_form,
        whatsapp: statsRow.whatsapp
      },
      today: statsRow.today
    }

    return NextResponse.json({
      leads: leads.map(l => ({
        id: l.lead_id,
        timestamp: l.timestamp,
        source: l.source,
        score: l.score,
        name: l.name,
        email: l.email,
        phone: l.phone,
        service: l.service,
        conversation: l.conversation,
        notified: l.notified
      })),
      stats
    })
  } catch (error: any) {
    console.error('Error al obtener leads:', error)
    return NextResponse.json(
      { error: 'Error al obtener leads', details: error.message },
      { status: 500 }
    )
  }
}
