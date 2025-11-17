"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "business" | "enterprise-client" | "enterprise-admin"
  credits: {
    available: number
    used: number
    total: number
  }
  sales: number
  plan: string; // Nuevo: Plan actual
  averageDailyUsage: number; // Nuevo: Consumo promedio
  peakHour: string; // Nuevo: Hora pico de uso
  mostActiveChannel: string; // Nuevo: Canal más activo
}

// Modifica la definición del tipo AuthContextType para incluir información de empresa
type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  authError: string | null
  setAuthError : (error: string | null) => void
  login: (email: string, password: string, role?: "business" | "enterprise-client" | "enterprise-admin") => Promise<void>
  signup: (
    email: string,
    password: string,
    name: string,
    role: "business" | "enterprise-client" | "enterprise-admin",
    companyName?: any,
    selectedCompany?: any,
  ) => Promise<void>
  logout: () => void
  addCredits: (amount: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null); 
  const router = useRouter()

  // Mock business user data
  const mockBusinessUser: User = {
    id: "1",
    name: "Izmel Torres",
    email: "business@example.com",
    role: "enterprise-admin",
    credits: {
      available: 300,
      used: 200,
      total: 500,
    },
    sales: 42,
    plan: "Profesional",
    averageDailyUsage: 0,
    peakHour: "-- - --",
    mostActiveChannel: "Whatsapp",
  }

  useEffect(() => {
    const token = localStorage.getItem("accessTokenChatApp")
    // if (token) {
    //   setUser(mockBusinessUser)
    // }
    setIsLoading(false)
  }, [])

  
  const login = async (loginEmail: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
  
    try {
      const body: { email: string; password: string } = { email: loginEmail, password };
      // 1. Enviar solicitud de login
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVICE_AUTH}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });
  
      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        throw new Error(errorData.error || "Error al iniciar sesión");
      }
  
      const loginData = await loginRes.json();
      const accessToken = loginData.accessToken;
      localStorage.setItem("accessTokenChatApp", accessToken);
  
      // 2. Obtener información del usuario
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVICE_AUTH}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
  
      if (!userRes.ok) {
        const errorData = await userRes.json();
        throw new Error(errorData.error || "Error al obtener información del usuario");
      }
  
      const userData = await userRes.json();
      const { email, role } = userData;
  
      // 3. Determinar el rol
      const userRole: "business" | "enterprise" =
        role === "business" || email.includes("business")
          ? "business"
          : "enterprise";
  
      // 4. Guardar datos del usuario
      setUser(userData); // Aquí ponías un mock, ahora usamos el real
  
      // 5. Redireccionar según el rol
      if (userRole === "business") {
        router.push("/chat-app/business-dashboard");
      } else {
        router.push("/chat-app/enterprise-dashboard");
      }
  
    } catch (error: any) {
      setAuthError(error.message || "Error desconocido");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Modifica la función signup para aceptar información de empresa
  const signup = async (
    email: string,
    password: string,
    name: string,
    role: "business" | "enterprise-client" | "enterprise-admin",
    companyName?: any,
    selectedCompany?: any,
  ) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const body = {
        email,
        password,
        role,
        client:'https://www.torressantiago.com/chat-app',
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVICE_AUTH}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",  
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrarse");
      }

      const data = await response.json();

      // Store token and role in localStorage
      localStorage.setItem("authChatAppToken", data.accessToken);

      const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVICE_BILLING}/create-free-trial-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`, // pasas tu token
        },
        credentials: "include",
        body: JSON.stringify({
          priceId: "price_1RHrtpLrt9eL13Wjxy7UwJ3N",
          email: email,
        }),
      });
    
      const sessionData = await sessionResponse.json();
    
      if (!sessionResponse.ok) {
        throw new Error(sessionData.error || "Error al crear sesión de pago");
      }

      const databilling = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVICE_BILLING}/check-subscription`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`, // pasas tu token
        },
        credentials: "include",
      });
      const dataBilling = await databilling.json();
      if (!databilling.ok) {
        throw new Error(dataBilling.error || "Error al obtener información de la suscripción");
      }

      // Set user with provided name, email and role
      if (role === "business") {
        setUser({
          ...mockBusinessUser,
          name,
          email,
        })
        router.push("/chat-app/business-dashboard")
      } else {
        setUser({
          ...mockBusinessUser,
          name,
          email,
        })
        router.push("/chat-app/enterprise-dashboard")
      }

    } catch (error:any) {
        setAuthError(error.message || "Error al registrarse");
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Remove token and role from localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")

    // Clear user
    setUser(null)

    // Redirect to landing
    router.push("/chat-central")
  }

  const addCredits = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        credits: {
          ...user.credits,
          available: user.credits.available + amount,
          total: user.credits.total + amount,
        },
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authError,
        setAuthError,
        login,
        signup,
        logout,
        addCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
