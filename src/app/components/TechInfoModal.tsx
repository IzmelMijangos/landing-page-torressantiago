"use client"

import { useState } from "react"
import { ChevronRight, Zap, Cpu, Globe, Lock, Database, Cloud } from "lucide-react"
import InfoModal from "./InfoModal"

interface TechInfoModalProps {
  onRequestQuote?: () => void
}

export default function TechInfoModal({ onRequestQuote }: TechInfoModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Datos de tecnologías (simulados)
  const technologies = [
    {
      name: "Inteligencia Artificial",
      icon: <Cpu className="h-8 w-8 text-purple-400" />,
      description:
        "Implementamos soluciones de IA para automatizar procesos, analizar datos y mejorar la toma de decisiones. Nuestras soluciones de IA pueden ayudar a su empresa a identificar patrones, predecir tendencias y optimizar operaciones.",
      applications: [
        "Chatbots y asistentes virtuales",
        "Análisis predictivo",
        "Reconocimiento de imágenes y voz",
        "Automatización de procesos",
        "Personalización de experiencias de usuario",
      ],
    },
    {
      name: "Blockchain",
      icon: <Lock className="h-8 w-8 text-blue-400" />,
      description:
        "Utilizamos tecnología blockchain para crear soluciones seguras, transparentes y descentralizadas. Desde contratos inteligentes hasta sistemas de verificación, nuestras soluciones blockchain pueden transformar la forma en que su empresa gestiona datos y transacciones.",
      applications: [
        "Contratos inteligentes",
        "Cadenas de suministro transparentes",
        "Sistemas de verificación de identidad",
        "Tokenización de activos",
        "Sistemas de votación seguros",
      ],
    },
    {
      name: "Internet de las Cosas (IoT)",
      icon: <Globe className="h-8 w-8 text-green-400" />,
      description:
        "Conectamos dispositivos y sistemas para crear entornos inteligentes que mejoran la eficiencia y la experiencia del usuario. Nuestras soluciones IoT pueden ayudar a su empresa a recopilar datos en tiempo real, automatizar procesos y optimizar recursos.",
      applications: [
        "Monitoreo remoto de equipos",
        "Automatización de edificios",
        "Gestión de flotas y logística",
        "Agricultura inteligente",
        "Ciudades inteligentes",
      ],
    },
    {
      name: "Computación en la Nube",
      icon: <Cloud className="h-8 w-8 text-blue-400" />,
      description:
        "Aprovechamos el poder de la nube para crear soluciones escalables, flexibles y accesibles desde cualquier lugar. Nuestras soluciones en la nube pueden ayudar a su empresa a reducir costos, aumentar la agilidad y mejorar la colaboración.",
      applications: [
        "Infraestructura como servicio (IaaS)",
        "Plataforma como servicio (PaaS)",
        "Software como servicio (SaaS)",
        "Almacenamiento y respaldo en la nube",
        "Entornos de desarrollo colaborativos",
      ],
    },
    {
      name: "Big Data",
      icon: <Database className="h-8 w-8 text-yellow-400" />,
      description:
        "Transformamos grandes volúmenes de datos en información valiosa para la toma de decisiones. Nuestras soluciones de Big Data pueden ayudar a su empresa a descubrir insights ocultos, identificar oportunidades y optimizar operaciones.",
      applications: [
        "Análisis de comportamiento de clientes",
        "Optimización de operaciones",
        "Detección de fraudes",
        "Personalización de marketing",
        "Investigación y desarrollo",
      ],
    },
    {
      name: "Realidad Aumentada y Virtual",
      icon: <Zap className="h-8 w-8 text-pink-400" />,
      description:
        "Creamos experiencias inmersivas que transforman la forma en que los usuarios interactúan con productos y servicios. Nuestras soluciones de RA/RV pueden ayudar a su empresa a mejorar la formación, el marketing y la experiencia del cliente.",
      applications: [
        "Formación y capacitación inmersiva",
        "Visualización de productos en 3D",
        "Configuradores de productos interactivos",
        "Turismo virtual",
        "Asistencia remota con RA",
      ],
    },
  ]

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        Conocer más <ChevronRight className="h-4 w-4 ml-1" />
      </button>

      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tecnología de Vanguardia" size="lg">
        <div className="space-y-8">
          <p className="text-lg text-gray-300">
            En Torres Santiago Soluciones Inteligentes, nos mantenemos a la vanguardia de las últimas tendencias y
            avances tecnológicos. Integramos estas tecnologías innovadoras en nuestras soluciones para ayudar a nuestros
            clientes a mantenerse competitivos en un mundo digital en constante evolución.
          </p>

          <div className="space-y-8">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start">
                  <div className="bg-gray-700 p-3 rounded-lg mr-4">{tech.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{tech.name}</h3>
                    <p className="text-gray-300 mb-4">{tech.description}</p>

                    <h4 className="text-lg font-semibold text-white mb-2">Aplicaciones</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tech.applications.map((app, idx) => (
                        <li key={idx} className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-400/10 rounded-xl p-6 border border-yellow-500/30">
            <h3 className="text-xl font-bold text-white mb-4">¿Quiere implementar estas tecnologías en su negocio?</h3>
            <p className="text-gray-300 mb-4">
              Nuestro equipo de expertos puede ayudarle a identificar las tecnologías más adecuadas para su negocio y
              desarrollar una estrategia de implementación personalizada.
            </p>
            <button
              onClick={() => {
                setIsModalOpen(false)
                if (onRequestQuote) onRequestQuote()
              }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:shadow-yellow-500/20 transform transition-all duration-300 hover:-translate-y-1"
            >
              Solicitar asesoramiento
            </button>
          </div>
        </div>
      </InfoModal>
    </>
  )
}
