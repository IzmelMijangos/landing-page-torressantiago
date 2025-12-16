import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getIndustrySolutionBySlug,
  getAllIndustrySlugs,
} from "@/app/lib/data/industry-solutions"
import { servicesData } from "@/app/lib/data/services"
import { caseStudiesData } from "@/app/lib/data/case-studies"
import { generatePageMetadata, generateFAQSchema } from "@/app/lib/utils/seo"
import HeaderRedesign from "@/app/components/redesign/HeaderRedesign"
import Footer from "@/app/components/Footer"
import WhatsAppFloatingButton from "@/app/components/redesign/WhatsAppFloatingButton"
import Breadcrumbs from "@/app/components/Breadcrumbs"
import {
  Check,
  ArrowRight,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Users,
  Calendar,
  Shield,
  FileText,
  Bell,
  UtensilsCrossed,
  CalendarCheck,
  Smartphone,
  TrendingUp,
  GraduationCap,
  Video,
  Award,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

// Icon mapping
const iconMap: Record<string, any> = {
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Users,
  Calendar,
  Shield,
  FileText,
  Bell,
  UtensilsCrossed,
  CalendarCheck,
  Smartphone,
  TrendingUp,
  GraduationCap,
  Video,
  Award,
}

// Generate static params for all industries
export async function generateStaticParams() {
  const slugs = getAllIndustrySlugs()
  return slugs.map((slug) => ({
    industria: slug,
  }))
}

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: { industria: string }
}): Promise<Metadata> {
  const industry = getIndustrySolutionBySlug(params.industria)

  if (!industry) {
    return {
      title: "Industria no encontrada",
    }
  }

  return generatePageMetadata({
    title: `${industry.hero.title} | Torres Santiago`,
    description: industry.hero.description,
    path: `/soluciones/${industry.slug}`,
    keywords: industry.keywords,
  })
}

export default function IndustryPage({
  params,
}: {
  params: { industria: string }
}) {
  const industry = getIndustrySolutionBySlug(params.industria)

  if (!industry) {
    notFound()
  }

  // Get related services
  const relatedServices = industry.serviceIds
    .map((id) => servicesData.find((s) => s.slug === id))
    .filter((s) => s !== undefined)

  // Get related case study
  const relatedCase = industry.caseStudyId
    ? caseStudiesData.find((c) => c.slug === industry.caseStudyId)
    : null

  // Generate FAQ schema
  const faqSchema = generateFAQSchema(industry.faq)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <HeaderRedesign />

      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Breadcrumbs */}
              <Breadcrumbs
                items={[
                  { name: "Inicio", url: "/" },
                  { name: "Soluciones", url: "/soluciones" },
                  { name: industry.name, url: `/soluciones/${industry.slug}` },
                ]}
                className="mb-8"
              />

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    {industry.hero.title}
                  </h1>
                  <p className="text-xl text-slate-300 mb-8">
                    {industry.hero.description}
                  </p>

                  {industry.stats && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {industry.stats.map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="text-3xl font-bold text-accent">
                            {stat.value}
                          </div>
                          <div className="text-sm text-slate-400 mt-1">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <a
                    href="https://wa.me/529516482395?text=Hola,%20me%20interesa%20informaci%C3%B3n%20sobre%20soluciones%20para%20mi%20negocio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-600 text-slate-900 font-bold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    Solicitar cotización
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>

                <div className="hidden md:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                    <img
                      src={industry.hero.image}
                      alt={industry.name}
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
                Beneficios de nuestras soluciones
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {industry.benefits.map((benefit, index) => {
                  const Icon = iconMap[benefit.icon] || CheckCircle2
                  return (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
                    >
                      <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-accent" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-stone-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Challenges & Solutions */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Challenges */}
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-8">
                    Desafíos comunes
                  </h2>
                  <div className="space-y-6">
                    {industry.challenges.map((challenge, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 mb-2">
                            {challenge.title}
                          </h3>
                          <p className="text-stone-600 text-sm">
                            {challenge.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solutions */}
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-8">
                    Nuestras soluciones
                  </h2>
                  <div className="space-y-6">
                    {industry.solutions.map((solution, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 mb-2">
                            {solution.title}
                          </h3>
                          <p className="text-stone-600 text-sm">
                            {solution.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="py-20 bg-stone-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                  Servicios recomendados
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/servicios/${service.slug}`}
                      className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-stone-200 hover:border-accent"
                    >
                      <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                        <service.icon className="w-7 h-7 text-accent" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center text-accent font-semibold text-sm">
                        <span>Ver servicio</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Case Study */}
        {relatedCase && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                  Caso de éxito
                </h2>

                <Link
                  href={`/casos-de-estudio/${relatedCase.slug}`}
                  className="group block bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="p-8 md:p-12 text-white flex flex-col justify-center">
                      <h3 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                        {relatedCase.title}
                      </h3>
                      <p className="text-xl text-slate-300 mb-6">
                        {relatedCase.tagline}
                      </p>
                      <p className="text-slate-400 mb-8">
                        {relatedCase.description}
                      </p>

                      {relatedCase.metrics.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          {relatedCase.metrics.slice(0, 3).map((metric, index) => (
                            <div key={index}>
                              <div className="text-2xl font-bold text-accent">
                                {metric.value}
                              </div>
                              <div className="text-sm text-slate-400 mt-1">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center text-accent font-semibold">
                        <span>Ver caso completo</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>

                    <div className="relative h-64 md:h-auto">
                      <img
                        src={relatedCase.image}
                        alt={relatedCase.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                Preguntas frecuentes
              </h2>

              <div className="space-y-6">
                {industry.faq.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md"
                  >
                    <h3 className="font-bold text-slate-900 mb-3 flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-accent text-sm">
                        ?
                      </span>
                      {item.question}
                    </h3>
                    <p className="text-stone-600 pl-9">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">
                ¿Listo para transformar tu {industry.name.toLowerCase()}?
              </h2>
              <p className="text-xl text-slate-300 mb-10">
                Agenda una consultoría gratuita de 30 minutos. Analizamos tu negocio
                y te mostramos cómo la tecnología puede ayudarte a crecer.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/529516482395?text=Hola,%20quiero%20agendar%20una%20consultor%C3%ADa%20gratuita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-12 py-5 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Agendar consultoría gratuita
                </a>

                <Link
                  href="/servicios"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-5 rounded-lg transition-all border border-white/20"
                >
                  Ver todos los servicios
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}
