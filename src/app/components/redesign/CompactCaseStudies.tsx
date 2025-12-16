// src/app/components/redesign/CompactCaseStudies.tsx
"use client"

import { motion } from "framer-motion"
import { ExternalLink, TrendingUp } from "lucide-react"

interface CaseStudy {
  title: string
  tagline: string
  description: string
  metrics: {
    label: string
    value: string
  }[]
  url?: string
  image: string
  tags: string[]
}

interface CompactCaseStudiesProps {
  cases: CaseStudy[]
}

export default function CompactCaseStudies({ cases }: CompactCaseStudiesProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block bg-amber-100 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Casos de Éxito Reales
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Proyectos que{" "}
            <span className="text-amber-700">Hemos Desarrollado</span>
          </h2>
          <p className="text-xl text-stone-600">
            Plataformas completas que resuelven problemas reales de negocios
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cases.map((caseStudy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Tags */}
                <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
                  {caseStudy.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs px-2 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {caseStudy.title}
                </h3>
                <p className="text-sm text-amber-700 font-semibold mb-3">
                  {caseStudy.tagline}
                </p>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {caseStudy.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {caseStudy.metrics.map((metric, i) => (
                    <div key={i} className="bg-white border border-stone-200 rounded-lg p-3">
                      <div className="text-2xl font-bold text-amber-700 mb-1 flex items-center gap-1">
                        {metric.value}
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-stone-600">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Link */}
                {caseStudy.url && (
                  <a
                    href={caseStudy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold text-sm transition-colors group-hover:gap-3"
                  >
                    Ver proyecto completo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-stone-600 mb-4">
            ¿Quieres un proyecto como estos?
          </p>
          <a
            href="#servicios"
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold transition-colors"
          >
            Ver nuestros servicios
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
