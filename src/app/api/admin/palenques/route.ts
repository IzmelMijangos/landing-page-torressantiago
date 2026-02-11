/**
 * Palenques API - List and Create
 * GET: List all palenques with optional filters
 * POST: Create new palenque and user
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    // Verify admin session
    const session = await getServerSession(authOptions);

    if (!session || ((session.user as any)?.role !== 'admin' && (session.user as any)?.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || '';
    const activo = searchParams.get('activo');

    // Build query
    let query = `
      SELECT
        p.id,
        p.uuid,
        p.nombre,
        p.ubicacion,
        p.telefono_contacto,
        p.email_contacto,
        p.whatsapp_phone_number,
        p.plan,
        p.activo,
        p.fecha_registro,
        COUNT(l.id) as total_leads
      FROM palenques p
      LEFT JOIN leads l ON p.id = l.palenque_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      query += ` AND (p.nombre ILIKE $${paramIndex} OR p.email_contacto ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Plan filter
    if (plan) {
      query += ` AND p.plan = $${paramIndex}`;
      params.push(plan);
      paramIndex++;
    }

    // Active filter
    if (activo !== null && activo !== '') {
      query += ` AND p.activo = $${paramIndex}`;
      params.push(activo === 'true');
      paramIndex++;
    }

    query += `
      GROUP BY p.id, p.uuid, p.nombre, p.ubicacion, p.telefono_contacto,
               p.email_contacto, p.whatsapp_phone_number, p.plan, p.activo, p.fecha_registro
      ORDER BY p.fecha_registro DESC
    `;

    const result = await queryMezcal(query, params);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching palenques:', error);
    return NextResponse.json(
      { error: 'Error al obtener palenques' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
      // User creation
      usuario_email,
      usuario_password,
      usuario_nombre,
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
        { error: 'Email de contacto inválido' },
        { status: 400 }
      );
    }

    if (usuario_email && !emailRegex.test(usuario_email)) {
      return NextResponse.json(
        { error: 'Email de usuario inválido' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingPalenque = await queryMezcal(
      'SELECT id FROM palenques WHERE email_contacto = $1',
      [email_contacto]
    );

    if (existingPalenque.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe un palenque con ese email' },
        { status: 400 }
      );
    }

    // Insert palenque
    const palenqueResult = await queryMezcal(
      `INSERT INTO palenques (
        nombre,
        ubicacion,
        telefono_contacto,
        email_contacto,
        whatsapp_phone_number,
        plan,
        activo
      ) VALUES ($1, $2, $3, $4, $5, $6, TRUE)
      RETURNING id, uuid, nombre, email_contacto, plan, fecha_registro`,
      [nombre, ubicacion, telefono_contacto, email_contacto, whatsapp_phone_number, plan]
    );

    const newPalenque = palenqueResult.rows[0];

    // Create user if credentials provided
    let newUser = null;
    if (usuario_email && usuario_password) {
      // Check if user email already exists
      const existingUser = await queryMezcal(
        'SELECT id FROM usuarios WHERE email = $1',
        [usuario_email]
      );

      if (existingUser.rows.length > 0) {
        // Palenque was created but user exists - return warning
        return NextResponse.json({
          ...newPalenque,
          warning: 'Palenque creado pero el email de usuario ya existe',
          user_created: false,
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(usuario_password, 10);

      // Create user
      const userResult = await queryMezcal(
        `INSERT INTO usuarios (
          email,
          password_hash,
          nombre_completo,
          role,
          palenque_id,
          activo
        ) VALUES ($1, $2, $3, 'palenque', $4, TRUE)
        RETURNING id, email, nombre_completo, role`,
        [usuario_email, hashedPassword, usuario_nombre || nombre, newPalenque.id]
      );

      newUser = userResult.rows[0];
    }

    return NextResponse.json({
      ...newPalenque,
      user_created: !!newUser,
      user: newUser,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating palenque:', error);
    return NextResponse.json(
      { error: 'Error al crear palenque' },
      { status: 500 }
    );
  }
}
