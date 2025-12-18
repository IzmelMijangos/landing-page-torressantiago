"use client"

import Link from "next/link"
import { Mail, MapPin, Clock, ChevronRight } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import NewsletterSubscribe from "@/app/components/lead-capture/NewsletterSubscribe";

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-black text-gray-300 border-t border-gray-800">
      {/* Sección principal del footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Columna 1: Navegación Principal */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Navegación</h4>
            <ul className="space-y-3">
              <li className="transition-transform hover:translate-x-1">
                <Link href="/" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Inicio</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/servicios" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Servicios</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/casos-de-estudio" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Proyectos</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/blog" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Blog</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 2: Servicios Destacados */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Servicios</h4>
            <ul className="space-y-3">
              <li className="transition-transform hover:translate-x-1">
                <Link href="/servicios/desarrollo-web" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Desarrollo Web</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/servicios/apps-moviles" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Apps Móviles</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/servicios/chatbots-inteligentes" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Chatbots IA</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/servicios/automatizacion-ia" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Automatización IA</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Contacto</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="https://wa.me/529513183885?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20sus%20servicios."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center group"
                >
                  <FaWhatsapp className="h-5 w-5 mr-3 text-yellow-400" />
                  <span className="text-sm group-hover:text-yellow-400">+52 951 318 3885</span>
                </Link>
              </li>
              <li>
                <Link href="mailto:contacto.torressantiago@gmail.com" className="flex items-center group">
                  <Mail className="h-5 w-5 mr-3 text-yellow-400" />
                  <span className="text-sm group-hover:text-yellow-400">contacto.torressantiago@gmail.com</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.google.com/maps?q=Av.+Ferrocarril+40+A,+Quinta+Secc,+70400+Tlacolula+de+Matamoros,+Oax."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start group"
                >
                  <MapPin className="h-5 w-5 mr-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm group-hover:text-yellow-400">
                    Tlacolula, Oaxaca
                  </span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-yellow-400" />
                  <span className="text-sm">
                    Lun - Vie: 9:00 AM - 6:00 PM
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Columna 4: Recursos */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Recursos</h4>
            <ul className="space-y-3">
              <li className="transition-transform hover:translate-x-1">
                <Link href="/blog" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Blog Tech</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/soluciones/retail" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Soluciones por Industria</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/terms" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Términos de Servicio</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/privacy" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Política de Privacidad</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSubscribe
        variant="footer"
        title="Mantente actualizado"
        description="Recibe tips de tecnología directo en tu inbox"
      />

      {/* Copyright */}
      <div className="border-t border-gray-800 py-6 bg-black/50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-sm text-gray-500">
            &copy; {currentYear} Torres Santiago Soluciones Inteligentes. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
