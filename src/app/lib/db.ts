// src/app/lib/db.ts
// Utilidad para conexión a PostgreSQL (Neon)

import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error('DATABASE_URL no está configurada en las variables de entorno')
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20, // Máximo de conexiones en el pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Log de conexión exitosa
    pool.on('connect', () => {
      console.log('✅ Conectado a PostgreSQL (Neon)')
    })

    // Log de errores
    pool.on('error', (err) => {
      console.error('❌ Error inesperado en el pool de PostgreSQL:', err)
    })
  }

  return pool
}

// Helper para ejecutar queries con manejo de errores
export async function query(text: string, params?: any[]) {
  const pool = getPool()
  const start = Date.now()

  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start

    console.log('📊 Query ejecutada:', {
      query: text.substring(0, 100) + '...',
      duration: `${duration}ms`,
      rows: res.rowCount
    })

    return res
  } catch (error) {
    console.error('❌ Error en query:', error)
    throw error
  }
}

// Helper para cerrar el pool (útil en desarrollo)
export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
    console.log('🔌 Pool de PostgreSQL cerrado')
  }
}
