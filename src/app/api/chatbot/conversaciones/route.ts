/**
 * Conversations API
 * List conversations for palenque
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const palenqueId = (session.user as any)?.palenqueId;

    if (userRole !== 'palenque' || !palenqueId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    let query = `
      SELECT
        c.*,
        COUNT(m.id) as total_mensajes,
        COUNT(CASE WHEN m.direccion = 'entrante' AND m.leido_at IS NULL THEN 1 END) as mensajes_no_leidos
      FROM conversaciones_chatbot c
      LEFT JOIN mensajes_whatsapp m ON c.id = m.conversacion_id
      WHERE c.palenque_id = $1
    `;

    const params: any[] = [palenqueId];
    let paramIndex = 2;

    if (estado) {
      query += ` AND c.estado = $${paramIndex++}`;
      params.push(estado);
    }

    query += `
      GROUP BY c.id
      ORDER BY c.ultima_interaccion DESC
      LIMIT $${paramIndex}
    `;

    params.push(limit);

    const result = await queryMezcal(query, params);

    return NextResponse.json({
      conversaciones: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Error al obtener conversaciones' },
      { status: 500 }
    );
  }
}
