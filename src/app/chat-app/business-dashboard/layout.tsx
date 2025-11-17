"use client"

import type React from "react"

import { useAuth } from "../../components/chat-app/auth/auth-context"
import Sidebar from "@/app/components/chat-app/dashboard/sidebar"
import ProtectedRoute from "../protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
    <div className="flex h-screen bg-gray-100 dark:bg-dark">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-white dark:bg-dark-light shadow-sm py-3 px-6">
          <div className="flex items-center">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 dark:text-gray-400">Bienvenido de nuevo</p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || "Usuario"}</h2>
            </div>
            <div className="ml-auto flex items-center">
              <div className="flex items-center bg-gray-100 dark:bg-dark rounded-lg px-3 py-1.5">
              <div className="flex items-center mr-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Plan: {user?.credits ? "30 días de prueba" : "Gratis"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-accent mr-1.5"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user?.credits?.available || 0} créditos disponibles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
