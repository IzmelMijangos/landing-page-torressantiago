/**
 * Palenque Info API (Public)
 * Devuelve información básica de un palenque para mostrar en el formulario
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryMezcal } from '@/lib/db-mezcal';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const palenqueId = parseInt(params.id);

    if (isNaN(palenqueId)) {
      return NextResponse.json(
        { error: 'ID de palenque inválido' },
        { status: 400 }
      );
    }

    // Obtener información básica del palenque (solo datos públicos)
    const result = await queryMezcal(
      `SELECT
        id,
        nombre,
        ubicacion,
        plan,
        activo
       FROM palenques
       WHERE id = $1 AND activo = TRUE`,
      [palenqueId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Palenque no encontrado o inactivo' },
        { status: 404 }
      );
    }

    const palenque = result.rows[0];

    return NextResponse.json({
      id: palenque.id,
      nombre: palenque.nombre,
      ubicacion: palenque.ubicacion,
      plan: palenque.plan,
    });

  } catch (error: any) {
    console.error('Error obteniendo info del palenque:', error);
    return NextResponse.json(
      { error: 'Error al obtener información del palenque' },
      { status: 500 }
    );
  }
}
