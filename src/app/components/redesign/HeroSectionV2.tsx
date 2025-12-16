// src/app/components/redesign/HeroSectionV2.tsx
"use client"

import Image from "next/image"

export default function HeroSectionV2() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "529516482395"
    const message = "Hola, me interesa conocer más sobre sus servicios"
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

      {/* Refined glow effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-900/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left column: Content */}
          <div className="text-center md:text-left max-w-xl">
            {/* Main headline - direct and memorable */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Desarrollamos la tecnología que necesitas para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-300">
                crecer
              </span>
            </h1>

            {/* Subheadline - location emphasis */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Desde Oaxaca, para todo México.
              <br />
              <span className="text-slate-400 text-lg">
                Desarrollo web, apps móviles y sistemas personalizados.
              </span>
            </p>

            {/* Single key metric */}
            <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-amber-900/30 px-6 py-4 rounded-lg mb-10">
              <div className="text-5xl font-bold text-amber-400">47</div>
              <div className="text-left text-sm text-slate-300">
                negocios locales<br />ya crecieron con nosotros
              </div>
            </div>

            {/* Single primary CTA */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <button
                onClick={handleWhatsAppClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg px-10 py-4 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 flex items-center gap-3 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Platiquemos de tu proyecto
              </button>

              <p className="text-sm text-slate-400">
                Agenda 1 hora de consultoría · Sin compromiso
              </p>
            </div>
          </div>

          {/* Right column: Visual */}
          <div className="relative">
            <div className="relative w-full h-[350px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
              <Image
                src="/images/ia.webp"
                alt="Tecnología y Desarrollo - Torres Santiago"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

              {/* Stats overlay */}
              <div className="absolute bottom-8 left-8 right-8 space-y-4">
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-amber-400">7-10</div>
                      <div className="text-xs text-slate-300">días de entrega</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-400">4.9</div>
                      <div className="text-xs text-slate-300">valoración</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-400">$7,999</div>
                      <div className="text-xs text-slate-300">desde</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
