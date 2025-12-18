import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'newsletter-subscribers.json')

interface Subscriber {
  id: string
  email: string
  name?: string
  timestamp: string
  source: string
  page: string
  status: 'active' | 'unsubscribed'
  emailsSent: number
  unsubscribedAt?: string
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

    // Leer suscriptores
    if (!existsSync(SUBSCRIBERS_FILE)) {
      return NextResponse.json(
        { error: 'No se encontraron suscriptores' },
        { status: 404 }
      )
    }

    const data = await readFile(SUBSCRIBERS_FILE, 'utf-8')
    const subscribers: Subscriber[] = JSON.parse(data)

    // Buscar suscriptor
    const subscriberIndex = subscribers.findIndex(s => s.id === id)

    if (subscriberIndex === -1) {
      return NextResponse.json(
        { error: 'Suscriptor no encontrado' },
        { status: 404 }
      )
    }

    const subscriber = subscribers[subscriberIndex]

    // Si ya está dado de baja
    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json({
        success: true,
        message: 'Ya te habías dado de baja anteriormente',
        subscriber: {
          email: subscriber.email,
          unsubscribedAt: subscriber.unsubscribedAt
        }
      })
    }

    // Actualizar estado
    subscribers[subscriberIndex] = {
      ...subscriber,
      status: 'unsubscribed',
      unsubscribedAt: new Date().toISOString()
    }

    // Guardar cambios
    await writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))

    console.log(`🚫 [Newsletter] Usuario dado de baja: ${subscriber.email}`)

    return NextResponse.json({
      success: true,
      message: 'Te has dado de baja exitosamente del newsletter',
      subscriber: {
        email: subscriber.email,
        unsubscribedAt: subscribers[subscriberIndex].unsubscribedAt
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

    if (!existsSync(SUBSCRIBERS_FILE)) {
      return NextResponse.json(
        { error: 'No se encontraron suscriptores' },
        { status: 404 }
      )
    }

    const data = await readFile(SUBSCRIBERS_FILE, 'utf-8')
    const subscribers: Subscriber[] = JSON.parse(data)

    const subscriber = subscribers.find(s => s.id === id)

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Suscriptor no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        status: subscriber.status,
        subscribedAt: subscriber.timestamp,
        emailsSent: subscriber.emailsSent,
        unsubscribedAt: subscriber.unsubscribedAt
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
