"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { ChevronRight, Lock, Shield, Eye, Database, Clock, AlertCircle } from "lucide-react"
import Header_v2 from "../components/Header_v2"
export default function Privacy() {
  const [activeSection, setActiveSection] = useState("introduction")

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const lastUpdated = "15 de abril de 2024"

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-gray-950 to-gray-900 text-gray-50">
      <Header_v2 />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-16 border-b border-gray-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/10 via-gray-900 to-gray-950 z-0"></div>
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block px-3 py-1 bg-blue-500/10 rounded-full text-blue-400 text-sm font-medium mb-4">
                DOCUMENTOS LEGALES
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Política de Privacidad</h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Este documento describe cómo recopilamos, usamos y protegemos su información personal cuando utiliza
                nuestros servicios y sitio web.
              </p>
              <div className="mt-6 text-sm text-gray-400 flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                Última actualización: {lastUpdated}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Sidebar Navigation */}
              <div className="lg:w-1/4">
                <div className="sticky top-24 bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-blue-400" />
                    Contenido
                  </h3>
                  <nav className="space-y-1">
                    {[
                      { id: "introduction", label: "Introducción" },
                      { id: "information", label: "Información que recopilamos" },
                      { id: "usage", label: "Uso de la información" },
                      { id: "sharing", label: "Compartir información" },
                      { id: "cookies", label: "Cookies y tecnologías similares" },
                      { id: "security", label: "Seguridad de datos" },
                      { id: "rights", label: "Sus derechos" },
                      { id: "children", label: "Privacidad de menores" },
                      { id: "changes", label: "Cambios a esta política" },
                      { id: "contact", label: "Contacto" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm transition-colors ${
                          activeSection === item.id
                            ? "bg-blue-500/20 text-blue-400 font-medium"
                            : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        }`}
                      >
                        <ChevronRight
                          className={`h-4 w-4 mr-2 transition-transform ${
                            activeSection === item.id ? "rotate-90 text-blue-400" : ""
                          }`}
                        />
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="ml-3 text-sm text-gray-300">
                        Si tiene alguna pregunta sobre nuestra política de privacidad, por favor{" "}
                        <Link href="/contacto" className="text-blue-400 hover:underline">
                          contáctenos
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:w-3/4">
                <div className="prose prose-lg prose-invert max-w-none">
                  <section id="introduction" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Lock className="h-4 w-4 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Introducción</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Torres Santiago Soluciones Inteligentes ("nosotros", "nuestro", "nos") se compromete a proteger
                        su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y
                        salvaguardamos su información cuando visita nuestro sitio web o utiliza nuestros servicios.
                      </p>
                      <p className="text-gray-300">
                        Por favor, lea esta política de privacidad cuidadosamente. Si no está de acuerdo con los
                        términos de esta política de privacidad, por favor absténgase de utilizar nuestro sitio web y
                        nuestros servicios.
                      </p>
                      <p className="text-gray-300">
                        Nos reservamos el derecho de hacer cambios a esta Política de Privacidad en cualquier momento y
                        por cualquier razón. Le notificaremos sobre cualquier cambio actualizando la fecha de "Última
                        actualización" de esta Política de Privacidad.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="information" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Database className="h-4 w-4 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Información que recopilamos</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Podemos recopilar información personal que usted nos proporciona voluntariamente cuando se
                        registra en nuestro sitio web, expresa interés en obtener información sobre nosotros o nuestros
                        productos y servicios, participa en actividades en nuestro sitio web o nos contacta.
                      </p>
                      <p className="text-gray-300">La información personal que recopilamos puede incluir:</p>
                      <ul className="space-y-3 text-gray-300">
                        <li>
                          <strong className="text-white">Información de contacto</strong>: como su nombre, dirección de
                          correo electrónico, dirección postal, número de teléfono y otros datos de contacto similares.
                        </li>
                        <li>
                          <strong className="text-white">Información comercial</strong>: como el nombre de su empresa,
                          cargo, departamento y dirección física de la empresa.
                        </li>
                        <li>
                          <strong className="text-white">Información de credenciales</strong>: como contraseñas, pistas
                          de contraseña e información de seguridad similar utilizada para la autenticación y el acceso a
                          la cuenta.
                        </li>
                        <li>
                          <strong className="text-white">Información de pago</strong>: como datos de instrumentos de
                          pago, como números de tarjeta de crédito, fechas de vencimiento y códigos de seguridad.
                        </li>
                        <li>
                          <strong className="text-white">Información de uso</strong>: como información sobre cómo usted
                          usa nuestro sitio web, productos y servicios.
                        </li>
                      </ul>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="usage" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Eye className="h-4 w-4 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Uso de la información</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Utilizamos la información personal recopilada a través de nuestro sitio web para una variedad de
                        propósitos comerciales descritos a continuación. Procesamos su información personal para estos
                        fines en base a nuestros intereses comerciales legítimos, con el fin de celebrar o ejecutar un
                        contrato con usted, con su consentimiento, y/o para cumplir con nuestras obligaciones legales.
                      </p>
                      <p className="text-gray-300">Utilizamos la información que recopilamos o recibimos para:</p>
                      <ul className="space-y-3 text-gray-300">
                        <li>Facilitar la creación y gestión de su cuenta.</li>
                        <li>Entregar los servicios o productos solicitados.</li>
                        <li>Responder a consultas, solicitudes, preguntas y/o otras comunicaciones.</li>
                        <li>
                          Enviar información administrativa como confirmaciones, facturas, avisos técnicos,
                          actualizaciones, alertas de seguridad y mensajes de soporte y administrativos.
                        </li>
                        <li>Procesar sus transacciones financieras.</li>
                        <li>
                          Prevenir actividades fraudulentas, monitorear contra el robo y proteger contra actividades
                          criminales.
                        </li>
                        <li>
                          Para cumplir con nuestras obligaciones legales y resolver cualquier disputa que podamos tener.
                        </li>
                      </ul>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="sharing" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Shield className="h-4 w-4 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Compartir información</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Podemos compartir información en situaciones específicas descritas a continuación:
                      </p>
                      <ul className="space-y-3 text-gray-300">
                        <li>
                          <strong className="text-white">Proveedores de servicios</strong>: Podemos compartir su
                          información con proveedores de servicios externos que utilizamos para apoyar nuestro negocio.
                        </li>
                        <li>
                          <strong className="text-white">Transferencias de negocios</strong>: Podemos compartir o
                          transferir su información en relación con, o durante las negociaciones de, cualquier fusión,
                          venta de activos de la empresa, financiamiento o adquisición de todo o una parte de nuestro
                          negocio a otra empresa.
                        </li>
                        <li>
                          <strong className="text-white">Con su consentimiento</strong>: Podemos divulgar su información
                          personal para cualquier otro propósito con su consentimiento.
                        </li>
                        <li>
                          <strong className="text-white">Obligaciones legales</strong>: Podemos divulgar su información
                          cuando sea legalmente requerido para cumplir con la ley aplicable, solicitudes
                          gubernamentales, un procedimiento judicial, orden judicial o proceso legal.
                        </li>
                        <li>
                          <strong className="text-white">Intereses vitales y protecciones legales</strong>: Podemos
                          divulgar su información cuando creemos que es necesario investigar, prevenir o tomar medidas
                          con respecto a posibles violaciones de nuestras políticas, sospecha de fraude, situaciones que
                          involucren amenazas potenciales a la seguridad de cualquier persona y actividades ilegales, o
                          como evidencia en litigios en los que estamos involucrados.
                        </li>
                      </ul>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="cookies" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Database className="h-4 w-4 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Cookies y tecnologías similares</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Podemos utilizar cookies y tecnologías de seguimiento similares (como web beacons y pixels) para
                        acceder o almacenar información. La información específica sobre cómo utilizamos dichas
                        tecnologías y cómo puede rechazar ciertas cookies se establece en nuestra Política de Cookies.
                      </p>
                      <p className="text-gray-300">Utilizamos cookies para los siguientes propósitos:</p>
                      <ul className="space-y-3 text-gray-300">
                        <li>
                          <strong className="text-white">Cookies necesarias</strong>: Estas cookies son esenciales para
                          proporcionarle los servicios disponibles a través de nuestro sitio web y para permitirle
                          utilizar algunas de sus funciones.
                        </li>
                        <li>
                          <strong className="text-white">Cookies de funcionalidad</strong>: Estas cookies nos permiten
                          recordar las elecciones que hace cuando utiliza nuestro sitio web, como recordar sus
                          preferencias de inicio de sesión o preferencias de idioma.
                        </li>
                        <li>
                          <strong className="text-white">Cookies analíticas y de rendimiento</strong>: Estas cookies se
                          utilizan para recopilar información sobre el tráfico a nuestro sitio web y cómo los usuarios
                          utilizan nuestro sitio web.
                        </li>
                      </ul>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="security" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Shield className="h-4 w-4 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Seguridad de datos</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Hemos implementado medidas de seguridad técnicas y organizativas apropiadas diseñadas para
                        proteger la seguridad de cualquier información personal que procesamos. Sin embargo, a pesar de
                        nuestras salvaguardas y esfuerzos para asegurar su información, ninguna transmisión electrónica
                        a través de Internet o tecnología de almacenamiento de información puede garantizarse como 100%
                        segura, por lo que no podemos prometer o garantizar que hackers, ciberdelincuentes u otros
                        terceros no autorizados no puedan burlar nuestra seguridad y recopilar, acceder, robar o
                        modificar indebidamente su información.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="rights" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Eye className="h-4 w-4 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Sus derechos</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información
                        personal, como el derecho a solicitar acceso a su información, rectificar o borrar su
                        información, oponerse al procesamiento de su información, y portabilidad de datos.
                      </p>
                      <p className="text-gray-300">
                        Si desea ejercer cualquiera de estos derechos, por favor contáctenos utilizando los detalles
                        proporcionados en la sección "Contacto" a continuación.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="children" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Shield className="h-4 w-4 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Privacidad de menores</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Nuestro sitio web no está dirigido a personas menores de 18 años. No recopilamos a sabiendas
                        información personal de niños menores de 18 años. Si es padre o tutor y sabe que su hijo nos ha
                        proporcionado datos personales, por favor contáctenos. Si nos damos cuenta de que hemos
                        recopilado datos personales de niños sin verificación del consentimiento parental, tomamos
                        medidas para eliminar esa información de nuestros servidores.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="changes" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Cambios a esta política</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Podemos actualizar esta política de privacidad de vez en cuando. La versión actualizada será
                        indicada por una fecha de "Última actualización" actualizada y la versión actualizada entrará en
                        vigencia tan pronto como sea accesible. Si realizamos cambios materiales a esta política de
                        privacidad, podemos notificarle ya sea publicando un aviso de dichos cambios o enviándole
                        directamente una notificación. Le recomendamos que revise esta política de privacidad con
                        frecuencia para estar informado de cómo estamos protegiendo su información.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="contact" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Lock className="h-4 w-4 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Contacto</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Si tiene preguntas o comentarios sobre esta política de privacidad, puede contactarnos en:
                      </p>
                      <ul className="space-y-3 text-gray-300">
                        <li>
                          <strong className="text-white">Email</strong>: contacto.torressantiago@gmail.com
                        </li>
                        <li>
                          <strong className="text-white">Teléfono</strong>: +52 951 648 2395
                        </li>
                        <li>
                          <strong className="text-white">Dirección</strong>: Av. Ferrocarril 40-A, Sección Quinta,
                          Tlacolula de Matamotos, Oaxaca, 70400
                        </li>
                      </ul>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 border-t border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Su privacidad es importante para nosotros
                </h2>
                <p className="text-gray-300 mb-8">
                  Si tiene alguna pregunta sobre cómo manejamos sus datos personales o desea ejercer alguno de sus
                  derechos, no dude en contactarnos.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/contacto"
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors duration-300"
                  >
                    Contáctenos
                  </Link>
                  <Link
                    href="/terms"
                    className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Ver términos del servicio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
