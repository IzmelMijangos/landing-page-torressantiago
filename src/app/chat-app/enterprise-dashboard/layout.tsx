"use client"

import type React from "react"

import { useAuth } from "../../components/chat-app/auth/auth-context"
import Sidebar from "@/app/components/chat-app/dashboard/sidebar"
import ProtectedRoute from "../protected-route"
import { RoleProvider } from "../../components/chat-app/auth/role-context" // Importar RoleProvider

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <RoleProvider>
        <div className="flex h-screen bg-gray-100 dark:bg-dark">
          <Sidebar />
          <div className="flex-1 flex flex-col md:ml-64">
            

            {/* Main content */}
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </RoleProvider>
    </ProtectedRoute>
  )
}
