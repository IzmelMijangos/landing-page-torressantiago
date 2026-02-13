/**
 * Single Conversation API
 * Get messages for a conversation and send manual responses
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';
import { sendWhatsAppMessage } from '@/lib/whatsapp-sender';

/**
 * GET: Get conversation with messages
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const palenqueId = (session.user as any)?.palenqueId;
    const conversacionId = parseInt(params.id);

    // Get conversation
    const convResult = await queryMezcal(
      `SELECT * FROM conversaciones_chatbot
       WHERE id = $1 AND palenque_id = $2`,
      [conversacionId, palenqueId]
    );

    if (convResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    const conversacion = convResult.rows[0];

    // Get messages
    const mensajesResult = await queryMezcal(
      `SELECT * FROM mensajes_whatsapp
       WHERE conversacion_id = $1
       ORDER BY timestamp ASC`,
      [conversacionId]
    );

    // Mark as read
    await queryMezcal(
      `UPDATE mensajes_whatsapp
       SET leido_at = NOW()
       WHERE conversacion_id = $1 AND direccion = 'entrante' AND leido_at IS NULL`,
      [conversacionId]
    );

    return NextResponse.json({
      conversacion,
      mensajes: mensajesResult.rows,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Error al obtener conversación' },
      { status: 500 }
    );
  }
}

/**
 * POST: Send manual message
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const palenqueId = (session.user as any)?.palenqueId;
    const conversacionId = parseInt(params.id);

    const body = await request.json();
    const { mensaje } = body;

    if (!mensaje) {
      return NextResponse.json(
        { error: 'Mensaje es requerido' },
        { status: 400 }
      );
    }

    // Get conversation
    const convResult = await queryMezcal<{ telefono: string }>(
      `SELECT telefono FROM conversaciones_chatbot
       WHERE id = $1 AND palenque_id = $2`,
      [conversacionId, palenqueId]
    );

    if (convResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    const { telefono } = convResult.rows[0];

    // Send message
    const result = await sendWhatsAppMessage({
      to: telefono,
      message: mensaje,
      conversacionId,
      palenqueId,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al enviar mensaje' },
        { status: 500 }
      );
    }

    // Switch conversation to passive mode (manual handling)
    await queryMezcal(
      `UPDATE conversaciones_chatbot
       SET modo_conversacion = 'pasivo'
       WHERE id = $1`,
      [conversacionId]
    );

    return NextResponse.json({
      success: true,
      messageSid: result.messageSid,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}
