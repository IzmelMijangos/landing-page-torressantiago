"use client"

import type React from "react"

import { useState, useEffect, useRef, type FormEvent } from "react"
import Link from "next/link"
import { X, Send, Loader2 } from "lucide-react"
import { useOnClickOutside } from "@/hooks/use-click-outside"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  selectedService?: string | null
}

export default function Modal({ isOpen, onClose, selectedService }: ModalProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    description: "",
    serviceType: "",
    agree: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef<HTMLInputElement>(null)

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

  // Enfocar el primer campo al abrir
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

  // Resetear el estado del formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormState({
          name: "",
          email: "",
          description: "",
          serviceType: "",
          agree: false,
        })
        setFormErrors({})
        setSubmitted(false)
      }, 300)
    } else if (selectedService) {
      setFormState((prev) => ({
        ...prev,
        serviceType: selectedService,
      }))
    }
  }, [isOpen, selectedService])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined
  
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  
    // Limpiar error al editar
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formState.name.trim()) {
      errors.name = "El nombre es requerido"
    }

    if (!formState.email.trim()) {
      errors.email = "El correo electrónico es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.email = "Ingrese un correo electrónico válido"
    }

    if (!formState.serviceType) {
      errors.serviceType = "El tipo de servicio es requerido"
    }


    if (!formState.agree) {
      errors.agree = "Debe aceptar los términos y condiciones"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulación de envío de formulario
      const res = await fetch('/api/send_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      
      if (!res.ok) throw new Error('Error al enviar correo')
      
      const data = await res.json()

      setSubmitted(true)
    } catch (error) {
      setFormErrors({
        submit: "Hubo un error al enviar el formulario. Por favor, inténtelo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay con animación */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Contenedor del modal con animación */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 sm:p-8 text-black"
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
            Solicita tu Cotización
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Completa el formulario y nos pondremos en contacto contigo a la brevedad.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-lg bg-green-50 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">¡Solicitud enviada!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Gracias por contactarnos. Revisaremos tu solicitud y te responderemos lo antes posible.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                ref={initialFocusRef}
                value={formState.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  formErrors.name ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm`}
                placeholder="Juan Pérez"
              />
              {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                Tipo de Servicio
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formState.serviceType || ""}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  formErrors.serviceType ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm`}
              >
                <option value="" disabled>
                  Selecciona un servicio
                </option>
                <option value="Desarrollo Web">Desarrollo Web</option>
                <option value="Chatbots">Chatbots</option>
                <option value="Desarrollo de aplicaciones móviles">Desarrollo de aplicaciones móviles</option>
                <option value="Consultoría TI">Consultoría TI</option>
                <option value="Tratamiento de Datos">Tratamiento de Datos</option>
                <option value="Ciberseguridad">Ciberseguridad</option>
                <option value="Otros">Otro</option>
              </select>
              {formErrors.serviceType && <p className="mt-1 text-xs text-red-600">{formErrors.serviceType}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  formErrors.email ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm`}
                placeholder="correo@ejemplo.com"
              />
              {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción del Proyecto
              </label>
              <textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                rows={4}
                className={`mt-1 block w-full rounded-md border ${
                  formErrors.description ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm`}
                placeholder="Describe brevemente tu proyecto y necesidades..."
              ></textarea>
              {formErrors.description && <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>}
            </div>

            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  checked={formState.agree}
                  onChange={handleChange}
                  className={`h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 ${
                    formErrors.agree ? "border-red-300" : ""
                  }`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agree" className="font-medium text-gray-700">
                  Acepto los{" "}
                  <Link href="/terms" className="text-yellow-600 hover:text-yellow-500 hover:underline">
                    términos y condiciones
                  </Link>
                </label>
                {formErrors.agree && <p className="mt-1 text-xs text-red-600">{formErrors.agree}</p>}
              </div>
            </div>

            {formErrors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{formErrors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-yellow-500 to-yellow-400 px-4 py-2 text-base font-medium text-gray-900 shadow-sm hover:from-yellow-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-70 sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
