"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
// import { ChevronRight, Check, ArrowRight, Spinner } from "lucide-react"
import { ChevronRight, Check, ArrowRight } from "lucide-react"
import { Loader } from "lucide-react" // Reemplaza Spinner con Loader
import InfoModal from "./InfoModal"

interface ServiceDetailProps {
  service: {
    titulo: string
    descripcion: string
    icono: React.ReactNode
    color: string,
    imagen: string
  }
  onRequestQuote?: () => void
}

export default function ServiceDetail({ service,onRequestQuote }: ServiceDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  // Datos detallados para cada servicio (simulados)
  const getServiceDetails = (title: string) => {
    const details = {
      "Desarrollo Web": {
        image: "/servicios/desarrollo_web.webp",
        description:
          "Nuestro servicio de desarrollo web ofrece soluciones personalizadas que se adaptan perfectamente a las necesidades específicas de su negocio. Utilizamos las últimas tecnologías y mejores prácticas para crear sitios web atractivos, funcionales y optimizados para motores de búsqueda.",
        features: [
          "Diseño web responsivo para todos los dispositivos",
          "Optimización SEO para mejorar su visibilidad en línea",
          "Integración con sistemas de gestión de contenido",
          "Desarrollo de tiendas en línea y plataformas de comercio electrónico",
          "Optimización de velocidad y rendimiento",
        ],
        process: [
          "Análisis y planificación",
          "Diseño de interfaz de usuario",
          "Desarrollo frontend y backend",
          "Pruebas y control de calidad",
          "Lanzamiento y mantenimiento",
        ],
        technologies: ["React", "Next.js", "Node.js", "WordPress", "WooCommerce", "Shopify"],
      },
      Chatbots: {
        image: "/servicios/chatbot.webp",
        description:
          "Nuestros chatbots inteligentes están diseñados para mejorar la experiencia del cliente y optimizar sus operaciones comerciales. Utilizamos tecnologías avanzadas de procesamiento de lenguaje natural para crear asistentes virtuales que pueden interactuar de manera natural con sus clientes.",
        features: [
          "Disponibilidad 24/7 para atender consultas de clientes",
          "Integración con plataformas de mensajería populares",
          "Capacidad para procesar pedidos y reservas",
          "Análisis de sentimientos para mejorar la experiencia del usuario",
          "Escalabilidad para manejar múltiples conversaciones simultáneas",
        ],
        process: [
          "Definición de objetivos y casos de uso",
          "Diseño de flujos de conversación",
          "Desarrollo e integración",
          "Entrenamiento y pruebas",
          "Implementación y monitoreo continuo",
        ],
        technologies: ["DialogFlow", "IBM Watson", "Microsoft Bot Framework", "NLP", "Machine Learning"],
      },
      "Desarrollo de aplicaciones móviles": {
        image: "/servicios/desarrollo_aplicaciones_moviles.webp",
        description:
          "Desarrollamos aplicaciones móviles nativas y multiplataforma que ofrecen experiencias de usuario excepcionales. Nuestro enfoque se centra en crear aplicaciones intuitivas, rápidas y seguras que satisfagan las necesidades de su negocio y sus usuarios.",
        features: [
          "Desarrollo para iOS y Android",
          "Interfaces de usuario intuitivas y atractivas",
          "Integración con APIs y servicios en la nube",
          "Funcionalidades offline",
          "Análisis de comportamiento de usuarios",
        ],
        process: [
          "Conceptualización y planificación",
          "Diseño de experiencia de usuario",
          "Desarrollo y codificación",
          "Pruebas exhaustivas",
          "Publicación y mantenimiento",
        ],
        technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
      },
      "Consultoría TI": {
        image: "/servicios/consultoria_ti.webp",
        description:
          "Nuestros servicios de consultoría TI proporcionan orientación estratégica para ayudar a su empresa a aprovechar al máximo sus inversiones tecnológicas. Trabajamos estrechamente con usted para comprender sus desafíos y objetivos comerciales, y desarrollar soluciones personalizadas que impulsen su crecimiento.",
        features: [
          "Evaluación de infraestructura tecnológica",
          "Planificación estratégica de TI",
          "Optimización de procesos empresariales",
          "Gestión de proyectos tecnológicos",
          "Asesoramiento en seguridad informática",
        ],
        process: [
          "Análisis de situación actual",
          "Identificación de oportunidades de mejora",
          "Desarrollo de estrategias",
          "Implementación de soluciones",
          "Evaluación y ajuste continuo",
        ],
        technologies: ["Cloud Computing", "DevOps", "Automatización", "Inteligencia Artificial", "Big Data"],
      },
      "Tratamiento de Datos": {
        image: "/servicios/tratamiento_datos.webp",
        description:
          "Nuestros servicios de tratamiento de datos le ayudan a convertir sus datos en información valiosa para la toma de decisiones. Utilizamos técnicas avanzadas de análisis y visualización para descubrir patrones, tendencias y oportunidades ocultas en sus datos.",
        features: [
          "Recopilación y limpieza de datos",
          "Análisis estadístico y predictivo",
          "Visualización de datos interactiva",
          "Implementación de soluciones de Business Intelligence",
          "Desarrollo de modelos de Machine Learning",
        ],
        process: [
          "Identificación de fuentes de datos",
          "Extracción y transformación",
          "Análisis y modelado",
          "Visualización e interpretación",
          "Implementación de soluciones basadas en datos",
        ],
        technologies: ["Python", "R", "Tableau", "Power BI", "TensorFlow", "SQL", "NoSQL"],
      },
      Ciberseguridad: {
        image: "/servicios/ciber_seguridad.webp",
        description:
          "Nuestros servicios de ciberseguridad están diseñados para proteger su infraestructura digital contra amenazas y vulnerabilidades. Implementamos soluciones robustas que salvaguardan sus datos y sistemas críticos, permitiéndole operar con confianza en el entorno digital.",
        features: [
          "Evaluación de vulnerabilidades y pruebas de penetración",
          "Implementación de soluciones de seguridad",
          "Monitoreo continuo y respuesta a incidentes",
          "Formación en concienciación sobre seguridad",
          "Cumplimiento normativo y auditorías",
        ],
        process: [
          "Evaluación de riesgos",
          "Diseño de arquitectura de seguridad",
          "Implementación de controles",
          "Pruebas y validación",
          "Monitoreo y mejora continua",
        ],
        technologies: [
          "Firewalls de nueva generación",
          "Sistemas de detección de intrusiones",
          "Cifrado",
          "Autenticación multifactor",
          "SIEM",
        ],
      },
    }

    return details[title as keyof typeof details] || details["Desarrollo Web"]
  }

  const serviceDetails = getServiceDetails(service.titulo)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 inline-flex items-center text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        Más información <ChevronRight className="h-4 w-4 ml-1" />
      </button>

      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={service.titulo} size="lg">
        <div className="space-y-8">
          <div className="relative w-full h-90 md:h-[30rem] lg:h-[30rem] overflow-hidden rounded-xl">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <Loader className="h-10 w-10 text-yellow-400 animate-spin" />
              </div>
            )}
            <Image
              src={serviceDetails.image || "/placeholder.svg"}
              alt={service.titulo}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              placeholder="blur"
              blurDataURL="/blur-placeholder.jpg"
              quality={15}
              onLoadingComplete={() => setLoading(false)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Descripción</h3>
            <p className="text-gray-300">{serviceDetails.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Características</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {serviceDetails.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Nuestro Proceso</h3>
            <div className="flex flex-wrap">
              {serviceDetails.process.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`px-4 py-2 rounded-full mb-5 ${index % 2 === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"
                      } text-sm font-medium`}
                  >
                    {step}
                  </div>
                  {index < serviceDetails.process.length - 1 && <ArrowRight className="h-4 w-4 mx-2 text-gray-600" />}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Tecnologías</h3>
            <div className="flex flex-wrap gap-2">
              {serviceDetails.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <button
              onClick={() => {
                setIsModalOpen(false)
                if (onRequestQuote) onRequestQuote()
              }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:shadow-yellow-500/20 transform transition-all duration-300 hover:-translate-y-1 w-full"
            >
              Solicitar este servicio
            </button>
          </div>
        </div>
      </InfoModal>
    </>
  )
}
