/**
 * 🎯 Sistema Inteligente de Detección y Análisis de Leads
 *
 * Este módulo analiza conversaciones del chatbot para:
 * 1. Detectar información de contacto (nombre, email, teléfono)
 * 2. Calcular score de calidad del lead
 * 3. Identificar servicios de interés
 * 4. Determinar nivel de urgencia
 *
 * Diseñado para trabajar en armonía con Alex, nuestro asistente conversacional.
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 TIPOS Y INTERFACES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface LeadInfo {
  name?: string
  email?: string
  phone?: string
  service?: string
  company?: string
  urgency?: 'alta' | 'media' | 'baja'
}

export interface LeadAnalysis {
  isHot: boolean
  score: number
  info: LeadInfo | null
  signals: {
    hasContactInfo: boolean
    showsIntent: boolean
    showsUrgency: boolean
    mentionsService: boolean
    mentionsBudget: boolean
    isQualified: boolean
  }
  confidence: number // 0-100: qué tan confiados estamos del análisis
  reason?: string // Por qué es o no es lead caliente
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 EXTRACTORES DE INFORMACIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Extrae nombres de la conversación con múltiples estrategias
 */
function extractName(text: string): string | undefined {
  const lowerText = text.toLowerCase()

  // Estrategia 1: Patrones explícitos comunes
  const explicitPatterns = [
    /(?:me llamo|soy|mi nombre es)\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)/i,
    /(?:puedes llamarme|dime)\s+([a-záéíóúñ]+)/i,
    /^([a-záéíóúñ]+)(?:\s+[a-záéíóúñ]+)?\s+(?:aquí|aqui|acá|aca|presente)/i,
  ]

  for (const pattern of explicitPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const name = match[1].trim()
      // Normalizar: primera letra mayúscula
      return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }
  }

  // Estrategia 2: Nombres con mayúscula inicial (2+ palabras = nombre completo)
  // Excluir nombres de empresas conocidas y frases comunes
  const capitalizedPattern = /\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,})\b/
  const match = text.match(capitalizedPattern)
  if (match) {
    const name = match[1]
    const excludedNames = [
      'Torres Santiago', 'Vertex AI', 'Open AI', 'Chat GPT',
      'Google Cloud', 'Microsoft Azure', 'Amazon Web',
      'Nombre Completo', 'Por Favor', 'Muy Bien'
    ]
    if (!excludedNames.includes(name)) {
      return name.trim()
    }
  }

  // Estrategia 3: Nombres después de palabras de confirmación
  // "claro Izmel", "si, soy Izmel", "ok, mi nombre es Izmel"
  const confirmationNamePattern = /(?:claro|si|sí|ok|vale)\s*,?\s+(?:soy\s+)?([A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,})?)/i
  const confirmMatch = text.match(confirmationNamePattern)
  if (confirmMatch && confirmMatch[1]) {
    const name = confirmMatch[1].trim()
    const excludedPhrases = [
      'gracias', 'perfecto', 'excelente', 'bueno', 'genial',
      'favor', 'por favor', 'porfavor', 'ayuda', 'necesito',
      'puedo', 'quisiera', 'podria', 'podrías'
    ]
    const nameLower = name.toLowerCase()
    if (!excludedPhrases.some(phrase => nameLower.includes(phrase))) {
      return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }
  }

  // Estrategia 4: Nombre completo antes de "y mi correo/email/teléfono/whats"
  // "Izmel angel y mi whats es", "Juan Pérez y mi correo"
  const nameBeforeContactPattern = /\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,})*)\s+y\s+mi\s+(?:correo|email|teléfono|telefono|tel|whatsapp|whats|número|numero)/i
  const nameBeforeMatch = text.match(nameBeforeContactPattern)
  if (nameBeforeMatch && nameBeforeMatch[1]) {
    const name = nameBeforeMatch[1].trim()
    const excludedWords = ['Gmail', 'Hotmail', 'Yahoo', 'Outlook', 'Email', 'Correo', 'Completo', 'Nombre']
    const nameLower = name.toLowerCase()
    if (!excludedWords.some(word => nameLower.includes(word.toLowerCase()))) {
      return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }
  }

  // Estrategia 5: Nombres de una sola palabra después de contexto
  // "soy izmel" o "mi nombre izmel"
  const singleNamePattern = /(?:soy|nombre|llamo)\s+([a-záéíóúñ]{3,})/i
  const singleMatch = text.match(singleNamePattern)
  if (singleMatch && singleMatch[1]) {
    const name = singleMatch[1].toLowerCase()
    // Excluir palabras comunes que no son nombres
    const excludedWords = ['gracias', 'cliente', 'interesado', 'usuario', 'bueno', 'feliz']
    if (!excludedWords.includes(name)) {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
  }

  return undefined
}

/**
 * Extrae emails con validación
 */
function extractEmail(text: string): string | undefined {
  // Pattern robusto para emails
  const emailPattern = /([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/gi
  const matches = text.match(emailPattern)

  if (matches && matches.length > 0) {
    // Retornar el primer email válido
    const email = matches[0].toLowerCase()

    // Validación adicional: debe tener formato válido
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (isValid) {
      return email
    }
  }

  return undefined
}

/**
 * Extrae teléfonos en múltiples formatos mexicanos
 */
function extractPhone(text: string): string | undefined {
  // Limpiar texto de caracteres especiales para mejor detección
  const cleanText = text.replace(/[()[\]]/g, ' ')

  const phonePatterns = [
    // +52 1 951 123 4567 o +52 951 123 4567
    /\+52\s*1?\s*(\d{3})\s*(\d{3})\s*(\d{4})/,
    // 52 1 951 123 4567 o 52 951 123 4567
    /\b52\s*1?\s*(\d{3})\s*(\d{3})\s*(\d{4})/,
    // 951 123 4567 o 9511234567
    /\b(95[01])\s*(\d{3})\s*(\d{4})\b/,
    // 10 dígitos consecutivos (formato general mexicano)
    /\b(\d{10})\b/,
  ]

  for (const pattern of phonePatterns) {
    const match = cleanText.match(pattern)
    if (match) {
      // Normalizar a formato limpio (solo dígitos)
      const phone = match[0].replace(/\D/g, '')

      // Validar que tenga 10 dígitos (o 12 con código de país)
      if (phone.length === 10) {
        return phone
      } else if (phone.length === 12 && phone.startsWith('52')) {
        return phone.slice(2) // Remover código de país
      } else if (phone.length === 11 && phone.startsWith('521')) {
        return phone.slice(3) // Remover código de país y 1
      }
    }
  }

  return undefined
}

/**
 * Detecta el servicio de interés del usuario
 */
function detectService(text: string): string | undefined {
  const lowerText = text.toLowerCase()

  const serviceKeywords = {
    'Desarrollo Web': ['web', 'sitio', 'pagina', 'landing', 'ecommerce', 'tienda online', 'wordpress'],
    'App Móvil': ['app', 'aplicacion', 'movil', 'ios', 'android', 'flutter', 'react native'],
    'Chatbot IA': ['chatbot', 'bot', 'asistente virtual', 'ia', 'inteligencia artificial', 'automatizar conversaciones'],
    'Automatización': ['automatiz', 'workflow', 'zapier', 'integrar', 'api', 'automatico'],
    'Ciberseguridad': ['seguridad', 'ciberseguridad', 'hackeo', 'proteger', 'vulnerabilidad', 'pentest'],
    'Sistema Personalizado': ['sistema', 'erp', 'crm', 'inventario', 'gestion', 'plataforma', 'software a medida'],
    'Consultoría IT': ['consultoria', 'asesoria', 'estrategia', 'transformacion digital', 'arquitectura']
  }

  for (const [service, keywords] of Object.entries(serviceKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return service
    }
  }

  return undefined
}

/**
 * Detecta nombre de empresa/negocio
 */
function detectCompany(text: string): string | undefined {
  const companyPatterns = [
    /(?:mi empresa|mi negocio|trabajo en|de)\s+([A-ZÁÉÍÓÚÑ][a-zA-Z0-9áéíóúñ\s]{2,30})/i,
    /(?:tenemos|somos)\s+(?:una?\s+)?([A-ZÁÉÍÓÚÑ][a-zA-Z0-9áéíóúñ\s]{2,30})\s+(?:que|dedicada|enfocada)/i,
  ]

  for (const pattern of companyPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return undefined
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 ANÁLISIS DE SEÑALES DE COMPRA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Detecta señales de intención de compra
 */
function detectBuyingIntent(text: string): number {
  const lowerText = text.toLowerCase()
  let score = 0

  // Palabras de alta intención (cada una +15 puntos)
  const highIntentWords = [
    'necesito', 'quiero contratar', 'me interesa', 'quiero hacer',
    'cuando empezamos', 'cuanto tardan', 'hagamos', 'empecemos'
  ]
  highIntentWords.forEach(word => {
    if (lowerText.includes(word)) score += 15
  })

  // Palabras de intención media (cada una +10 puntos)
  const mediumIntentWords = [
    'quiero', 'quisiera', 'necesitaria', 'estoy buscando',
    'me gustaria', 'pensando en', 'planeando'
  ]
  mediumIntentWords.forEach(word => {
    if (lowerText.includes(word)) score += 10
  })

  // Preguntas sobre proceso (cada una +8 puntos)
  const processQuestions = [
    'como funciona', 'que necesitan', 'que sigue',
    'cual es el proceso', 'como empezamos', 'que pasos'
  ]
  processQuestions.forEach(q => {
    if (lowerText.includes(q)) score += 8
  })

  return Math.min(score, 40) // Max 40 puntos por intención
}

/**
 * Detecta señales de urgencia
 */
function detectUrgency(text: string): { score: number; level: 'alta' | 'media' | 'baja' } {
  const lowerText = text.toLowerCase()
  let score = 0

  // Urgencia alta (+25 puntos)
  const highUrgency = [
    'urgente', 'ya', 'hoy', 'inmediato', 'lo antes posible',
    'esta semana', 'rapido', 'cuanto antes'
  ]
  highUrgency.forEach(word => {
    if (lowerText.includes(word)) score += 25
  })

  // Urgencia media (+15 puntos)
  const mediumUrgency = [
    'pronto', 'proxima semana', 'este mes', 'en breve'
  ]
  mediumUrgency.forEach(word => {
    if (lowerText.includes(word)) score += 15
  })

  // Urgencia baja (+5 puntos)
  const lowUrgency = [
    'futuro', 'proximamente', 'mas adelante', 'eventualmente'
  ]
  lowUrgency.forEach(word => {
    if (lowerText.includes(word)) score += 5
  })

  const level = score >= 25 ? 'alta' : score >= 15 ? 'media' : 'baja'

  return { score: Math.min(score, 30), level } // Max 30 puntos por urgencia
}

/**
 * Detecta mención de presupuesto/precio
 */
function detectBudgetMention(text: string): number {
  const lowerText = text.toLowerCase()
  let score = 0

  const budgetWords = [
    'precio', 'cuanto cuesta', 'cotizacion', 'presupuesto',
    'inversion', 'cuanto sale', 'valor', 'que me cobrarian',
    'cuanto seria', 'tengo x pesos'
  ]

  budgetWords.forEach(word => {
    if (lowerText.includes(word)) score += 15
  })

  return Math.min(score, 20) // Max 20 puntos por presupuesto
}

/**
 * Analiza el contexto de la conversación para detectar momentum
 */
function analyzeConversationMomentum(messages: Message[]): number {
  let score = 0

  // Conversación larga indica interés genuino
  if (messages.length >= 6) score += 10
  if (messages.length >= 10) score += 5

  // Últimos 3 mensajes del usuario (indica engagement)
  const recentUserMessages = messages
    .filter(m => m.role === 'user')
    .slice(-3)
    .map(m => m.content.toLowerCase())

  // Respuestas afirmativas
  const affirmativeWords = ['si', 'claro', 'perfecto', 'excelente', 'me gusta', 'me parece']
  const hasAffirmative = recentUserMessages.some(msg =>
    affirmativeWords.some(word => msg.includes(word))
  )
  if (hasAffirmative) score += 10

  // Usuario está dando información personal (señal fuerte)
  const givingInfo = recentUserMessages.some(msg =>
    msg.includes('@') || /\d{10}/.test(msg) || msg.includes('me llamo') || msg.includes('soy ')
  )
  if (givingInfo) score += 15

  return score
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 ANÁLISIS PRINCIPAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Analiza una conversación completa y determina si es un lead caliente
 */
export function analyzeConversation(
  messages: Message[],
  latestResponse: string
): LeadAnalysis {
  // Combinar toda la conversación para análisis
  const allUserMessages = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join('\n')

  const fullConversation = allUserMessages + '\n' + latestResponse

  // 1️⃣ EXTRACCIÓN DE INFORMACIÓN
  const info: LeadInfo = {
    name: extractName(fullConversation),
    email: extractEmail(fullConversation),
    phone: extractPhone(fullConversation),
    service: detectService(fullConversation),
    company: detectCompany(fullConversation),
  }

  // 2️⃣ CÁLCULO DE SCORE POR COMPONENTES
  let totalScore = 0

  // Componente 1: Información de contacto (hasta 40 puntos)
  let contactScore = 0
  if (info.name) contactScore += 10
  if (info.email) contactScore += 15
  if (info.phone) contactScore += 15
  totalScore += contactScore

  // Componente 2: Intención de compra (hasta 40 puntos)
  const intentScore = detectBuyingIntent(fullConversation)
  totalScore += intentScore

  // Componente 3: Urgencia (hasta 30 puntos)
  const urgencyAnalysis = detectUrgency(fullConversation)
  totalScore += urgencyAnalysis.score
  info.urgency = urgencyAnalysis.level

  // Componente 4: Mención de presupuesto (hasta 20 puntos)
  const budgetScore = detectBudgetMention(fullConversation)
  totalScore += budgetScore

  // Componente 5: Servicio específico (hasta 15 puntos)
  const serviceScore = info.service ? 15 : 0
  totalScore += serviceScore

  // Componente 6: Momentum de conversación (hasta 25 puntos)
  const momentumScore = analyzeConversationMomentum(messages)
  totalScore += momentumScore

  // 3️⃣ ANÁLISIS DE SEÑALES
  const signals = {
    // Tiene info de contacto si: (Nombre + Email/Teléfono) O (Email + Teléfono)
    hasContactInfo: !!(
      (info.name && (info.email || info.phone)) ||  // Nombre + (email o teléfono)
      (info.email && info.phone)                    // O ambos email y teléfono sin nombre
    ),
    showsIntent: intentScore >= 15,
    showsUrgency: urgencyAnalysis.level === 'alta' || urgencyAnalysis.level === 'media',
    mentionsService: !!info.service,
    mentionsBudget: budgetScore > 0,
    isQualified: contactScore >= 25 && intentScore >= 15
  }

  // 4️⃣ CÁLCULO DE CONFIANZA (qué tan seguros estamos del análisis)
  let confidence = 50 // Base
  if (signals.hasContactInfo) confidence += 25
  if (signals.showsIntent) confidence += 15
  if (messages.length >= 5) confidence += 10
  confidence = Math.min(confidence, 100)

  // 5️⃣ DETERMINACIÓN DE LEAD CALIENTE
  // Un lead es caliente si cumple TODAS estas condiciones:
  const isHot =
    signals.hasContactInfo &&           // DEBE tener nombre + email/teléfono
    (signals.showsIntent ||             // Y mostrar intención de compra
     signals.showsUrgency ||            // O tener urgencia
     signals.isQualified) &&            // O estar calificado por otros factores
    totalScore >= 50                    // Y tener score mínimo de 50

  // 6️⃣ GENERAR RAZÓN DEL ANÁLISIS
  let reason = ''
  if (isHot) {
    reason = `Lead caliente confirmado: Score ${totalScore}/170. `
    if (signals.showsUrgency) reason += 'Muestra urgencia. '
    if (signals.showsIntent) reason += 'Tiene intención clara de compra. '
    if (signals.mentionsBudget) reason += 'Ha mencionado presupuesto. '
    reason += `Datos: ${info.name || 'N/A'} | ${info.email || info.phone || 'N/A'}`
  } else if (signals.hasContactInfo && totalScore >= 35) {
    reason = `Lead tibio (Score ${totalScore}/170). Tiene datos de contacto pero falta mayor intención o urgencia.`
  } else if (!signals.hasContactInfo) {
    reason = `No es lead aún (Score ${totalScore}/170). Falta capturar datos de contacto (nombre + email/teléfono).`
  } else {
    reason = `No califica como lead caliente (Score ${totalScore}/170). ${
      !signals.showsIntent ? 'Falta intención de compra clara. ' : ''
    }`
  }

  // 7️⃣ LOGGING PARA DEBUG
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎯 ANÁLISIS DE LEAD')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Score Total:', `${totalScore}/170`)
  console.log('📋 Desglose:')
  console.log(`   • Contacto: ${contactScore}/40`)
  console.log(`   • Intención: ${intentScore}/40`)
  console.log(`   • Urgencia: ${urgencyAnalysis.score}/30 (${urgencyAnalysis.level})`)
  console.log(`   • Presupuesto: ${budgetScore}/20`)
  console.log(`   • Servicio: ${serviceScore}/15`)
  console.log(`   • Momentum: ${momentumScore}/25`)
  console.log('\n👤 Información Capturada:')
  console.log(`   • Nombre: ${info.name || '❌ No capturado'}`)
  console.log(`   • Email: ${info.email || '❌ No capturado'}`)
  console.log(`   • Teléfono: ${info.phone || '❌ No capturado'}`)
  console.log(`   • Servicio: ${info.service || '❌ No identificado'}`)
  console.log(`   • Empresa: ${info.company || '❌ No mencionada'}`)
  console.log('\n🚦 Señales:')
  console.log(`   • Tiene contacto: ${signals.hasContactInfo ? '✅' : '❌'}`)
  console.log(`   • Muestra intención: ${signals.showsIntent ? '✅' : '❌'}`)
  console.log(`   • Tiene urgencia: ${signals.showsUrgency ? '✅' : '❌'}`)
  console.log(`   • Menciona servicio: ${signals.mentionsService ? '✅' : '❌'}`)
  console.log(`   • Habla de presupuesto: ${signals.mentionsBudget ? '✅' : '❌'}`)
  console.log(`   • Lead calificado: ${signals.isQualified ? '✅' : '❌'}`)
  console.log(`\n🎯 RESULTADO: ${isHot ? '🔥 LEAD CALIENTE' : '❄️ No es lead caliente aún'}`)
  console.log(`💯 Confianza: ${confidence}%`)
  console.log(`📝 Razón: ${reason}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  return {
    isHot,
    score: Math.min(totalScore, 170),
    info: Object.keys(info).some(key => info[key as keyof LeadInfo]) ? info : null,
    signals,
    confidence,
    reason
  }
}

/**
 * Formatea la información del lead para notificaciones
 */
export function formatLeadForNotification(analysis: LeadAnalysis, messages: Message[]) {
  const { info, score, signals, confidence, reason } = analysis

  if (!info) return null

  return {
    // Datos básicos
    name: info.name || 'No proporcionado',
    email: info.email || 'No proporcionado',
    phone: info.phone || 'No proporcionado',
    service: info.service || 'No especificado',
    company: info.company,
    urgency: info.urgency || 'baja',

    // Métricas
    score,
    confidence,

    // Contexto de la conversación
    conversationLength: messages.length,
    lastMessages: messages.slice(-4),

    // Análisis
    signals,
    reason,

    // Metadata
    timestamp: new Date().toISOString(),
    source: 'chatbot',
  }
}
