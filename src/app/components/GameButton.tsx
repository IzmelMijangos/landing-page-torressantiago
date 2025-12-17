"use client"

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"

interface GameButtonProps {
  children: ReactNode
  onClick?: () => void
  href?: string
  icon?: LucideIcon
  variant?: "primary" | "secondary" | "success" | "danger"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  target?: string
  rel?: string
}

export default function GameButton({
  children,
  onClick,
  href,
  icon: Icon,
  variant = "primary",
  size = "md",
  className = "",
  target,
  rel,
}: GameButtonProps) {
  // Colores por variante
  const colors = {
    primary: {
      bg: "bg-accent",
      hover: "hover:bg-yellow-500",
      text: "text-slate-900",
      shadow: "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
      hoverShadow: "hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]",
      activeShadow: "active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    },
    secondary: {
      bg: "bg-white",
      hover: "hover:bg-stone-100",
      text: "text-slate-900",
      shadow: "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
      hoverShadow: "hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]",
      activeShadow: "active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    },
    success: {
      bg: "bg-emerald-500",
      hover: "hover:bg-emerald-600",
      text: "text-white",
      shadow: "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
      hoverShadow: "hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]",
      activeShadow: "active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    },
    danger: {
      bg: "bg-red-500",
      hover: "hover:bg-red-600",
      text: "text-white",
      shadow: "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
      hoverShadow: "hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]",
      activeShadow: "active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    },
  }

  // Tamaños
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-5 text-xl",
  }

  const colorScheme = colors[variant]

  const baseClasses = `
    inline-flex items-center justify-center gap-3
    font-black uppercase tracking-wide
    border-4 border-black rounded-xl
    transition-all duration-150 ease-out
    ${colorScheme.bg}
    ${colorScheme.hover}
    ${colorScheme.text}
    ${colorScheme.shadow}
    ${colorScheme.hoverShadow}
    ${colorScheme.activeShadow}
    hover:translate-x-[-2px] hover:translate-y-[-2px]
    active:translate-x-[3px] active:translate-y-[3px]
    ${sizes[size]}
    ${className}
  `

  const content = (
    <>
      {Icon && <Icon className={size === "sm" ? "w-5 h-5" : size === "md" ? "w-6 h-6" : "w-7 h-7"} />}
      {children}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        target={target}
        rel={rel}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  )
}
