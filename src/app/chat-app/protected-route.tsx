"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../components/chat-app/auth/auth-context"

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: Array<"business" | "enterprise-client" | "enterprise-admin">;
};

export default function ProtectedRoute({ children, allowedRoles  }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {

      if (!isAuthenticated) {
        router.push("/chat-app");
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push("/403"); // o a una página 403
      }      
    }
    
  }, [isAuthenticated, isLoading, user, allowedRoles, router])
  


  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
