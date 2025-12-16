// src/app/components/redesign/TestimonialsFAQ.tsx
"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export default function TestimonialsFAQ() {
  const testimonials = [
    {
      text: "Nos desarrollaron la página web en 6 días. El equipo es profesional y siempre disponible para dudas.",
      author: "María González",
      role: "Café La Tradición",
      rating: 5
    },
    {
      text: "Sistema de inventario a medida entregado en 10 días. Nos capacitaron y ahora somos más eficientes.",
      author: "Carlos Hernández",
      role: "Distribuidor de Abarrotes",
      rating: 5
    },
  ]

  const faqs = [
    {
      q: "¿Cuánto tarda mi proyecto?",
      a: "Páginas web: 5-7 días. Sistemas: 10-15 días. Apps: 15-20 días. Te mostramos avances cada 2-3 días."
    },
    {
      q: "¿Qué pasa si necesito cambios después?",
      a: "30 días de soporte incluido. Cambios menores gratis, cambios mayores se cotizan aparte."
    },
    {
      q: "¿Trabajan solo en Oaxaca?",
      a: "Estamos en Oaxaca pero trabajamos con clientes de todo México por videollamada."
    },
  ]

  return (
    <section className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
              Lo que dicen nuestros clientes
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white border border-stone-200 rounded-xl p-8"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-stone-700 mb-6 leading-relaxed">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-stone-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white border border-stone-200 rounded-xl p-6 group hover:shadow-sm transition-shadow"
                >
                  <summary className="font-semibold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <svg
                      className="w-5 h-5 group-open:rotate-180 transition-transform"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-stone-600">
                    <p>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
