// Lead Magnets Configuration
// Este archivo contiene la metadata de todos los recursos descargables (lead magnets)

export interface LeadMagnet {
  id: string
  title: string
  description: string
  filename: string
  fileSize?: string
  category: 'desarrollo-web' | 'chatbots' | 'ciberseguridad' | 'datos' | 'ia' | 'general'
  relatedBlogPosts?: string[] // Slugs de posts relacionados
  emailSubject: string
  emailPreview: string
  icon?: string
}

export const leadMagnets: Record<string, LeadMagnet> = {
  'checklist-desarrollo-web': {
    id: 'checklist-desarrollo-web',
    title: 'Checklist: 10 Puntos para Evaluar Proveedores de Desarrollo Web',
    description: 'Guía completa con los 10 puntos clave que todo empresario debe revisar antes de contratar un desarrollador web profesional.',
    filename: 'checklist-desarrollo-web.pdf',
    fileSize: '2.5 MB',
    category: 'desarrollo-web',
    relatedBlogPosts: ['desarrollo-web-vs-plantillas', 'como-elegir-proveedor-web'],
    emailSubject: '📥 Tu Checklist de Desarrollo Web está lista',
    emailPreview: 'Descarga tu guía para evaluar proveedores de desarrollo web profesional',
    icon: '📋'
  },

  'guia-roi-chatbots': {
    id: 'guia-roi-chatbots',
    title: 'Guía: ROI de Chatbots + Calculadora Excel',
    description: 'Descubre cómo calcular el retorno de inversión de implementar un chatbot en tu negocio. Incluye calculadora en Excel.',
    filename: 'guia-roi-chatbots.pdf',
    fileSize: '3.1 MB',
    category: 'chatbots',
    relatedBlogPosts: ['roi-chatbots-empresas', 'como-implementar-chatbot'],
    emailSubject: '🤖 Tu Guía de ROI de Chatbots + Calculadora',
    emailPreview: 'Accede a la calculadora de ROI y guía completa de chatbots',
    icon: '🤖'
  },

  'plan-ciberseguridad-pymes': {
    id: 'plan-ciberseguridad-pymes',
    title: 'Template: Plan de Ciberseguridad para PyMEs',
    description: 'Plantilla lista para usar con checklist de seguridad, políticas recomendadas y plan de respuesta a incidentes.',
    filename: 'plan-ciberseguridad-pymes.pdf',
    fileSize: '1.8 MB',
    category: 'ciberseguridad',
    relatedBlogPosts: ['ciberseguridad-pymes-guia', 'amenazas-comunes-empresas'],
    emailSubject: '🔒 Tu Plan de Ciberseguridad para PyMEs',
    emailPreview: 'Descarga tu plantilla de plan de ciberseguridad lista para implementar',
    icon: '🔒'
  },

  'guia-automatizacion-ia': {
    id: 'guia-automatizacion-ia',
    title: 'Guía: Automatización con IA para Negocios',
    description: 'Aprende qué procesos puedes automatizar con IA y cómo empezar. Incluye casos de uso reales y herramientas recomendadas.',
    filename: 'guia-automatizacion-ia.pdf',
    fileSize: '2.9 MB',
    category: 'ia',
    relatedBlogPosts: ['automatizacion-ia-negocios', 'herramientas-ia-empresas'],
    emailSubject: '🚀 Tu Guía de Automatización con IA',
    emailPreview: 'Descubre cómo automatizar procesos en tu negocio con inteligencia artificial',
    icon: '🚀'
  },

  'ebook-transformacion-digital': {
    id: 'ebook-transformacion-digital',
    title: 'eBook: Transformación Digital para PyMEs',
    description: 'Guía completa de 50 páginas sobre cómo digitalizar tu negocio paso a paso. Desde la estrategia hasta la implementación.',
    filename: 'ebook-transformacion-digital.pdf',
    fileSize: '4.2 MB',
    category: 'general',
    relatedBlogPosts: ['transformacion-digital-pymes', 'digitalizacion-negocios'],
    emailSubject: '📚 Tu eBook de Transformación Digital',
    emailPreview: 'Accede a la guía completa de digitalización para PyMEs',
    icon: '📚'
  },

  'checklist-gdpr-cumplimiento': {
    id: 'checklist-gdpr-cumplimiento',
    title: 'Checklist: Cumplimiento GDPR y Protección de Datos',
    description: 'Verifica que tu empresa cumpla con las regulaciones de protección de datos. Incluye plantilla de aviso de privacidad.',
    filename: 'checklist-gdpr-cumplimiento.pdf',
    fileSize: '1.5 MB',
    category: 'datos',
    relatedBlogPosts: ['gdpr-empresas-mexicanas', 'proteccion-datos-clientes'],
    emailSubject: '📋 Tu Checklist de Cumplimiento GDPR',
    emailPreview: 'Asegura el cumplimiento de protección de datos en tu empresa',
    icon: '📋'
  }
}

// Utility functions

export function getLeadMagnetById(id: string): LeadMagnet | undefined {
  return leadMagnets[id]
}

export function getLeadMagnetsByCategory(category: LeadMagnet['category']): LeadMagnet[] {
  return Object.values(leadMagnets).filter(lm => lm.category === category)
}

export function getAllLeadMagnets(): LeadMagnet[] {
  return Object.values(leadMagnets)
}

export function getLeadMagnetsByBlogPost(blogSlug: string): LeadMagnet[] {
  return Object.values(leadMagnets).filter(
    lm => lm.relatedBlogPosts?.includes(blogSlug)
  )
}
