"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  MessageSquare,
  Film,
  ImageIcon,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"

interface AppItem {
  id: string
  name: string
  icon: React.ReactNode
  route: string
}

const apps: AppItem[] = [
  { id: "home", name: "Home", icon: <Home className="h-6 w-6" />, route: "/" },
  { id: "chat", name: "Chat", icon: <MessageSquare className="h-6 w-6" />, route: "/chat" },
  { id: "movies", name: "Movies", icon: <Film className="h-6 w-6" />, route: "/movies" },
  { id: "photos", name: "Photos", icon: <ImageIcon className="h-6 w-6" />, route: "/photos" },
  { id: "books", name: "Books", icon: <BookOpen className="h-6 w-6" />, route: "/books" },
  // Añade más apps aquí si lo necesitas
]

export const AppSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()
  const isMobile = useMobile()

  // Número de apps visibles alrededor del selector
  const visibleCount = 4
  // Angulo total (180° para media circunferencia) dividido por segmentos visibles
  const segmentAngle = 180 / (visibleCount - 1)
  // Radio para posicionar los íconos
  const radius = isMobile ? 80 : 120

  // Apps visibles en ventana deslizante
  const visibleApps = Array.from({ length: visibleCount }, (_, i) => {
    const idx = (activeIndex + i) % apps.length
    return { ...apps[idx], idx }
  })

  const toggleOpen = () => setIsOpen((open) => !open)
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + apps.length) % apps.length)
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % apps.length)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Contenedor relativo para centralizar radio y botones */}
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        {/* Iconos animados en media circunferencia */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {visibleApps.map((app, i) => {
                // Distribuir en arco de 180°, desde izquierda (180°) a derecha (0°)
                const angle = 180 - segmentAngle * i
                const rad = (angle * Math.PI) / 180
                const x = Math.cos(rad) * radius
                const y = -Math.sin(rad) * radius
                // El ícono en el centro de la ventana es el activo
                const isActive = i === Math.floor(visibleCount / 2)

                return (
                  <motion.button
                    key={app.id}
                    onClick={() => {
                      if (isActive) {
                        router.push(app.route)
                        setIsOpen(false)
                      } else {
                        setActiveIndex(app.idx)
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={
                      `absolute flex items-center justify-center rounded-full shadow-lg cursor-pointer transition-transform ` +
                      (isActive
                        ? `bg-yellow-500 text-gray-900 h-16 w-16 z-20`
                        : `bg-gray-700 text-white h-12 w-12 z-10`)
                    }
                    style={{
                      left: `calc(50% + ${x}px)`, // Centrar en X y desplazar
                      top: `calc(50% + ${y}px)`,  // Centrar en Y y desplazar
                      transform: "translate(-50%, -50%)", // Alinear punto medio
                    }}
                  >
                    {app.icon}
                    {isActive && <span className="text-xs mt-1 whitespace-nowrap">{app.name}</span>}
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flechas y botón central */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className="pointer-events-auto p-2 mr-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={toggleOpen}
            aria-expanded={isOpen}
            aria-label="Toggle apps"
            className="pointer-events-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Apps
          </button>
          <button
            onClick={handleNext}
            aria-label="Next"
            className="pointer-events-auto p-2 ml-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
