/**
 * Change Password API
 * Allows users to change their password
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';
import bcrypt from 'bcryptjs';
import { validatePasswordStrength } from '@/lib/password-utils';

export async function POST(request: Request) {
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
    const { currentPassword, newPassword } = await request.json();

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Contraseña actual y nueva son requeridas' },
        { status: 400 }
      );
    }

    // Validate new password strength
    const validation = validatePasswordStrength(newPassword);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'La nueva contraseña no cumple con los requisitos', errors: validation.errors },
        { status: 400 }
      );
    }

    // Get current user data
    const userResult = await queryMezcal(
      'SELECT id, password_hash, email FROM usuarios WHERE email = $1 AND activo = TRUE',
      [user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const userData = userResult.rows[0];

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password_hash);

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'La contraseña actual es incorrecta' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password and remove "requiere_cambio_password" flag
    await queryMezcal(
      `UPDATE usuarios
       SET password_hash = $1,
           metadata = COALESCE(metadata, '{}'::jsonb) - 'requiere_cambio_password',
           email_verificado = TRUE,
           updated_at = NOW()
       WHERE id = $2`,
      [hashedNewPassword, userData.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Error al cambiar contraseña' },
      { status: 500 }
    );
  }
}
