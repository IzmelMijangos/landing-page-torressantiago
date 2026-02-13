/**
 * WhatsApp Sender Service
 * Handles sending messages via Twilio WhatsApp API
 * with rate limiting, retry logic, and status tracking
 */

import axios from 'axios';
import { queryMezcal } from './db-mezcal';

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string; // formato: whatsapp:+14155238886
}

interface SendMessageOptions {
  to: string; // número del destinatario con formato: +521234567890
  message: string;
  mediaUrl?: string; // para enviar imágenes
  conversacionId?: number;
  palenqueId: number;
}

interface SendMessageResult {
  success: boolean;
  messageSid?: string;
  error?: string;
  status: string; // queued, sent, delivered, read, failed
}

// Rate limiting: máximo 10 mensajes por minuto por palenque
const rateLimitMap = new Map<number, { count: number; resetTime: number }>();

/**
 * Get Twilio configuration
 */
function getTwilioConfig(): TwilioConfig {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
  };
}

/**
 * Check rate limit for palenque
 */
function checkRateLimit(palenqueId: number): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(palenqueId);

  if (!limit || now > limit.resetTime) {
    // Reset counter
    rateLimitMap.set(palenqueId, {
      count: 0,
      resetTime: now + 60000, // 1 minuto
    });
    return true;
  }

  if (limit.count >= 10) {
    return false; // Rate limit exceeded
  }

  return true;
}

/**
 * Increment rate limit counter
 */
function incrementRateLimit(palenqueId: number) {
  const limit = rateLimitMap.get(palenqueId);
  if (limit) {
    limit.count++;
  }
}

/**
 * Format phone number for WhatsApp
 */
function formatWhatsAppNumber(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');

  // Add country code if not present
  if (!cleaned.startsWith('52') && cleaned.length === 10) {
    cleaned = '52' + cleaned; // México
  }

  return `whatsapp:+${cleaned}`;
}

/**
 * Send WhatsApp message via Twilio
 */
export async function sendWhatsAppMessage(
  options: SendMessageOptions
): Promise<SendMessageResult> {
  const { to, message, mediaUrl, conversacionId, palenqueId } = options;

  try {
    // Check rate limit
    if (!checkRateLimit(palenqueId)) {
      console.warn(`Rate limit exceeded for palenque ${palenqueId}`);
      return {
        success: false,
        error: 'Rate limit exceeded. Try again in a minute.',
        status: 'failed',
      };
    }

    const config = getTwilioConfig();

    if (!config.accountSid || !config.authToken) {
      throw new Error('Twilio credentials not configured');
    }

    // Format phone numbers
    const fromNumber = config.whatsappNumber;
    const toNumber = formatWhatsAppNumber(to);

    // Prepare request body
    const body: any = {
      From: fromNumber,
      To: toNumber,
      Body: message,
    };

    if (mediaUrl) {
      body.MediaUrl = [mediaUrl];
    }

    // Send via Twilio API
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
      new URLSearchParams(body),
      {
        auth: {
          username: config.accountSid,
          password: config.authToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { sid, status, error_code, error_message } = response.data;

    // Increment rate limit
    incrementRateLimit(palenqueId);

    // Save message to database
    if (conversacionId) {
      await queryMezcal(
        `INSERT INTO mensajes_whatsapp (
          conversacion_id, mensaje_id, direccion, contenido, tipo, media_url, estado
        ) VALUES ($1, $2, 'saliente', $3, $4, $5, $6)`,
        [
          conversacionId,
          sid,
          message,
          mediaUrl ? 'imagen' : 'texto',
          mediaUrl || null,
          status || 'queued',
        ]
      );

      // Update conversation last interaction
      await queryMezcal(
        `UPDATE conversaciones_chatbot
         SET ultima_interaccion = NOW(), updated_at = NOW()
         WHERE id = $1`,
        [conversacionId]
      );
    }

    if (error_code) {
      return {
        success: false,
        messageSid: sid,
        error: error_message || `Twilio error: ${error_code}`,
        status: 'failed',
      };
    }

    return {
      success: true,
      messageSid: sid,
      status: status || 'queued',
    };
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);

    // Save failed message attempt
    if (conversacionId) {
      try {
        await queryMezcal(
          `INSERT INTO mensajes_whatsapp (
            conversacion_id, direccion, contenido, tipo, estado, metadata
          ) VALUES ($1, 'saliente', $2, 'texto', 'fallido', $3)`,
          [conversacionId, message, JSON.stringify({ error: error.message })]
        );
      } catch (dbError) {
        console.error('Error saving failed message:', dbError);
      }
    }

    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: 'failed',
    };
  }
}

/**
 * Send bulk messages (for broadcasts)
 */
export async function sendBulkWhatsAppMessages(
  messages: Array<{ to: string; message: string; conversacionId?: number }>,
  palenqueId: number
): Promise<{
  successful: number;
  failed: number;
  results: SendMessageResult[];
}> {
  const results: SendMessageResult[] = [];
  let successful = 0;
  let failed = 0;

  for (const msg of messages) {
    // Add delay between messages to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await sendWhatsAppMessage({
      ...msg,
      palenqueId,
    });

    results.push(result);

    if (result.success) {
      successful++;
    } else {
      failed++;
    }
  }

  return {
    successful,
    failed,
    results,
  };
}

/**
 * Check message status from Twilio
 */
export async function checkMessageStatus(
  messageSid: string
): Promise<{
  status: string;
  dateUpdated: string;
  errorCode?: string;
  errorMessage?: string;
}> {
  try {
    const config = getTwilioConfig();

    const response = await axios.get(
      `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages/${messageSid}.json`,
      {
        auth: {
          username: config.accountSid,
          password: config.authToken,
        },
      }
    );

    const { status, date_updated, error_code, error_message } = response.data;

    return {
      status,
      dateUpdated: date_updated,
      errorCode: error_code,
      errorMessage: error_message,
    };
  } catch (error: any) {
    console.error('Error checking message status:', error);
    throw error;
  }
}

/**
 * Update message status in database
 */
export async function updateMessageStatus(
  mensajeId: number,
  status: string
): Promise<void> {
  try {
    await queryMezcal(
      `UPDATE mensajes_whatsapp
       SET estado = $1, leido_at = CASE WHEN $1 = 'leido' THEN NOW() ELSE leido_at END
       WHERE id = $2`,
      [status, mensajeId]
    );
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
}

/**
 * Retry failed messages
 */
export async function retryFailedMessages(
  palenqueId: number,
  maxRetries: number = 3
): Promise<{
  retried: number;
  successful: number;
  stillFailed: number;
}> {
  try {
    // Get failed messages that haven't exceeded retry limit
    const result = await queryMezcal<{
      id: number;
      conversacion_id: number;
      contenido: string;
      metadata: any;
    }>(
      `SELECT m.id, m.conversacion_id, m.contenido, m.metadata, c.telefono
       FROM mensajes_whatsapp m
       JOIN conversaciones_chatbot c ON m.conversacion_id = c.id
       WHERE c.palenque_id = $1
       AND m.estado = 'fallido'
       AND m.direccion = 'saliente'
       AND COALESCE((m.metadata->>'retry_count')::int, 0) < $2
       ORDER BY m.created_at DESC
       LIMIT 10`,
      [palenqueId, maxRetries]
    );

    const messages = result.rows;
    let successful = 0;
    let stillFailed = 0;

    for (const msg of messages) {
      // Get telefono from conversation
      const convResult = await queryMezcal<{ telefono: string }>(
        'SELECT telefono FROM conversaciones_chatbot WHERE id = $1',
        [msg.conversacion_id]
      );

      if (convResult.rows.length === 0) continue;

      const { telefono } = convResult.rows[0];

      // Retry sending
      const retryResult = await sendWhatsAppMessage({
        to: telefono,
        message: msg.contenido,
        conversacionId: msg.conversacion_id,
        palenqueId,
      });

      if (retryResult.success) {
        successful++;
        // Update original message
        await queryMezcal(
          `UPDATE mensajes_whatsapp
           SET estado = 'enviado',
               metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('retried', true)
           WHERE id = $1`,
          [msg.id]
        );
      } else {
        stillFailed++;
        // Update retry count
        const retryCount = (msg.metadata?.retry_count || 0) + 1;
        await queryMezcal(
          `UPDATE mensajes_whatsapp
           SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('retry_count', $1)
           WHERE id = $2`,
          [retryCount, msg.id]
        );
      }

      // Delay between retries
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return {
      retried: messages.length,
      successful,
      stillFailed,
    };
  } catch (error) {
    console.error('Error retrying failed messages:', error);
    throw error;
  }
}

/**
 * Send template message (for common responses)
 */
export async function sendTemplateMessage(
  to: string,
  templateKey: string,
  variables: Record<string, string>,
  palenqueId: number,
  conversacionId?: number
): Promise<SendMessageResult> {
  try {
    // Get template from database
    const result = await queryMezcal<{ contenido: string; variables: string[] }>(
      `SELECT contenido, variables
       FROM plantillas_mensajes
       WHERE clave = $1
       AND (palenque_id = $2 OR palenque_id IS NULL)
       AND activo = TRUE
       ORDER BY palenque_id DESC NULLS LAST
       LIMIT 1`,
      [templateKey, palenqueId]
    );

    if (result.rows.length === 0) {
      throw new Error(`Template ${templateKey} not found`);
    }

    let { contenido } = result.rows[0];

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      contenido = contenido.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });

    // Send message
    return await sendWhatsAppMessage({
      to,
      message: contenido,
      palenqueId,
      conversacionId,
    });
  } catch (error: any) {
    console.error('Error sending template message:', error);
    return {
      success: false,
      error: error.message,
      status: 'failed',
    };
  }
}
