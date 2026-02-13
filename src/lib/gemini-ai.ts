/**
 * Gemini AI Integration Service
 * Handles intent detection, entity extraction, and response generation
 * for the mezcal sales chatbot
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Intent types
export type IntentType =
  | 'saludo'
  | 'consulta_catalogo'
  | 'consulta_precio'
  | 'consulta_stock'
  | 'hacer_pedido'
  | 'confirmar_pedido'
  | 'cancelar_pedido'
  | 'modificar_pedido'
  | 'consulta_envio'
  | 'consulta_pago'
  | 'hablar_con_humano'
  | 'agradecer'
  | 'despedida'
  | 'queja'
  | 'otro';

export interface DetectedIntent {
  intent: IntentType;
  confidence: number; // 0.0 - 1.0
  entities: Record<string, any>;
  sentiment: 'positivo' | 'neutral' | 'negativo';
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  tipo_agave: string;
  presentaciones: Array<{
    ml: number;
    precio: number;
    stock: number;
  }>;
}

export interface ChatbotConfig {
  modo: 'pasivo' | 'activo';
  mensaje_bienvenida: string;
  personalidad: string;
  temperatura_ia: number;
}

/**
 * Detect user intent from message
 */
export async function detectIntent(
  mensaje: string,
  historialConversacion: Array<{ role: string; content: string }> = []
): Promise<DetectedIntent> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Eres un asistente experto en clasificar las intenciones de clientes en una tienda de mezcal artesanal.

Analiza el siguiente mensaje y clasifica la intención del usuario, extrae entidades relevantes, y determina el sentimiento.

INTENCIONES POSIBLES:
- saludo: Cliente saluda o inicia conversación
- consulta_catalogo: Pregunta por productos disponibles, tipos de mezcal
- consulta_precio: Pregunta específica sobre precios
- consulta_stock: Pregunta sobre disponibilidad
- hacer_pedido: Quiere comprar o agregar al carrito
- confirmar_pedido: Confirma que desea proceder con la compra
- cancelar_pedido: Quiere cancelar o no continuar
- modificar_pedido: Quiere cambiar cantidades o productos
- consulta_envio: Pregunta sobre envíos, costos, tiempos
- consulta_pago: Pregunta sobre métodos de pago
- hablar_con_humano: Quiere hablar con una persona real
- agradecer: Agradece la atención
- despedida: Se despide
- queja: Expresa insatisfacción o problema
- otro: No encaja en las categorías anteriores

ENTIDADES A EXTRAER:
- producto: nombre del mezcal mencionado (espadín, tobalá, etc)
- cantidad: número de botellas
- presentacion: tamaño (750ml, 1L, etc)
- ubicacion: ciudad/estado para envío
- precio_mencionado: si menciona un monto
- urgencia: si es urgente (sí/no)

SENTIMIENTO:
- positivo: Cliente contento, entusiasmado
- neutral: Sin emoción particular
- negativo: Molesto, insatisfecho

${historialConversacion.length > 0 ? `
HISTORIAL RECIENTE:
${historialConversacion.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}
` : ''}

MENSAJE ACTUAL:
"${mensaje}"

RESPONDE EN FORMATO JSON:
{
  "intent": "nombre_de_intencion",
  "confidence": 0.95,
  "entities": {
    "producto": "valor o null",
    "cantidad": numero o null,
    "presentacion": "valor o null",
    "ubicacion": "valor o null",
    "precio_mencionado": numero o null,
    "urgencia": boolean
  },
  "sentiment": "positivo|neutral|negativo",
  "razonamiento": "breve explicación"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta de IA');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      intent: parsed.intent as IntentType,
      confidence: parsed.confidence,
      entities: parsed.entities || {},
      sentiment: parsed.sentiment || 'neutral',
    };
  } catch (error) {
    console.error('Error detecting intent:', error);
    // Fallback to basic intent
    return {
      intent: 'otro',
      confidence: 0.3,
      entities: {},
      sentiment: 'neutral',
    };
  }
}

/**
 * Generate chatbot response based on intent and context
 */
export async function generateResponse(
  intent: IntentType,
  entities: Record<string, any>,
  config: ChatbotConfig,
  productos: Product[] = [],
  historialConversacion: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature: config.temperatura_ia || 0.7,
        maxOutputTokens: 300,
      },
    });

    let contextoProductos = '';
    if (productos.length > 0 && ['consulta_catalogo', 'consulta_precio', 'hacer_pedido'].includes(intent)) {
      contextoProductos = `
CATÁLOGO DISPONIBLE:
${productos.map((p, i) => `
${i + 1}. ${p.nombre}
   - Tipo: ${p.tipo_agave}
   - Descripción: ${p.descripcion}
   - Presentaciones: ${p.presentaciones.map(pr => `${pr.ml}ml - $${pr.precio} (stock: ${pr.stock})`).join(', ')}
`).join('\n')}
`;
    }

    const prompt = `
Eres un vendedor experto de mezcal artesanal. Tu personalidad es: ${config.personalidad}.

MODO DE OPERACIÓN: ${config.modo}
${config.modo === 'activo' ? '- Debes ser proactivo, sugerir productos, cerrar ventas' : '- Solo responde preguntas, no presiones para vender'}

INTENCIÓN DETECTADA: ${intent}
ENTIDADES: ${JSON.stringify(entities)}

${contextoProductos}

${historialConversacion.length > 0 ? `
HISTORIAL RECIENTE:
${historialConversacion.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}
` : ''}

INSTRUCCIONES:
1. Genera una respuesta natural y amigable en español
2. Usa emojis con moderación (máximo 2)
3. Si es consulta de catálogo, menciona máximo 3 productos destacados
4. Si es pedido, confirma los detalles y pregunta por envío
5. Si es queja o problema, muestra empatía y ofrece solución
6. Máximo 3-4 líneas de texto
7. Si modo es activo y es apropiado, sugiere el siguiente paso para cerrar venta

RESPUESTA (solo texto, sin formato adicional):
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating response:', error);
    // Fallback responses
    const fallbacks: Record<IntentType, string> = {
      saludo: '¡Hola! 👋 Gracias por contactarnos. ¿En qué puedo ayudarte hoy?',
      consulta_catalogo: 'Con gusto te muestro nuestros mezcales. ¿Tienes alguna preferencia de tipo de agave?',
      consulta_precio: 'Los precios varían según la presentación. ¿Qué producto te interesa?',
      consulta_stock: 'Déjame verificar la disponibilidad. ¿Qué producto buscas?',
      hacer_pedido: '¡Perfecto! ¿Qué producto te gustaría ordenar?',
      confirmar_pedido: 'Excelente, procesando tu pedido. Te confirmaré los detalles.',
      cancelar_pedido: 'Sin problema, quedamos a tus órdenes para cuando gustes.',
      modificar_pedido: 'Claro, ¿qué cambios te gustaría hacer?',
      consulta_envio: 'Hacemos envíos a toda la república. ¿A dónde lo necesitas?',
      consulta_pago: 'Aceptamos efectivo, transferencia y tarjeta. ¿Cuál prefieres?',
      hablar_con_humano: 'Entiendo, déjame conectarte con un asesor. Un momento por favor.',
      agradecer: '¡Con gusto! Estamos para servirte 😊',
      despedida: '¡Hasta pronto! Que tengas excelente día 👋',
      queja: 'Lamento mucho lo ocurrido. Déjame ayudarte a resolverlo.',
      otro: '¿Podrías darme más detalles para ayudarte mejor?',
    };

    return fallbacks[intent] || 'Gracias por tu mensaje. ¿En qué más puedo ayudarte?';
  }
}

/**
 * Extract product entities from message using AI
 */
export async function extractProductDetails(
  mensaje: string,
  catalogoDisponible: Product[]
): Promise<{
  productos: Array<{ producto_id: number; cantidad: number; presentacion_ml: number }>;
  confianza: number;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Extrae los detalles de productos que el cliente quiere comprar.

CATÁLOGO DISPONIBLE:
${catalogoDisponible.map(p => `ID: ${p.id}, Nombre: ${p.nombre}, Tipo: ${p.tipo_agave}, Presentaciones: ${p.presentaciones.map(pr => `${pr.ml}ml`).join(', ')}`).join('\n')}

MENSAJE DEL CLIENTE:
"${mensaje}"

Identifica:
1. Qué productos menciona (puede ser por nombre o tipo de agave)
2. Cuántas unidades quiere de cada uno
3. Qué presentación (750ml, 1000ml, etc)

RESPONDE EN JSON:
{
  "productos": [
    {
      "producto_id": numero,
      "cantidad": numero,
      "presentacion_ml": numero
    }
  ],
  "confianza": 0.0-1.0
}

Si no menciona cantidad, asume 1.
Si no menciona presentación, usa la más común (750ml).
Si no identificas ningún producto, regresa array vacío.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { productos: [], confianza: 0 };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (error) {
    console.error('Error extracting product details:', error);
    return { productos: [], confianza: 0 };
  }
}

/**
 * Analyze sentiment of message
 */
export async function analyzeSentiment(mensaje: string): Promise<{
  sentiment: 'positivo' | 'neutral' | 'negativo';
  score: number; // -1 to 1
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Analiza el sentimiento del siguiente mensaje:

"${mensaje}"

RESPONDE EN JSON:
{
  "sentiment": "positivo|neutral|negativo",
  "score": -1.0 a 1.0 (-1 muy negativo, 0 neutral, 1 muy positivo)
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { sentiment: 'neutral', score: 0 };
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { sentiment: 'neutral', score: 0 };
  }
}

/**
 * Check if customer is ready to complete purchase
 */
export async function evaluateReadinessToConvert(
  historialCompleto: Array<{ role: string; content: string; intent?: string }>
): Promise<{
  ready: boolean;
  score: number; // 0-100
  missingInfo: string[];
  sugerencia: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Analiza esta conversación y determina si el cliente está listo para confirmar su compra.

HISTORIAL:
${historialCompleto.map((m, i) => `[${i + 1}] ${m.role}: ${m.content}${m.intent ? ` (intención: ${m.intent})` : ''}`).join('\n')}

Evalúa:
1. ¿Ha elegido productos específicos?
2. ¿Ha confirmado cantidades?
3. ¿Ha preguntado por precio/envío?
4. ¿Muestra interés real en comprar?
5. ¿Qué información falta?

RESPONDE EN JSON:
{
  "ready": boolean,
  "score": 0-100,
  "missingInfo": ["info que falta", ...],
  "sugerencia": "Qué preguntarle para avanzar"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        ready: false,
        score: 0,
        missingInfo: ['No se pudo evaluar'],
        sugerencia: 'Continúa la conversación',
      };
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error evaluating conversion readiness:', error);
    return {
      ready: false,
      score: 0,
      missingInfo: ['Error en evaluación'],
      sugerencia: 'Continúa conversando naturalmente',
    };
  }
}
