"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Brain,
  Users,
  PieChart,
  Palette,
} from "lucide-react";
import { useAuth } from "../auth/auth-context"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const businessMenuItems = [
    {
      name: "Resumen",
      href: "/chat-app/business-dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Comprar créditos",
      href: "/chat-app/business-dashboard/credits",
      icon: CreditCard,
      exact: false,
    },
    {
      name: "Suscripción",
      href: "/chat-app/business-dashboard/subscription",
      icon: Settings,
      exact: false,
    }
  ];

  // Menú para empresas (ejemplo)
  const enterpriseMenuItems = [
    {
      name: "Resumen",
      href: "/chat-app/enterprise-dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Clientes",
      href: "/chat-app/enterprise-dashboard/clients",
      icon: Users,
      exact: false,
    },
    {
      name: "Asignar créditos",
      href: "/chat-app/enterprise-dashboard/allocate",
      icon: PieChart,
      exact: false,
    },
    {
      name: "Comprar créditos",
      href: "/chat-app/enterprise-dashboard/credits",
      icon: CreditCard,
      exact: false,
    }
  ];

  // Escoge menú basado en rol
  const menuItems = user?.role === "enterprise-client" || user?.role === "enterprise-admin"
    ? enterpriseMenuItems
    : businessMenuItems;

  const isActive = (item: (typeof menuItems)[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-md bg-dark-light text-white md:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-dark text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-lighter">
            <Link href="/chat-app" className="text-xl font-bold text-accent">
              Chat App
            </Link>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-md hover:bg-dark-lighter md:hidden">
              <X size={20} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive(item) ? "bg-accent text-white" : "text-gray-300 hover:bg-dark-lighter"
                }`}
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-dark-lighter">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-dark-lighter transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
