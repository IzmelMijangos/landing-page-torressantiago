"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { servicesData, getServiceBySlug, getAllServiceSlugs } from "@/app/lib/data/services"
import { generateServiceSchema } from "@/app/lib/utils/seo"
import HeaderRedesign from "@/app/components/redesign/HeaderRedesign"
import Footer from "@/app/components/Footer"
import WhatsAppFloatingButton from "@/app/components/redesign/WhatsAppFloatingButton"
import { Check, Clock, ArrowRight } from "lucide-react"

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

  // Related services (3 others)
  const relatedServices = servicesData.filter((s) => s.slug !== service.slug).slice(0, 3)

  // Generate JSON-LD schema for this service
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.description,
    price: service.price,
    url: `/servicios/${service.slug}`,
  })

  const handleWhatsAppCTA = () => {
    const phoneNumber = "529516482395"
    const message = `Hola, me interesa el servicio de ${service.title}`
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
                <Link href="/servicios" className="hover:text-white transition-colors">
                  Servicios
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">{service.title}</span>
              </nav>

              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <service.icon className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                {service.description}
              </p>

              {/* Price and Time */}
              <div className="flex flex-wrap gap-6 items-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                  <div className="text-sm text-slate-300 mb-1">Inversión</div>
                  <div className="text-3xl font-bold text-accent">{service.price}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-accent" />
                  <div>
                    <div className="text-sm text-slate-300">Tiempo de entrega</div>
                    <div className="text-lg font-bold">{service.deliveryTime} días</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
              {/* Features */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Características principales
                </h2>
                <ul className="space-y-4">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Includes */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Qué incluye
                </h2>
                <ul className="space-y-4">
                  {service.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                ¿Listo para comenzar?
              </h2>
              <p className="text-xl text-stone-600 mb-10">
                Agenda una consultoría gratuita y platiquemos sobre tu proyecto sin compromiso.
              </p>
              <button
                onClick={handleWhatsAppCTA}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-12 py-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Solicitar cotización por WhatsApp
              </button>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              También te puede interesar
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.slug}
                  href={`/servicios/${relatedService.slug}`}
                  className="group bg-stone-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 border border-stone-200 hover:border-accent"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <relatedService.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors">
                    {relatedService.title}
                  </h3>
                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                    {relatedService.description}
                  </p>
                  <div className="flex items-center text-accent font-semibold text-sm group-hover:translate-x-2 transition-transform">
                    <span>Ver más</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}
