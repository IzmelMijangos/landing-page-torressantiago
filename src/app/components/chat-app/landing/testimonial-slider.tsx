"use client"

import { useState, useEffect } from "react"
import TestimonialCard from "./testimonial-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    quote:
      "Chat App ha transformado nuestra atención al cliente. Ahora respondemos más rápido y no perdemos oportunidades de venta.",
    author: "María Rodríguez",
    role: "Gerente de Ventas",
    company: "TechSolutions",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "Desde que implementamos Chat App, nuestras conversiones aumentaron un 35%. La centralización de mensajes es clave.",
    author: "Carlos Méndez",
    role: "Director de Marketing",
    company: "GrowthAgency",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "La integración con WhatsApp y Messenger fue sencilla y ahora tenemos todo en un solo lugar. Excelente servicio.",
    author: "Laura Sánchez",
    role: "CEO",
    company: "InnovaTech",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-accent" : "bg-gray-300 dark:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-0 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-dark-light/80 shadow-md hover:bg-white dark:hover:bg-dark-light transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-0 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-dark-light/80 shadow-md hover:bg-white dark:hover:bg-dark-light transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
