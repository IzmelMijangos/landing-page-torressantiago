"use client"

import { useState } from "react"
import { ChevronRight, CheckCircle, Users, Briefcase, BarChart, Settings, Clock } from "lucide-react"
import InfoModal from "./InfoModal"

interface CustomSolutionsModalProps {
  onRequestQuote?: () => void
}

export default function CustomSolutionsModal({ onRequestQuote }: CustomSolutionsModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Datos de industrias (simulados)
  const industries = [
    {
      name: "Comercio Minorista",
      icon: <Briefcase className="h-6 w-6 text-blue-400" />,
      solutions: [
        "Plataformas de comercio electrónico",
        "Sistemas de gestión de inventario",
        "Análisis de comportamiento del cliente",
        "Chatbots para atención al cliente",
        "Aplicaciones móviles para fidelización",
      ],
    },
    {
      name: "Salud",
      icon: <Users className="h-6 w-6 text-green-400" />,
      solutions: [
        "Sistemas de gestión de pacientes",
        "Telemedicina",
        "Análisis de datos médicos",
        "Aplicaciones de seguimiento de salud",
        "Automatización de procesos administrativos",
      ],
    },
    {
      name: "Educación",
      icon: <Users className="h-6 w-6 text-yellow-400" />,
      solutions: [
        "Plataformas de aprendizaje en línea",
        "Sistemas de gestión académica",
        "Herramientas de colaboración virtual",
        "Análisis de rendimiento estudiantil",
        "Aplicaciones móviles educativas",
      ],
    },
    {
      name: "Finanzas",
      icon: <BarChart className="h-6 w-6 text-purple-400" />,
      solutions: [
        "Sistemas de gestión financiera",
        "Plataformas de pago en línea",
        "Análisis de riesgos",
        "Automatización de procesos contables",
        "Aplicaciones de gestión de inversiones",
      ],
    },
    {
      name: "Manufactura",
      icon: <Settings className="h-6 w-6 text-red-400" />,
      solutions: [
        "Sistemas de gestión de producción",
        "IoT para monitoreo de equipos",
        "Automatización de procesos industriales",
        "Análisis predictivo de mantenimiento",
        "Gestión de cadena de suministro",
      ],
    },
    {
      name: "Servicios Profesionales",
      icon: <Briefcase className="h-6 w-6 text-teal-400" />,
      solutions: [
        "Sistemas de gestión de clientes (CRM)",
        "Herramientas de colaboración",
        "Automatización de procesos administrativos",
        "Plataformas de gestión de proyectos",
        "Análisis de rendimiento empresarial",
      ],
    },
  ]

  // Datos de proceso (simulados)
  const process = [
    {
      step: 1,
      title: "Análisis de Necesidades",
      description:
        "Realizamos un análisis exhaustivo de sus necesidades y objetivos comerciales para comprender completamente sus requerimientos.",
      icon: <Users className="h-6 w-6 text-yellow-400" />,
    },
    {
      step: 2,
      title: "Diseño de Solución",
      description:
        "Diseñamos una solución personalizada que se adapta perfectamente a sus necesidades específicas y se alinea con sus objetivos.",
      icon: <Settings className="h-6 w-6 text-yellow-400" />,
    },
    {
      step: 3,
      title: "Desarrollo",
      description:
        "Desarrollamos la solución utilizando las tecnologías más adecuadas y siguiendo las mejores prácticas de la industria.",
      icon: <Briefcase className="h-6 w-6 text-yellow-400" />,
    },
    {
      step: 4,
      title: "Implementación",
      description:
        "Implementamos la solución en su entorno, asegurándonos de que se integre perfectamente con sus sistemas existentes.",
      icon: <BarChart className="h-6 w-6 text-yellow-400" />,
    },
    {
      step: 5,
      title: "Soporte Continuo",
      description:
        "Proporcionamos soporte continuo y mantenimiento para garantizar que su solución siga funcionando de manera óptima.",
      icon: <Clock className="h-6 w-6 text-yellow-400" />,
    },
  ]

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        Solicitar cotización <ChevronRight className="h-4 w-4 ml-1" />
      </button>

      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Soluciones a Medida" size="lg">
        <div className="space-y-8">
          <p className="text-lg text-gray-300">
            En Torres Santiago Soluciones Inteligentes, entendemos que cada negocio es único y tiene necesidades
            específicas. Por eso, desarrollamos soluciones personalizadas que se adaptan perfectamente a sus
            requerimientos y objetivos comerciales.
          </p>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Nuestro Proceso</h3>
            <div className="space-y-6">
              {process.map((item) => (
                <div key={item.step} className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </h4>
                    <p className="text-gray-300 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Soluciones por Industria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industries.map((industry, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white flex items-center mb-4">
                    {industry.icon}
                    <span className="ml-2">{industry.name}</span>
                  </h4>
                  <ul className="space-y-2">
                    {industry.solutions.map((solution, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-400/10 rounded-xl p-6 border border-yellow-500/30">
            <h3 className="text-xl font-bold text-white mb-4">¿Listo para comenzar?</h3>
            <p className="text-gray-300 mb-4">
              Contáctenos hoy mismo para discutir sus necesidades y descubrir cómo podemos ayudarle a alcanzar sus
              objetivos comerciales con nuestras soluciones personalizadas.
            </p>
            <button
              onClick={() => {
                setIsModalOpen(false)
                if (onRequestQuote) onRequestQuote()
              }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:shadow-yellow-500/20 transform transition-all duration-300 hover:-translate-y-1"
            >
              Solicitar cotización
            </button>
          </div>
        </div>
      </InfoModal>
    </>
  )
}
