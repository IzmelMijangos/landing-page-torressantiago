// src/app/components/redesign/ServiceDetailModal.tsx
"use client"

import { LucideIcon } from "lucide-react"
import { X, MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import GameButton from "@/app/components/GameButton"

interface ServiceDetailModalProps {
  isOpen: boolean
  onClose: () => void
  icon: LucideIcon
  title: string
  description: string
  price: string
  features: string[]
  deliveryTime: string
  includes: string[]
  onCTAClick: () => void
}

export default function ServiceDetailModal({
  isOpen,
  onClose,
  icon: Icon,
  title,
  description,
  price,
  features,
  deliveryTime,
  includes,
  onCTAClick,
}: ServiceDetailModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-5 h-5 text-stone-700" />
              </button>

              {/* Content */}
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                      {title}
                    </h2>
                    <p className="text-stone-600">{description}</p>
                  </div>
                </div>

                {/* Price & Time */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                    <div className="text-sm text-stone-600 mb-1">Inversión</div>
                    <div className="text-3xl font-bold text-slate-900">
                      {price}
                    </div>
                    <div className="text-sm text-stone-500">MXN</div>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                    <div className="text-sm text-stone-600 mb-1">Entrega</div>
                    <div className="text-3xl font-bold text-slate-900">
                      {deliveryTime}
                    </div>
                    <div className="text-sm text-stone-500">días</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="font-bold text-slate-900 mb-4">
                    Características principales
                  </h3>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          ✓
                        </span>
                        <span className="text-stone-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Includes */}
                <div className="mb-8">
                  <h3 className="font-bold text-slate-900 mb-4">
                    Qué incluye
                  </h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <ul className="space-y-2">
                      {includes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-stone-700">
                          <span className="text-amber-700">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center">
                  <GameButton
                    onClick={() => {
                      onCTAClick()
                      onClose()
                    }}
                    variant="success"
                    size="lg"
                    icon={MessageSquare}
                    className="w-full"
                  >
                    Cotizar este servicio
                  </GameButton>
                  <p className="text-center text-sm text-stone-500 mt-3">
                    Agenda una sesión de 1 hora sin compromiso
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
