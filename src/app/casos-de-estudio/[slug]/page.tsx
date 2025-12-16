"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { caseStudiesData, getCaseStudyBySlug, getAllCaseStudySlugs } from "@/app/lib/data/case-studies"
import { generateCreativeWorkSchema } from "@/app/lib/utils/seo"
import HeaderRedesign from "@/app/components/redesign/HeaderRedesign"
import Footer from "@/app/components/Footer"
import WhatsAppFloatingButton from "@/app/components/redesign/WhatsAppFloatingButton"
import { ExternalLink, Check, ArrowRight } from "lucide-react"

export default function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
  const caseStudy = getCaseStudyBySlug(params.slug)

  if (!caseStudy) {
    notFound()
  }

  // Related cases (2 others)
  const relatedCases = caseStudiesData.filter((c) => c.slug !== caseStudy.slug).slice(0, 2)

  // Generate JSON-LD schema
  const creativeWorkSchema = generateCreativeWorkSchema({
    name: `${caseStudy.title} - ${caseStudy.tagline}`,
    description: caseStudy.description,
    url: `/casos-de-estudio/${caseStudy.slug}`,
    image: caseStudy.image,
    datePublished: caseStudy.year ? `${caseStudy.year}-01-01` : undefined,
    keywords: caseStudy.tags,
    about: caseStudy.industry,
  })

  const handleWhatsAppCTA = () => {
    const phoneNumber = "529516482395"
    const message = `Hola, vi el caso de éxito de ${caseStudy.title} y me interesa un proyecto similar`
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />

      <HeaderRedesign />

      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="mb-6 text-sm text-slate-400">
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
                <span className="mx-2">/</span>
                <Link href="/casos-de-estudio" className="hover:text-white transition-colors">
                  Casos de Éxito
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">{caseStudy.title}</span>
              </nav>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {caseStudy.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {caseStudy.title}
              </h1>
              <p className="text-2xl text-accent font-semibold mb-6">
                {caseStudy.tagline}
              </p>
              <p className="text-xl text-slate-300 mb-8">
                {caseStudy.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 items-center mb-8">
                {caseStudy.client && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                    <div className="text-sm text-slate-300">Cliente</div>
                    <div className="text-lg font-bold">{caseStudy.client}</div>
                  </div>
                )}
                {caseStudy.year && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                    <div className="text-sm text-slate-300">Año</div>
                    <div className="text-lg font-bold">{caseStudy.year}</div>
                  </div>
                )}
                {caseStudy.industry && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                    <div className="text-sm text-slate-300">Industria</div>
                    <div className="text-lg font-bold">{caseStudy.industry}</div>
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {caseStudy.metrics.map((metric, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-accent mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-slate-300 uppercase">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Image */}
        <section className="py-0">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto -mt-12">
              <img
                src={caseStudy.image}
                alt={caseStudy.title}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Challenge & Solution */}
        {(caseStudy.challenge || caseStudy.solution) && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                {caseStudy.challenge && (
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">
                      El Desafío
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">
                      {caseStudy.challenge}
                    </p>
                  </div>
                )}

                {caseStudy.solution && (
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">
                      La Solución
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">
                      {caseStudy.solution}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Results */}
        {caseStudy.results && caseStudy.results.length > 0 && (
          <section className="py-20 bg-stone-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                  Resultados
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {caseStudy.results.map((result, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-6 shadow-md flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-stone-700">{result}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Technologies */}
        {caseStudy.technologies && caseStudy.technologies.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                  Tecnologías Utilizadas
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {caseStudy.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-stone-100 text-stone-700 px-6 py-3 rounded-lg font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonial */}
        {caseStudy.testimonial && (
          <section className="py-20 bg-gradient-to-br from-accent/10 to-yellow-600/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="text-6xl text-accent mb-6">"</div>
                <p className="text-2xl text-slate-800 font-medium mb-8 italic">
                  {caseStudy.testimonial.quote}
                </p>
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {caseStudy.testimonial.author}
                  </p>
                  <p className="text-stone-600">
                    {caseStudy.testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Visit Site */}
        {caseStudy.url && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4 text-center">
              <a
                href={caseStudy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:text-yellow-600 font-semibold text-lg transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Visitar sitio web
              </a>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                ¿Tienes un proyecto similar?
              </h2>
              <p className="text-xl text-stone-600 mb-10">
                Cuéntanos sobre tu idea y descubre cómo podemos ayudarte a convertirla en realidad.
              </p>
              <button
                onClick={handleWhatsAppCTA}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-12 py-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Platiquemos de tu proyecto
              </button>
            </div>
          </div>
        </section>

        {/* Related Cases */}
        {relatedCases.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                Otros Proyectos
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {relatedCases.map((relatedCase) => (
                  <Link
                    key={relatedCase.slug}
                    href={`/casos-de-estudio/${relatedCase.slug}`}
                    className="group bg-stone-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-stone-200 hover:border-accent"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedCase.image}
                        alt={relatedCase.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors">
                        {relatedCase.title}
                      </h3>
                      <p className="text-sm text-accent font-semibold mb-3">
                        {relatedCase.tagline}
                      </p>
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                        {relatedCase.description}
                      </p>
                      <div className="flex items-center text-accent font-semibold text-sm group-hover:translate-x-2 transition-transform">
                        <span>Ver proyecto</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}
