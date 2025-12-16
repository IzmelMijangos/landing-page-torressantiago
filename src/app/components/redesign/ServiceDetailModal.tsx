// src/app/components/redesign/ServiceDetailModal.tsx
"use client"

import { LucideIcon } from "lucide-react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
                <button
                  onClick={() => {
                    onCTAClick()
                    onClose()
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Cotizar este servicio
                </button>
                <p className="text-center text-sm text-stone-500 mt-3">
                  Agenda una sesión de 1 hora sin compromiso
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
