/**
 * Resend Credentials API
 * Generates new temporary password and sends email to palenque user
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';
import bcrypt from 'bcryptjs';
import { generateTemporaryPassword } from '@/lib/password-utils';
import axios from 'axios';

export async function POST(
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

    const palenqueId = parseInt(params.id);

    // Get palenque info
    const palenqueResult = await queryMezcal(
      'SELECT id, nombre, email_contacto FROM palenques WHERE id = $1',
      [palenqueId]
    );

    if (palenqueResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Palenque no encontrado' },
        { status: 404 }
      );
    }

    const palenque = palenqueResult.rows[0];

    // Get associated user
    const userResult = await queryMezcal(
      'SELECT id, email, nombre_completo FROM usuarios WHERE palenque_id = $1 AND role = $2 AND activo = TRUE',
      [palenqueId, 'palenque']
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No existe un usuario asociado a este palenque' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Generate new temporary password
    const newTemporaryPassword = generateTemporaryPassword();

    // Hash password
    const hashedPassword = await bcrypt.hash(newTemporaryPassword, 10);

    // Update user password and set flag to require password change
    await queryMezcal(
      `UPDATE usuarios
       SET password_hash = $1,
           metadata = COALESCE(metadata, '{}'::jsonb) || '{"requiere_cambio_password": true}'::jsonb,
           email_verificado = FALSE,
           updated_at = NOW()
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    // Send email with new credentials
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
              email: user.email,
              name: user.nombre_completo || palenque.nombre
            }
          ],
          subject: `Nuevas Credenciales de Acceso - ${palenque.nombre}`,
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🔑 Nuevas Credenciales de Acceso</h1>
              </div>

              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hola <strong>${user.nombre_completo || palenque.nombre}</strong>,</p>

                <p style="margin-bottom: 20px;">
                  Se han generado nuevas credenciales de acceso para tu cuenta en el sistema de gestión de leads de <strong>${palenque.nombre}</strong>.
                </p>

                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #d97706; margin: 25px 0;">
                  <h3 style="margin-top: 0; color: #d97706;">📋 Nuevos Datos de Acceso</h3>
                  <p style="margin: 10px 0;"><strong>Email:</strong> ${user.email}</p>
                  <p style="margin: 10px 0;"><strong>Nueva Contraseña Temporal:</strong> <code style="background: #fef3c7; padding: 5px 10px; border-radius: 4px; font-size: 16px; font-weight: bold;">${newTemporaryPassword}</code></p>
                  <p style="margin: 10px 0;"><strong>URL de Acceso:</strong> <a href="${process.env.NEXTAUTH_URL || 'https://leads.torressantiago.com'}/login" style="color: #d97706;">Ir al Dashboard</a></p>
                </div>

                <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 14px;">
                    <strong>⚠️ Importante:</strong> Por tu seguridad, deberás cambiar esta contraseña temporal en tu primer inicio de sesión.
                  </p>
                </div>

                <div style="background: #dbeafe; border: 1px solid #60a5fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 14px;">
                    <strong>📧 ¿No solicitaste este cambio?</strong> Si no solicitaste nuevas credenciales, contacta inmediatamente al administrador del sistema.
                  </p>
                </div>

                <h3 style="color: #374151; margin-top: 30px;">Próximos Pasos:</h3>
                <ol style="padding-left: 20px;">
                  <li style="margin-bottom: 10px;">Ingresa a <a href="${process.env.NEXTAUTH_URL || 'https://leads.torressantiago.com'}/login" style="color: #d97706;">leads.torressantiago.com</a></li>
                  <li style="margin-bottom: 10px;">Inicia sesión con tu email y nueva contraseña temporal</li>
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

      return NextResponse.json({
        success: true,
        message: 'Credenciales reenviadas exitosamente',
        email_sent_to: user.email,
      });

    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Credenciales generadas pero error al enviar email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error resending credentials:', error);
    return NextResponse.json(
      { error: 'Error al reenviar credenciales' },
      { status: 500 }
    );
  }
}
