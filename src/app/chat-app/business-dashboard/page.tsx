"use client";

import { LayoutDashboard, DollarSign, Zap, BarChart3 } from "lucide-react";
import KPICard from "@/app/components/chat-app/dashboard/kpi-card";
import CreditProgress from "@/app/components/chat-app/dashboard/credit-progress";
import { useAuth } from "../../components/chat-app/auth/auth-context";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null; // Manejo de error: usuario no autenticado
  }

  const estimatedDaysLeft = user.averageDailyUsage > 0
    ? Math.floor(user.credits.available / user.averageDailyUsage)
    : "∞"; // evita división por cero

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Resumen</h1>

      {/* Resumen de consumo */}
      <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 mb-8 animate-fade-in">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white flex items-center">
          <BarChart3 size={20} className="mr-2 text-accent" />
          Resumen de consumo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Plan actual</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.plan}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Consumo diario promedio</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {user.averageDailyUsage} créditos
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Hora pico de uso</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.peakHour}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Canal más activo</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.mostActiveChannel}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Créditos restantes</p>
          <CreditProgress used={user.credits.used} total={user.credits.total} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Con tu consumo actual, tus créditos durarán aproximadamente{" "}
            {estimatedDaysLeft} {typeof estimatedDaysLeft === "number" ? "días" : ""} más.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Ventas realizadas" value={user.sales} icon={<DollarSign size={24} />} />
        <KPICard title="Créditos disponibles" value={user.credits.available} icon={<Zap size={24} />} />

        <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Créditos consumidos</h3>
            <div className="p-2 bg-accent/10 text-accent rounded-full">
              <LayoutDashboard size={24} />
            </div>
          </div>
          <CreditProgress used={user.credits.used} total={user.credits.total} />
        </div>
      </div>
    </div>
  );
}
