import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { caseStudiesData } from "@/app/lib/data/case-studies"
import { generatePageMetadata } from "@/app/lib/utils/seo"
import HeaderRedesign from "@/app/components/redesign/HeaderRedesign"
import Footer from "@/app/components/Footer"
import WhatsAppFloatingButton from "@/app/components/redesign/WhatsAppFloatingButton"
import BreadcrumbsWithSchema from "@/app/components/BreadcrumbsWithSchema"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = generatePageMetadata({
  title: "Casos de Éxito - Proyectos Desarrollados",
  description: "Descubre nuestros proyectos exitosos: plataformas web, apps móviles y sistemas personalizados desarrollados para clientes en México.",
  path: "/casos-de-estudio",
  keywords: ["portfolio", "proyectos", "casos de éxito", "desarrollo web", "apps", "Oaxaca"],
})

export default function CasosDeEstudioPage() {
  return (
    <>
      <HeaderRedesign />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumbs */}
              <BreadcrumbsWithSchema
                items={[
                  { label: "Inicio", href: "/" },
                  { label: "Proyectos" }
                ]}
              />

              <div className="text-center mt-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Casos de Éxito
                </h1>
                <p className="text-xl text-slate-300 mb-8">
                  Proyectos reales que transformaron negocios. Conoce cómo hemos ayudado a nuestros clientes a alcanzar sus objetivos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cases Grid */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {caseStudiesData.map((caseStudy, index) => (
                <Link
                  key={caseStudy.slug}
                  href={`/casos-de-estudio/${caseStudy.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full border border-stone-200 hover:border-accent">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={caseStudy.image}
                        alt={caseStudy.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                      {/* Tags */}
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                        {caseStudy.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors">
                        {caseStudy.title}
                      </h3>
                      <p className="text-sm text-accent font-semibold mb-3">
                        {caseStudy.tagline}
                      </p>
                      <p className="text-stone-600 mb-6 line-clamp-3">
                        {caseStudy.description}
                      </p>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {caseStudy.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex}>
                            <div className="text-2xl font-bold text-accent">
                              {metric.value}
                            </div>
                            <div className="text-xs text-stone-500 uppercase">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center text-accent font-semibold group-hover:translate-x-2 transition-transform duration-300">
                        <span>Ver caso completo</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
              ¿Listo para ser nuestro próximo caso de éxito?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Cuéntanos sobre tu proyecto y descubre cómo podemos ayudarte a alcanzar tus objetivos.
            </p>
            <a
              href="https://wa.me/529516482395?text=Hola,%20me%20interesa%20iniciar%20un%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-12 py-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Iniciar mi Proyecto
            </a>
            <p className="text-amber-200 mt-6 text-sm">
              📧 contacto.torressantiago@gmail.com
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}
