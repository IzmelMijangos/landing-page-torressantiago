import { Code, Smartphone, Cpu, Bot, Zap, Lightbulb, LucideIcon } from "lucide-react"

export interface ServiceComplete {
  slug: string
  icon: LucideIcon
  title: string
  description: string
  price: string
  deliveryTime: string
  features: string[]
  includes: string[]
}

export const servicesData: ServiceComplete[] = [
  {
    slug: "desarrollo-web",
    icon: Code,
    title: "Desarrollo Web",
    description: "Sitios web profesionales, rápidos y optimizados para vender. Ideal para restaurantes, tiendas y profesionales.",
    price: "$7,999",
    deliveryTime: "5-7",
    features: [
      "Diseño responsive adaptado a móviles y tablets",
      "Optimización SEO para aparecer en Google",
      "Integración con WhatsApp Business",
      "Formularios de contacto inteligentes",
      "Galería de productos/servicios",
      "Mapa de ubicación integrado",
    ],
    includes: [
      "Hosting gratis por 1 año (valor $1,200 MXN)",
      "Certificado SSL de seguridad",
      "Correos corporativos (3 cuentas)",
      "Capacitación de uso (1 sesión)",
      "30 días de soporte técnico incluido",
      "Hasta 3 rondas de ajustes",
    ]
  },
  {
    slug: "apps-moviles",
    icon: Smartphone,
    title: "Apps Móviles",
    description: "Aplicaciones iOS y Android para gestionar pedidos, reservas, clientes o inventario.",
    price: "$19,999",
    deliveryTime: "15-20",
    features: [
      "Desarrollo nativo para iOS y Android",
      "Notificaciones push ilimitadas",
      "Login de usuarios (email, Google, Facebook)",
      "Panel de administración web",
      "Actualizaciones automáticas",
      "Diseño UI/UX personalizado",
    ],
    includes: [
      "Publicación en App Store y Google Play",
      "3 meses de soporte post-lanzamiento",
      "Documentación técnica completa",
      "Capacitación del equipo (2 sesiones)",
      "Métricas y analytics integrados",
      "Certificados y cuentas de desarrollador",
    ]
  },
  {
    slug: "sistemas-personalizados",
    icon: Cpu,
    title: "Sistemas Personalizados",
    description: "Inventario, punto de venta, CRM o gestión interna. 100% a tu medida.",
    price: "$14,999",
    deliveryTime: "10-15",
    features: [
      "100% personalizado según tus procesos",
      "Base de datos escalable",
      "Múltiples usuarios con roles y permisos",
      "Reportes y dashboards en tiempo real",
      "Respaldos automáticos diarios",
      "Acceso desde cualquier dispositivo",
    ],
    includes: [
      "Análisis de procesos y requerimientos",
      "Prototipo funcional antes de desarrollar",
      "Hosting empresarial incluido 1 año",
      "Capacitación completa del equipo",
      "Manuales de usuario detallados",
      "Soporte prioritario por 60 días",
    ]
  },
  {
    slug: "chatbots-inteligentes",
    icon: Bot,
    title: "Chatbots Inteligentes",
    description: "Automatiza atención a clientes con chatbots que responden 24/7 por WhatsApp.",
    price: "$9,999",
    deliveryTime: "7-10",
    features: [
      "Integración con WhatsApp Business API",
      "Entrenamiento con tus datos reales",
      "Respuestas automáticas inteligentes",
      "Recopilación de datos de clientes",
      "Transferencia a humano cuando es necesario",
      "Dashboard de métricas y conversaciones",
    ],
    includes: [
      "Configuración completa de WhatsApp Business",
      "100 conversaciones mensuales incluidas",
      "Plantillas de mensajes pre-diseñadas",
      "Integraciones con CRM/Google Sheets",
      "Actualizaciones de respuestas gratis",
      "Soporte técnico por 90 días",
    ]
  },
  {
    slug: "automatizacion-ia",
    icon: Zap,
    title: "Automatización con IA",
    description: "Conecta tus herramientas para que trabajen solas. Ahorra horas de trabajo repetitivo.",
    price: "$4,999",
    deliveryTime: "3-5",
    features: [
      "Automatización de tareas repetitivas",
      "Integración entre múltiples plataformas",
      "Procesamiento inteligente de datos",
      "Notificaciones y alertas automáticas",
      "Generación automática de reportes",
      "Sincronización en tiempo real",
    ],
    includes: [
      "Hasta 5 automatizaciones configuradas",
      "Integración con Google Workspace",
      "Conexión con WhatsApp/Telegram",
      "Documentación de flujos",
      "1 mes de ajustes sin costo",
      "Capacitación de uso (1 sesión)",
    ]
  },
  {
    slug: "asesoria-estrategica",
    icon: Lightbulb,
    title: "Asesoría Estratégica",
    description: "Te ayudamos a definir qué tecnología necesitas, con lenguaje claro.",
    price: "Gratis",
    deliveryTime: "1-2",
    features: [
      "Sesión de diagnóstico sin costo",
      "Análisis de necesidades tecnológicas",
      "Propuesta de soluciones viables",
      "Estimación de costos realista",
      "Roadmap de implementación",
      "Recomendaciones de herramientas",
    ],
    includes: [
      "30 minutos de consultoría gratuita",
      "Documento de recomendaciones",
      "Cotización detallada si procedes",
      "Lista de herramientas sugeridas",
      "Plan de trabajo propuesto",
      "Sin compromiso de contratación",
    ]
  },
]

// Helper para obtener servicio por slug
export function getServiceBySlug(slug: string): ServiceComplete | undefined {
  return servicesData.find(service => service.slug === slug)
}

// Helper para obtener todos los slugs
export function getAllServiceSlugs(): string[] {
  return servicesData.map(service => service.slug)
}
