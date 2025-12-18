// src/app/components/redesign/SimplifiedPricing.tsx
"use client"

import { motion } from "framer-motion"

export default function SimplifiedPricing() {
  const packages = [
    {
      name: "Página Web",
      price: "$7,999",
      time: "5-7 días",
      ideal: "Restaurantes, tiendas locales, profesionales",
      includes: [
        "Diseño responsive",
        "Hosting incluido 1 año",
        "Certificado SSL",
        "Optimización SEO básica",
      ]
    },
    {
      name: "Tienda en Línea",
      price: "$12,999",
      time: "7-10 días",
      ideal: "Comercios que venden productos",
      includes: [
        "Catálogo de productos",
        "Carrito de compras",
        "Pasarela de pagos",
        "Panel de administración",
      ]
    },
    {
      name: "App Móvil",
      price: "$19,999",
      time: "15-20 días",
      ideal: "Negocios con base de clientes frecuentes",
      includes: [
        "iOS y Android",
        "Notificaciones push",
        "Login de usuarios",
        "Diseño personalizado",
      ]
    },
    {
      name: "Sistema a Medida",
      price: "Desde $14,999",
      time: "10-20 días",
      ideal: "Necesidades específicas de tu negocio",
      includes: [
        "100% personalizado",
        "Capacitación incluida",
        "Soporte continuo",
        "Actualizaciones",
      ]
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Precios Transparentes
          </h2>
          <p className="text-xl text-stone-600">
            Sin letra chica. Sin sorpresas. Paga en partes.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-stone-50 border border-stone-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {pkg.name}
                </h3>
                <div className="text-3xl font-bold text-amber-700 mb-1">
                  {pkg.price}
                </div>
                <div className="text-sm text-stone-500">{pkg.time}</div>
              </div>

              <div className="mb-4 pb-4 border-b border-stone-200">
                <p className="text-sm text-stone-600 italic">
                  {pkg.ideal}
                </p>
              </div>

              <ul className="space-y-2">
                {pkg.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Process - simplified */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            ¿Cómo trabajamos?
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Platicamos</h4>
              <p className="text-sm text-stone-600">
                30 minutos de consultoría por videollamada para entender tu proyecto a fondo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Cotizamos</h4>
              <p className="text-sm text-stone-600">
                Precio fijo, plazos claros, sin letra chica
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Entregamos</h4>
              <p className="text-sm text-stone-600">
                Desarrollamos, probamos, capacitamos. Listo para usar.
              </p>
            </div>
          </div>

          {/* Payment info */}
          <div className="mt-12 bg-stone-50 border border-stone-200 rounded-xl p-6">
            <h4 className="font-bold text-slate-900 mb-3 text-center">Formas de Pago</h4>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-600">
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                50% al inicio, 50% al entregar
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                Hasta 3 pagos sin intereses
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                Transferencia o tarjeta
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
