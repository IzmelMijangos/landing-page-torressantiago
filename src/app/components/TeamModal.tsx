"use client"

import { useState } from "react"
import Image from "next/image"
import { Linkedin, Twitter, Mail, ChevronRight } from "lucide-react"
import InfoModal from "./InfoModal"

export default function TeamModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Datos del equipo (simulados)
  const teamMembers = [
    
    {
      name: "Belén Aidee Santiago Marcial",
      position: "Co-Fundadora",
      bio: "Belén es una profesional con más de 3 años de experiencia en gestión de proyectos y DevOps. Su enfoque en la eficiencia y la comunicación efectiva ha sido clave para el éxito de Torres Santiago Soluciones Inteligentes.",
      image: "/avatares/belen.jpeg",
      social: {
        linkedin: "https://www.linkedin.com/in/belensantimar/",
        email: "belensantiamar@gmail.com",
      },
      skills: ["Gestión de Proyectos", "Comunicación", "Liderazgo", "Atención al Cliente"],
    },
    {
      name: "Izmel Angel Torres Mijangos",
      position: "Co-Fundador",
      bio: "Izmel es un experto en desarrollo de software con más de 5 años de experiencia. Su enfoque en la innovación y la calidad ha llevado a Torres Santiago Soluciones Inteligentes a ser un referente en el sector.",
      image: "/avatares/izmel.png",
      social: {
        linkedin: "https://www.linkedin.com/in/izmeltorres/",
        email: "tomiizmel@gmail.com",
      },
      skills: ["Arquitectura de Software", "Innovación", "Resolución de Problemas", "Trabajo en Equipo"],
    }
  ]

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        Conocer al equipo <ChevronRight className="h-4 w-4 ml-1" />
      </button>

      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuestro Equipo" size="xl">
        <div className="space-y-8">
          <p className="text-lg text-gray-300">
            En Torres Santiago Soluciones Inteligentes, contamos con un equipo de profesionales altamente capacitados y
            apasionados por la tecnología. Cada miembro aporta experiencia única y habilidades especializadas que nos
            permiten ofrecer soluciones innovadoras y de alta calidad.
          </p>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-yellow-400 mb-3">{member.position}</p>
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3 pt-3 border-t border-gray-700">
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 rounded-full text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
                      aria-label={`LinkedIn de ${member.name}`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href={`mailto:${member.social.email}`}
                      className="p-2 bg-gray-700 rounded-full text-gray-300 hover:bg-yellow-500 hover:text-white transition-colors"
                      aria-label={`Email de ${member.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">¿Quieres unirte a nuestro equipo?</h3>
            <p className="text-gray-300 mb-4">
              Siempre estamos buscando talentos apasionados por la tecnología y la innovación. Si te interesa formar
              parte de Torres Santiago Soluciones Inteligentes, envíanos tu CV.
            </p>
            <a
              href="mailto:careers@torressantiago.com"
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Enviar CV <Mail className="ml-2 h-4 w-4" />
            </a>
          </div> */}
        </div>
      </InfoModal>
    </>
  )
}
