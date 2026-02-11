'use client';

/**
 * QR Codes Admin Page
 * Página para generar y descargar QR codes de cada palenque
 */

import { useState, useEffect } from 'react';
import { QrCodeIcon, ArrowDownTrayIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Palenque {
  id: number;
  nombre: string;
  ubicacion: string;
  activo: boolean;
  plan: string;
}

interface QRCodeData {
  palenqueId: number;
  url: string;
  qrCode: string;
  loading: boolean;
}

export default function QRCodesPage() {
  const [palenques, setPalenques] = useState<Palenque[]>([]);
  const [qrCodes, setQrCodes] = useState<{ [key: number]: QRCodeData }>({});
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<number | null>(null);

  useEffect(() => {
    fetchPalenques();
  }, []);

  const fetchPalenques = async () => {
    try {
      const response = await fetch('/api/admin/palenques');
      if (response.ok) {
        const data = await response.json();
        setPalenques(data.palenques || []);
      }
    } catch (error) {
      console.error('Error cargando palenques:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (palenqueId: number) => {
    setQrCodes((prev) => ({
      ...prev,
      [palenqueId]: { ...prev[palenqueId], loading: true } as QRCodeData,
    }));

    try {
      const response = await fetch(`/api/palenques/${palenqueId}/qr-code`);
      if (response.ok) {
        const data = await response.json();
        setQrCodes((prev) => ({
          ...prev,
          [palenqueId]: {
            palenqueId,
            url: data.url,
            qrCode: data.qrCode,
            loading: false,
          },
        }));
      }
    } catch (error) {
      console.error('Error generando QR:', error);
      setQrCodes((prev) => ({
        ...prev,
        [palenqueId]: { ...prev[palenqueId], loading: false } as QRCodeData,
      }));
    }
  };

  const downloadQRCode = (palenque: Palenque, qrCode: string) => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `QR-${palenque.nombre.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyURL = (palenqueId: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(palenqueId);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando palenques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Códigos QR</h1>
        <p className="text-gray-600">
          Genera y descarga códigos QR para cada palenque. Los clientes escanean el código y registran sus datos.
        </p>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Instrucciones:</h3>
        <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
          <li>Click en "Generar QR" para crear el código del palenque</li>
          <li>Descarga la imagen en alta calidad (512x512px)</li>
          <li>Imprime el QR y colócalo en un lugar visible del palenque</li>
          <li>Los clientes escanean el código y llenan el formulario</li>
          <li>Los leads aparecen automáticamente en el dashboard</li>
        </ol>
      </div>

      {/* Lista de Palenques */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {palenques.map((palenque) => {
          const qrData = qrCodes[palenque.id];

          return (
            <div
              key={palenque.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200"
            >
              {/* Header del Card */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{palenque.nombre}</h3>
                  <p className="text-sm text-gray-600">{palenque.ubicacion}</p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                      palenque.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {palenque.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="text-2xl">🥃</div>
              </div>

              {/* QR Code Display */}
              {qrData && qrData.qrCode && !qrData.loading ? (
                <div className="mb-4">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center">
                    <img
                      src={qrData.qrCode}
                      alt={`QR Code - ${palenque.nombre}`}
                      className="w-48 h-48"
                    />
                  </div>

                  {/* URL Display */}
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={qrData.url}
                      readOnly
                      className="input-field text-xs flex-1"
                    />
                    <button
                      onClick={() => copyURL(palenque.id, qrData.url)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                      title="Copiar URL"
                    >
                      {copiedUrl === palenque.id ? (
                        <CheckIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <ClipboardDocumentIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center">
                  <QrCodeIcon className="h-24 w-24 text-gray-300" />
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                {!qrData || !qrData.qrCode ? (
                  <button
                    onClick={() => generateQRCode(palenque.id)}
                    disabled={qrData?.loading || !palenque.activo}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    {qrData?.loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Generando...
                      </>
                    ) : (
                      <>
                        <QrCodeIcon className="h-5 w-5" />
                        Generar QR
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => downloadQRCode(palenque, qrData.qrCode)}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      Descargar QR (512x512)
                    </button>
                    <button
                      onClick={() => generateQRCode(palenque.id)}
                      className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                      Regenerar
                    </button>
                  </>
                )}
              </div>

              {!palenque.activo && (
                <p className="mt-3 text-xs text-red-600 text-center">
                  Palenque inactivo. Actívalo para generar QR.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {palenques.length === 0 && (
        <div className="text-center py-12">
          <QrCodeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay palenques registrados
          </h3>
          <p className="text-gray-600 mb-6">
            Crea un palenque para generar códigos QR
          </p>
          <a href="/admin/palenques/nuevo" className="btn-primary inline-block">
            Crear Palenque
          </a>
        </div>
      )}
    </div>
  );
}
