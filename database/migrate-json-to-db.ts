#!/usr/bin/env tsx
/**
 * Script de migración de datos JSON a PostgreSQL
 *
 * Este script migra los datos existentes en archivos JSON a la base de datos PostgreSQL.
 * Solo debe ejecutarse UNA VEZ durante la migración inicial.
 *
 * Uso:
 *   npx tsx database/migrate-json-to-db.ts
 */

import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Rutas a los archivos JSON
const dataDir = path.join(process.cwd(), 'data')
const files = {
  leads: path.join(dataDir, 'leads.json'),
  subscribers: path.join(dataDir, 'newsletter-subscribers.json'),
  downloads: path.join(dataDir, 'lead-magnet-downloads.json'),
  newsletters: path.join(dataDir, 'sent-newsletters.json')
}

interface Lead {
  id: string
  timestamp: string
  source: string
  score: number
  name?: string
  email?: string
  phone?: string
  service?: string
  lastMessages?: any[]
  conversation?: any[]
  notified?: boolean
}

interface Subscriber {
  email: string
  name?: string
  source?: string
  signupPage?: string
  signupDate?: string
  timestamp?: string
  status?: string
  emailsSent?: number
}

interface Download {
  id: string
  email: string
  name?: string
  resource: string
  timestamp: string
  source?: string
  emailSent?: boolean
}

interface Newsletter {
  id: string
  timestamp: string
  subject: string
  postSlugs: string[]
  recipientCount: number
  successCount: number
  failCount: number
  status: string
  testMode?: boolean
}

// Función para leer JSON de forma segura
function readJSON<T>(filepath: string): T[] {
  try {
    if (!fs.existsSync(filepath)) {
      console.log(`⚠️  Archivo no encontrado: ${filepath}`)
      return []
    }
    const content = fs.readFileSync(filepath, 'utf-8')
    const data = JSON.parse(content)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(`❌ Error leyendo ${filepath}:`, error)
    return []
  }
}

// Migrar leads
async function migrateLeads() {
  const leads = readJSON<Lead>(files.leads)
  console.log(`\n📊 Migrando ${leads.length} leads...`)

  let migrated = 0
  let skipped = 0

  for (const lead of leads) {
    try {
      const conversation = lead.lastMessages || lead.conversation || []

      await pool.query(
        `INSERT INTO leads
          (lead_id, timestamp, source, score, name, email, phone, service, conversation, notified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (lead_id) DO NOTHING`,
        [
          lead.id,
          lead.timestamp || new Date().toISOString(),
          lead.source || 'unknown',
          lead.score || 0,
          lead.name || null,
          lead.email || null,
          lead.phone || null,
          lead.service || null,
          JSON.stringify(conversation),
          lead.notified || false
        ]
      )
      migrated++
    } catch (error: any) {
      console.error(`  ❌ Error migrando lead ${lead.id}:`, error.message)
      skipped++
    }
  }

  console.log(`  ✅ ${migrated} leads migrados, ${skipped} omitidos`)
}

// Migrar suscriptores
async function migrateSubscribers() {
  const subscribers = readJSON<Subscriber>(files.subscribers)
  console.log(`\n📧 Migrando ${subscribers.length} suscriptores...`)

  let migrated = 0
  let skipped = 0

  for (const sub of subscribers) {
    try {
      const signupDate = sub.signupDate || sub.timestamp || new Date().toISOString()

      await pool.query(
        `INSERT INTO newsletter_subscribers
          (email, name, source, signup_page, signup_date, status, emails_sent)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO NOTHING`,
        [
          sub.email.toLowerCase().trim(),
          sub.name || null,
          sub.source || 'inline',
          sub.signupPage || null,
          signupDate,
          sub.status || 'active',
          sub.emailsSent || 0
        ]
      )
      migrated++
    } catch (error: any) {
      console.error(`  ❌ Error migrando suscriptor ${sub.email}:`, error.message)
      skipped++
    }
  }

  console.log(`  ✅ ${migrated} suscriptores migrados, ${skipped} omitidos`)
}

// Migrar descargas
async function migrateDownloads() {
  const downloads = readJSON<Download>(files.downloads)
  console.log(`\n📥 Migrando ${downloads.length} descargas...`)

  let migrated = 0
  let skipped = 0

  for (const download of downloads) {
    try {
      await pool.query(
        `INSERT INTO lead_magnet_downloads
          (download_id, email, name, resource, timestamp, source, email_sent)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (download_id) DO NOTHING`,
        [
          download.id,
          download.email.toLowerCase().trim(),
          download.name || null,
          download.resource,
          download.timestamp || new Date().toISOString(),
          download.source || 'unknown',
          download.emailSent || false
        ]
      )
      migrated++
    } catch (error: any) {
      console.error(`  ❌ Error migrando descarga ${download.id}:`, error.message)
      skipped++
    }
  }

  console.log(`  ✅ ${migrated} descargas migradas, ${skipped} omitidas`)
}

// Migrar newsletters enviados
async function migrateNewsletters() {
  const newsletters = readJSON<Newsletter>(files.newsletters)
  console.log(`\n📨 Migrando ${newsletters.length} newsletters...`)

  let migrated = 0
  let skipped = 0

  for (const newsletter of newsletters) {
    try {
      await pool.query(
        `INSERT INTO sent_newsletters
          (newsletter_id, timestamp, subject, post_slugs, recipient_count, success_count, fail_count, status, test_mode)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (newsletter_id) DO NOTHING`,
        [
          newsletter.id,
          newsletter.timestamp || new Date().toISOString(),
          newsletter.subject || 'Newsletter',
          newsletter.postSlugs || [],
          newsletter.recipientCount || 0,
          newsletter.successCount || 0,
          newsletter.failCount || 0,
          newsletter.status || 'completed',
          newsletter.testMode || false
        ]
      )
      migrated++
    } catch (error: any) {
      console.error(`  ❌ Error migrando newsletter ${newsletter.id}:`, error.message)
      skipped++
    }
  }

  console.log(`  ✅ ${migrated} newsletters migrados, ${skipped} omitidos`)
}

// Verificar que las tablas existan
async function verifyTables() {
  console.log('\n🔍 Verificando tablas en la base de datos...')

  const tables = ['leads', 'newsletter_subscribers', 'lead_magnet_downloads', 'sent_newsletters']

  for (const table of tables) {
    const result = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = $1
      )`,
      [table]
    )

    if (!result.rows[0].exists) {
      throw new Error(`❌ Tabla "${table}" no existe. Ejecuta primero el schema.sql`)
    }

    console.log(`  ✅ Tabla "${table}" existe`)
  }
}

// Estadísticas finales
async function showStats() {
  console.log('\n📊 Estadísticas finales:')

  const stats = [
    { table: 'leads', name: 'Leads' },
    { table: 'newsletter_subscribers', name: 'Suscriptores' },
    { table: 'lead_magnet_downloads', name: 'Descargas' },
    { table: 'sent_newsletters', name: 'Newsletters enviados' }
  ]

  for (const stat of stats) {
    const result = await pool.query(`SELECT COUNT(*) as count FROM ${stat.table}`)
    console.log(`  ${stat.name}: ${result.rows[0].count}`)
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando migración de datos JSON a PostgreSQL...')
  console.log(`📁 Directorio de datos: ${dataDir}`)

  try {
    // Verificar conexión a la base de datos
    if (!process.env.DATABASE_URL) {
      throw new Error('❌ DATABASE_URL no está configurada en las variables de entorno')
    }

    await pool.query('SELECT NOW()')
    console.log('✅ Conexión a la base de datos exitosa')

    // Verificar tablas
    await verifyTables()

    // Ejecutar migraciones
    await migrateLeads()
    await migrateSubscribers()
    await migrateDownloads()
    await migrateNewsletters()

    // Mostrar estadísticas
    await showStats()

    console.log('\n✅ Migración completada exitosamente!')
    console.log('\n⚠️  IMPORTANTE: Haz un backup de los archivos JSON antes de eliminarlos:')
    console.log('   cp -r data data-backup')
    console.log('\n💡 Los archivos JSON ahora pueden ser eliminados o movidos a un backup.')

  } catch (error: any) {
    console.error('\n❌ Error durante la migración:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Ejecutar
main()
