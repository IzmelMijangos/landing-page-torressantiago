export interface CaseStudy {
  slug: string
  title: string
  tagline: string
  description: string
  client?: string
  year?: string
  industry?: string
  metrics: {
    label: string
    value: string
  }[]
  url?: string
  image: string
  tags: string[]
  testimonial?: {
    quote: string
    author: string
    role: string
  }
  technologies?: string[]
  challenge?: string
  solution?: string
  results?: string[]
}

export const caseStudiesData: CaseStudy[] = [
  {
    slug: "meditium",
    title: "Meditium",
    tagline: "Plataforma de bienestar mental",
    description: "Conecta terapeutas con pacientes. Incluye videollamadas, pagos en línea, calendario y app móvil.",
    client: "Meditium",
    year: "2024",
    industry: "Salud",
    metrics: [
      { label: "usuarios activos", value: "500+" },
      { label: "sesiones/mes", value: "200+" },
    ],
    url: "https://meditium.com",
    image: "https://placehold.co/600x400/9333EA/white?text=Meditium",
    tags: ["Plataforma Web", "App Móvil", "Pagos"],
    technologies: ["Next.js", "React Native", "Node.js", "PostgreSQL", "Stripe"],
    challenge: "Crear una plataforma segura y confiable para conectar terapeutas con pacientes, garantizando la privacidad y facilitando las sesiones virtuales.",
    solution: "Desarrollamos una plataforma web completa con videollamadas integradas, sistema de pagos en línea, calendario de citas y aplicación móvil nativa para iOS y Android.",
    results: [
      "500+ usuarios activos en los primeros 6 meses",
      "200+ sesiones mensuales completadas",
      "Reducción del 70% en tiempos de gestión administrativa",
      "Calificación promedio de 4.8/5 estrellas"
    ],
    testimonial: {
      quote: "La plataforma transformó completamente nuestra forma de trabajar. Ahora podemos enfocarnos en lo que realmente importa: ayudar a nuestros pacientes.",
      author: "Dr. Ana Martínez",
      role: "Fundadora de Meditium"
    }
  },
  {
    slug: "ordy",
    title: "Ordy",
    tagline: "Sistema de delivery local",
    description: "Marketplace que conecta restaurantes, clientes y repartidores en Tlacolula con rastreo en tiempo real.",
    client: "Ordy",
    year: "2024",
    industry: "Retail",
    metrics: [
      { label: "restaurantes", value: "15+" },
      { label: "pedidos/día", value: "50+" },
    ],
    url: "https://ordy-seven.vercel.app",
    image: "https://placehold.co/600x400/F59E0B/white?text=Ordy",
    tags: ["Marketplace", "Geolocalización", "Admin Panel"],
    technologies: ["Next.js", "TypeScript", "Google Maps API", "Firebase", "Tailwind CSS"],
    challenge: "Crear un marketplace local que permita a los restaurantes de Tlacolula ofrecer servicio de delivery de manera eficiente, con rastreo en tiempo real.",
    solution: "Desarrollamos un sistema completo con tres aplicaciones: cliente web, panel de administración para restaurantes y app para repartidores con geolocalización.",
    results: [
      "15+ restaurantes activos en la plataforma",
      "50+ pedidos diarios procesados",
      "Tiempo promedio de entrega reducido en 30%",
      "Crecimiento mensual del 40% en usuarios"
    ],
    testimonial: {
      quote: "Ordy nos permitió digitalizar nuestro negocio y llegar a más clientes. El sistema de rastreo en tiempo real genera mucha confianza.",
      author: "Carlos Hernández",
      role: "Propietario de Restaurante Los Sabores"
    }
  },
  {
    slug: "sistema-pos",
    title: "Sistema POS",
    tagline: "Punto de venta para abarrotes",
    description: "Control de inventario, ventas, proveedores y reportes en tiempo real para distribuidor local.",
    client: "Distribuidora San Juan",
    year: "2023",
    industry: "Retail",
    metrics: [
      { label: "productos", value: "800+" },
      { label: "ahorro tiempo", value: "60%" },
    ],
    image: "https://placehold.co/600x400/10B981/white?text=POS+System",
    tags: ["Sistema Interno", "Inventario", "Reportes"],
    technologies: ["React", "Node.js", "Express", "MySQL", "Electron"],
    challenge: "Modernizar el control de inventario y ventas de un distribuidor de abarrotes, eliminando procesos manuales y reduciendo errores.",
    solution: "Desarrollamos un sistema POS personalizado con control de inventario, gestión de proveedores, reportes en tiempo real y respaldo automático de datos.",
    results: [
      "Gestión de 800+ productos activos",
      "60% de reducción en tiempo de operaciones",
      "Eliminación total de errores de inventario manual",
      "ROI positivo en menos de 4 meses"
    ],
    testimonial: {
      quote: "El sistema nos cambió la vida. Ahora sabemos exactamente qué tenemos en inventario y podemos tomar decisiones basadas en datos reales.",
      author: "María Guadalupe Sánchez",
      role: "Gerente de Distribuidora San Juan"
    }
  },
]

// Helper para obtener caso por slug
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudiesData.find(caseStudy => caseStudy.slug === slug)
}

// Helper para obtener todos los slugs
export function getAllCaseStudySlugs(): string[] {
  return caseStudiesData.map(caseStudy => caseStudy.slug)
}

// Helper para obtener casos por industria
export function getCaseStudiesByIndustry(industry: string): CaseStudy[] {
  return caseStudiesData.filter(caseStudy => caseStudy.industry === industry)
}

// Helper para obtener casos por tag
export function getCaseStudiesByTag(tag: string): CaseStudy[] {
  return caseStudiesData.filter(caseStudy =>
    caseStudy.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}
