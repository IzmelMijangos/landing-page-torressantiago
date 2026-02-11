/**
 * Dashboard Leads API (for Palenques)
 * Returns leads specific to the logged-in palenque
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';

export async function GET(request: Request) {
  try {
    // Get session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const user = session.user as any;
    const palenqueId = user.palenqueId;

    if (user.role === 'palenque' && !palenqueId) {
      return NextResponse.json(
        { error: 'Usuario sin palenque asignado' },
        { status: 403 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const estado = searchParams.get('estado') || '';
    const origen = searchParams.get('origen') || '';

    // Build query
    let query = `
      SELECT
        id,
        uuid,
        nombre,
        telefono,
        email,
        ciudad,
        mezcal_probado,
        experiencia_calificacion,
        origen,
        fecha_captura,
        estado,
        fecha_ultima_interaccion,
        acepto_ofertas
      FROM leads
      WHERE palenque_id = $1
    `;

    const params: any[] = [palenqueId];
    let paramIndex = 2;

    // Search filter
    if (search) {
      query += ` AND (nombre ILIKE $${paramIndex} OR telefono ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Estado filter
    if (estado) {
      query += ` AND estado = $${paramIndex}`;
      params.push(estado);
      paramIndex++;
    }

    // Origen filter
    if (origen) {
      query += ` AND origen = $${paramIndex}`;
      params.push(origen);
      paramIndex++;
    }

    query += ' ORDER BY fecha_captura DESC';

    const result = await queryMezcal(query, params);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Error al obtener leads' },
      { status: 500 }
    );
  }
}
