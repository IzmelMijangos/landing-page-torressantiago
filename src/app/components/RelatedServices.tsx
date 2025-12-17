import Link from "next/link";
import { ServiceComplete } from "@/app/lib/data/services";
import { ArrowRight } from "lucide-react";

interface RelatedServicesProps {
  services: ServiceComplete[];
  title?: string;
}

export default function RelatedServices({ services, title = "Servicios Relacionados" }: RelatedServicesProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          {title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.slice(0, 3).map((service) => (
            <Link
              key={service.slug}
              href={`/servicios/${service.slug}`}
              className="group bg-stone-50 rounded-lg p-6 hover:shadow-xl transition-all duration-300 border border-stone-200 hover:border-accent"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <service.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors">
                {service.title}
              </h3>

              <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-accent">
                  {service.price}
                </span>
                <div className="flex items-center text-accent font-semibold text-sm group-hover:translate-x-2 transition-transform">
                  <span>Ver más</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Ver todos los servicios
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
