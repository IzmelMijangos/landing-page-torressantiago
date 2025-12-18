import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'

interface Subscriber {
  id: number
  email: string
  name?: string
  signup_date: string
  source: string
  signup_page?: string
  status: 'active' | 'unsubscribed'
  emails_sent: number
  unsubscribed_at?: string
}

// POST: Cancelar suscripción
export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID de suscriptor requerido' },
        { status: 400 }
      )
    }

    // Buscar suscriptor
    const selectQuery = `
      SELECT * FROM newsletter_subscribers
      WHERE id = $1
    `
    const selectResult = await query(selectQuery, [parseInt(id)])

    if (selectResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Suscriptor no encontrado' },
        { status: 404 }
      )
    }

    const subscriber = selectResult.rows[0]

    // Si ya está dado de baja
    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json({
        success: true,
        message: 'Ya te habías dado de baja anteriormente',
        subscriber: {
          email: subscriber.email,
          unsubscribedAt: subscriber.unsubscribed_at
        }
      })
    }

    // Actualizar estado a unsubscribed
    const updateQuery = `
      UPDATE newsletter_subscribers
      SET
        status = 'unsubscribed',
        unsubscribed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `
    const updateResult = await query(updateQuery, [parseInt(id)])
    const updatedSubscriber = updateResult.rows[0]

    console.log(`🚫 [Newsletter] Usuario dado de baja: ${updatedSubscriber.email}`)

    return NextResponse.json({
      success: true,
      message: 'Te has dado de baja exitosamente del newsletter',
      subscriber: {
        email: updatedSubscriber.email,
        unsubscribedAt: updatedSubscriber.unsubscribed_at
      }
    })
  } catch (error: any) {
    console.error('Error al cancelar suscripción:', error)
    return NextResponse.json(
      { error: 'Error al procesar la cancelación', details: error.message },
      { status: 500 }
    )
  }
}

// GET: Obtener información del suscriptor (para confirmar antes de dar de baja)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de suscriptor requerido' },
        { status: 400 }
      )
    }

    // Buscar suscriptor por ID
    const selectQuery = `
      SELECT
        id,
        email,
        name,
        status,
        signup_date,
        emails_sent,
        unsubscribed_at
      FROM newsletter_subscribers
      WHERE id = $1
    `
    const result = await query(selectQuery, [parseInt(id)])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Suscriptor no encontrado' },
        { status: 404 }
      )
    }

    const subscriber = result.rows[0]

    return NextResponse.json({
      success: true,
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        status: subscriber.status,
        subscribedAt: subscriber.signup_date,
        emailsSent: subscriber.emails_sent,
        unsubscribedAt: subscriber.unsubscribed_at
      }
    })
  } catch (error: any) {
    console.error('Error al obtener suscriptor:', error)
    return NextResponse.json(
      { error: 'Error al obtener información', details: error.message },
      { status: 500 }
    )
  }
}
