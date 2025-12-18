import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'

export const dynamic = 'force-dynamic'

// GET: Exportar datos en diferentes formatos
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'json' // json, csv, brevo
    const type = searchParams.get('type') || 'newsletter' // newsletter, downloads, leads, all

    let data: any[] = []

    // Cargar datos según el tipo
    if (type === 'newsletter' || type === 'all') {
      const subscribersResult = await query(
        'SELECT * FROM newsletter_subscribers WHERE status = $1 ORDER BY signup_date DESC',
        ['active']
      )
      data = [
        ...data,
        ...subscribersResult.rows.map(row => ({
          email: row.email,
          name: row.name,
          source: row.source,
          timestamp: row.signup_date,
          status: row.status,
          type: 'newsletter'
        }))
      ]
    }

    if (type === 'downloads' || type === 'all') {
      const downloadsResult = await query(
        'SELECT * FROM lead_magnet_downloads ORDER BY timestamp DESC'
      )
      data = [
        ...data,
        ...downloadsResult.rows.map(row => ({
          email: row.email,
          name: row.name,
          source: row.source,
          timestamp: row.timestamp,
          resource: row.resource,
          type: 'download'
        }))
      ]
    }

    if (type === 'leads' || type === 'all') {
      const leadsResult = await query(
        'SELECT * FROM leads ORDER BY timestamp DESC'
      )
      data = [
        ...data,
        ...leadsResult.rows.map(row => ({
          email: row.email,
          name: row.name,
          phone: row.phone,
          service: row.service,
          source: row.source,
          timestamp: row.timestamp,
          score: row.score,
          type: 'lead'
        }))
      ]
    }

    // Formato JSON
    if (format === 'json') {
      return NextResponse.json({
        success: true,
        count: data.length,
        data,
        exportDate: new Date().toISOString()
      })
    }

    // Formato CSV
    if (format === 'csv') {
      const csv = convertToCSV(data)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Formato Brevo (lista de contactos)
    if (format === 'brevo') {
      const brevoContacts = data
        .filter(item => item.email) // Solo los que tienen email
        .map(item => ({
          email: item.email,
          attributes: {
            FIRSTNAME: item.name || '',
            LASTNAME: '',
            SOURCE: item.source || 'unknown',
            TYPE: item.type || 'unknown',
            SUBSCRIBED_DATE: item.timestamp || new Date().toISOString(),
            RESOURCE: item.resource || '',
            SCORE: item.score || 0
          }
        }))

      return NextResponse.json({
        success: true,
        count: brevoContacts.length,
        contacts: brevoContacts,
        instructions: 'Copia estos contactos y súbelos a Brevo en: Contacts > Import Contacts',
        exportDate: new Date().toISOString()
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
    return 'tipo,email,nombre,telefono,fecha,fuente,puntuacion,recurso\n'
  }

  // Headers
  const headers = ['tipo', 'email', 'nombre', 'telefono', 'fecha', 'fuente', 'puntuacion', 'recurso']
  let csv = headers.join(',') + '\n'

  // Rows
  data.forEach(item => {
    const row = [
      item.type || '',
      item.email || '',
      item.name || '',
      item.phone || '',
      item.timestamp ? new Date(item.timestamp).toLocaleDateString('es-MX') : '',
      item.source || '',
      item.score || '',
      item.resource || ''
    ]
    csv += row.map(field => `"${field}"`).join(',') + '\n'
  })

  return csv
}
