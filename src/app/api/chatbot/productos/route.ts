/**
 * Products API
 * CRUD operations for mezcal products catalog
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';

/**
 * GET: List all products for palenque
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const palenqueId = (session.user as any)?.palenqueId;

    if (userRole !== 'palenque' || !palenqueId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const activo = searchParams.get('activo');
    const destacado = searchParams.get('destacado');
    const tipoAgave = searchParams.get('tipo_agave');

    // Build query
    let query = `
      SELECT * FROM productos_mezcal
      WHERE palenque_id = $1
    `;
    const params: any[] = [palenqueId];
    let paramIndex = 2;

    if (activo !== null) {
      query += ` AND activo = $${paramIndex++}`;
      params.push(activo === 'true');
    }

    if (destacado !== null) {
      query += ` AND destacado = $${paramIndex++}`;
      params.push(destacado === 'true');
    }

    if (tipoAgave) {
      query += ` AND tipo_agave ILIKE $${paramIndex++}`;
      params.push(`%${tipoAgave}%`);
    }

    query += ` ORDER BY destacado DESC, orden_display ASC, nombre ASC`;

    const result = await queryMezcal(query, params);

    return NextResponse.json({
      productos: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create new product
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const palenqueId = (session.user as any)?.palenqueId;

    if (userRole !== 'palenque' || !palenqueId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
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

    // Validations
    if (!nombre || !presentaciones) {
      return NextResponse.json(
        { error: 'Nombre y presentaciones son requeridos' },
        { status: 400 }
      );
    }

    if (!Array.isArray(presentaciones) || presentaciones.length === 0) {
      return NextResponse.json(
        { error: 'Debe incluir al menos una presentación' },
        { status: 400 }
      );
    }

    // Validate presentaciones format
    for (const pres of presentaciones) {
      if (!pres.ml || !pres.precio || pres.stock === undefined) {
        return NextResponse.json(
          { error: 'Cada presentación debe tener ml, precio y stock' },
          { status: 400 }
        );
      }
    }

    // Check if SKU already exists for this palenque
    if (sku) {
      const existingSku = await queryMezcal(
        'SELECT id FROM productos_mezcal WHERE palenque_id = $1 AND sku = $2',
        [palenqueId, sku]
      );

      if (existingSku.rows.length > 0) {
        return NextResponse.json(
          { error: 'Ya existe un producto con ese SKU' },
          { status: 400 }
        );
      }
    }

    // Insert product
    const result = await queryMezcal(
      `INSERT INTO productos_mezcal (
        palenque_id, sku, nombre, descripcion, tipo_agave, grados_alcohol,
        presentaciones, proceso, region, imagen_url, activo, destacado, orden_display
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        palenqueId,
        sku || null,
        nombre,
        descripcion || null,
        tipo_agave || null,
        grados_alcohol || null,
        JSON.stringify(presentaciones),
        proceso || null,
        region || null,
        imagen_url || null,
        activo !== undefined ? activo : true,
        destacado !== undefined ? destacado : false,
        orden_display || 0,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        producto: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}
