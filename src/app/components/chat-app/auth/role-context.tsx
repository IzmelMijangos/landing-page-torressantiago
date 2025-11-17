"use client"

import { useContext } from "react"

import { createContext, useState, type ReactNode } from "react"
import { useAuth } from "./auth-context"

type Client = {
  id: number
  slug: string
  name: string
  logo?: string
  sales: number
  creditsUsed: number
  creditsTotal: number
  specialization?: string
  description?: string
}

// Modificar la interfaz RoleContextType para añadir la función addClient
type RoleContextType = {
  clients: Client[]
  addClientCredits: (clientId: number, amount: number) => void
  getClient: (slug: string) => Client | undefined
  getClientById: (id: number) => Client | undefined
  addClient: (client: Omit<Client, "id">) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const defaultRole = user?.role || "enterprise-client";
  // Mock clients data for enterprise users
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      slug: "pizza-express",
      name: "Pizza Express",
      logo: "/logos/pizza-express.png",
      sales: 120,
      creditsUsed: 500,
      creditsTotal: 600,
      specialization: "Restaurantes",
      description: "Bot especializado en atención a restaurantes y pedidos de comida",
    },
    {
      id: 2,
      slug: "burger-house",
      name: "Burger House",
      logo: "/logos/burger-house.png",
      sales: 75,
      creditsUsed: 200,
      creditsTotal: 400,
      specialization: "Comida rápida",
      description: "Bot especializado en pedidos de comida rápida y servicio al cliente",
    },
    {
      id: 3,
      slug: "coffee-corner",
      name: "Coffee Corner",
      logo: "/logos/coffee-corner.png",
      sales: 42,
      creditsUsed: 150,
      creditsTotal: 300,
      specialization: "Cafeterías",
      description: "Bot especializado en cafeterías y bebidas",
    },
  ])

  const addClientCredits = (clientId: number, amount: number) => {
    if (!user || user.role !== "enterprise-admin") return

    // Update client credits
    setClients((prevClients) =>
      prevClients.map((client) => {
        if (client.id === clientId) {
          return {
            ...client,
            creditsTotal: client.creditsTotal + amount,
          }
        }
        return client
      }),
    )
  }

  const getClient = (slug: string) => {
    return clients.find((client) => client.slug === slug)
  }

  const getClientById = (id: number) => {
    return clients.find((client) => client.id === id)
  }

  // Añadir la función addClient en el provider
  const addClient = (client: Omit<Client, "id">) => {
    if (!user || user.role !== "enterprise-admin") return

    // Generar un ID único para el nuevo cliente
    const newId = Math.max(...clients.map((c) => c.id), 0) + 1

    // Añadir el nuevo cliente a la lista
    setClients((prevClients) => [
      ...prevClients,
      {
        ...client,
        id: newId,
        // Valores por defecto si no se proporcionan
        sales: client.sales || 0,
        creditsUsed: client.creditsUsed || 0,
        creditsTotal: client.creditsTotal || 0,
      },
    ])
  }

  // Actualizar el valor del contexto para incluir addClient
  return (
    <RoleContext.Provider
      value={{
        clients,
        addClientCredits,
        getClient,
        getClientById,
        addClient,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
