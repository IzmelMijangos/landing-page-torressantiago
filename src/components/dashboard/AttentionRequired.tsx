/**
 * AttentionRequired Component
 * Shows critical alerts that require immediate action
 */

import { ExclamationTriangleIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

interface Alert {
  type: 'new_today' | 'waiting_response' | 'high_rating';
  count: number;
  label: string;
  description: string;
  icon: 'fire' | 'clock' | 'star';
  color: 'red' | 'yellow' | 'purple';
  action: () => void;
}

interface AttentionRequiredProps {
  newToday: number;
  waitingResponse: number;
  highRatingUnconverted: number;
  onFilterNew: () => void;
  onFilterWaiting: () => void;
  onFilterHighRating: () => void;
}

export default function AttentionRequired({
  newToday,
  waitingResponse,
  highRatingUnconverted,
  onFilterNew,
  onFilterWaiting,
  onFilterHighRating,
}: AttentionRequiredProps) {
  const alerts: Alert[] = [
    {
      type: 'new_today',
      count: newToday,
      label: 'Leads nuevos hoy',
      description: 'Sin contactar',
      icon: 'fire',
      color: 'red',
      action: onFilterNew,
    },
    {
      type: 'waiting_response',
      count: waitingResponse,
      label: 'Esperando respuesta',
      description: '>48 horas',
      icon: 'clock',
      color: 'yellow',
      action: onFilterWaiting,
    },
    {
      type: 'high_rating',
      count: highRatingUnconverted,
      label: 'Alta calificación',
      description: '5⭐ sin convertir',
      icon: 'star',
      color: 'purple',
      action: onFilterHighRating,
    },
  ];

  const hasAlerts = alerts.some(alert => alert.count > 0);

  if (!hasAlerts) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-md p-4 sm:p-6 mb-6 border-l-4 border-red-500">
      <div className="flex items-center mb-4">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
        <h2 className="text-lg font-bold text-gray-900">⚠️ Requiere Atención Ahora</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map((alert) => {
          if (alert.count === 0) return null;

          const iconMap = {
            fire: '🔥',
            clock: '⏰',
            star: '⭐',
          };

          const bgColorMap = {
            red: 'bg-red-100 border-red-300 hover:bg-red-200',
            yellow: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
            purple: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
          };

          const textColorMap = {
            red: 'text-red-900',
            yellow: 'text-yellow-900',
            purple: 'text-purple-900',
          };

          return (
            <button
              key={alert.type}
              onClick={alert.action}
              className={`${bgColorMap[alert.color]} border-2 rounded-lg p-4 text-left transition-all hover:shadow-lg transform hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{iconMap[alert.icon]}</span>
                    <span className={`text-3xl font-bold ${textColorMap[alert.color]}`}>
                      {alert.count}
                    </span>
                  </div>
                  <p className={`text-sm font-semibold ${textColorMap[alert.color]} mb-1`}>
                    {alert.label}
                  </p>
                  <p className="text-xs text-gray-600">{alert.description}</p>
                </div>
                <div className="ml-2">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center text-xs text-gray-600">
        <svg
          className="h-4 w-4 mr-1 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Haz clic en cualquier alerta para ver los leads correspondientes
      </div>
    </div>
  );
}
