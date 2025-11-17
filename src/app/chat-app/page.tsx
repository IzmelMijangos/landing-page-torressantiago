"use client"
import dynamic from "next/dynamic";
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageSquare, TrendingUp, Brain, Clock, ChevronRight, LogIn, ArrowRight, CheckCircle, Store, Building2 } from "lucide-react"
// import AuthModal from "../components/chat-app/auth/auth-modal"
const AuthModal = dynamic(() => import("../components/chat-app/auth/auth-modal"), {
  ssr: false,
});
import BenefitCard from "../components/chat-app/landing/benefit-card"
import TestimonialSlider from "../components/chat-app/landing/testimonial-slider"
import Footer from "../components/Footer"

export default function ChatCentral() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("signup")
  const [authModalRole, setAuthModalRole] = useState<"business" | "enterprise" | undefined>(undefined)

  const openAuthModal = (tab: "login" | "signup", role?: "business" | "enterprise", inviteCode?: string) => {
    setAuthModalTab(tab)
    setAuthModalRole(role)
    setIsAuthModalOpen(true)

    // Si hay un código de invitación, lo añadimos a la URL
    if (inviteCode) {
      // En una app real, actualizaríamos la URL con el código de invitación
      // para que pueda ser detectado por el AuthModal
    }
  }

  const benefits = [
    {
      icon: <MessageSquare size={24} />,
      title: "Menos clientes perdidos",
      description: "Centraliza todos tus canales de comunicación y no pierdas ninguna oportunidad de venta.",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Más ventas cerradas",
      description: "Responde más rápido y mejora tus tasas de conversión con una comunicación eficiente.",
    },
    {
      icon: <Clock size={24} />,
      title: "Menos estrés operativo",
      description: "Gestiona todos tus chats desde una sola plataforma y optimiza el tiempo de tu equipo.",
    },
    {
      icon: <Brain size={24} />,
      title: "Respuestas automáticas inteligentes",
      description: "Automatiza respuestas comunes y brinda atención 24/7 con nuestra IA.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-dark py-4 px-6">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <Link href="/chat-app" className="text-2xl font-bold text-accent">
            Chat App
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => openAuthModal("login")}
              className="text-white hover:text-accent transition-colors flex items-center"
            >
              <LogIn size={18} className="mr-1" />
              Iniciar sesión
            </button>
            <button
              onClick={() => openAuthModal("signup")}
              className="px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors"
            >
              Registrarse
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-dark to-dark-light text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                El superpoder de la IA <span className="text-accent">Ahora para tu negocio.</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300">Conecta WhatsApp, Messenger y Webchat en segundos.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => openAuthModal("signup")}
                  className="px-8 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors animate-slide-up flex items-center justify-center"
                >
                  Empezar gratis
                  <ChevronRight size={20} className="ml-2" />
                </button>
                <button
                  onClick={() => openAuthModal("login")}
                  className="px-8 py-3 bg-transparent border border-white hover:border-accent hover:text-accent text-white font-medium rounded-md transition-colors animate-slide-up flex items-center justify-center"
                >
                  <LogIn size={20} className="mr-2" />
                  Iniciar sesión
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in">
              <div className="relative w-full max-w-md h-80">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Chat App Dashboard"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-dark">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Cómo quieres usar <span className="text-accent">Chat App</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Elige la opción que mejor se adapte a tus necesidades y comienza a centralizar tus conversaciones hoy
              mismo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            <div className="bg-white dark:bg-dark-light rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="p-4 bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Store className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Para mi negocio</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ideal para pequeñas y medianas empresas que buscan mejorar su atención al cliente y aumentar sus
                ventas a través de una comunicación eficiente.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-accent mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Centraliza todos tus canales</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-accent mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Respuestas automáticas con IA</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-accent mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Estadísticas de conversión</span>
                </li>
              </ul>
              <div className="mt-auto">
                <button
                  onClick={() => openAuthModal("signup", "business")}
                  className="w-full py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors flex items-center justify-center"
                >
                  Comenzar como negocio
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-light rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="p-4 bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Para empresas</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Perfecto para agencias y empresas que quieren ofrecer servicios de chat centralizado a sus clientes,
                con gestión de múltiples cuentas.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-accent mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Gestión de múltiples clientes</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-accent mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Asignación de créditos</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-accent mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Personalización de marca</span>
                </li>
              </ul>
              <div className="mt-auto">
                <button
                  onClick={() => openAuthModal("signup", "enterprise")}
                  className="w-full py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors flex items-center justify-center"
                >
                  Comenzar como empresa
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-dark">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Todo lo que necesitas para <span className="text-accent">potenciar tus ventas</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} icon={benefit.icon} title={benefit.title} description={benefit.description} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={() => openAuthModal("signup")}
              className="px-8 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors animate-slide-up inline-flex items-center"
            >
              Probar ahora
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-dark-light">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Características <span className="text-accent">principales</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1 animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Integración con múltiples canales
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Conecta todos tus canales de comunicación en una sola plataforma. WhatsApp, Messenger, Instagram y chat
                web, todo en un solo lugar.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Configuración en menos de 5 minutos",
                  "Sin necesidad de conocimientos técnicos",
                  "Sincronización automática de mensajes",
                  "Historial completo de conversaciones",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle size={18} className="text-accent mr-2 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openAuthModal("signup")}
                className="px-6 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors flex items-center"
              >
                Conectar canales
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-full max-w-md h-64 md:h-80">
                <Image
                  src="/chat-app/Chat.png"
                  alt="Integración de canales"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-64 md:h-80">
                <Image
                  src="/chat-app/Chat-automatico.png"
                  alt="Respuestas automáticas"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Respuestas automáticas inteligentes
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Automatiza respuestas a preguntas frecuentes y brinda atención 24/7 con nuestra tecnología de IA
                avanzada.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Respuestas personalizadas según el cliente",
                  "Aprendizaje continuo basado en conversaciones",
                  "Transferencia inteligente a agentes humanos",
                  "Plantillas predefinidas para casos comunes",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle size={18} className="text-accent mr-2 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openAuthModal("signup")}
                className="px-6 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors flex items-center"
              >
                Probar respuestas automáticas
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-dark">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Lo que dicen nuestros <span className="text-accent">clientes</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <TestimonialSlider />
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={() => openAuthModal("signup")}
              className="px-8 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors animate-slide-up inline-flex items-center"
            >
              Únete a ellos
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-accent">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">¿Listo para centralizar tus conversaciones?</h2>
          <p className="text-xl mb-8 text-white/90">
            Comienza hoy mismo y experimenta la diferencia en tu atención al cliente y ventas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => openAuthModal("signup")}
              className="px-8 py-3 bg-white text-accent hover:bg-gray-100 font-medium rounded-md transition-colors flex items-center justify-center"
            >
              Crear cuenta gratis
              <ChevronRight size={20} className="ml-2" />
            </button>
            <button
              onClick={() => openAuthModal("login")}
              className="px-8 py-3 bg-transparent border border-white hover:bg-white/10 text-white font-medium rounded-md transition-colors flex items-center justify-center"
            >
              <LogIn size={20} className="mr-2" />
              Iniciar sesión
            </button>
          </div>
        </div>
      </section>
      <Footer />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialTab={authModalTab} />
    </div>
  )
}
