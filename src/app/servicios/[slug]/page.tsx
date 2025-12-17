import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { servicesData, getServiceBySlug, getAllServiceSlugs } from "@/app/lib/data/services";
import { generateServiceSchema } from "@/app/lib/utils/seo";
import HeaderRedesign from "@/app/components/redesign/HeaderRedesign";
import Footer from "@/app/components/Footer";
import WhatsAppFloatingButton from "@/app/components/redesign/WhatsAppFloatingButton";
import WhatsAppCTAButton from "@/app/components/WhatsAppCTAButton";
import { Check, Clock, ArrowRight } from "lucide-react";

// Generate static params for all service slugs
export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for each service page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "Servicio no encontrado",
    };
  }

  const serviceTitle = `${service.title} - Torres Santiago`;
  const description = service.description;
  const url = `https://www.torressantiago.com/servicios/${service.slug}`;
  const ogImage = `https://www.torressantiago.com/images/og-services.jpg`;

  return {
    title: serviceTitle,
    description: description,
    keywords: [
      service.title,
      "desarrollo web Oaxaca",
      "servicios tecnológicos",
      "desarrollo software México",
      "soluciones digitales",
    ],
    authors: [{ name: "Torres Santiago" }],
    openGraph: {
      title: serviceTitle,
      description: description,
      url: url,
      siteName: "Torres Santiago",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      locale: "es_MX",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: serviceTitle,
      description: description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  // Related services (3 others)
  const relatedServices = servicesData.filter((s) => s.slug !== service.slug).slice(0, 3);

  // Generate JSON-LD schema for this service
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.description,
    price: service.price,
    url: `/servicios/${service.slug}`,
  });

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
              <WhatsAppCTAButton serviceName={service.title} />
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
  );
}
