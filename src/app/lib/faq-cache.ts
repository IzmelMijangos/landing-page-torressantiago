// Sistema de FAQ Caché - Respuestas instantáneas sin tokens
// Actualizado: 2025-12-17

interface FAQItem {
  keywords: string[]
  response: string
  quickReplies?: string[]
}

export const FAQ_DATABASE: FAQItem[] = [
  // Precios y costos
  {
    keywords: ['cuanto cuesta web', 'precio web', 'costo sitio', 'precio sitio web', 'cuanto vale web'],
    response: '¡Buena pregunta! 😊 Nuestras páginas web van desde $15,000 a $80,000 MXN, dependiendo de funcionalidades.\n\n¿Qué necesitas? Landing page, e-commerce, o sistema personalizado?',
    quickReplies: ['Landing page simple', 'E-commerce completo', 'Sistema personalizado']
  },
  {
    keywords: ['cuanto cuesta app', 'precio app', 'costo aplicacion', 'cuanto vale app movil'],
    response: 'Las apps móviles van de $50,000 a $300,000 MXN (2-6 meses). El precio depende de:\n\n• iOS, Android o ambos\n• Funcionalidades (login, pagos, GPS, etc)\n• Diseño custom vs templates\n\n¿Qué tipo de app necesitas? 📱',
    quickReplies: ['App para iOS', 'App para Android', 'App híbrida (ambas)']
  },
  {
    keywords: ['cuanto cuesta chatbot', 'precio bot', 'costo chatbot'],
    response: 'Nuestros chatbots con IA cuestan $12,000 MXN inicial + $800/mes de mantenimiento.\n\nIncluye:\n✅ GPT-4 integrado\n✅ Captura de leads 24/7\n✅ Personalización total\n\nUn restaurante en Oaxaca aumentó sus reservas 40% con el nuestro. ¿Te interesa? 🤖',
    quickReplies: ['Ver caso del restaurante', 'Agendar demo', 'Más info']
  },
  {
    keywords: ['precios', 'lista de precios', 'cuanto cuestan servicios', 'costo servicios'],
    response: 'Te paso un resumen rápido de precios:\n\n💻 Web: $15K-80K\n📱 Apps: $50K-300K\n🤖 Chatbots: $12K + $800/mes\n⚡ Automatización: desde $8K\n🔒 Ciberseguridad: desde $5K\n\n¿Cuál te interesa más para darte detalles específicos?',
    quickReplies: ['Web/E-commerce', 'Apps móviles', 'Chatbots IA']
  },

  // Contacto e información
  {
    keywords: ['horario', 'cuando atienden', 'que horas', 'hora de atencion'],
    response: 'Nuestro horario es:\n🕘 Lunes a Viernes: 9AM - 6PM\n\nPero este chatbot está 24/7 😊\n\nDame tu contacto y te llamo/escribo en horario hábil. ¿Tu nombre y WhatsApp?',
    quickReplies: ['Prefiero WhatsApp ahora', 'Prefiero que me llamen']
  },
  {
    keywords: ['whatsapp', 'telefono', 'numero', 'como contactar', 'llamar'],
    response: '¡Claro! Nuestro WhatsApp es:\n📱 +52 951 318 3885\n\nPuedes escribirnos ahora mismo o, si prefieres, dame tu contacto y te escribimos nosotros en 10 minutos. ¿Qué prefieres?',
    quickReplies: ['Escribir por WhatsApp', 'Que me contacten']
  },
  {
    keywords: ['donde estan', 'ubicacion', 'direccion', 'oficina'],
    response: 'Estamos en Oaxaca, México 🇲🇽\n\nPero trabajamos con clientes de todo México y Latinoamérica. Todo es remoto y muy profesional.\n\n¿De dónde nos escribes?'
  },
  {
    keywords: ['email', 'correo', 'correo electronico'],
    response: 'Nuestro email es:\n📧 contacto.torressantiago@gmail.com\n\nPero ¿sabes qué? Por WhatsApp respondo más rápido 😊\n¿Prefieres que te contactemos por ahí? Dame tu número.',
    quickReplies: ['Sí, por WhatsApp', 'Prefiero email']
  },

  // Servicios específicos
  {
    keywords: ['que hacen', 'que servicios', 'servicios', 'que ofrecen'],
    response: 'Somos expertos en desarrollo de software. Nuestros servicios:\n\n💻 Desarrollo web\n📱 Apps móviles\n🤖 Chatbots con IA\n⚡ Automatización\n🔒 Ciberseguridad\n📊 Procesamiento de datos\n\n¿Cuál te interesa? Te cuento más 😊',
    quickReplies: ['Web', 'Apps', 'Chatbots']
  },
  {
    keywords: ['ecommerce', 'tienda online', 'tienda virtual', 'vender online'],
    response: '¡Perfecto para e-commerce! 🛒\n\nUn cliente local vendió $200K en 3 meses con su tienda.\n\nIncluye:\n✅ Catálogo\n✅ Carrito\n✅ Pagos (tarjeta/Oxxo)\n✅ Inventario\n\nRango: $40K-80K MXN\n\n¿Qué productos vendes?'
  },
  {
    keywords: ['automatizacion', 'automatizar', 'procesos', 'eficiencia'],
    response: 'La automatización es oro puro ⚡\n\nUn despacho ahorró 15 hrs/semana automatizando reportes.\n\nPodemos automatizar:\n• Reportes\n• Facturas\n• Emails\n• Excel/Sheets\n• Integraciones\n\n¿Qué proceso quieres optimizar?'
  },

  // Casos de éxito
  {
    keywords: ['ejemplos', 'casos', 'proyectos', 'clientes', 'portfolio', 'trabajos'],
    response: 'Te comparto casos reales de Oaxaca:\n\n🍽️ Restaurante: Chatbot +40% reservas\n🛒 Tienda: E-commerce $200K en 3 meses\n📋 Despacho: Automatización -15 hrs/sem\n🏥 Clínica: App redujo 60% llamadas\n\n¿Cuál se parece más a tu proyecto?',
    quickReplies: ['Restaurante', 'Tienda', 'Servicios profesionales']
  },

  // Proceso y tiempos
  {
    keywords: ['cuanto tardan', 'tiempo', 'cuando entregan', 'duracion', 'cuanto demora'],
    response: 'Los tiempos varían por proyecto:\n\n⚡ Landing page: 2-3 semanas\n💼 Web completa: 4-8 semanas\n📱 App móvil: 2-6 meses\n🤖 Chatbot: 2-3 semanas\n\n¿Qué urgencia tienes? Si es prioritario podemos acelerar 🚀',
    quickReplies: ['Urgente (1-2 semanas)', 'Normal', 'Flexible']
  },
  {
    keywords: ['como funciona', 'proceso', 'como trabajan', 'metodologia'],
    response: 'Nuestro proceso es súper claro:\n\n1️⃣ Consultoría gratis 30 min\n2️⃣ Propuesta y cotización\n3️⃣ Anticipo 40%\n4️⃣ Desarrollo + revisiones\n5️⃣ Entrega y capacitación\n\n¿Quieres agendar la consultoría? Es sin compromiso 😊',
    quickReplies: ['Agendar consultoría', 'Primero quiero cotización']
  },

  // Objeciones comunes
  {
    keywords: ['muy caro', 'no tengo presupuesto', 'es mucho'],
    response: 'Entiendo que es inversión. Mira:\n\n💡 Ofrecemos planes de pago (40% + parcialidades)\n💡 La pregunta es: ¿cuánto pierdes sin tenerlo?\n💡 Un cliente recuperó inversión en 2 meses\n\n¿Quieres explorar opciones de pago?',
    quickReplies: ['Sí, planes de pago', 'Quiero ROI detallado']
  },

  // Saludos
  {
    keywords: ['hola', 'buenos dias', 'buenas tardes', 'que tal'],
    response: '¡Hola! 👋 Soy Alex de Torres Santiago.\n\n¿En qué puedo ayudarte hoy? Puedo asesorarte sobre:\n\n💻 Desarrollo web\n📱 Apps móviles\n🤖 Chatbots con IA\n⚡ Automatización',
    quickReplies: ['Ver servicios', 'Cotizar proyecto', 'Casos de éxito']
  }
]

// Función de matching fuzzy
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[¿?¡!.,]/g, '') // Quitar puntuación
    .trim()
}

export function findFAQMatch(userMessage: string): FAQItem | null {
  const normalized = normalizeText(userMessage)

  // Buscar coincidencia exacta o parcial
  for (const faq of FAQ_DATABASE) {
    for (const keyword of faq.keywords) {
      const normalizedKeyword = normalizeText(keyword)

      // Match exacto
      if (normalized === normalizedKeyword) {
        return faq
      }

      // Match parcial (contiene todas las palabras clave)
      const keywordWords = normalizedKeyword.split(' ')
      const allWordsPresent = keywordWords.every(word =>
        word.length > 2 && normalized.includes(word)
      )

      if (allWordsPresent && keywordWords.length >= 2) {
        return faq
      }
    }
  }

  return null
}

// Estadísticas de uso del caché
export function logCacheHit(keyword: string) {
  if (typeof window !== 'undefined') {
    try {
      const stats = JSON.parse(localStorage.getItem('faq_cache_stats') || '{}')
      stats[keyword] = (stats[keyword] || 0) + 1
      stats.totalHits = (stats.totalHits || 0) + 1
      stats.lastHit = new Date().toISOString()
      localStorage.setItem('faq_cache_stats', JSON.stringify(stats))
    } catch (error) {
      console.error('Error logging cache hit:', error)
    }
  }
}
