'use client';

/**
 * Products Management Page
 * CRUD interface for mezcal catalog
 */

import { useEffect, useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface Presentacion {
  ml: number;
  precio: number;
  stock: number;
}

interface Producto {
  id: number;
  sku?: string;
  nombre: string;
  descripcion?: string;
  tipo_agave?: string;
  grados_alcohol?: number;
  presentaciones: Presentacion[];
  proceso?: string;
  region?: string;
  imagen_url?: string;
  activo: boolean;
  destacado: boolean;
  orden_display: number;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('/api/chatbot/productos');
      if (!response.ok) throw new Error('Error al cargar productos');

      const data = await response.json();
      setProductos(data.productos || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Desactivar el producto "${nombre}"?`)) return;

    try {
      const response = await fetch(`/api/chatbot/productos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar producto');

      fetchProductos();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar producto');
    }
  };

  const handleToggleActive = async (producto: Producto) => {
    try {
      const response = await fetch(`/api/chatbot/productos/${producto.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !producto.activo }),
      });

      if (!response.ok) throw new Error('Error al actualizar producto');

      fetchProductos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleDestacado = async (producto: Producto) => {
    try {
      const response = await fetch(`/api/chatbot/productos/${producto.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destacado: !producto.destacado }),
      });

      if (!response.ok) throw new Error('Error al actualizar producto');

      fetchProductos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Gestiona tu inventario de mezcales
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center sm:justify-start px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Producto
        </button>
      </div>

      {/* Products Grid */}
      {productos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="h-16 w-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">No hay productos registrados</p>
          <p className="mt-2 text-sm text-gray-500">
            Comienza agregando tu primer mezcal al catálogo
          </p>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowModal(true);
            }}
            className="mt-6 inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Agregar Primer Producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className={`bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition ${
                !producto.activo ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 relative">
                {producto.imagen_url ? (
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-amber-600">
                    <svg className="h-20 w-20" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {producto.destacado && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <SparklesIcon className="h-3 w-3" />
                      Destacado
                    </span>
                  )}
                  {!producto.activo && (
                    <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
                      Inactivo
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{producto.nombre}</h3>
                {producto.tipo_agave && (
                  <p className="text-sm text-gray-600 mt-1">Tipo: {producto.tipo_agave}</p>
                )}
                {producto.grados_alcohol && (
                  <p className="text-sm text-gray-600">Grados: {producto.grados_alcohol}%</p>
                )}

                {/* Presentaciones */}
                <div className="mt-3 space-y-2">
                  {producto.presentaciones.map((pres, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-2"
                    >
                      <span className="font-medium text-gray-700">{pres.ml}ml</span>
                      <span className="text-amber-600 font-semibold">${pres.precio}</span>
                      <span className="text-gray-600">Stock: {pres.stock}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleToggleActive(producto)}
                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      producto.activo
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={producto.activo ? 'Desactivar' : 'Activar'}
                  >
                    {producto.activo ? (
                      <>
                        <EyeIcon className="h-4 w-4" />
                        Activo
                      </>
                    ) : (
                      <>
                        <EyeSlashIcon className="h-4 w-4" />
                        Inactivo
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleToggleDestacado(producto)}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition ${
                      producto.destacado
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={producto.destacado ? 'Quitar destacado' : 'Marcar destacado'}
                  >
                    <SparklesIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      setEditingProduct(producto);
                      setShowModal(true);
                    }}
                    className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(producto.id, producto.nombre)}
                    className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            setShowModal(false);
            setEditingProduct(null);
            fetchProductos();
          }}
        />
      )}
    </div>
  );
}

// Product Modal Component
function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Producto | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Producto>>(
    product || {
      nombre: '',
      descripcion: '',
      tipo_agave: '',
      grados_alcohol: 0,
      presentaciones: [{ ml: 750, precio: 0, stock: 0 }],
      proceso: '',
      region: '',
      imagen_url: '',
      activo: true,
      destacado: false,
    }
  );
  const [saving, setSaving] = useState(false);

  const handleAddPresentacion = () => {
    setFormData({
      ...formData,
      presentaciones: [
        ...(formData.presentaciones || []),
        { ml: 750, precio: 0, stock: 0 },
      ],
    });
  };

  const handleRemovePresentacion = (index: number) => {
    setFormData({
      ...formData,
      presentaciones: formData.presentaciones?.filter((_, i) => i !== index),
    });
  };

  const handlePresentacionChange = (
    index: number,
    field: keyof Presentacion,
    value: number
  ) => {
    const presentaciones = [...(formData.presentaciones || [])];
    presentaciones[index] = { ...presentaciones[index], [field]: value };
    setFormData({ ...formData, presentaciones });
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.presentaciones?.length) {
      alert('Nombre y al menos una presentación son requeridos');
      return;
    }

    setSaving(true);

    try {
      const url = product
        ? `/api/chatbot/productos/${product.id}`
        : '/api/chatbot/productos';
      const method = product ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar producto');

      onSave();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="input-field"
                placeholder="Ej: Mezcal Espadín"
              />
            </div>

            {/* Tipo Agave y Grados */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Agave
                </label>
                <input
                  type="text"
                  value={formData.tipo_agave || ''}
                  onChange={(e) => setFormData({ ...formData, tipo_agave: e.target.value })}
                  className="input-field"
                  placeholder="Espadín, Tobalá..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grados Alcohólicos
                </label>
                <input
                  type="number"
                  value={formData.grados_alcohol || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, grados_alcohol: parseFloat(e.target.value) })
                  }
                  className="input-field"
                  placeholder="45.5"
                  step="0.1"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                value={formData.descripcion || ''}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                className="input-field"
                placeholder="Descripción del producto..."
              />
            </div>

            {/* Presentaciones */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Presentaciones *
                </label>
                <button
                  onClick={handleAddPresentacion}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  + Agregar Presentación
                </button>
              </div>

              <div className="space-y-3">
                {formData.presentaciones?.map((pres, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">ML</label>
                      <input
                        type="number"
                        value={pres.ml}
                        onChange={(e) =>
                          handlePresentacionChange(idx, 'ml', parseInt(e.target.value))
                        }
                        className="input-field"
                        placeholder="750"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Precio (MXN)</label>
                      <input
                        type="number"
                        value={pres.precio}
                        onChange={(e) =>
                          handlePresentacionChange(idx, 'precio', parseFloat(e.target.value))
                        }
                        className="input-field"
                        placeholder="450"
                        step="0.01"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Stock</label>
                      <input
                        type="number"
                        value={pres.stock}
                        onChange={(e) =>
                          handlePresentacionChange(idx, 'stock', parseInt(e.target.value))
                        }
                        className="input-field"
                        placeholder="10"
                      />
                    </div>
                    {formData.presentaciones!.length > 1 && (
                      <button
                        onClick={() => handleRemovePresentacion(idx)}
                        className="mt-6 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Proceso y Región */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proceso</label>
                <input
                  type="text"
                  value={formData.proceso || ''}
                  onChange={(e) => setFormData({ ...formData, proceso: e.target.value })}
                  className="input-field"
                  placeholder="Artesanal, Ancestral..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Región</label>
                <input
                  type="text"
                  value={formData.region || ''}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="input-field"
                  placeholder="Oaxaca, Durango..."
                />
              </div>
            </div>

            {/* URL Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                value={formData.imagen_url || ''}
                onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                className="input-field"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
