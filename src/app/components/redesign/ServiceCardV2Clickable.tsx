// src/app/components/redesign/ServiceCardV2Clickable.tsx
"use client"

import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

interface ServiceCardV2ClickableProps {
  icon: LucideIcon
  title: string
  description: string
  price: string
  onClick: () => void
}

export default function ServiceCardV2Clickable({
  icon: Icon,
  title,
  description,
  price,
  onClick,
}: ServiceCardV2ClickableProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="bg-white border border-stone-200 rounded-xl p-8 hover:shadow-lg hover:border-amber-300 transition-all duration-300 group cursor-pointer text-left w-full"
    >
      {/* Icon */}
      <div className="w-14 h-14 bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-200 rounded-lg flex items-center justify-center mb-5 group-hover:border-amber-200 group-hover:from-amber-50 group-hover:to-orange-50 transition-all">
        <Icon className="w-7 h-7 text-stone-700 group-hover:text-amber-700 transition-colors" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-800 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-stone-600 mb-6 leading-relaxed text-sm">{description}</p>

      {/* Price & Click indicator */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-stone-500">
          Desde <span className="text-lg font-bold text-slate-900">{price}</span> MXN
        </div>
        <div className="flex items-center gap-1 text-amber-700 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Ver más
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.button>
  )
}
