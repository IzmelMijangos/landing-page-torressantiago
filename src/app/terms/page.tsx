"use client"

import React, { useState } from "react"
import Link from "next/link"
import Footer from "@/app/components/Footer"
import HeaderRedesign from "@/app/components/redesign/HeaderRedesign"
import { ChevronRight, FileText, Shield, Scale, Clock, AlertCircle } from 'lucide-react'

export default function Terms() {
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
      <HeaderRedesign />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-16 border-b border-gray-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-400/10 via-gray-900 to-gray-950 z-0"></div>
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block px-3 py-1 bg-yellow-500/10 rounded-full text-yellow-400 text-sm font-medium mb-4">
                DOCUMENTOS LEGALES
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Términos del Servicio</h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Este documento establece los términos y condiciones bajo los cuales puede utilizar nuestros servicios y
                sitio web. Por favor, léalo detenidamente.
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
                    <FileText className="h-5 w-5 mr-2 text-yellow-400" />
                    Contenido
                  </h3>
                  <nav className="space-y-1">
                    {[
                      { id: "introduction", label: "Introducción" },
                      { id: "definitions", label: "Definiciones" },
                      { id: "license", label: "Licencia de uso" },
                      { id: "restrictions", label: "Restricciones" },
                      { id: "content", label: "Su contenido" },
                      { id: "services", label: "Nuestros servicios" },
                      { id: "payments", label: "Pagos y facturación" },
                      { id: "termination", label: "Terminación" },
                      { id: "liability", label: "Limitación de responsabilidad" },
                      { id: "warranty", label: "Garantías" },
                      { id: "changes", label: "Cambios a los términos" },
                      { id: "contact", label: "Contacto" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm transition-colors ${
                          activeSection === item.id
                            ? "bg-yellow-500/20 text-yellow-400 font-medium"
                            : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        }`}
                      >
                        <ChevronRight
                          className={`h-4 w-4 mr-2 transition-transform ${
                            activeSection === item.id ? "rotate-90 text-yellow-400" : ""
                          }`}
                        />
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  <div className="mt-8 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="ml-3 text-sm text-gray-300">
                        Si tiene alguna pregunta sobre estos términos, por favor{" "}
                        <Link href="/contacto" className="text-yellow-400 hover:underline">
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
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Introducción</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Bienvenido a Torres Santiago Soluciones Inteligentes. Estos términos y condiciones describen las
                        reglas y regulaciones para el uso de nuestro sitio web y servicios ubicados en{" "}
                        <Link href="/" className="text-yellow-400 hover:underline">
                          www.torressantiago.com
                        </Link>
                        .
                      </p>
                      <p className="text-gray-300">
                        Al acceder a este sitio web o utilizar nuestros servicios, asumimos que aceptas estos términos y
                        condiciones en su totalidad. No continúes usando el sitio web o nuestros servicios si no aceptas
                        todos los términos y condiciones establecidos en esta página.
                      </p>
                      <p className="text-gray-300">
                        Los siguientes términos y condiciones rigen todo uso de nuestro sitio web y todos los servicios
                        disponibles en o a través del sitio web (colectivamente, los "Servicios"). Los Servicios son
                        propiedad y están operados por Torres Santiago Soluciones Inteligentes ("nosotros", "nuestro").
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="definitions" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <Scale className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Definiciones</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">Para los propósitos de estos Términos y Condiciones:</p>
                      <ul className="space-y-3 text-gray-300">
                        <li>
                          <strong className="text-white">Cliente</strong>: se refiere a cualquier persona o entidad que
                          contrate nuestros servicios.
                        </li>
                        <li>
                          <strong className="text-white">Contenido</strong>: se refiere a cualquier material (incluyendo
                          texto, imágenes, audio, video, etc.) que se publique, cargue, o de otra manera se ponga a
                          disposición a través de nuestros Servicios.
                        </li>
                        <li>
                          <strong className="text-white">Servicios</strong>: se refiere a todos los servicios
                          proporcionados por Torres Santiago Soluciones Inteligentes, incluyendo pero no limitado a
                          desarrollo web, chatbots, desarrollo de aplicaciones móviles, consultoría TI, tratamiento de
                          datos y ciberseguridad.
                        </li>
                        <li>
                          <strong className="text-white">Usuario</strong>: se refiere a cualquier persona que acceda o
                          utilice nuestro sitio web.
                        </li>
                      </ul>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="license" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <Shield className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Licencia de uso</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Sujeto a estos Términos, Torres Santiago Soluciones Inteligentes le otorga una licencia limitada,
                        no exclusiva, no transferible y revocable para usar nuestros Servicios para sus propósitos
                        comerciales o personales legítimos.
                      </p>
                      <p className="text-gray-300">
                        A menos que se indique lo contrario, todos los materiales, incluyendo, sin limitación, logotipos,
                        nombres de marca, imágenes, diseños, fotografías, clips de video, y material escrito que aparecen
                        como parte de nuestros Servicios son propiedad intelectual de Torres Santiago Soluciones
                        Inteligentes, protegidos por derechos de autor, marcas registradas y otras leyes de propiedad
                        intelectual.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="restrictions" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Restricciones</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">Usted acepta no:</p>
                      <ul className="space-y-3 text-gray-300">
                        <li>
                          Utilizar nuestros Servicios de cualquier manera que pueda dañar, deshabilitar, sobrecargar o
                          deteriorar los Servicios.
                        </li>
                        <li>
                          Utilizar cualquier robot, spider, u otro dispositivo automático, proceso o medio para acceder a
                          los Servicios para cualquier propósito, incluyendo monitoreo o copia de cualquier material en
                          los Servicios.
                        </li>
                        <li>
                          Introducir cualquier virus, troyano, gusano, bomba lógica u otro material malicioso o
                          tecnológicamente dañino.
                        </li>
                        <li>
                          Intentar obtener acceso no autorizado, interferir, dañar o interrumpir cualquier parte de los
                          Servicios, el servidor en el que se almacenan los Servicios, o cualquier servidor, computadora
                          o base de datos conectada a los Servicios.
                        </li>
                        <li>
                          Atacar los Servicios a través de un ataque de denegación de servicio o un ataque distribuido de
                          denegación de servicio.
                        </li>
                      </ul>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="content" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Su contenido</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Cuando proporciona contenido a través de nuestros Servicios, usted conserva la propiedad de
                        cualquier propiedad intelectual que posea sobre ese contenido. Al proporcionar contenido a través
                        de nuestros Servicios, usted nos otorga una licencia mundial, libre de regalías, no exclusiva,
                        transferible y sublicenciable para usar, reproducir, modificar, adaptar, publicar, traducir,
                        crear trabajos derivados, distribuir y mostrar dicho contenido en relación con la provisión de
                        nuestros Servicios.
                      </p>
                      <p className="text-gray-300">
                        Usted declara y garantiza que: (i) posee el contenido que proporciona a través de los Servicios o
                        tiene el derecho de otorgar los derechos y licencias descritos en estos Términos, y (ii) la
                        provisión de su contenido a través de los Servicios no infringe los derechos de privacidad,
                        derechos de publicidad, derechos de autor, derechos contractuales o cualquier otro derecho de
                        cualquier persona.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="services" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <Shield className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Nuestros servicios</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Torres Santiago Soluciones Inteligentes ofrece una variedad de servicios tecnológicos,
                        incluyendo, pero no limitado a, desarrollo web, chatbots, desarrollo de aplicaciones móviles,
                        consultoría TI, tratamiento de datos y ciberseguridad.
                      </p>
                      <p className="text-gray-300">
                        Nos reservamos el derecho de modificar, suspender o discontinuar, temporal o permanentemente,
                        cualquier parte de nuestros Servicios con o sin previo aviso. Usted acepta que no seremos
                        responsables ante usted o cualquier tercero por cualquier modificación, suspensión o
                        discontinuación de los Servicios.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="payments" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Pagos y facturación</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Para los servicios que requieren pago, proporcionaremos información clara sobre los montos a
                        pagar, los métodos de pago aceptados y los plazos de pago. Todos los pagos deben realizarse de
                        acuerdo con los términos especificados en la cotización o contrato correspondiente.
                      </p>
                      <p className="text-gray-300">
                        Nos reservamos el derecho de cambiar nuestros precios en cualquier momento, pero dichos cambios
                        no afectarán los acuerdos existentes a menos que se acuerde mutuamente por escrito.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="termination" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Terminación</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Podemos terminar o suspender su acceso a nuestros Servicios inmediatamente, sin previo aviso o
                        responsabilidad, por cualquier razón, incluyendo, sin limitación, si usted incumple estos
                        Términos.
                      </p>
                      <p className="text-gray-300">
                        Tras la terminación, su derecho a utilizar los Servicios cesará inmediatamente. Si desea terminar
                        su cuenta, puede simplemente dejar de usar nuestros Servicios.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="liability" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <Scale className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Limitación de responsabilidad</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        En ningún caso Torres Santiago Soluciones Inteligentes, ni sus directores, empleados, socios,
                        agentes, proveedores o afiliados, serán responsables por cualquier daño indirecto, incidental,
                        especial, consecuente o punitivo, incluyendo, sin limitación, pérdida de beneficios, datos, uso,
                        buena voluntad, u otras pérdidas intangibles, resultantes de (i) su acceso o uso o incapacidad
                        para acceder o usar los Servicios; (ii) cualquier conducta o contenido de cualquier tercero en
                        los Servicios; (iii) cualquier contenido obtenido de los Servicios; y (iv) acceso no autorizado,
                        uso o alteración de sus transmisiones o contenido, ya sea basado en garantía, contrato, agravio
                        (incluyendo negligencia) o cualquier otra teoría legal, ya sea que hayamos sido informados o no
                        de la posibilidad de tales daños.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="warranty" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <Shield className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Garantías</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Los Servicios se proporcionan "tal cual" y "según disponibilidad" sin ningún tipo de garantía, ya
                        sea expresa o implícita, incluyendo, pero no limitado a, garantías implícitas de comerciabilidad,
                        idoneidad para un propósito particular, no infracción o curso de rendimiento.
                      </p>
                      <p className="text-gray-300">
                        Torres Santiago Soluciones Inteligentes, sus subsidiarias, afiliados y sus licenciantes no
                        garantizan que a) los Servicios funcionarán ininterrumpidamente, de manera segura o estarán
                        disponibles en cualquier momento o ubicación; b) cualquier error o defecto será corregido; c) los
                        Servicios están libres de virus u otros componentes dañinos; o d) los resultados del uso de los
                        Servicios cumplirán con sus requisitos.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="changes" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Cambios a los términos</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en
                        cualquier momento. Si una revisión es material, intentaremos proporcionar al menos 30 días de
                        aviso antes de que los nuevos términos entren en vigencia. Lo que constituye un cambio material
                        será determinado a nuestra sola discreción.
                      </p>
                      <p className="text-gray-300">
                        Al continuar accediendo o utilizando nuestros Servicios después de que esas revisiones entren en
                        vigencia, usted acepta estar sujeto a los términos revisados. Si no está de acuerdo con los
                        nuevos términos, por favor deje de usar los Servicios.
                      </p>
                    </div>
                  </section>

                  <div className="h-px w-full bg-gray-800 my-10"></div>

                  <section id="contact" className="scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white m-0">Contacto</h2>
                    </div>
                    <div className="pl-11">
                      <p className="text-gray-300">
                        Si tiene alguna pregunta sobre estos Términos, por favor contáctenos:
                      </p>
                      <ul className="space-y-3 text-gray-300">
                        <li>
                          <strong className="text-white">Email</strong>: contacto.torressantiago@gmail.com
                        </li>
                        <li>
                          <strong className="text-white">Teléfono</strong>: +52 951 318 3885
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
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">¿Tiene alguna pregunta legal?</h2>
                <p className="text-gray-300 mb-8">
                  Nuestro equipo está disponible para aclarar cualquier duda sobre nuestros términos y condiciones o
                  política de privacidad.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/contacto"
                    className="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors duration-300"
                  >
                    Contáctenos
                  </Link>
                  <Link
                    href="/privacy"
                    className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Ver política de privacidad
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
