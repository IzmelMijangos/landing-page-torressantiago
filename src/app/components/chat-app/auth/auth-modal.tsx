"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { X, Mail, Lock, User, AlertCircle, Building2, Store } from "lucide-react"
import { useAuth } from "./auth-context"

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  initialTab?: "login" | "signup"
  initialRole?: "business" | "enterprise-client" | "enterprise-admin"
}

export default function AuthModal({ isOpen, onClose, initialTab = "login", initialRole }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"business" | "enterprise-client" | "enterprise-admin">(initialRole || "business")
  const [localError, setLocalError] = useState("")
  const { login, signup, isLoading, authError, setAuthError } = useAuth()

  const [companyCode, setCompanyCode] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [isNewCompany, setIsNewCompany] = useState(false)
  const [availableCompanies, setAvailableCompanies] = useState([
    { id: 1, name: "TechSolutions Inc." },
    { id: 2, name: "Marketing Pro" },
    { id: 3, name: "Digital Agency" },
  ])
  const [selectedCompany, setSelectedCompany] = useState("")
  const searchParams = useSearchParams()

  // Ocultar errores automáticamente después de 5 segundos
  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => {setLocalError(""); setAuthError(null)}, 5000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  // Update role when initialRole prop changes
  useEffect(() => {
    if (initialRole) {
      setRole(initialRole)
    }
  }, [initialRole])

  useEffect(() => {
    // Detectar si hay un código de invitación en la URL
    const inviteCode = searchParams.get("invite")
    if (inviteCode) {
      // En una app real, verificaríamos este código con la API
      setCompanyCode(inviteCode)
      // Simulamos encontrar la empresa correspondiente
      const company = availableCompanies.find((c) => c.id.toString() === inviteCode)
      if (company) {
        setSelectedCompany(company.id.toString())
      }
    }
  }, [searchParams])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!email || !password) {
      setLocalError("Por favor completa todos los campos")
      return
    }

    if (activeTab === "signup") {
      if (!name) {
        setLocalError("Por favor ingresa tu nombre")
        return
      }

      if (role === "enterprise-client" && !isNewCompany && !selectedCompany && !companyCode) {
        setLocalError("Por favor selecciona una empresa")
        return
      }

      if (role === "enterprise-admin" && isNewCompany && !companyName) {
        setLocalError("Por favor ingresa el nombre de tu empresa")
        return
      }
    }

    try {
      if (activeTab === "login") {
        await login(email, password, role)
      } else {
        const registrationData = {
          email,
          password,
          name,
          role,
        }

        await signup(email, password, name, role, companyName, selectedCompany)
      }
    } catch (err) {
      setLocalError("Error de autenticación. " + (err as Error).message)
    }
  }

  const handleGoogleAuth = () => {
    // Mock Google OAuth
    login(`google@${role}.com`, "google-oauth", role)
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
          <div className="flex border-b dark:border-gray-700">
            <button
              className={`flex-1 py-3 font-medium ${activeTab === "login" ? "text-accent border-b-2 border-accent" : "text-gray-500 dark:text-gray-400"
                }`}
              onClick={() => setActiveTab("login")}
            >
              Iniciar sesión
            </button>
            <button
              className={`flex-1 py-3 font-medium ${activeTab === "signup" ? "text-accent border-b-2 border-accent" : "text-gray-500 dark:text-gray-400"
                }`}
              onClick={() => setActiveTab("signup")}
            >
              Crear cuenta
            </button>
          </div>
        </div>

        {(localError || authError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center justify-between dark:bg-red-900/30 dark:text-red-400">
            <div className="flex items-center">
              <AlertCircle size={18} className="mr-2" />
              {localError || authError}
            </div>
            <button
              onClick={() => { setLocalError(""); setAuthError(null) }}
              className="text-red-700 hover:text-red-900 dark:hover:text-red-200"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {activeTab === "signup" && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
                  placeholder="Tu nombre o nombre del negocio"
                />
              </div>
            </div>
          )}

          {activeTab === "signup" && (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                ¿Cómo quieres usar Chat App?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setRole("business")
                    setIsNewCompany(false)
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border ${role === "business"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark"
                    }`}
                >
                  <Store size={24} className="mb-2" />
                  <span className="text-sm font-medium">Para mi negocio</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole("enterprise-client")
                    setIsNewCompany(false)
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border ${role === "enterprise-client" || role === "enterprise-admin"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark"
                    }`}
                >
                  <Building2 size={24} className="mb-2" />
                  <span className="text-sm font-medium">Para empresas</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "signup" && (role === "enterprise-client" || role === "enterprise-admin")  && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Opciones de empresa
              </label>
              <div className="flex mb-3">
                <button
                  type="button"
                  onClick={() => {setIsNewCompany(false); setRole("enterprise-client") }}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-l-md ${!isNewCompany ? "bg-accent text-white" : "bg-gray-100 text-gray-700 dark:bg-dark dark:text-gray-300"
                    }`}
                >
                  Unirse a empresa
                </button>
                <button
                  type="button"
                  onClick={() => {setIsNewCompany(true); setRole("enterprise-admin") }}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-r-md ${isNewCompany ? "bg-accent text-white" : "bg-gray-100 text-gray-700 dark:bg-dark dark:text-gray-300"
                    }`}
                >
                  Crear empresa
                </button>
              </div>

              {isNewCompany ? (
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre de la empresa
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                      <Building2 size={18} />
                    </div>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>
              ) : companyCode ? (
                <div className="p-3 bg-accent/10 rounded-md mb-4">
                  <p className="text-sm text-accent">
                    <span className="font-medium">Invitación detectada:</span> Te estás uniendo a una empresa con el
                    código {companyCode}
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selecciona tu empresa
                  </label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Selecciona una empresa</option>
                    {availableCompanies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-accent hover:bg-accent-light text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Procesando..." : activeTab === "login" ? "Entrar" : "Crear cuenta"}
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300 dark:border-gray-700" />
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">o</span>
            <hr className="flex-1 border-gray-300 dark:border-gray-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors dark:bg-dark-lighter dark:border-gray-600 dark:text-gray-200 dark:hover:bg-dark"
          >
            Continuar con Google
          </button>
        </form>
      </div>
    </div>
  )
}
