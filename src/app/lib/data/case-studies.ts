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
    url: "https://ordy.mx",
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
    slug: "constructopro",
    title: "ConstructoPro",
    tagline: "ERP para Gestión Integral de Obras de Construcción",
    description: "Sistema completo de gestión de proyectos de construcción con control de presupuestos, avances, personal y compras en tiempo real.",
    client: "Grupo Constructor del Sureste",
    year: "2024",
    industry: "Construcción",
    metrics: [
      { label: "proyectos activos", value: "15+" },
      { label: "ahorro en costos", value: "40%" },
    ],
    url: "https://constructopro.vercel.app",
    image: "https://placehold.co/600x400/0EA5E9/white?text=ConstructoPro+ERP",
    tags: ["ERP", "Construcción", "Presupuestos", "Control de Obra"],
    technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Zustand", "TanStack Query", "Radix UI", "ExcelJS", "Recharts"],
    challenge: "Empresas constructoras gestionaban proyectos con múltiples herramientas desconectadas (Excel, Word, software de presupuestos independiente), causando pérdida de información, duplicación de trabajo y dificultad para rastrear avances y costos reales.",
    solution: "Desarrollamos ConstructoPro, un ERP completo con 10 módulos integrados que centraliza toda la operación: desde la importación de catálogos Neodata hasta el control diario de obra, avances físicos/financieros, compras, personal y reportes automatizados.",
    results: [
      "Importación automática de catálogos desde Neodata, Excel o CSV",
      "40% de reducción en costos por mejor control de materiales",
      "Cálculo automático de explosión de materiales por período",
      "Control en tiempo real de avance físico vs financiero",
      "Gestión integrada de 15+ proyectos simultáneos",
      "Sistema de estimaciones y órdenes de compra automatizado",
      "Reducción de 70% en tiempo administrativo"
    ],
    testimonial: {
      quote: "ConstructoPro transformó completamente nuestra operación. Antes perdíamos miles de pesos por descontrol en materiales y sobrecostos. Ahora tenemos visibilidad total de cada proyecto en tiempo real.",
      author: "Ing. Roberto Martínez",
      role: "Director General, Grupo Constructor del Sureste"
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
