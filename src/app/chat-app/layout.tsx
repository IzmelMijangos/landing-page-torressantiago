// src/app/miapp/layout.tsx
"use client";

import { AuthProvider, useAuth } from "../components/chat-app/auth/auth-context";
import LoadingOverlay from "../components/LoadingOverlay";

export default function MiAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      {children}
    </>
  );
}