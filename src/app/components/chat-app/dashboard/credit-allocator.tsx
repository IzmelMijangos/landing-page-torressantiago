"use client"

import type React from "react"

import { useState } from "react"
import { X, CreditCard } from "lucide-react"
import { useAuth } from "../auth/auth-context"
import { useRole } from "../auth/role-context"

type CreditAllocatorProps = {
  isOpen: boolean
  onClose: () => void
  clientId: number
  clientName: string
}

export default function CreditAllocator({ isOpen, onClose, clientId, clientName }: CreditAllocatorProps) {
  const [amount, setAmount] = useState(100)
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()
  const { addClientCredits } = useRole()

  if (!isOpen || !user) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      addClientCredits(clientId, amount)
      setIsProcessing(false)
      onClose()
    }, 1000)
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Asignar créditos</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Asigna créditos a <span className="font-medium">{clientName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Cantidad de créditos
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setAmount(Math.max(50, amount - 50))}
                className="px-3 py-2 bg-gray-200 dark:bg-dark rounded-l-md text-gray-700 dark:text-gray-300"
              >
                -
              </button>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(50, Number.parseInt(e.target.value) || 50))}
                className="w-full px-3 py-2 border-y border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setAmount(amount + 50)}
                className="px-3 py-2 bg-gray-200 dark:bg-dark rounded-r-md text-gray-700 dark:text-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-100 dark:bg-dark rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300">Créditos disponibles:</span>
              <span className="font-medium text-gray-900 dark:text-white">{user.credits.available}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Créditos a asignar:</span>
              <span className="font-medium text-accent">{amount}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Créditos restantes:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.max(0, user.credits.available - amount)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing || amount > user.credits.available}
            className="w-full py-2 px-4 bg-accent hover:bg-accent-light text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                <CreditCard size={20} className="mr-2" />
                Asignar créditos
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
