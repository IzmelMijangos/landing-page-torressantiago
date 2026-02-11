/**
 * Test API Route - Verifica conexión a Mezcal Database
 *
 * GET /api/test-db-mezcal
 *
 * Returns:
 * - Database connection status
 * - List of palenques
 * - Database version
 */

import { NextResponse } from 'next/server';
import { queryMezcal } from '@/lib/db-mezcal';

export async function GET() {
  try {
    // 1. Test database connection with version query
    const versionResult = await queryMezcal('SELECT version()');
    const dbVersion = versionResult.rows[0].version;

    // 2. Get palenques count
    const countResult = await queryMezcal('SELECT COUNT(*) as total FROM palenques');
    const totalPalenques = countResult.rows[0].total;

    // 3. Get all palenques
    const palenquesResult = await queryMezcal(`
      SELECT
        id,
        nombre,
        ubicacion,
        telefono_contacto,
        email_contacto,
        activo,
        plan,
        fecha_registro
      FROM palenques
      ORDER BY id
    `);

    return NextResponse.json({
      success: true,
      message: 'Conexión a Mezcal Database exitosa',
      data: {
        database: {
          connected: true,
          version: dbVersion,
        },
        stats: {
          totalPalenques: parseInt(totalPalenques),
        },
        palenques: palenquesResult.rows,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error connecting to Mezcal database:', error);

    return NextResponse.json({
      success: false,
      message: 'Error al conectar con Mezcal Database',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
