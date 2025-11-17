import type { ReactNode } from "react"

type KPICardProps = {
  title: string
  value: string | number
  icon: ReactNode
  className?: string
}

export default function KPICard({ title, value, icon, className = "" }: KPICardProps) {
  return (
    <div className={`bg-white dark:bg-dark-light rounded-lg shadow-md p-6 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">{title}</h3>
        <div className="p-2 bg-accent/10 text-accent rounded-full">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  )
}
