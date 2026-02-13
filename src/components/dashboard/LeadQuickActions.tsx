/**
 * LeadQuickActions Component
 * Quick actions for each lead row (WhatsApp, change status, etc.)
 */

'use client';

import { useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface LeadQuickActionsProps {
  lead: {
    id: number;
    nombre: string;
    telefono: string;
    estado: string;
  };
  onStatusChange: (leadId: number, newStatus: string) => void;
}

export default function LeadQuickActions({ lead, onStatusChange }: LeadQuickActionsProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const handleWhatsAppClick = () => {
    // Format phone number for WhatsApp (remove spaces, ensure +52)
    const cleanPhone = lead.telefono.replace(/\s/g, '');
    const whatsappNumber = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;

    // Pre-filled message template
    const message = encodeURIComponent(
      `¡Hola ${lead.nombre}! 👋\n\nGracias por tu interés en nuestros mezcales. ¿En qué puedo ayudarte?`
    );

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsChangingStatus(true);
    try {
      await onStatusChange(lead.id, newStatus);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const statusOptions = [
    { value: 'nuevo', label: 'Nuevo', color: 'blue' },
    { value: 'contactado', label: 'Contactado', color: 'yellow' },
    { value: 'respondio', label: 'Respondió', color: 'orange' },
    { value: 'convertido', label: 'Convertido', color: 'green' },
    { value: 'inactivo', label: 'Inactivo', color: 'gray' },
    { value: 'opt_out', label: 'Opt-out', color: 'red' },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
        title="Abrir WhatsApp"
      >
        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
        WhatsApp
      </button>

      {/* Status Dropdown */}
      <select
        value={lead.estado}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isChangingStatus}
        className="text-xs border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
