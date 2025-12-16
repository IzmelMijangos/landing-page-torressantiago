# 📄 EJEMPLO DE IMPLEMENTACIÓN - LANDING REDISEÑADA

Este archivo muestra cómo integrar todos los componentes del rediseño en una página completa.

---

## 🗂️ Estructura de Archivos Creados

```
src/app/components/redesign/
├── HeroSection.tsx              ✅ Creado
├── CaseStudyCard.tsx            ✅ Creado
├── WhyChooseUs.tsx              ✅ Creado
├── ProcessSteps.tsx             ✅ Creado
└── WhatsAppFloatingButton.tsx   ✅ Creado
```

---

## 📝 Página Completa - Ejemplo de Uso

Crea un nuevo archivo o reemplaza `src/app/page.tsx` con esta estructura:

```tsx
// src/app/page.tsx
"use client"

import HeroSection from "@/app/components/redesign/HeroSection"
import TrustBar from "@/app/components/TrustBar" // Del documento anterior
import ServiceCard from "@/app/components/ServiceCard" // Del documento anterior
import WhyChooseUs from "@/app/components/redesign/WhyChooseUs"
import CaseStudyCard from "@/app/components/redesign/CaseStudyCard"
import ProcessSteps from "@/app/components/redesign/ProcessSteps"
import PricingTable from "@/app/components/PricingTable" // Del documento anterior
import WhatsAppFloatingButton from "@/app/components/redesign/WhatsAppFloatingButton"
import Footer from "@/app/components/Footer"

// Iconos para servicios
import { Code, Smartphone, Cpu, Bot, Zap, Lightbulb } from "lucide-react"

export default function HomePage() {
  // Configuración de servicios
  const services = [
    {
      icon: Code,
      title: "Desarrollo Web Profesional",
      description:
        "Diseñamos y desarrollamos sitios web rápidos, modernos y optimizados para vender. Ideal para restaurantes, tiendas, profesionales y empresas locales.",
      features: [
        "Responsive (se adapta a móvil)",
        "Optimizado para Google",
        "Integración con WhatsApp y redes sociales",
      ],
      price: "Desde $7,999",
      ctaText: "Solicitar cotización",
    },
    {
      icon: Smartphone,
      title: "Aplicaciones iOS y Android",
      description:
        "Crea tu propia app para gestionar pedidos, reservas, clientes o inventario. Perfecta para negocios que quieren estar en el celular de sus clientes.",
      features: [
        "Diseño personalizado",
        "Notificaciones push",
        "Compatible con iOS y Android",
      ],
      price: "Desde $19,999",
      ctaText: "Cotizar mi app",
    },
    {
      icon: Cpu,
      title: "Sistemas Personalizados",
      description:
        "¿Necesitas un sistema de inventario, punto de venta, CRM o gestión interna? Desarrollamos la solución exacta que tu empresa necesita.",
      features: [
        "100% personalizado",
        "Capacitación incluida",
        "Soporte técnico continuo",
      ],
      price: "Desde $14,999",
      ctaText: "Platiquemos tu proyecto",
    },
    {
      icon: Bot,
      title: "Chatbots Inteligentes 24/7",
      description:
        "Automatiza la atención a clientes con chatbots que responden preguntas, toman pedidos y programan citas — disponibles todo el día.",
      features: [
        "Integración con WhatsApp, Facebook, Web",
        "Entrenado con tus datos",
        "Ahorra tiempo y dinero",
      ],
      price: "Desde $9,999",
      ctaText: "Ver demo de chatbot",
    },
    {
      icon: Zap,
      title: "Automatización de Procesos con IA",
      description:
        "Conectamos tus herramientas (WhatsApp, Google Sheets, redes sociales, CRM) para que trabajen juntas sin intervención manual.",
      features: [
        "Ahorra horas de trabajo repetitivo",
        "Reduce errores humanos",
        "Aumenta productividad",
      ],
      price: "Desde $4,999",
      ctaText: "Automatizar mi negocio",
    },
    {
      icon: Lightbulb,
      title: "Asesoría y Estrategia Digital",
      description:
        "¿No sabes qué tecnología necesitas? Te ayudamos a definir la mejor solución para tu negocio, sin tecnicismos, con lenguaje claro.",
      features: [
        "Sesión de diagnóstico gratuita",
        "Plan de acción personalizado",
        "Acompañamiento en implementación",
      ],
      price: "Consultoría inicial gratuita",
      ctaText: "Agendar llamada",
    },
  ]

  const handleWhatsAppCTA = () => {
    const phoneNumber = "521234567890" // Reemplaza con tu número
    const message = "Hola, me interesa cotizar un servicio"
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <HeroSection />

      {/* Barra de confianza */}
      <TrustBar />

      {/* Servicios */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Soluciones Tecnológicas para{" "}
              <span className="text-blue-700">Hacer Crecer tu Negocio</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desarrollamos sistemas personalizados, seguros y escalables para
              negocios que quieren vender más y automatizar procesos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                price={service.price}
                ctaText={service.ctaText}
                onCTAClick={handleWhatsAppCTA}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <WhyChooseUs />

      {/* Casos de éxito */}
      <section id="casos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Proyectos Reales que{" "}
              <span className="text-blue-700">Hemos Desarrollado</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No solo hacemos webs simples. Construimos plataformas completas
              que resuelven problemas reales de negocios.
            </p>
          </div>

          <div className="space-y-12">
            {/* Meditium */}
            <CaseStudyCard
              title="Meditium"
              description="Plataforma digital de bienestar mental y emocional que conecta a usuarios con terapeutas, contenido de mindfulness y herramientas de seguimiento de salud mental."
              features={[
                "Plataforma web completa con panel de administración",
                "Sistema de citas y videollamadas integrado",
                "Pagos en línea seguros",
                "App móvil para iOS y Android",
                "Automatizaciones con IA para recomendaciones personalizadas",
              ]}
              result="Plataforma activa con usuarios registrados, sesiones programadas y modelo de negocio en crecimiento."
              image="/images/meditium-mockup.jpg" // Reemplaza con tu imagen
              url="https://meditium.com"
              bgColor="bg-gradient-to-br from-purple-50 to-pink-50"
            />

            {/* Ordy */}
            <CaseStudyCard
              title="Ordy"
              description="Plataforma de delivery local especializada en Tlacolula de Matamoros. Conecta restaurantes, clientes y repartidores en un solo sistema."
              features={[
                "Marketplace completo con menús dinámicos",
                "Rastreo de pedidos en tiempo real",
                "Panel de gestión para restaurantes",
                "App para repartidores con geolocalización",
                "Integración de pagos y comisiones automáticas",
              ]}
              result="Plataforma funcional que facilita la economía local y conecta a negocios con sus clientes de forma eficiente."
              image="/images/ordy-mockup.jpg" // Reemplaza con tu imagen
              url="https://ordy-seven.vercel.app"
              bgColor="bg-gradient-to-br from-orange-50 to-yellow-50"
            />
          </div>

          {/* Testimonios */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Torres Santiago desarrolló nuestra página web en tiempo récord.
                El equipo es profesional, entiende las necesidades del negocio
                local y siempre está disponible para resolver dudas."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold">
                  MG
                </div>
                <div>
                  <p className="font-semibold text-gray-900">María González</p>
                  <p className="text-sm text-gray-600">
                    Dueña, Café La Tradición
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Necesitábamos un sistema de inventario a medida y lo entregaron
                en 10 días. Nos capacitaron, nos dieron soporte y ahora nuestro
                negocio es mucho más eficiente."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold">
                  CH
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Carlos Hernández</p>
                  <p className="text-sm text-gray-600">
                    Distribuidor de Abarrotes
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "El chatbot que desarrollaron para WhatsApp nos ha ahorrado horas
                de atención manual. Los clientes obtienen respuestas al instante
                y nosotros podemos enfocarnos en otras tareas."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-800 font-bold">
                  AL
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ana López</p>
                  <p className="text-sm text-gray-600">
                    Directora, Boutique Hotel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <ProcessSteps />

      {/* Precios */}
      <PricingTable />

      {/* Garantía y Urgencia */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-orange-400">
              <div className="text-center">
                <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
                  🔥 OFERTA ESPECIAL
                </span>

                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Cotización Gratuita + Descuento por Apertura
                </h2>

                <p className="text-xl text-gray-600 mb-8">
                  Solo tomamos 4 proyectos nuevos al mes para garantizar calidad
                  y atención personalizada.
                </p>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    🎁 BONUS SI CONTRATAS ESTA SEMANA:
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-left">
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-2xl">✓</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Hosting gratis por 1 año
                        </p>
                        <p className="text-sm text-gray-600">
                          Valor $1,200 MXN
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-2xl">✓</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Logo y diseño de marca básico
                        </p>
                        <p className="text-sm text-gray-600">Sin costo</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-2xl">✓</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Capacitación extendida
                        </p>
                        <p className="text-sm text-gray-600">
                          Para tu equipo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-100 border-2 border-red-400 rounded-xl p-4 mb-8">
                  <p className="text-red-800 font-bold text-lg">
                    ⏰ Cupos limitados: Solo quedan 2 espacios para este mes
                  </p>
                </div>

                <button
                  onClick={handleWhatsAppCTA}
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xl px-12 py-5 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Reservar mi Proyecto Ahora →
                </button>

                <p className="text-gray-500 mt-4 text-sm">
                  Garantía de satisfacción o devolución de dinero
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {/* Aquí agregarías componentes de FAQ/Accordion */}
            <details className="bg-gray-50 rounded-xl p-6 group">
              <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                ¿Cuánto tarda en estar listo mi proyecto?
                <svg
                  className="w-5 h-5 group-open:rotate-180 transition-transform"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 text-gray-600">
                <p>
                  • Páginas web: 5-7 días
                  <br />
                  • Sistemas personalizados: 7-15 días
                  <br />
                  • Apps móviles: 15-20 días
                  <br />
                  <br />
                  Te entregamos avances cada 2-3 días para que veas el progreso.
                </p>
              </div>
            </details>

            {/* Más preguntas... */}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para Llevar tu Negocio al Siguiente Nivel?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Agenda una llamada gratuita de 15 minutos. Sin compromiso, sin
            presión de ventas.
          </p>
          <button
            onClick={handleWhatsAppCTA}
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-lg px-12 py-5 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            🟢 Chatear por WhatsApp Ahora
          </button>
          <p className="text-blue-200 mt-4 text-sm">
            📧 O escríbenos a contacto@torressantiago.com
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* WhatsApp flotante */}
      <WhatsAppFloatingButton />
    </main>
  )
}
```

---

## 🎯 Componentes Faltantes por Crear

Todavía necesitas crear estos componentes que se mencionan en el documento REDISENO_LANDING.md:

1. **TrustBar.tsx** (Barra de confianza con badges)
2. **ServiceCard.tsx** (Card individual de servicio)
3. **PricingTable.tsx** (Tabla de precios)

Estos están documentados con código completo en `REDISENO_LANDING.md` - solo cópialos a:
```
src/app/components/TrustBar.tsx
src/app/components/ServiceCard.tsx
src/app/components/PricingTable.tsx
```

---

## 🖼️ Assets Necesarios

Asegúrate de tener estas imágenes en `public/images/`:

- `meditium-mockup.jpg` - Screenshot o mockup de Meditium
- `ordy-mockup.jpg` - Screenshot o mockup de Ordy
- `grid-pattern.svg` - Patrón de fondo para el hero (opcional)

---

## ⚙️ Configuración de Número de WhatsApp

**Reemplaza en todos los componentes:**

```tsx
const phoneNumber = "521234567890" // Formato: 52 + código de área + número
```

Por ejemplo, si tu número es 951 123 4567:
```tsx
const phoneNumber = "529511234567"
```

---

## 🚀 Cómo Lanzar la Nueva Landing

1. **Crea los componentes faltantes** (TrustBar, ServiceCard, PricingTable)
2. **Reemplaza `src/app/page.tsx`** con el ejemplo de arriba
3. **Agrega las imágenes** en `public/images/`
4. **Actualiza el número de WhatsApp** en todos los componentes
5. **Prueba en desarrollo:**
   ```bash
   npm run dev
   ```
6. **Revisa versión mobile** en DevTools (F12 → Toggle device toolbar)
7. **Ajusta copy y colores** según tu preferencia
8. **Haz build y deploy:**
   ```bash
   npm run build
   npm start
   ```

---

## 📊 Checklist de Implementación

- [ ] Crear TrustBar.tsx
- [ ] Crear ServiceCard.tsx
- [ ] Crear PricingTable.tsx
- [ ] Reemplazar page.tsx
- [ ] Agregar imágenes de Meditium y Ordy
- [ ] Actualizar número de WhatsApp
- [ ] Probar en mobile
- [ ] Probar todos los CTAs
- [ ] Ajustar copywriting personalizado
- [ ] Configurar Google Analytics
- [ ] Optimizar imágenes (WebP)
- [ ] Testear velocidad de carga
- [ ] Deploy a producción

---

**¡Listo para implementar!** 🎉

Si necesitas ayuda con algún componente específico o ajustes, avísame.
