'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Clock, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function FooterRedesign() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Determinar si estamos en la homepage
  const isHomepage = pathname === "/" || pathname === "/redesign";

  // Función para manejar navegación inteligente
  const getNavigationHref = (section: string): string => {
    if (isHomepage) {
      // Si estamos en homepage, usar anchor links
      return `#${section}`;
    } else {
      // Si estamos en otra página, navegar a homepage con anchor
      return `/#${section}`;
    }
  };

  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-black text-gray-300 border-t border-gray-800">
      {/* Sección principal del footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Columna 1: Enlaces Rápidos */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li className="transition-transform hover:translate-x-1">
                <Link href="/servicios" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Nuestros Servicios</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/casos-de-estudio" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Casos de Éxito</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href="/blog" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Blog</span>
                </Link>
              </li>
              <li className="transition-transform hover:translate-x-1">
                <Link href={getNavigationHref("faq")} className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Preguntas Frecuentes</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 2: Servicios */}
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
                <Link href="/servicios/asesoria-estrategica" className="flex items-center text-sm group">
                  <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Asesoría Estratégica</span>
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
                  href="https://www.google.com/maps?q=Av.+Ferrocarril+40+A,+Quinta+Secc,+70400+Tlacolula+de+Matamoros,+Oax."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start group"
                >
                  <MapPin className="h-5 w-5 mr-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm group-hover:text-yellow-400">
                    Av. Ferrocarril 40 A,
                    <br />
                    Quinta Secc,
                    <br />
                    70400 Tlacolula de Matamoros, Oax.
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/529516482395?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20sus%20servicios."
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
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-yellow-400" />
                  <span className="text-sm">
                    Lun - Vie: 9:00 AM - 6:00 PM
                    <br />
                    Sábado: 9:00 AM - 2:00 PM
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Mantente Informado</h4>
            <div>
              <p className="text-sm mb-4">Suscríbete a nuestro boletín para recibir las últimas noticias y actualizaciones.</p>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-md transition-colors duration-300 text-sm"
                >
                  Suscribir
                </button>
              </form>
              <p className="text-xs mt-2 text-gray-500">
                Nos comprometemos a respetar tu privacidad. No compartiremos tu información.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección inferior del footer */}
      <div className="border-t border-gray-800 py-6 bg-black/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            &copy; {currentYear} Torres Santiago Soluciones Inteligentes. Todos los derechos reservados.
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="text-xs hover:text-yellow-400 transition-colors duration-300">
              Términos del servicio
            </Link>
            <Link href="/privacy" className="text-xs hover:text-yellow-400 transition-colors duration-300">
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
