type CreditProgressProps = {
    used: number
    total: number
  }
  
  export default function CreditProgress({ used, total }: CreditProgressProps) {
    const percentage = Math.min(Math.round((used / total) * 100), 100)
  
    return (
      <div className="w-full">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {used} de {total} créditos
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{percentage}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-dark-lighter overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
  