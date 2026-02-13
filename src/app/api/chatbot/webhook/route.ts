/**
 * Chatbot Webhook
 * Receives WhatsApp messages from Twilio via n8n
 * Processes with Gemini AI and sends automated responses
 */

import { NextResponse } from 'next/server';
import { queryMezcal } from '@/lib/db-mezcal';
import { detectIntent, generateResponse, extractProductDetails } from '@/lib/gemini-ai';
import { sendWhatsAppMessage, sendTemplateMessage } from '@/lib/whatsapp-sender';

interface WebhookPayload {
  From: string; // whatsapp:+521234567890
  To: string; // whatsapp:+14155238886
  Body: string; // mensaje del usuario
  MessageSid: string; // ID del mensaje de Twilio
  MediaUrl?: string; // URL de imagen/video si aplica
  MediaContentType?: string;
  // Campos adicionales de identificación
  palenque_id?: number; // Si n8n ya identificó el palenque
  lead_uuid?: string; // Si viene de un lead existente
}

export async function POST(request: Request) {
  try {
    const payload: WebhookPayload = await request.json();
    const { From, Body, MessageSid, MediaUrl, palenque_id } = payload;

    console.log('📩 Webhook received:', { From, Body: Body.substring(0, 50), palenque_id });

    // Extract phone number
    const phoneNumber = From.replace('whatsapp:', '');

    if (!phoneNumber || !Body) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Step 1: Identify palenque
    let palenqueId = palenque_id;

    if (!palenqueId) {
      // Try to find from existing conversation
      const convResult = await queryMezcal<{ palenque_id: number }>(
        `SELECT palenque_id FROM conversaciones_chatbot
         WHERE telefono = $1 AND estado = 'activa'
         ORDER BY ultima_interaccion DESC LIMIT 1`,
        [phoneNumber]
      );

      if (convResult.rows.length > 0) {
        palenqueId = convResult.rows[0].palenque_id;
      } else {
        // Try to find from leads
        const leadResult = await queryMezcal<{ palenque_id: number }>(
          `SELECT palenque_id FROM leads
           WHERE telefono = $1
           ORDER BY fecha_captura DESC LIMIT 1`,
          [phoneNumber]
        );

        if (leadResult.rows.length > 0) {
          palenqueId = leadResult.rows[0].palenque_id;
        } else {
          // Cannot determine palenque - log error and exit
          console.error('❌ Cannot determine palenque for:', phoneNumber);
          return NextResponse.json(
            { error: 'Cannot determine palenque' },
            { status: 400 }
          );
        }
      }
    }

    // Step 2: Get chatbot configuration
    const configResult = await queryMezcal<{
      id: number;
      modo: 'pasivo' | 'activo';
      activo: boolean;
      horario_activo: any;
      mensaje_bienvenida: string;
      mensaje_fuera_horario: string;
      tiempo_espera_respuesta: number;
      personalidad: string;
      temperatura_ia: number;
    }>(
      `SELECT * FROM configuraciones_chatbot
       WHERE palenque_id = $1 AND activo = TRUE`,
      [palenqueId]
    );

    // If no config exists, create default
    if (configResult.rows.length === 0) {
      await queryMezcal(
        `INSERT INTO configuraciones_chatbot (palenque_id, modo, activo)
         VALUES ($1, 'pasivo', TRUE)
         ON CONFLICT (palenque_id) DO NOTHING`,
        [palenqueId]
      );

      // Recursive call to get the config
      const newConfigResult = await queryMezcal<{
        id: number;
        modo: 'pasivo' | 'activo';
        activo: boolean;
        mensaje_bienvenida: string;
        personalidad: string;
        temperatura_ia: number;
      }>(
        `SELECT * FROM configuraciones_chatbot WHERE palenque_id = $1`,
        [palenqueId]
      );

      var config = newConfigResult.rows[0];
    } else {
      var config = configResult.rows[0];
    }

    // Check if chatbot is active
    if (!config.activo) {
      console.log('🚫 Chatbot desactivado para palenque:', palenqueId);
      return NextResponse.json({ message: 'Chatbot disabled' });
    }

    // Check business hours
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    const horario = config.horario_activo || {
      inicio: '09:00',
      fin: '20:00',
      dias: [1, 2, 3, 4, 5, 6],
    };

    const [horaInicio] = horario.inicio.split(':').map(Number);
    const [horaFin] = horario.fin.split(':').map(Number);
    const dentroHorario =
      horario.dias.includes(currentDay) &&
      currentHour >= horaInicio &&
      currentHour < horaFin;

    if (!dentroHorario) {
      // Send out of hours message
      const mensajeFueraHorario =
        config.mensaje_fuera_horario ||
        `Gracias por tu mensaje! Nuestro horario de atención es de ${horario.inicio} a ${horario.fin}. Te responderemos pronto.`;

      await sendWhatsAppMessage({
        to: phoneNumber,
        message: mensajeFueraHorario,
        palenqueId,
      });

      return NextResponse.json({
        message: 'Out of hours response sent',
        mode: 'out_of_hours',
      });
    }

    // Step 3: Get or create conversation
    let conversacionId: number;
    let isNewConversation = false;

    const existingConvResult = await queryMezcal<{ id: number; nombre_cliente: string }>(
      `SELECT id, nombre_cliente FROM conversaciones_chatbot
       WHERE palenque_id = $1 AND telefono = $2 AND estado = 'activa'
       ORDER BY ultima_interaccion DESC LIMIT 1`,
      [palenqueId, phoneNumber]
    );

    if (existingConvResult.rows.length > 0) {
      conversacionId = existingConvResult.rows[0].id;
    } else {
      // Create new conversation
      const newConvResult = await queryMezcal<{ id: number }>(
        `INSERT INTO conversaciones_chatbot (palenque_id, telefono, estado, modo_conversacion)
         VALUES ($1, $2, 'activa', $3)
         RETURNING id`,
        [palenqueId, phoneNumber, config.modo]
      );
      conversacionId = newConvResult.rows[0].id;
      isNewConversation = true;
    }

    // Step 4: Save incoming message
    await queryMezcal(
      `INSERT INTO mensajes_whatsapp (
        conversacion_id, mensaje_id, direccion, contenido, tipo, media_url, estado
      ) VALUES ($1, $2, 'entrante', $3, $4, $5, 'recibido')`,
      [
        conversacionId,
        MessageSid,
        Body,
        MediaUrl ? 'imagen' : 'texto',
        MediaUrl || null,
      ]
    );

    // Update conversation last interaction
    await queryMezcal(
      `UPDATE conversaciones_chatbot
       SET ultima_interaccion = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [conversacionId]
    );

    // Step 5: Get conversation history
    const historyResult = await queryMezcal<{
      direccion: string;
      contenido: string;
      timestamp: string;
    }>(
      `SELECT direccion, contenido, timestamp
       FROM mensajes_whatsapp
       WHERE conversacion_id = $1
       ORDER BY timestamp DESC
       LIMIT 10`,
      [conversacionId]
    );

    const historial = historyResult.rows.reverse().map((m) => ({
      role: m.direccion === 'entrante' ? 'user' : 'assistant',
      content: m.contenido,
    }));

    // Step 6: Detect intent with Gemini AI
    console.log('🤖 Detecting intent...');
    const detectedIntent = await detectIntent(Body, historial);
    console.log('✅ Intent detected:', detectedIntent.intent, detectedIntent.confidence);

    // Save detected intent
    await queryMezcal(
      `INSERT INTO intenciones_detectadas (
        conversacion_id, intencion, confianza, entidades, modelo_ia
      ) VALUES ($1, $2, $3, $4, 'gemini-pro')`,
      [
        conversacionId,
        detectedIntent.intent,
        detectedIntent.confidence,
        JSON.stringify(detectedIntent.entities),
      ]
    );

    // Update conversation intent
    await queryMezcal(
      `UPDATE conversaciones_chatbot
       SET intencion_principal = $1, score_intencion = $2
       WHERE id = $3`,
      [detectedIntent.intent, detectedIntent.confidence, conversacionId]
    );

    // Step 7: Decide response based on mode
    let shouldRespond = false;
    let responseMessage = '';

    if (config.modo === 'pasivo') {
      // MODO PASIVO: Solo responde saludos y notifica al dueño
      if (isNewConversation || detectedIntent.intent === 'saludo') {
        shouldRespond = true;
        responseMessage =
          config.mensaje_bienvenida ||
          'Hola! Gracias por contactarnos. Un asesor te atenderá pronto.';
      }

      // TODO: Enviar notificación al palenque sobre nuevo mensaje
      console.log('📧 [TODO] Notificar al palenque sobre mensaje:', {
        palenqueId,
        telefono: phoneNumber,
        mensaje: Body,
      });
    } else {
      // MODO ACTIVO: El bot maneja la venta completa
      shouldRespond = true;

      // Get products for intelligent responses
      const productosResult = await queryMezcal<{
        id: number;
        nombre: string;
        descripcion: string;
        tipo_agave: string;
        presentaciones: any;
      }>(
        `SELECT id, nombre, descripcion, tipo_agave, presentaciones
         FROM productos_mezcal
         WHERE palenque_id = $1 AND activo = TRUE
         ORDER BY destacado DESC, orden_display ASC, nombre ASC`,
        [palenqueId]
      );

      const productos = productosResult.rows;

      // Generate intelligent response
      console.log('💬 Generating response...');
      responseMessage = await generateResponse(
        detectedIntent.intent,
        detectedIntent.entities,
        {
          modo: config.modo,
          mensaje_bienvenida: config.mensaje_bienvenida,
          personalidad: config.personalidad,
          temperatura_ia: config.temperatura_ia,
        },
        productos,
        historial
      );

      // Handle specific intents
      if (detectedIntent.intent === 'hacer_pedido' && detectedIntent.confidence > 0.7) {
        // Extract products from message
        const productDetails = await extractProductDetails(Body, productos);

        if (productDetails.productos.length > 0) {
          // Create or update cart
          const cartResult = await queryMezcal<{ id: number }>(
            `SELECT id FROM carritos_temporales
             WHERE conversacion_id = $1 AND estado = 'activo'`,
            [conversacionId]
          );

          if (cartResult.rows.length > 0) {
            // Update existing cart
            const cartId = cartResult.rows[0].id;
            // TODO: Add items to cart
          } else {
            // Create new cart
            const items = productDetails.productos.map((p) => {
              const producto = productos.find((pr) => pr.id === p.producto_id);
              const presentacion = producto?.presentaciones.find(
                (pr: any) => pr.ml === p.presentacion_ml
              );
              return {
                producto_id: p.producto_id,
                nombre: producto?.nombre,
                cantidad: p.cantidad,
                precio_unitario: presentacion?.precio || 0,
                subtotal: (presentacion?.precio || 0) * p.cantidad,
              };
            });

            const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

            await queryMezcal(
              `INSERT INTO carritos_temporales (
                conversacion_id, palenque_id, items, subtotal, total, estado
              ) VALUES ($1, $2, $3, $4, $4, 'activo')`,
              [conversacionId, palenqueId, JSON.stringify(items), subtotal]
            );

            // Update response to include cart summary
            const itemsSummary = items
              .map((i) => `${i.cantidad}x ${i.nombre} - $${i.subtotal}`)
              .join('\n');
            responseMessage += `\n\n📦 Tu carrito:\n${itemsSummary}\n\nSubtotal: $${subtotal}\n\n¿Deseas confirmar tu pedido?`;
          }
        }
      }

      if (detectedIntent.intent === 'hablar_con_humano') {
        // Switch to passive mode for this conversation
        await queryMezcal(
          `UPDATE conversaciones_chatbot
           SET modo_conversacion = 'pasivo'
           WHERE id = $1`,
          [conversacionId]
        );
        // TODO: Notify palenque owner
      }
    }

    // Step 8: Send response if needed
    if (shouldRespond && responseMessage) {
      console.log('📤 Sending response...');
      const sendResult = await sendWhatsAppMessage({
        to: phoneNumber,
        message: responseMessage,
        conversacionId,
        palenqueId,
      });

      if (!sendResult.success) {
        console.error('❌ Error sending response:', sendResult.error);
      } else {
        console.log('✅ Response sent successfully');
      }

      // Save intent with response
      await queryMezcal(
        `UPDATE intenciones_detectadas
         SET respuesta_enviada = $1
         WHERE id = (
           SELECT id FROM intenciones_detectadas
           WHERE conversacion_id = $2
           ORDER BY timestamp DESC
           LIMIT 1
         )`,
        [responseMessage, conversacionId]
      );
    }

    // Step 9: Check if should create lead
    if (
      isNewConversation ||
      (detectedIntent.confidence > 0.6 &&
        ['consulta_catalogo', 'consulta_precio', 'hacer_pedido'].includes(
          detectedIntent.intent
        ))
    ) {
      // Check if lead exists
      const leadResult = await queryMezcal(
        `SELECT id FROM leads WHERE telefono = $1 AND palenque_id = $2`,
        [phoneNumber, palenqueId]
      );

      if (leadResult.rows.length === 0) {
        // Create new lead
        await queryMezcal(
          `INSERT INTO leads (
            palenque_id, telefono, estado, origen, experiencia_calificacion, metadata, fecha_captura
          ) VALUES ($1, $2, 'nuevo', 'whatsapp-chatbot', 5, $3, NOW())`,
          [
            palenqueId,
            phoneNumber,
            JSON.stringify({
              primera_intencion: detectedIntent.intent,
              sentiment: detectedIntent.sentiment,
            }),
          ]
        );

        // Update conversation with lead_id
        const newLeadResult = await queryMezcal<{ id: number }>(
          `SELECT id FROM leads WHERE telefono = $1 AND palenque_id = $2 ORDER BY fecha_captura DESC LIMIT 1`,
          [phoneNumber, palenqueId]
        );

        if (newLeadResult.rows.length > 0) {
          await queryMezcal(
            `UPDATE conversaciones_chatbot
             SET lead_id = $1, genera_lead = TRUE
             WHERE id = $2`,
            [newLeadResult.rows[0].id, conversacionId]
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      conversacion_id: conversacionId,
      intent: detectedIntent.intent,
      confidence: detectedIntent.confidence,
      mode: config.modo,
      responded: shouldRespond,
    });
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'chatbot-webhook',
    timestamp: new Date().toISOString(),
  });
}
