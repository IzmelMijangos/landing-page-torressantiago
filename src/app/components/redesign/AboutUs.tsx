// src/app/components/redesign/AboutUs.tsx
"use client"

import { motion } from "framer-motion"
import { MapPin, Users, Award } from "lucide-react"

export default function AboutUs() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Story */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Quiénes somos
              </h2>

              <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                <p>
                  Somos un equipo de desarrolladores con más de 5 años de experiencia,
                  fundamos Torres Santiago porque vimos que muchos negocios en Oaxaca
                  necesitan tecnología de calidad sin intermediarios.
                </p>

                <p>
                  Trabajamos directo contigo, sin agencias, sin outsourcing.
                  Cada proyecto lo desarrollamos nosotros mismos, aquí en Oaxaca.
                </p>

                <p className="text-slate-900 font-semibold">
                  No somos la opción más barata. Somos la opción más honesta.
                </p>
              </div>

              {/* Small metrics */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-700">5+</div>
                  <div className="text-sm text-stone-600">años</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-700">47</div>
                  <div className="text-sm text-stone-600">proyectos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-700">100%</div>
                  <div className="text-sm text-stone-600">satisfacción</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Values */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-stone-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">100% Local</h3>
                    <p className="text-stone-600 text-sm">
                      Con sede en Tlacolula de Matamoros, Oaxaca. Atendemos reuniones presenciales
                      en la zona y videollamadas para el resto de México.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-stone-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Trato Directo</h3>
                    <p className="text-stone-600 text-sm">
                      Hablas directamente con quien desarrolla tu proyecto.
                      Sin vendedores, sin intermediarios, sin sorpresas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-stone-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Calidad Comprobada</h3>
                    <p className="text-stone-600 text-sm">
                      Hemos desarrollado plataformas complejas como Meditium (salud mental)
                      y Ordy (delivery local). Tu proyecto está en buenas manos.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
