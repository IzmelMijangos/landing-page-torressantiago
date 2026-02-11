/**
 * Lead Capture API
 * Recibe datos del formulario y los envía a n8n webhook
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validaciones básicas
    if (!body.palenque_id) {
      return NextResponse.json(
        { error: 'palenque_id es requerido' },
        { status: 400 }
      );
    }

    if (!body.nombre || !body.telefono) {
      return NextResponse.json(
        { error: 'Nombre y teléfono son requeridos' },
        { status: 400 }
      );
    }

    // Preparar datos para n8n
    const leadData = {
      palenque_id: body.palenque_id,
      nombre: body.nombre,
      telefono: body.telefono,
      email: body.email,
      ciudad: body.ciudad || '',
      mezcal_probado: body.mezcal_probado || '',
      experiencia_calificacion: parseInt(body.experiencia_calificacion) || 5,
      origen: body.origen || 'qr_mesa',
      acepto_terminos: body.acepto_terminos || false,
      acepto_ofertas: body.acepto_ofertas !== false, // default true
      timestamp: new Date().toISOString(),
    };

    // URL del webhook de n8n
    // IMPORTANTE: Esta URL debe estar configurada en variables de entorno
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://35.226.54.93:5678/webhook/lead-capture';

    // Enviar a n8n
    console.log('Enviando a n8n:', n8nWebhookUrl, leadData);

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    console.log('n8n status:', n8nResponse.status);

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('Error en n8n webhook:', errorText);
      throw new Error(`Error al procesar el registro: ${errorText}`);
    }

    const responseText = await n8nResponse.text();
    console.log('n8n response:', responseText);

    let n8nResult;
    try {
      n8nResult = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Error parsing JSON:', e);
      n8nResult = { raw: responseText };
    }

    return NextResponse.json({
      success: true,
      message: 'Lead registrado exitosamente',
      data: n8nResult,
    });

  } catch (error: any) {
    console.error('Error en lead capture:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar el registro' },
      { status: 500 }
    );
  }
}
