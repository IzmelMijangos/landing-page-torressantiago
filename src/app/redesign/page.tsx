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
import GameButton from "@/app/components/GameButton"
import { MessageSquare } from "lucide-react"
import { servicesData } from "@/app/lib/data/services"
import { caseStudiesData } from "@/app/lib/data/case-studies"

export default function RedesignPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null)

  // Usar servicios importados desde datos centralizados
  const services = servicesData

  // Usar casos de estudio importados desde datos centralizados
  const caseStudies = caseStudiesData

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
            <GameButton
              onClick={handleWhatsAppCTA}
              variant="success"
              size="lg"
              icon={MessageSquare}
            >
              Platiquemos de tu proyecto
            </GameButton>
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
          <GameButton
            onClick={handleWhatsAppCTA}
            variant="success"
            size="xl"
            icon={MessageSquare}
          >
            Chatear por WhatsApp
          </GameButton>
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
