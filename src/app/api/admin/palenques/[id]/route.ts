/**
 * Palenques API - Single Operations
 * GET: Get single palenque
 * PUT: Update palenque
 * DELETE: Deactivate palenque (soft delete)
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin session
    const session = await getServerSession(authOptions);

    if (!session || ((session.user as any)?.role !== 'admin' && (session.user as any)?.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const result = await queryMezcal(
      `SELECT
        p.*,
        COUNT(l.id) as total_leads,
        u.email as usuario_email,
        u.nombre_completo as usuario_nombre,
        u.activo as usuario_activo
      FROM palenques p
      LEFT JOIN leads l ON p.id = l.palenque_id
      LEFT JOIN usuarios u ON p.id = u.palenque_id
      WHERE p.id = $1
      GROUP BY p.id, u.email, u.nombre_completo, u.activo`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Palenque no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching palenque:', error);
    return NextResponse.json(
      { error: 'Error al obtener palenque' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin session
    const session = await getServerSession(authOptions);

    if (!session || ((session.user as any)?.role !== 'admin' && (session.user as any)?.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      nombre,
      ubicacion,
      telefono_contacto,
      email_contacto,
      whatsapp_phone_number,
      plan,
      activo,
    } = body;

    // Validate required fields
    if (!nombre || !email_contacto || !plan) {
      return NextResponse.json(
        { error: 'Nombre, email y plan son requeridos' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_contacto)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Check if palenque exists
    const existingPalenque = await queryMezcal(
      'SELECT id FROM palenques WHERE id = $1',
      [params.id]
    );

    if (existingPalenque.rows.length === 0) {
      return NextResponse.json(
        { error: 'Palenque no encontrado' },
        { status: 404 }
      );
    }

    // Check if email is taken by another palenque
    const emailCheck = await queryMezcal(
      'SELECT id FROM palenques WHERE email_contacto = $1 AND id != $2',
      [email_contacto, params.id]
    );

    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'El email ya está en uso por otro palenque' },
        { status: 400 }
      );
    }

    // Update palenque
    const result = await queryMezcal(
      `UPDATE palenques SET
        nombre = $1,
        ubicacion = $2,
        telefono_contacto = $3,
        email_contacto = $4,
        whatsapp_phone_number = $5,
        plan = $6,
        activo = $7,
        updated_at = NOW()
      WHERE id = $8
      RETURNING id, uuid, nombre, email_contacto, plan, activo, fecha_registro`,
      [nombre, ubicacion, telefono_contacto, email_contacto, whatsapp_phone_number, plan, activo, params.id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating palenque:', error);
    return NextResponse.json(
      { error: 'Error al actualizar palenque' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin session
    const session = await getServerSession(authOptions);

    if (!session || ((session.user as any)?.role !== 'admin' && (session.user as any)?.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Check if palenque exists
    const existingPalenque = await queryMezcal(
      'SELECT id FROM palenques WHERE id = $1',
      [params.id]
    );

    if (existingPalenque.rows.length === 0) {
      return NextResponse.json(
        { error: 'Palenque no encontrado' },
        { status: 404 }
      );
    }

    // Soft delete - just deactivate
    await queryMezcal(
      'UPDATE palenques SET activo = FALSE, updated_at = NOW() WHERE id = $1',
      [params.id]
    );

    // Also deactivate associated users
    await queryMezcal(
      'UPDATE usuarios SET activo = FALSE WHERE palenque_id = $1',
      [params.id]
    );

    return NextResponse.json({ success: true, message: 'Palenque desactivado' });
  } catch (error) {
    console.error('Error deleting palenque:', error);
    return NextResponse.json(
      { error: 'Error al eliminar palenque' },
      { status: 500 }
    );
  }
}
