"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import Modal from "@/app/components/Modal"
import ServiceDetail from "@/app/components/ServiceDetail"
import TeamModal from "@/app/components/TeamModal"
import TechInfoModal from "@/app/components/TechInfoModal"
import CustomSolutionsModal from "@/app/components/CustomSolutionsModal"
import { AppSelector } from "@/app/components/AppSelector"
// Iconos
import {
  Code,
  MessageSquare,
  Smartphone,
  BarChart2,
  Shield,
  Lightbulb,
  ChevronRight,
  Star,
  Users,
  Award,
  Circle,
} from "lucide-react"

// Swiper
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay } from "swiper/modules"

// Estilos de Swiper
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/autoplay"

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  // Efecto para animación de entrada
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Servicios con iconos
  const servicios = [
    {
      titulo: "Desarrollo Web",
      descripcion:
        "Nuestro equipo especializado en desarrollo web crea sitios personalizados, responsivos y orientados a resultados, diseñados para fortalecer su presencia digital y conectar con sus clientes.",
      icono: <Code className="h-10 w-10 text-blue-400 mb-4" />,
      color: "border-blue-500",
      imagen: "/servicios/ciber_seguridad.jpg",
    },
    {
      titulo: "Chatbots",
      descripcion:
        "Transforme la manera en que su empresa interactúa con los clientes mediante nuestros avanzados chatbots personalizados. Disponibles 24/7, nuestros chatbots no solo responden a preguntas comunes, sino que también procesan pedidos y proporcionan soporte técnico en tiempo real.",
      icono: <MessageSquare className="h-10 w-10 text-red-400 mb-4" />,
      color: "border-red-500",
      imagen: "/servicios/ciber_seguridad.jpg",
    },
    {
      titulo: "Desarrollo de aplicaciones móviles",
      descripcion:
        "Saque el máximo provecho de la tecnología móvil con nuestras aplicaciones móviles personalizadas que se integran perfectamente con sus operaciones comerciales.",
      icono: <Smartphone className="h-10 w-10 text-green-400 mb-4" />,
      color: "border-green-500",
      imagen: "/servicios/ciber_seguridad.jpg",
    },
    {
      titulo: "Consultoría TI",
      descripcion:
        "Nuestros experimentados consultores de TI brindan orientación estratégica y soluciones personalizadas para optimizar su infraestructura tecnológica e impulsar la innovación.",
      icono: <Lightbulb className="h-10 w-10 text-purple-400 mb-4" />,
      color: "border-purple-500",
      imagen: "/servicios/ciber_seguridad.jpg",
    },
    {
      titulo: "Tratamiento de Datos",
      descripcion:
        "Transforme sus datos en decisiones estratégicas con nuestros servicios de análisis de datos avanzados y personalizados.",
      icono: <BarChart2 className="h-10 w-10 text-yellow-400 mb-4" />,
      color: "border-yellow-500",
      imagen: "/servicios/ciber_seguridad.jpg",
    },
    {
      titulo: "Ciberseguridad",
      descripcion:
        "Proteja su infraestructura digital con nuestras soluciones avanzadas de ciberseguridad, diseñadas para mantener sus datos seguros y sus operaciones funcionando sin interrupciones.",
      icono: <Shield className="h-10 w-10 text-pink-400 mb-4" />,
      color: "border-pink-500",
      imagen: "/servicios/ciber_seguridad.jpg",
    },
  ]

  // Testimonios
  const testimonios = [
    {
      nombre: "David Santiago, Director General",
      cargo: "Consultoría y Construcción Santiago Gonzalez",
      testimonio:
        "Los servicios de desarrollo web de Torres Santiago Soluciones Inteligentes han cambiado las reglas del juego para nuestro negocio. Su enfoque personalizado y atención al detalle resultaron en un sitio web que no solo se ve increíble, sino que también ha aumentado significativamente nuestras conversiones.",
      avatar: "/avatares/santiago_gonzalez.jpg",
    },
    {
      nombre: "Uziel Torres, Directo General",
      cargo: "Total-Fix",
      testimonio:
        "La aplicación móvil desarrollada por Torres Santiago Soluciones Inteligentes ha transformado la forma en que interactuamos con nuestros clientes. La interfaz intuitiva y las funcionalidades avanzadas han recibido comentarios extremadamente positivos de nuestros usuarios.",
      avatar: "/avatares/total-fix.jpg",
    },
    {
      nombre: "Carlos López, Gerente de TI",
      cargo: "Ensigna",
      testimonio:
        "Implementar el chatbot de Torres Santiago Soluciones Inteligentes en nuestra ferretería ha sido un cambio revolucionario. Ha reducido nuestra carga de trabajo en un 40% mientras mejora la satisfacción del cliente. Una inversión que realmente valió la pena.",
      avatar: "/avatares/ferreteria.webp",
    },
    {
      nombre: "Sofía Martínez, Directora de Marketing",
      cargo: "Taquería Eli",
      testimonio:
        "Torres Santiago nos ha ayudado a aprovechar al máximo nuestros datos, mejorando nuestras campañas de marketing con análisis detallados y estrategias basadas en datos. Los resultados han superado nuestras expectativas.",
      avatar: "/avatares/tacos.png",
    },
  ]

  // Plataformas de integración
  const plataformas = [
    {
      nombre: "Facebook",
      color: "border-blue-600",
      descripcion:
        "Integramos sus servicios con Facebook para maximizar la interacción y participación en redes sociales, impulsando su presencia digital y conectando con su audiencia.",
    },
    {
      nombre: "WhatsApp",
      color: "border-green-500",
      descripcion:
        "Implementamos soluciones de mensajería automatizada a través de WhatsApp, permitiendo a sus clientes comunicarse directamente con su negocio de manera eficiente y segura.",
    },
    {
      nombre: "Google Cloud",
      color: "border-gray-500",
      descripcion:
        "Aproveche la potencia de Google Cloud para escalar su infraestructura tecnológica, garantizando seguridad y eficiencia en sus operaciones.",
    },
    {
      nombre: "Instagram",
      color: "border-purple-600",
      descripcion:
        "Desarrolle una estrategia visual efectiva en Instagram, atrayendo a un público más amplio y mejorando su marca a través de contenidos visuales impactantes.",
    },
    {
      nombre: "YouTube",
      color: "border-red-500",
      descripcion:
        "Cree contenido atractivo y educativo en YouTube, posicionando su negocio como un líder en su industria mediante videos que resuenen con su audiencia.",
    },
    {
      nombre: "Google My Business",
      color: "border-orange-500",
      descripcion:
        "Aumente la visibilidad de su negocio local optimizando su perfil en Google My Business, asegurando que sus clientes lo encuentren fácilmente en búsquedas y mapas.",
    },
  ]

  // Preguntas frecuentes
  const faqs = [
    {
      pregunta: "¿Qué servicios ofrece Torres Santiago Soluciones Inteligentes?",
      respuesta:
        "Ofrecemos una variedad de servicios tecnológicos, incluyendo desarrollo web, desarrollo de aplicaciones móviles, chatbots, tratamiento de datos, ciberseguridad, y más.",
    },
    {
      pregunta: "¿Cómo puedo obtener una cotización para un proyecto?",
      respuesta:
        'Puedes obtener una cotización rápida contactándonos a través del formulario de contacto en nuestro sitio web o directamente haciendo clic en el botón "Consigue una cotización" en la página principal.',
    },
    {
      pregunta: "¿Cuál es el proceso de desarrollo de un proyecto con ustedes?",
      respuesta:
        "Nuestro proceso incluye una reunión inicial para comprender tus necesidades, seguido de la planificación y diseño del proyecto, desarrollo, pruebas, y finalmente, la implementación y soporte continuo.",
    },
    {
      pregunta: "¿Ofrecen soporte después de la implementación del proyecto?",
      respuesta:
        "Sí, ofrecemos soporte técnico y mantenimiento continuo para asegurarnos de que tu proyecto siga funcionando de manera óptima después de su implementación.",
    },
    {
      pregunta: "¿Cómo puedo contactar con Torres Santiago Soluciones Inteligentes?",
      respuesta:
        "Puedes contactarnos a través de nuestro correo electrónico contacto.torressantiago@gmail.com, o por teléfono al +52 951 648 2395. También puedes usar el botón de WhatsApp en nuestro sitio web para comunicarte directamente con nosotros.",
    },
  ]

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-gray-950 to-gray-900 text-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Mejorada con animaciones y mejor estructura */}
        <section className="relative w-full pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-32 lg:pb-32 overflow-hidden border-b border-gray-800">
          {/* Fondo con efecto de partículas o gradiente */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-400/10 via-gray-900 to-gray-950 z-0"></div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[1800px]">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
              {/* Contenido del Hero */}
              <div
                className={`space-y-6 transition-all duration-1000 ease-out transform ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                  }`}
              >
                <div className="inline-block px-4 py-1.5 bg-yellow-500/10 rounded-full text-yellow-400 text-sm font-medium mb-2">
                  Innovación Tecnológica para su Negocio
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="block text-white">Torres Santiago</span>
                  <span className="block text-yellow-400 mt-1">Soluciones Inteligentes</span>
                </h1>

                <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
                  Ofrecemos soluciones de vanguardia para optimizar sus operaciones, aumentar la productividad e
                  impulsar su negocio a la era de la digitalización. Experimente el poder de nuestros servicios
                  innovadores hoy.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:shadow-yellow-500/20 transform transition-all duration-300 hover:-translate-y-1"
                  >
                    Solicitar cotización
                  </button>

                  <Link
                    href="#servicios"
                    className="px-6 py-3 bg-gray-800 text-gray-100 font-medium rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors duration-300"
                  >
                    Explorar servicios
                  </Link>
                </div>

                {/* Estadísticas o badges */}
                <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-gray-300">Más de 10 clientes satisfechos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-gray-300">Valoración promedio: 4.9 de 5</span>
                  </div>
                </div>
              </div>

              {/* Imagen del Hero con animación */}
              <div
                className={`relative transition-all duration-1000 delay-300 ease-out transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                  }`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-2xl blur opacity-20 animate-pulse"></div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img src="/images/ia.webp" alt="Soluciones Inteligentes" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal para cotizaciones */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          selectedService={selectedService}
        />

        {/* Sección de Servicios - Mejorada con iconos y mejor diseño de tarjetas */}
        <section id="servicios" className="w-full py-16 md:py-24 lg:py-32 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[1800px]">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block px-3 py-1 bg-blue-500/10 rounded-full text-blue-400 text-sm font-medium mb-4">
                NUESTROS SERVICIOS
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Soluciones tecnológicas a la medida de su negocio
              </h2>
              <p className="text-gray-400 text-lg">
                En Torres Santiago Soluciones Inteligentes, brindamos soluciones tecnológicas de vanguardia, adaptadas a las necesidades específicas de cada negocio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
              {servicios.map((servicio, index) => (
                <div
                  key={index}
                  className={`
                    w-full max-w-md
                    p-8 rounded-xl border-2 ${servicio.color}
                    bg-gray-800/80 backdrop-blur-sm text-white
                    shadow-xl hover:shadow-2xl transition-all duration-300
                    hover:-translate-y-2 flex flex-col
                  `}
                >
                  {servicio.icono}
                  <h3 className="text-xl font-bold mb-3">{servicio.titulo}</h3>
                  <p className="text-gray-300 flex-grow">{servicio.descripcion}</p>
                  <ServiceDetail
                    service={servicio}
                    onRequestQuote={() => {
                      setSelectedService(servicio.titulo)
                      setModalOpen(true)
                    }}
                  />
                </div>
              ))}
            </div>
            {/* <div className="text-end mt-12">
            <button
              onClick={() => {
                setSelectedService(servicio.titulo)
                setModalOpen(true)
              }}
              className="mt-4 text-yellow-400 underline hover:text-yellow-300 transition"
            >
              Solicitar este servicio
            </button>
            </div> */}
          </div>
        </section>

        {/* Sección de Casos de Éxito - Mejorada con diseño de testimonios */}
        <section id="proyectos" className="w-full py-16 md:py-20 lg:py-20 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[1800px]">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block px-3 py-1 bg-green-500/10 rounded-full text-green-400 text-sm font-medium mb-4">
                CASOS DE ÉXITO
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Lo que nuestros clientes dicen
              </h2>
              <p className="text-gray-300 text-lg">
                Descubre cómo Torres Santiago Soluciones Inteligentes ha transformado los negocios de nuestros clientes.
              </p>
            </div>

            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
              }}
              loop={true}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              modules={[Pagination, Navigation, Autoplay]}
              className="testimonial-swiper mt-8"
            >
              {testimonios.map((testimonio, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-gradient-to-b from-gray-800 to-gray-800/70 backdrop-blur-sm p-8 rounded-xl shadow-xl h-full flex flex-col">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-yellow-400">
                        <img
                          src={testimonio.avatar || "/placeholder.svg"}
                          alt={testimonio.nombre}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{testimonio.nombre}</h4>
                        <p className="text-gray-400 text-sm">{testimonio.cargo}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500/20"
                      >
                        <path
                          d="M9.33333 21.3333C7.86667 21.3333 6.66667 20.8 5.73333 19.7333C4.8 18.6667 4.33333 17.3333 4.33333 15.7333C4.33333 14 4.93333 12.2 6.13333 10.3333C7.33333 8.46667 9.06667 6.8 11.3333 5.33333L13.3333 8C11.7333 9.06667 10.5333 10.1333 9.73333 11.2C8.93333 12.2667 8.53333 13.2667 8.53333 14.2C8.53333 14.6 8.6 14.9333 8.73333 15.2C8.86667 15.4667 9.13333 15.7333 9.53333 16C10.0667 16.4 10.4667 16.8667 10.7333 17.4C11 17.9333 11.1333 18.5333 11.1333 19.2C11.1333 19.8667 10.9333 20.4 10.5333 20.8C10.1333 21.1333 9.6 21.3333 9.33333 21.3333ZM22.6667 21.3333C21.2 21.3333 20 20.8 19.0667 19.7333C18.1333 18.6667 17.6667 17.3333 17.6667 15.7333C17.6667 14 18.2667 12.2 19.4667 10.3333C20.6667 8.46667 22.4 6.8 24.6667 5.33333L26.6667 8C25.0667 9.06667 23.8667 10.1333 23.0667 11.2C22.2667 12.2667 21.8667 13.2667 21.8667 14.2C21.8667 14.6 21.9333 14.9333 22.0667 15.2C22.2 15.4667 22.4667 15.7333 22.8667 16C23.4 16.4 23.8 16.8667 24.0667 17.4C24.3333 17.9333 24.4667 18.5333 24.4667 19.2C24.4667 19.8667 24.2667 20.4 23.8667 20.8C23.4667 21.1333 22.9333 21.3333 22.6667 21.3333Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-300 italic flex-grow">{testimonio.testimonio}</p>
                    <div className="flex mt-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Sección de Plataformas de Integración */}
        <section id="plataformas" className="w-full py-16 md:py-24 lg:py-32 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[1800px]">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block px-3 py-1 bg-purple-500/10 rounded-full text-purple-400 text-sm font-medium mb-4">
                INTEGRACIONES
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Plataformas que potencian su negocio
              </h2>
              <p className="text-gray-300 text-lg">
                En Torres Santiago Soluciones Inteligentes, integramos y optimizamos sus procesos a través de diversas
                plataformas líderes en la industria.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
              {plataformas.map((plataforma, index) => (
                <div
                  key={index}
                  className={`
                    w-full max-w-md
                    p-8 rounded-xl border ${plataforma.color}
                    bg-gray-800 text-white
                    shadow-lg hover:shadow-xl
                    transition-all duration-300 hover:-translate-y-1
                    flex flex-col
                  `}
                >
                  <h3 className="text-xl font-bold mb-3">{plataforma.nombre}</h3>
                  <p className="text-gray-300">{plataforma.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección Quiénes Somos - Mejorada con más contenido y mejor diseño */}
        <section
          id="quienes-somos"
          className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-950 to-gray-900"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[1800px]">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block px-3 py-1 bg-red-500/10 rounded-full text-red-400 text-sm font-medium mb-4">
                QUIÉNES SOMOS
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Su socio tecnológico de confianza
              </h2>
              <p className="text-gray-300 text-lg">
                Conozca las ventajas que posicionan a Torres Santiago Soluciones Inteligentes como su mejor aliado tecnológico.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="bg-gray-800 p-8 rounded-xl border-l-4 border-yellow-400">
                  <h3 className="text-xl font-bold mb-3">Tecnología de vanguardia</h3>
                  <p className="text-gray-300">
                    Torres Santiago Soluciones Inteligentes aprovecha las últimas tecnologías y mejores prácticas de la
                    industria para ofrecer soluciones innovadoras que impulsan su negocio hacia adelante.
                  </p>
                  <TechInfoModal onRequestQuote={() => {
                    setSelectedService(null)
                    setModalOpen(true)
                  }} />
                </div>

                <div className="bg-gray-800 p-8 rounded-xl border-l-4 border-yellow-400">
                  <h3 className="text-xl font-bold mb-3">Soluciones a medida</h3>
                  <p className="text-gray-300">
                    Nuestro equipo trabaja estrechamente con usted para comprender sus necesidades comerciales únicas y
                    desarrollar soluciones personalizadas que brinden el máximo impacto.
                  </p>
                  <CustomSolutionsModal onRequestQuote={() => {
                    setSelectedService(null)
                    setModalOpen(true)
                  }} />
                </div>

                <div className="bg-gray-800 p-8 rounded-xl border-l-4 border-yellow-400">
                  <h3 className="text-xl font-bold mb-3">Equipo de expertos</h3>
                  <p className="text-gray-300">
                    Contamos con un equipo de profesionales altamente capacitados y certificados en las últimas
                    tecnologías, comprometidos con la excelencia y la innovación continua.
                  </p>
                  <TeamModal />
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-gray-800 p-8 rounded-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-gray-900/50 rounded-lg">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">4+</div>
                      <p className="text-gray-300">Años de experiencia</p>
                    </div>
                    <div className="text-center p-6 bg-gray-900/50 rounded-lg">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">10+</div>
                      <p className="text-gray-300">Proyectos completados</p>
                    </div>
                    <div className="text-center p-6 bg-gray-900/50 rounded-lg">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">5+</div>
                      <p className="text-gray-300">Especialistas certificados</p>
                    </div>
                    <div className="text-center p-6 bg-gray-900/50 rounded-lg">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
                      <p className="text-gray-300">Clientes satisfechos</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gray-900/50 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-4">Nuestros valores</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        <span className="ml-2 text-gray-300">Innovación constante</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        <span className="ml-2 text-gray-300">Excelencia en el servicio</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        <span className="ml-2 text-gray-300">Integridad y transparencia</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        <span className="ml-2 text-gray-300">Compromiso con resultados</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección FAQ - Mejorada con mejor diseño y animaciones */}
        <section id="faq" className="w-full py-16 md:py-24 lg:py-32 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[1800px]">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block px-3 py-1 bg-orange-500/10 rounded-full text-orange-400 text-sm font-medium mb-4">
                PREGUNTAS FRECUENTES
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Resolvemos sus dudas</h2>
              <p className="text-gray-300 text-lg">
                Resuelva sus dudas con esta guía de respuestas a las preguntas más frecuentes sobre nuestros servicios y procesos.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 open:shadow-xl"
                  >
                    <summary className="flex items-center justify-between p-6 text-lg font-semibold text-white cursor-pointer list-none">
                      {faq.pregunta}
                      <div className="relative ml-4 flex-shrink-0 h-5 w-5">
                        <div className="absolute inset-0 transform group-open:rotate-180 transition-transform duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </summary>
                    <div className="px-6 pb-6 text-gray-300">
                      <div className="h-px w-full bg-gray-700 mb-6"></div>
                      <p>{faq.respuesta}</p>
                    </div>
                  </details>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-400 mb-6">¿No encuentra la respuesta que busca?</p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:shadow-yellow-500/20 transform transition-all duration-300 hover:-translate-y-1"
                >
                  Contáctenos
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Link
        href="/chat-app"
        className="
        fixed bottom-16 right-4
        z-50
        flex items-center justify-center
        bg-gradient-to-r from-blue-600 to-blue-500
        text-white font-bold
        rounded-full
        shadow-lg hover:shadow-blue-500/30
        transform transition-all duration-300 hover:-translate-y-1
        px-4 py-3
        text-sm
      "
      >
        <MessageSquare className="h-5 w-5 mr-0 md:mr-2" />
        <span className="hidden md:inline">Acceder a la aplicación de chats</span>
      </Link>
      {/* <AppSelector /> */}
      <Footer />
    </div>
  )
}

