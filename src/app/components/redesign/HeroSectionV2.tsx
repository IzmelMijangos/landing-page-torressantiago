// src/app/components/redesign/HeroSectionV2.tsx
"use client"

import Image from "next/image"
import GameButton from "@/app/components/GameButton"
import { MessageSquare } from "lucide-react"

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
              <GameButton
                onClick={handleWhatsAppClick}
                variant="success"
                size="xl"
                icon={MessageSquare}
              >
                Platiquemos de tu proyecto
              </GameButton>

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
