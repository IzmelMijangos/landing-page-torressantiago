"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Search, ExternalLink, PlusCircle, CreditCard } from "lucide-react"
import ProtectedRoute from "../../protected-route"

import CreditAllocator from "@/app/components/chat-app/dashboard/credit-allocator"
// Importar el nuevo componente ClientModal
import ClientModal from "@/app/components/chat-app/dashboard/client-modal"

export default function EnterpriseClients() {
//   const { clients } = useRole()
    const clients:any = []
  const [searchTerm, setSearchTerm] = useState("")
  const [isAllocatorOpen, setIsAllocatorOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null)
  // Añadir estado para controlar la apertura del modal
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)

  // Filter clients based on search term
  const filteredClients = clients.filter((client:any) => client.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const openAllocator = (clientId: number, clientName: string) => {
    setSelectedClient({ id: clientId, name: clientName })
    setIsAllocatorOpen(true)
  }

  return (
    <ProtectedRoute allowedRoles={["enterprise-client", "enterprise-admin"]}>
      <div className="flex h-screen bg-gray-100 dark:bg-dark">

        <div className="flex-1 flex flex-col md:ml-64">
          {/* Topbar */}
          <header className="bg-white dark:bg-dark-light shadow-sm py-3 px-6">
            <div className="flex items-center">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona tus clientes</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mis Clientes</h2>
              </div>
              <div className="ml-auto flex items-center">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-lighter dark:border-gray-600 dark:text-white"
                  />
                </div>
                {/* Modificar el botón "Nuevo cliente" para abrir el modal */}
                <button
                  onClick={() => setIsClientModalOpen(true)}
                  className="ml-4 px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-md transition-colors flex items-center"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Nuevo cliente
                </button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Todos los clientes</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-dark">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Cliente
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
                        Ventas
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Landing
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
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client:any) => (
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
                            <div className="text-sm text-gray-900 dark:text-white">{client.sales}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/c/${client.slug}`}
                              target="_blank"
                              className="text-accent hover:text-accent-light transition-colors flex items-center"
                            >
                              Ver landing
                              <ExternalLink size={14} className="ml-1" />
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openAllocator(client.id, client.name)}
                                className="p-2 bg-accent/10 text-accent rounded-md hover:bg-accent/20 transition-colors"
                                title="Asignar créditos"
                              >
                                <CreditCard size={18} />
                              </button>
                              <Link
                                href={`/enterprise/client/${client.id}`}
                                className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors dark:bg-dark dark:text-gray-300 dark:hover:bg-dark-lighter"
                                title="Ver detalles"
                              >
                                <Users size={18} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                          No se encontraron clientes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
      {/* Client Modal */}
      <ClientModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} />
    </ProtectedRoute>
  )
}
