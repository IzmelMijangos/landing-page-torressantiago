/**
 * Single Product API
 * GET, PATCH, DELETE operations for individual products
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';

/**
 * GET: Get single product
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const productId = parseInt(params.id);
    const palenqueId = (session.user as any)?.palenqueId;

    const result = await queryMezcal(
      `SELECT * FROM productos_mezcal WHERE id = $1 AND palenque_id = $2`,
      [productId, palenqueId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      producto: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Update product
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const palenqueId = (session.user as any)?.palenqueId;
    const productId = parseInt(params.id);

    if (userRole !== 'palenque' || !palenqueId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Verify product belongs to palenque
    const existingProduct = await queryMezcal(
      'SELECT id FROM productos_mezcal WHERE id = $1 AND palenque_id = $2',
      [productId, palenqueId]
    );

    if (existingProduct.rows.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      sku,
      nombre,
      descripcion,
      tipo_agave,
      grados_alcohol,
      presentaciones,
      proceso,
      region,
      imagen_url,
      activo,
      destacado,
      orden_display,
    } = body;

    // Validate presentaciones if provided
    if (presentaciones) {
      if (!Array.isArray(presentaciones) || presentaciones.length === 0) {
        return NextResponse.json(
          { error: 'Debe incluir al menos una presentación' },
          { status: 400 }
        );
      }

      for (const pres of presentaciones) {
        if (!pres.ml || !pres.precio || pres.stock === undefined) {
          return NextResponse.json(
            { error: 'Cada presentación debe tener ml, precio y stock' },
            { status: 400 }
          );
        }
      }
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (sku !== undefined) {
      updates.push(`sku = $${paramIndex++}`);
      values.push(sku);
    }

    if (nombre !== undefined) {
      updates.push(`nombre = $${paramIndex++}`);
      values.push(nombre);
    }

    if (descripcion !== undefined) {
      updates.push(`descripcion = $${paramIndex++}`);
      values.push(descripcion);
    }

    if (tipo_agave !== undefined) {
      updates.push(`tipo_agave = $${paramIndex++}`);
      values.push(tipo_agave);
    }

    if (grados_alcohol !== undefined) {
      updates.push(`grados_alcohol = $${paramIndex++}`);
      values.push(grados_alcohol);
    }

    if (presentaciones !== undefined) {
      updates.push(`presentaciones = $${paramIndex++}`);
      values.push(JSON.stringify(presentaciones));
    }

    if (proceso !== undefined) {
      updates.push(`proceso = $${paramIndex++}`);
      values.push(proceso);
    }

    if (region !== undefined) {
      updates.push(`region = $${paramIndex++}`);
      values.push(region);
    }

    if (imagen_url !== undefined) {
      updates.push(`imagen_url = $${paramIndex++}`);
      values.push(imagen_url);
    }

    if (activo !== undefined) {
      updates.push(`activo = $${paramIndex++}`);
      values.push(activo);
    }

    if (destacado !== undefined) {
      updates.push(`destacado = $${paramIndex++}`);
      values.push(destacado);
    }

    if (orden_display !== undefined) {
      updates.push(`orden_display = $${paramIndex++}`);
      values.push(orden_display);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No hay campos para actualizar' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = NOW()`);

    // Add product ID for WHERE clause
    values.push(productId);
    values.push(palenqueId);

    const query = `
      UPDATE productos_mezcal
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex++} AND palenque_id = $${paramIndex}
      RETURNING *
    `;

    const result = await queryMezcal(query, values);

    return NextResponse.json({
      success: true,
      producto: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete (deactivate) product
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const palenqueId = (session.user as any)?.palenqueId;
    const productId = parseInt(params.id);

    if (userRole !== 'palenque' || !palenqueId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Soft delete - just deactivate
    const result = await queryMezcal(
      `UPDATE productos_mezcal
       SET activo = FALSE, updated_at = NOW()
       WHERE id = $1 AND palenque_id = $2
       RETURNING id, nombre`,
      [productId, palenqueId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Producto "${result.rows[0].nombre}" desactivado`,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}
