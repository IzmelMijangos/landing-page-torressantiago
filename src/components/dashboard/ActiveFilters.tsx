/**
 * ActiveFilters Component
 * Shows active filters with ability to remove them
 */

import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface ActiveFiltersProps {
  search: string;
  estadoFilter: string;
  origenFilter: string;
  onRemoveSearch: () => void;
  onRemoveEstado: () => void;
  onRemoveOrigen: () => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  search,
  estadoFilter,
  origenFilter,
  onRemoveSearch,
  onRemoveEstado,
  onRemoveOrigen,
  onClearAll,
}: ActiveFiltersProps) {
  const hasFilters = search || estadoFilter || origenFilter;

  if (!hasFilters) {
    return null;
  }

  const estadoLabels: { [key: string]: string } = {
    nuevo: 'Nuevo',
    contactado: 'Contactado',
    respondio: 'Respondió',
    convertido: 'Convertido',
    inactivo: 'Inactivo',
    opt_out: 'Opt-out',
  };

  const origenLabels: { [key: string]: string } = {
    qr_barra: 'QR Barra',
    qr_mesa: 'QR Mesa',
    manual: 'Manual',
    evento: 'Evento',
    web: 'Web',
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FunnelIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-blue-800 mb-2">
            Filtros activos ({[search, estadoFilter, origenFilter].filter(Boolean).length})
          </p>
          <div className="flex flex-wrap gap-2">
            {/* Search Filter */}
            {search && (
              <button
                onClick={onRemoveSearch}
                className="inline-flex items-center px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-800 hover:bg-blue-100 transition"
              >
                <span className="mr-1">🔍 Búsqueda: "{search}"</span>
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}

            {/* Estado Filter */}
            {estadoFilter && (
              <button
                onClick={onRemoveEstado}
                className="inline-flex items-center px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-800 hover:bg-blue-100 transition"
              >
                <span className="mr-1">Estado: {estadoLabels[estadoFilter]}</span>
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}

            {/* Origen Filter */}
            {origenFilter && (
              <button
                onClick={onRemoveOrigen}
                className="inline-flex items-center px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-800 hover:bg-blue-100 transition"
              >
                <span className="mr-1">Origen: {origenLabels[origenFilter]}</span>
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}

            {/* Clear All Button */}
            <button
              onClick={onClearAll}
              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
            >
              Limpiar todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
