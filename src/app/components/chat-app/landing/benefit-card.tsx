import type { ReactNode } from "react"

type BenefitCardProps = {
  icon: ReactNode
  title: string
  description: string
}

export default function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="bg-white dark:bg-dark-light rounded-lg shadow-md p-6 animate-fade-in">
      <div className="p-3 bg-accent/10 text-accent rounded-full w-fit mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
