/**
 * Chatbot Configuration API
 * Allows palenques to configure their chatbot settings
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';

/**
 * GET: Get chatbot configuration
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const palenqueId = (session.user as any)?.palenqueId;

    // Only palenque users can access their config
    if (userRole !== 'palenque' || !palenqueId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Get configuration
    const result = await queryMezcal(
      `SELECT * FROM configuraciones_chatbot WHERE palenque_id = $1`,
      [palenqueId]
    );

    if (result.rows.length === 0) {
      // Create default configuration
      const defaultConfig = await queryMezcal(
        `INSERT INTO configuraciones_chatbot (
          palenque_id, modo, activo, horario_activo, mensaje_bienvenida,
          mensaje_fuera_horario, tiempo_espera_respuesta, metodos_pago,
          costos_envio, zona_envio_gratis_min, temperatura_ia, personalidad
        ) VALUES (
          $1, 'pasivo', TRUE,
          '{"inicio": "09:00", "fin": "20:00", "dias": [1,2,3,4,5,6]}'::jsonb,
          'Hola! Gracias por contactarnos. ¿En qué puedo ayudarte?',
          'Gracias por tu mensaje. Nuestro horario es de 9am a 8pm. Te responderemos pronto.',
          120,
          ARRAY['efectivo', 'transferencia', 'tarjeta'],
          '{"local": 0, "nacional": 150, "internacional": 500}'::jsonb,
          1000.00,
          0.7,
          'amigable y conocedor'
        )
        RETURNING *`,
        [palenqueId]
      );

      return NextResponse.json({
        config: defaultConfig.rows[0],
        isNew: true,
      });
    }

    return NextResponse.json({
      config: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching chatbot config:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Update chatbot configuration
 */
export async function PATCH(request: Request) {
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

    const body = await request.json();
    const {
      modo,
      activo,
      horario_activo,
      mensaje_bienvenida,
      mensaje_fuera_horario,
      tiempo_espera_respuesta,
      metodos_pago,
      costos_envio,
      zona_envio_gratis_min,
      temperatura_ia,
      personalidad,
    } = body;

    // Validations
    if (modo && !['pasivo', 'activo'].includes(modo)) {
      return NextResponse.json(
        { error: 'Modo debe ser "pasivo" o "activo"' },
        { status: 400 }
      );
    }

    if (temperatura_ia !== undefined) {
      const temp = parseFloat(temperatura_ia);
      if (isNaN(temp) || temp < 0 || temp > 1) {
        return NextResponse.json(
          { error: 'Temperatura IA debe estar entre 0 y 1' },
          { status: 400 }
        );
      }
    }

    if (horario_activo) {
      if (!horario_activo.inicio || !horario_activo.fin || !horario_activo.dias) {
        return NextResponse.json(
          { error: 'Horario debe incluir inicio, fin y días' },
          { status: 400 }
        );
      }
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (modo !== undefined) {
      updates.push(`modo = $${paramIndex++}`);
      values.push(modo);
    }

    if (activo !== undefined) {
      updates.push(`activo = $${paramIndex++}`);
      values.push(activo);
    }

    if (horario_activo !== undefined) {
      updates.push(`horario_activo = $${paramIndex++}`);
      values.push(JSON.stringify(horario_activo));
    }

    if (mensaje_bienvenida !== undefined) {
      updates.push(`mensaje_bienvenida = $${paramIndex++}`);
      values.push(mensaje_bienvenida);
    }

    if (mensaje_fuera_horario !== undefined) {
      updates.push(`mensaje_fuera_horario = $${paramIndex++}`);
      values.push(mensaje_fuera_horario);
    }

    if (tiempo_espera_respuesta !== undefined) {
      updates.push(`tiempo_espera_respuesta = $${paramIndex++}`);
      values.push(tiempo_espera_respuesta);
    }

    if (metodos_pago !== undefined) {
      updates.push(`metodos_pago = $${paramIndex++}`);
      values.push(metodos_pago);
    }

    if (costos_envio !== undefined) {
      updates.push(`costos_envio = $${paramIndex++}`);
      values.push(JSON.stringify(costos_envio));
    }

    if (zona_envio_gratis_min !== undefined) {
      updates.push(`zona_envio_gratis_min = $${paramIndex++}`);
      values.push(zona_envio_gratis_min);
    }

    if (temperatura_ia !== undefined) {
      updates.push(`temperatura_ia = $${paramIndex++}`);
      values.push(temperatura_ia);
    }

    if (personalidad !== undefined) {
      updates.push(`personalidad = $${paramIndex++}`);
      values.push(personalidad);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No hay campos para actualizar' },
        { status: 400 }
      );
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`);

    // Add palenque_id for WHERE clause
    values.push(palenqueId);

    const query = `
      UPDATE configuraciones_chatbot
      SET ${updates.join(', ')}
      WHERE palenque_id = $${paramIndex}
      RETURNING *
    `;

    const result = await queryMezcal(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Configuración no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      config: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating chatbot config:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}
