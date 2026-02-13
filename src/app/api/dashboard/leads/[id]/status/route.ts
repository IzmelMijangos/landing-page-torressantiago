/**
 * Update Lead Status API
 * Allows palenques to update the status of their leads
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Get request body
    const { estado } = await request.json();

    // Validate estado
    const validEstados = ['nuevo', 'contactado', 'respondio', 'convertido', 'inactivo', 'opt_out'];
    if (!validEstados.includes(estado)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    const leadId = parseInt(params.id);

    // Verify the lead belongs to this palenque
    const verifyResult = await queryMezcal(
      'SELECT id FROM leads WHERE id = $1 AND palenque_id = $2',
      [leadId, palenqueId]
    );

    if (verifyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      );
    }

    // Update lead status and last interaction date
    await queryMezcal(
      `UPDATE leads
       SET estado = $1,
           fecha_ultima_interaccion = NOW()
       WHERE id = $2 AND palenque_id = $3`,
      [estado, leadId, palenqueId]
    );

    return NextResponse.json({
      success: true,
      message: 'Estado actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { error: 'Error al actualizar estado' },
      { status: 500 }
    );
  }
}
