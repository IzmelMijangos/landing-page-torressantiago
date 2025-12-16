import { servicesData as fullServicesData } from "./data/services"

export interface Service {
  titulo: string
  descripcion: string
}

// Mapeo de servicios completos a formato básico para JSON-LD
const servicesMapping: Record<string, string> = {
  "Desarrollo Web": "Nuestro equipo especializado en desarrollo web crea sitios personalizados, responsivos y orientados a resultados, diseñados para fortalecer su presencia digital y conectar con sus clientes.",
  "Apps Móviles": "Saque el máximo provecho de la tecnología móvil con nuestras aplicaciones móviles personalizadas que se integran perfectamente con sus operaciones comerciales.",
  "Sistemas Personalizados": "Desarrollamos sistemas personalizados que se adaptan 100% a sus procesos de negocio, desde inventarios hasta CRM y gestión interna.",
  "Chatbots Inteligentes": "Transforme la manera en que su empresa interactúa con los clientes mediante nuestros avanzados chatbots personalizados. Disponibles 24/7, procesan pedidos y proporcionan soporte técnico en tiempo real.",
  "Automatización con IA": "Conecte sus herramientas y automatice tareas repetitivas con inteligencia artificial, ahorrando horas de trabajo y aumentando la productividad.",
  "Asesoría Estratégica": "Nuestros experimentados consultores de TI brindan orientación estratégica y soluciones personalizadas para optimizar su infraestructura tecnológica e impulsar la innovación.",
}

// Función helper para obtener servicios en formato básico (para JSON-LD)
export function getBasicServices(): Service[] {
  return fullServicesData.map(service => ({
    titulo: service.title,
    descripcion: servicesMapping[service.title] || service.description,
  }))
}

// Exportar para compatibilidad con código existente
export const serviciosData: Service[] = getBasicServices()
  