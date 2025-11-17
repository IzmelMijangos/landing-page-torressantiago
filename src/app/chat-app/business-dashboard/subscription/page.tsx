"use client"

import { useState } from "react"
import { ArrowLeft, AlertTriangle, CheckCircle, Calendar, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../components/chat-app/auth/auth-context"
import Link from "next/link"

export default function SubscriptionManagement() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const router = useRouter()
  const { user, addCredits } = useAuth()

  // Datos de suscripción (en una app real vendrían de la API)
  const subscriptionData = {
    plan: "Profesional",
    price: 79,
    credits: 1000,
    nextBillingDate: "15 de mayo, 2025",
    startDate: "15 de abril, 2025",
    paymentMethod: "Visa terminada en 4242",
  }

  const handleCancelSubscription = () => {
    setIsProcessing(true)

    // Simular procesamiento de cancelación
    setTimeout(() => {
      setIsProcessing(false)
      setIsCancelled(true)
      setShowConfirmation(false)
    }, 1500)
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push("/chat-app/business-dashboard/credits")}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-lighter transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestionar suscripción</h1>
      </div>

      {isCancelled ? (
        <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 max-w-3xl animate-fade-in">
          <div className="flex items-center mb-4 text-green-600 dark:text-green-400">
            <CheckCircle size={24} className="mr-2" />
            <h2 className="text-xl font-semibold">Suscripción cancelada</h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Tu suscripción ha sido cancelada correctamente. Podrás seguir utilizando el servicio hasta el final del
            período facturado ({subscriptionData.nextBillingDate}).
          </p>

          <div className="bg-gray-50 dark:bg-dark p-4 rounded-md mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Si cambias de opinión, puedes reactivar tu suscripción en cualquier momento antes de que finalice el
              período actual.
            </p>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/chat-app/business-dashboard/credits"
              className="px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors"
            >
              Volver a planes
            </Link>

            <button className="px-4 py-2 border border-accent text-accent hover:bg-accent/10 font-medium rounded-md transition-colors">
              Reactivar suscripción
            </button>
          </div>
        </div>
      ) : showConfirmation ? (
        <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 max-w-3xl border border-red-200 dark:border-red-900/30 animate-fade-in">
          <div className="flex items-center mb-4 text-red-600 dark:text-red-400">
            <AlertTriangle size={24} className="mr-2" />
            <h2 className="text-xl font-semibold">Confirmar cancelación</h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            ¿Estás seguro de que deseas cancelar tu suscripción al plan {subscriptionData.plan}?
          </p>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-6">
            <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">Información importante:</h4>
            <ul className="list-disc pl-5 text-sm text-red-600 dark:text-red-300 space-y-1">
              <li>Tu suscripción seguirá activa hasta el {subscriptionData.nextBillingDate}.</li>
              <li>Después de esa fecha, no se te cobrará nuevamente.</li>
              <li>Perderás el acceso a los {subscriptionData.credits} créditos mensuales.</li>
              <li>Los créditos no utilizados se perderán al finalizar el período.</li>
              <li>Puedes reactivar tu suscripción en cualquier momento.</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleCancelSubscription}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Procesando...
                </>
              ) : (
                "Confirmar cancelación"
              )}
            </button>

            <button
              onClick={() => setShowConfirmation(false)}
              disabled={isProcessing}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-medium rounded-md transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 max-w-3xl animate-fade-in">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Detalles de la suscripción</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Plan actual</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{subscriptionData.plan}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Precio mensual</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">${subscriptionData.price} USD</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Créditos mensuales</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{subscriptionData.credits}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar size={18} className="mt-0.5 mr-2 text-accent" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de inicio</p>
                    <p className="text-gray-900 dark:text-white">{subscriptionData.startDate}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar size={18} className="mt-0.5 mr-2 text-accent" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Próxima facturación</p>
                    <p className="text-gray-900 dark:text-white">{subscriptionData.nextBillingDate}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CreditCard size={18} className="mt-0.5 mr-2 text-accent" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Método de pago</p>
                    <p className="text-gray-900 dark:text-white">{subscriptionData.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Acciones</h3>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/chat-app/business-dashboard/credits"
                    className="px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors"
                  >
                    Cambiar plan
                  </Link>

                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark font-medium rounded-md transition-colors">
                    Actualizar método de pago
                  </button>

                  <button
                    onClick={() => setShowConfirmation(true)}
                    className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-md transition-colors"
                  >
                    Cancelar suscripción
                  </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Si tienes alguna pregunta sobre tu suscripción, contacta a nuestro equipo de soporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
