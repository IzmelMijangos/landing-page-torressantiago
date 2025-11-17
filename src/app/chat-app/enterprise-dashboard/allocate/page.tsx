"use client"

import { useState } from "react"
import { CreditCard, Search, Zap, ArrowRight } from "lucide-react"
import ProtectedRoute from "../../protected-route"
import Sidebar from "@/app/components/chat-app/dashboard/sidebar"
import { useAuth } from "@/app/components/chat-app/auth/auth-context"
import { useRole } from "@/app/components/chat-app/auth/role-context"
import CreditAllocator from "@/app/components/chat-app/dashboard/credit-allocator"

export default function EnterpriseAllocate() {
  const { user } = useAuth()
  const { clients } = useRole()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAllocatorOpen, setIsAllocatorOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null)

  // Filter clients based on search term
  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const openAllocator = (clientId: number, clientName: string) => {
    setSelectedClient({ id: clientId, name: clientName })
    setIsAllocatorOpen(true)
  }

  return (
    <ProtectedRoute allowedRoles={["enterprise-admin", "enterprise-client"]}>
      <div className="flex h-screen bg-gray-100 dark:bg-dark">
        <Sidebar />

        <div className="flex-1 flex flex-col md:ml-64">
          {/* Topbar */}
          <header className="bg-white dark:bg-dark-light shadow-sm py-3 px-6">
            <div className="flex items-center">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">Distribuye tus recursos</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Asignar créditos</h2>
              </div>
              <div className="ml-auto flex items-center">
                <div className="flex items-center bg-gray-100 dark:bg-dark rounded-lg px-3 py-1.5">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-accent mr-1.5"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {user?.credits.available} créditos disponibles
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Asignación de créditos</h3>
                  <p className="text-gray-500 dark:text-gray-400">Distribuye créditos entre tus bots especializados</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar bot por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-dark">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Bot
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Especialización
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Créditos
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-light divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-medium">
                              {client.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">ID: {client.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {client.slug === "pizza-express" && "Restaurantes"}
                            {client.slug === "burger-house" && "Comida rápida"}
                            {client.slug === "coffee-corner" && "Cafeterías"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {client.slug === "pizza-express" && "Especializado en atención a restaurantes"}
                            {client.slug === "burger-house" && "Especializado en pedidos de comida rápida"}
                            {client.slug === "coffee-corner" && "Especializado en cafeterías y bebidas"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {client.creditsUsed} / {client.creditsTotal}
                          </div>
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full dark:bg-dark-lighter overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${Math.min(100, (client.creditsUsed / client.creditsTotal) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => openAllocator(client.id, client.name)}
                            className="px-3 py-1 bg-accent hover:bg-accent-light text-white text-sm font-medium rounded-md transition-colors flex items-center"
                          >
                            <CreditCard size={14} className="mr-1" />
                            Asignar créditos
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Historial de asignaciones</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-dark">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Fecha
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Bot
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Créditos
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-light divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        2023-05-15 14:30
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        Pizza Express
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">+100</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
                          Completado
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        2023-05-10 09:15
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        Burger House
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">+200</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
                          Completado
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        2023-05-05 16:45
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        Coffee Corner
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">+150</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
                          Completado
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-center">
                <button className="px-4 py-2 text-accent hover:text-accent-light transition-colors flex items-center">
                  Ver historial completo
                  <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Credit Allocator Modal */}
      {selectedClient && (
        <CreditAllocator
          isOpen={isAllocatorOpen}
          onClose={() => setIsAllocatorOpen(false)}
          clientId={selectedClient.id}
          clientName={selectedClient.name}
        />
      )}
    </ProtectedRoute>
  )
}
