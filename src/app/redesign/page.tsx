// src/app/redesign/page.tsx
"use client"

import { useState } from "react"
import HeaderRedesign from "@/app/components/redesign/HeaderRedesign"
import HeroSectionV2 from "@/app/components/redesign/HeroSectionV2"
import AboutUs from "@/app/components/redesign/AboutUs"
import ServiceCardV2Clickable from "@/app/components/redesign/ServiceCardV2Clickable"
import ServiceDetailModal from "@/app/components/redesign/ServiceDetailModal"
import CompactCaseStudies from "@/app/components/redesign/CompactCaseStudies"
import SimplifiedPricing from "@/app/components/redesign/SimplifiedPricing"
import TestimonialsFAQ from "@/app/components/redesign/TestimonialsFAQ"
import WhatsAppFloatingButton from "@/app/components/redesign/WhatsAppFloatingButton"
import Footer from "@/app/components/Footer"

// Iconos para servicios
import { Code, Smartphone, Cpu, Bot, Zap, Lightbulb } from "lucide-react"

export default function RedesignPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null)

  // Servicios con detalles completos
  const services = [
    {
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
        "1 hora de consultoría gratuita",
        "Documento de recomendaciones",
        "Cotización detallada si procedes",
        "Lista de herramientas sugeridas",
        "Plan de trabajo propuesto",
        "Sin compromiso de contratación",
      ]
    },
  ]

  // Casos de éxito compactos
  const caseStudies = [
    {
      title: "Meditium",
      tagline: "Plataforma de bienestar mental",
      description: "Conecta terapeutas con pacientes. Incluye videollamadas, pagos en línea, calendario y app móvil.",
      metrics: [
        { label: "usuarios activos", value: "500+" },
        { label: "sesiones/mes", value: "200+" },
      ],
      url: "https://meditium.com",
      image: "https://placehold.co/600x400/9333EA/white?text=Meditium",
      tags: ["Plataforma Web", "App Móvil", "Pagos"],
    },
    {
      title: "Ordy",
      tagline: "Sistema de delivery local",
      description: "Marketplace que conecta restaurantes, clientes y repartidores en Tlacolula con rastreo en tiempo real.",
      metrics: [
        { label: "restaurantes", value: "15+" },
        { label: "pedidos/día", value: "50+" },
      ],
      url: "https://ordy-seven.vercel.app",
      image: "https://placehold.co/600x400/F59E0B/white?text=Ordy",
      tags: ["Marketplace", "Geolocalización", "Admin Panel"],
    },
    {
      title: "Sistema POS",
      tagline: "Punto de venta para abarrotes",
      description: "Control de inventario, ventas, proveedores y reportes en tiempo real para distribuidor local.",
      metrics: [
        { label: "productos", value: "800+" },
        { label: "ahorro tiempo", value: "60%" },
      ],
      image: "https://placehold.co/600x400/10B981/white?text=POS+System",
      tags: ["Sistema Interno", "Inventario", "Reportes"],
    },
  ]

  const handleWhatsAppCTA = () => {
    const phoneNumber = "529516482395"
    const message = selectedService !== null
      ? `Hola, me interesa el servicio de ${services[selectedService].title}`
      : "Hola, me interesa conocer más sobre sus servicios"
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }

  return (
    <main className="min-h-screen pt-16">
      {/* Header */}
      <HeaderRedesign />

      {/* Hero */}
      <HeroSectionV2 />

      {/* Sobre Nosotros */}
      <div id="quienes-somos">
        <AboutUs />
      </div>

      {/* Servicios - CLICKEABLES con modal */}
      <section id="servicios" className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Qué desarrollamos
            </h2>
            <p className="text-xl text-stone-600">
              Haz clic en cada servicio para ver detalles completos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {services.map((service, index) => (
              <ServiceCardV2Clickable
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                price={service.price}
                onClick={() => setSelectedService(index)}
              />
            ))}
          </div>

          {/* UN SOLO CTA para todos los servicios */}
          <div className="text-center">
            <button
              onClick={handleWhatsAppCTA}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg px-12 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Platiquemos de tu proyecto
            </button>
            <p className="text-sm text-stone-500 mt-4">
              Agenda 1 hora de consultoría · Sin compromiso
            </p>
          </div>
        </div>
      </section>

      {/* Modal de detalles de servicio */}
      {selectedService !== null && (
        <ServiceDetailModal
          isOpen={selectedService !== null}
          onClose={() => setSelectedService(null)}
          icon={services[selectedService].icon}
          title={services[selectedService].title}
          description={services[selectedService].description}
          price={services[selectedService].price}
          features={services[selectedService].features}
          deliveryTime={services[selectedService].deliveryTime}
          includes={services[selectedService].includes}
          onCTAClick={handleWhatsAppCTA}
        />
      )}

      {/* Casos de éxito - COMPACTOS (3 proyectos) */}
      <div id="proyectos">
        <CompactCaseStudies cases={caseStudies} />
      </div>

      {/* Pricing + Proceso */}
      <SimplifiedPricing />

      {/* Testimonios + FAQ */}
      <div id="faq">
        <TestimonialsFAQ />
      </div>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
            ¿Listo para llevar tu negocio al siguiente nivel?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Agenda 1 hora de consultoría gratuita. Analizamos tu proyecto a fondo.
          </p>
          <button
            onClick={handleWhatsAppCTA}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-12 py-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chatear por WhatsApp
          </button>
          <p className="text-amber-200 mt-6 text-sm">
            📧 contacto.torressantiago@gmail.com
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* WhatsApp flotante */}
      <WhatsAppFloatingButton />
    </main>
  )
}
