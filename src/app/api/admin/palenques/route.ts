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
import { generateTemporaryPassword } from '@/lib/password-utils';
import axios from 'axios';

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

    return NextResponse.json({
      palenques: result.rows,
      total: result.rows.length
    });
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
      crear_usuario, // Boolean: true/false
      usuario_email,
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

    // Create user if requested
    let newUser = null;
    let temporaryPassword = null;

    if (crear_usuario && usuario_email) {
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

      // Generate temporary password
      temporaryPassword = generateTemporaryPassword();

      // Hash password
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      // Create user with metadata flag for password change
      const userResult = await queryMezcal(
        `INSERT INTO usuarios (
          email,
          password_hash,
          nombre_completo,
          role,
          palenque_id,
          activo,
          email_verificado,
          metadata
        ) VALUES ($1, $2, $3, 'palenque', $4, TRUE, FALSE, $5)
        RETURNING id, email, nombre_completo, role`,
        [
          usuario_email,
          hashedPassword,
          usuario_nombre || nombre,
          newPalenque.id,
          JSON.stringify({ requiere_cambio_password: true })
        ]
      );

      newUser = userResult.rows[0];

      // Send welcome email with temporary password
      try {
        await axios.post(
          'https://api.brevo.com/v3/smtp/email',
          {
            sender: {
              name: 'Torres Santiago - Sistema de Leads',
              email: 'contacto.torressantiago@gmail.com'
            },
            to: [
              {
                email: usuario_email,
                name: usuario_nombre || nombre
              }
            ],
            subject: `Bienvenido a Torres Santiago - Acceso al Dashboard de ${nombre}`,
            htmlContent: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">🥃 Bienvenido a Torres Santiago</h1>
                </div>

                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
                  <p style="font-size: 16px; margin-bottom: 20px;">Hola <strong>${usuario_nombre || nombre}</strong>,</p>

                  <p style="margin-bottom: 20px;">
                    Se ha creado tu cuenta para acceder al dashboard de <strong>${nombre}</strong> en nuestro sistema de gestión de leads.
                  </p>

                  <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #d97706; margin: 25px 0;">
                    <h3 style="margin-top: 0; color: #d97706;">📋 Datos de Acceso</h3>
                    <p style="margin: 10px 0;"><strong>Email:</strong> ${usuario_email}</p>
                    <p style="margin: 10px 0;"><strong>Contraseña Temporal:</strong> <code style="background: #fef3c7; padding: 5px 10px; border-radius: 4px; font-size: 16px; font-weight: bold;">${temporaryPassword}</code></p>
                    <p style="margin: 10px 0;"><strong>URL de Acceso:</strong> <a href="${process.env.NEXTAUTH_URL || 'https://leads.torressantiago.com'}/login" style="color: #d97706;">Ir al Dashboard</a></p>
                  </div>

                  <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px;">
                      <strong>⚠️ Importante:</strong> Por tu seguridad, deberás cambiar esta contraseña temporal en tu primer inicio de sesión.
                    </p>
                  </div>

                  <h3 style="color: #374151; margin-top: 30px;">Próximos Pasos:</h3>
                  <ol style="padding-left: 20px;">
                    <li style="margin-bottom: 10px;">Ingresa a <a href="${process.env.NEXTAUTH_URL || 'https://leads.torressantiago.com'}/login" style="color: #d97706;">leads.torressantiago.com</a></li>
                    <li style="margin-bottom: 10px;">Inicia sesión con tu email y contraseña temporal</li>
                    <li style="margin-bottom: 10px;">Crea tu nueva contraseña segura</li>
                    <li style="margin-bottom: 10px;">Comienza a gestionar tus leads</li>
                  </ol>

                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 14px; color: #6b7280; margin: 5px 0;">
                      Si tienes alguna duda, contáctanos:
                    </p>
                    <p style="font-size: 14px; color: #6b7280; margin: 5px 0;">
                      📧 contacto.torressantiago@gmail.com
                    </p>
                  </div>
                </div>

                <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                  <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                  <p>© ${new Date().getFullYear()} Torres Santiago. Todos los derechos reservados.</p>
                </div>
              </body>
              </html>
            `,
          },
          {
            headers: {
              'accept': 'application/json',
              'api-key': process.env.BREVO_API_KEY || '',
              'content-type': 'application/json'
            }
          }
        );

        console.log('Welcome email sent successfully to:', usuario_email);
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      ...newPalenque,
      user_created: !!newUser,
      user: newUser,
      email_sent: !!temporaryPassword,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating palenque:', error);
    return NextResponse.json(
      { error: 'Error al crear palenque' },
      { status: 500 }
    );
  }
}
