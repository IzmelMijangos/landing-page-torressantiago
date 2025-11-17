"use client"

import { LayoutDashboard, DollarSign, Zap, Users } from "lucide-react"

import KPICard from "@/app/components/chat-app/dashboard/kpi-card"
import CreditProgress from "@/app/components/chat-app/dashboard/credit-progress"
import { useAuth } from "@/app/components/chat-app/auth/auth-context"

export default function EnterpriseDashboard() {
  const { user } = useAuth()
  const clients: any = []

  // Calculate total sales and credits across all clients
  const totalClientSales = 9
  const totalClientCreditsUsed = 5
  const totalClientCreditsTotal = 7

  return (



    <div className="p-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Clientes activos" value={4} icon={<Users size={24} />} />

        <KPICard title="Ventas totales" value={totalClientSales} icon={<DollarSign size={24} />} />

        <KPICard title="Créditos disponibles" value={user?.credits.available || 0} icon={<Zap size={24} />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Créditos de la empresa</h3>
            <div className="p-2 bg-accent/10 text-accent rounded-full">
              <LayoutDashboard size={24} />
            </div>
          </div>
          <CreditProgress used={user?.credits.used || 0} total={user?.credits.total || 1} />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Estos son los créditos disponibles para asignar a tus clientes.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Créditos asignados a clientes
            </h3>
            <div className="p-2 bg-accent/10 text-accent rounded-full">
              <Users size={24} />
            </div>
          </div>
          <CreditProgress used={totalClientCreditsUsed} total={totalClientCreditsTotal} />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Estos son los créditos que has asignado a tus clientes.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Clientes recientes</h3>
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
                  Ventas
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Créditos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-light divide-y divide-gray-200 dark:divide-gray-700">
              {clients.slice(0, 3).map((client: any) => (
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
                    <div className="text-sm text-gray-900 dark:text-white">{client.sales}</div>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
