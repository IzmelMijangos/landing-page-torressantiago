"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import { X } from "lucide-react"
import { useOnClickOutside } from "@/hooks/use-click-outside"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

export default function InfoModal({ isOpen, onClose, title, children, size = "md" }: InfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef<HTMLButtonElement>(null)

  // Hook personalizado para cerrar al hacer clic fuera del modal
  useOnClickOutside(modalRef, isOpen ? onClose : () => {})

  // Manejar tecla Escape para cerrar el modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isOpen, onClose])

  // Enfocar el botón de cierre al abrir
  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      setTimeout(() => initialFocusRef.current?.focus(), 100)
    }

    // Bloquear scroll del body cuando el modal está abierto
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  }

  return  ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay con animación */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Contenedor del modal con animación */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} transform rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-2xl transition-all duration-300 sm:p-8`}
      >
        {/* Botón de cierre */}
        <button
          ref={initialFocusRef}
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-white">
            {title}
          </h2>
        </div>

        <div className="text-gray-300 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">{children}</div>
      </div>
    </div>,
    document.body
  )
}
