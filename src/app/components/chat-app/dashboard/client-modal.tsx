"use client"

import type React from "react"

import { useState } from "react"
import { X, Save, Upload } from "lucide-react"
import { useRole } from "../auth/role-context"

type ClientModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ClientModal({ isOpen, onClose }: ClientModalProps) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [description, setDescription] = useState("")
  const [initialCredits, setInitialCredits] = useState(100)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const { addClient } = useRole()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validación básica
    if (!name || !slug) {
      setError("Por favor completa los campos obligatorios")
      return
    }

    // Validar que el slug sea válido (solo letras, números y guiones)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError("El slug solo puede contener letras minúsculas, números y guiones")
      return
    }

    setIsProcessing(true)

    // Crear el nuevo cliente
    const newClient = {
      name,
      slug,
      specialization: specialization || undefined,
      description: description || undefined,
      logo: undefined, // En una app real, aquí manejaríamos la subida de la imagen
      sales: 0,
      creditsUsed: 0,
      creditsTotal: initialCredits,
    }

    // Simular una llamada a la API
    setTimeout(() => {
      try {
        addClient(newClient)
        setIsProcessing(false)
        onClose()

        // Limpiar el formulario
        setName("")
        setSlug("")
        setSpecialization("")
        setDescription("")
        setInitialCredits(100)
      } catch (err) {
        setError("Error al crear el cliente. Intenta nuevamente.")
        setIsProcessing(false)
      }
    }, 800)
  }

  // Generar slug automáticamente a partir del nombre
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)

    // Solo actualizar el slug automáticamente si el usuario no lo ha modificado manualmente
    if (
      !slug ||
      slug ===
        name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
    ) {
      setSlug(
        newName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-dark-light animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Añadir nuevo cliente</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Crea un nuevo cliente para gestionar sus conversaciones
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre del cliente *
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
              placeholder="Ej: Pizza Express"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Slug (URL) *</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-dark dark:text-gray-400 dark:border-gray-600">
                /c/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, ""),
                  )
                }
                className="flex-1 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
                placeholder="pizza-express"
                required
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Solo letras minúsculas, números y guiones. Sin espacios.
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Especialización</label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
              placeholder="Ej: Restaurantes, Cafeterías, etc."
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
              placeholder="Breve descripción del cliente y su negocio"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Logo</label>
            <button
              type="button"
              onClick={() => document.getElementById("logo-upload")?.click()}
              className="w-full p-2 border border-dashed border-gray-300 rounded-md text-gray-500 dark:text-gray-400 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark flex items-center justify-center"
            >
              <Upload size={18} className="mr-2" />
              Subir logo
            </button>
            <input id="logo-upload" type="file" accept="image/*" className="hidden" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Recomendado: imagen cuadrada de al menos 200x200px
            </p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Créditos iniciales
            </label>
            <input
              type="number"
              value={initialCredits}
              onChange={(e) => setInitialCredits(Math.max(0, Number.parseInt(e.target.value) || 0))}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
              min="0"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Cantidad de créditos que se asignarán al cliente al crearlo
            </p>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-2 px-4 bg-accent hover:bg-accent-light text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Crear cliente
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
