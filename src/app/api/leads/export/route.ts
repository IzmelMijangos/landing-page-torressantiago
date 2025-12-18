import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const DATA_DIR = path.join(process.cwd(), 'data')
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'newsletter-subscribers.json')
const DOWNLOADS_FILE = path.join(DATA_DIR, 'lead-magnet-downloads.json')
const LEADS_FILE = path.join(DATA_DIR, 'leads.json')

// GET: Exportar suscriptores en diferentes formatos
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'json' // json, csv, brevo
    const type = searchParams.get('type') || 'newsletter' // newsletter, downloads, leads, all

    let data: any[] = []

    // Cargar datos según el tipo
    if (type === 'newsletter' || type === 'all') {
      if (existsSync(SUBSCRIBERS_FILE)) {
        const subscribersData = await readFile(SUBSCRIBERS_FILE, 'utf-8')
        const subscribers = JSON.parse(subscribersData)
        data = [...data, ...subscribers.filter((s: any) => s.status === 'active')]
      }
    }

    if (type === 'downloads' || type === 'all') {
      if (existsSync(DOWNLOADS_FILE)) {
        const downloadsData = await readFile(DOWNLOADS_FILE, 'utf-8')
        const downloads = JSON.parse(downloadsData)
        data = [...data, ...downloads]
      }
    }

    if (type === 'leads' || type === 'all') {
      if (existsSync(LEADS_FILE)) {
        const leadsData = await readFile(LEADS_FILE, 'utf-8')
        const leads = JSON.parse(leadsData)
        data = [...data, ...leads]
      }
    }

    // Formato JSON
    if (format === 'json') {
      return NextResponse.json({
        success: true,
        count: data.length,
        data
      })
    }

    // Formato CSV
    if (format === 'csv') {
      const csv = convertToCSV(data)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="suscriptores-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Formato Brevo (lista de contactos)
    if (format === 'brevo') {
      const brevoContacts = data.map(item => ({
        email: item.email,
        attributes: {
          FIRSTNAME: item.name || '',
          LASTNAME: '',
          // Agregar campos personalizados según necesites
          SOURCE: item.source || 'unknown',
          SUBSCRIBED_DATE: item.timestamp || new Date().toISOString()
        }
      }))

      return NextResponse.json({
        success: true,
        count: brevoContacts.length,
        contacts: brevoContacts,
        instructions: 'Copia estos contactos y súbelos a Brevo en: Contacts > Import Contacts'
      })
    }

    return NextResponse.json({ error: 'Formato no soportado' }, { status: 400 })
  } catch (error: any) {
    console.error('Error al exportar:', error)
    return NextResponse.json(
      { error: 'Error al exportar datos', details: error.message },
      { status: 500 }
    )
  }
}

// Función para convertir a CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) {
    return 'email,nombre,fecha,fuente,estado\n'
  }

  // Headers
  const headers = ['email', 'nombre', 'fecha', 'fuente', 'estado']
  let csv = headers.join(',') + '\n'

  // Rows
  data.forEach(item => {
    const row = [
      item.email || '',
      item.name || '',
      item.timestamp ? new Date(item.timestamp).toLocaleDateString('es-MX') : '',
      item.source || 'unknown',
      item.status || 'active'
    ]
    csv += row.map(field => `"${field}"`).join(',') + '\n'
  })

  return csv
}
