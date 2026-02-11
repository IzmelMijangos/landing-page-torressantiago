/**
 * QR Code Generation API
 * Genera un código QR único para cada palenque
 */

import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación (solo admins)
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any)?.role !== 'admin' && (session.user as any)?.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const palenqueId = parseInt(params.id);

    if (isNaN(palenqueId)) {
      return NextResponse.json(
        { error: 'ID de palenque inválido' },
        { status: 400 }
      );
    }

    // Verificar que el palenque existe
    const result = await queryMezcal(
      `SELECT id, nombre FROM palenques WHERE id = $1`,
      [palenqueId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Palenque no encontrado' },
        { status: 404 }
      );
    }

    const palenque = result.rows[0];

    // URL base (usar la URL de producción o la actual)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://torressantiago.com';
    const leadCaptureUrl = `${baseUrl}/lead-capture?palenque=${palenqueId}`;

    // Opciones del QR
    const qrOptions = {
      errorCorrectionLevel: 'H' as const,
      type: 'image/png' as const,
      quality: 0.92,
      margin: 2,
      width: 512,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    };

    // Generar QR code como Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(leadCaptureUrl, qrOptions);

    // Retornar como JSON con la imagen base64
    return NextResponse.json({
      success: true,
      palenque: {
        id: palenque.id,
        nombre: palenque.nombre,
      },
      url: leadCaptureUrl,
      qrCode: qrCodeDataUrl,
    });

  } catch (error: any) {
    console.error('Error generando QR code:', error);
    return NextResponse.json(
      { error: 'Error al generar código QR' },
      { status: 500 }
    );
  }
}
