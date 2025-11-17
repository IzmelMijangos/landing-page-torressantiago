"use client"

import { useState } from "react"
import { CreditCard, Check, Calendar, Clock, Zap } from "lucide-react"
import { useAuth } from "../../../components/chat-app/auth/auth-context"

export default function Credits() {
  const [selectedPlan, setSelectedPlan] = useState<100 | 500 | 1000>(100)
  const [billingType, setBillingType] = useState<"onetime" | "monthly">("onetime")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCancelSubscription, setShowCancelSubscription] = useState(false)
  const { user, addCredits } = useAuth()

  // Planes de pago único
  const onetimePlans = [
    { credits: 100, price: 100 },
    { credits: 500, price: 300 },
    { credits: 1000, price: 450 },
  ]

  // Planes mensuales
  const monthlyPlans = [
    { name: "Básico", credits: 300, price: 150 },
    { name: "Profesional", credits: 1000, price: 300 },
    { name: "Empresarial", credits: 3000, price: 450 },
  ]

  const handlePurchase = () => {
    setIsProcessing(true)

    // Simular procesamiento de pago
    setTimeout(() => {
      if (billingType === "onetime") {
        addCredits(selectedPlan)
        alert(`¡Compra exitosa! Se han añadido ${selectedPlan} créditos a tu cuenta.`)
      } else {
        alert(`¡Suscripción exitosa al plan ${monthlyPlans.find((p) => p.credits === selectedPlan)?.name}!`)
      }
      setIsProcessing(false)
    }, 1500)
  }

  const handleCancelSubscription = () => {
    setIsProcessing(true)

    // Simular procesamiento de cancelación
    setTimeout(() => {
      alert("Tu suscripción ha sido cancelada. Podrás seguir usando el servicio hasta el final del período facturado.")
      setIsProcessing(false)
      setShowCancelSubscription(false)
      setBillingType("onetime") // Cambiar a pago único después de cancelar
    }, 1500)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Comprar créditos</h1>

      {/* Selector de tipo de facturación */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-dark-light rounded-full p-1 inline-flex shadow-md">
          <button
            onClick={() => setBillingType("onetime")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${billingType === "onetime"
                ? "bg-accent text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark"
              }`}
          >
            Pago único
          </button>
          <button
            onClick={() => setBillingType("monthly")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${billingType === "monthly"
                ? "bg-accent text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark"
              }`}
          >
            Mensualidad
          </button>
        </div>
      </div>

      {/* Planes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {billingType === "onetime"
          ? // Planes de pago único
          onetimePlans.map((plan) => (
            <div
              key={plan.credits}
              onClick={() => setSelectedPlan(plan.credits as 100 | 500 | 1000)}
              className={`bg-white dark:bg-dark-light rounded-lg shadow-md p-6 cursor-pointer transition-all ${selectedPlan === plan.credits ? "ring-2 ring-accent transform scale-105" : "hover:shadow-lg"
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.credits} créditos</h3>
                {selectedPlan === plan.credits && (
                  <div className="p-1 bg-accent rounded-full text-white">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-accent mb-2">
                ${plan.price} <span className="text-sm text-gray-500 dark:text-gray-400">MXN</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${(plan.price / plan.credits).toFixed(2)} por crédito
              </p>
            </div>
          ))
          : // Planes mensuales
          monthlyPlans.map((plan) => (
            <div
              key={plan.credits}
              onClick={() => setSelectedPlan(plan.credits as 100 | 500 | 1000)}
              className={`bg-white dark:bg-dark-light rounded-lg shadow-md p-6 cursor-pointer transition-all ${selectedPlan === plan.credits ? "ring-2 ring-accent transform scale-105" : "hover:shadow-lg"
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-accent">{plan.name}</span>
                {selectedPlan === plan.credits && (
                  <div className="p-1 bg-accent rounded-full text-white">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.credits} créditos/mes</h3>
              <p className="text-3xl font-bold text-accent mb-2">
                ${plan.price} <span className="text-sm text-gray-500 dark:text-gray-400">/mes</span>
              </p>
              <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={14} className="mr-1" />
                <span>Facturación mensual</span>
              </div>
            </div>
          ))}
      </div>

      {/* Resumen de compra */}
      <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 mb-6 max-w-3xl mx-auto">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Resumen de compra</h3>

        {billingType === "onetime" ? (
          <>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Plan seleccionado:</span>
              <span className="font-medium text-gray-900 dark:text-white">{selectedPlan} créditos</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-300">Precio total:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${onetimePlans.find((p) => p.credits === selectedPlan)?.price} MXN
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Plan seleccionado:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {monthlyPlans.find((p) => p.credits === selectedPlan)?.name}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Créditos mensuales:</span>
              <span className="font-medium text-gray-900 dark:text-white">{selectedPlan}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-300">Precio mensual:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${monthlyPlans.find((p) => p.credits === selectedPlan)?.price} MXN/mes
              </span>
            </div>
          </>
        )}

        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Procesando...
            </>
          ) : (
            <>
              {billingType === "onetime" ? (
                <>
                  <CreditCard size={20} className="mr-2" />
                  Pagar ahora
                </>
              ) : (
                <>
                  <Zap size={20} className="mr-2" />
                  Suscribirse ahora
                </>
              )}
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          {billingType === "monthly"
            ? "Puedes cancelar tu suscripción en cualquier momento"
            : "Los créditos no expiran y se acumulan con tu plan actual"}
        </p>
      </div>

      {/* Sección de cancelación de suscripción */}
      {billingType === "monthly" && !showCancelSubscription && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowCancelSubscription(true)}
            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline"
          >
            Cancelar suscripción
          </button>
        </div>
      )}

      {showCancelSubscription && (
        <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 mb-6 max-w-3xl mx-auto mt-8 border border-red-200 dark:border-red-900/30">
          <h3 className="text-lg font-medium mb-4 text-red-600 dark:text-red-400">Cancelar suscripción</h3>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            ¿Estás seguro de que deseas cancelar tu suscripción al plan{" "}
            {monthlyPlans.find((p) => p.credits === selectedPlan)?.name}?
          </p>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-6">
            <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">Información importante:</h4>
            <ul className="list-disc pl-5 text-sm text-red-600 dark:text-red-300 space-y-1">
              <li>Tu suscripción seguirá activa hasta el final del período facturado actual.</li>
              <li>Después de ese período, no se te cobrará nuevamente.</li>
              <li>Perderás el acceso a los créditos mensuales una vez finalice el período actual.</li>
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
              onClick={() => setShowCancelSubscription(false)}
              disabled={isProcessing}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-medium rounded-md transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
