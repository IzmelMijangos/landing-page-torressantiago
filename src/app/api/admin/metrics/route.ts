/**
 * Admin Metrics API
 * Returns dashboard metrics for admin panel
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';

export async function GET() {
  try {
    // Verify admin session
    const session = await getServerSession(authOptions);

    if (!session || ((session.user as any)?.role !== 'admin' && (session.user as any)?.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get metrics in parallel
    const [palenquesResult, leadsResult, leadsThisMonthResult, leadsLastMonthResult] = await Promise.all([
      // Total palenques
      queryMezcal('SELECT COUNT(*) as total FROM palenques WHERE activo = TRUE'),

      // Total leads
      queryMezcal('SELECT COUNT(*) as total FROM leads'),

      // Leads this month
      queryMezcal(`
        SELECT COUNT(*) as total
        FROM leads
        WHERE fecha_captura >= date_trunc('month', CURRENT_DATE)
      `),

      // Leads last month
      queryMezcal(`
        SELECT COUNT(*) as total
        FROM leads
        WHERE fecha_captura >= date_trunc('month', CURRENT_DATE - interval '1 month')
          AND fecha_captura < date_trunc('month', CURRENT_DATE)
      `),
    ]);

    // Get conversion rate (leads with status = 'convertido')
    const conversionResult = await queryMezcal(`
      SELECT
        COUNT(CASE WHEN estado = 'convertido' THEN 1 END)::float / NULLIF(COUNT(*)::float, 0) * 100 as rate
      FROM leads
    `);

    // Get recent palenques (last 5)
    const recentPalenquesResult = await queryMezcal(`
      SELECT
        id,
        nombre,
        telefono_contacto,
        email_contacto,
        plan,
        fecha_registro,
        activo
      FROM palenques
      ORDER BY fecha_registro DESC
      LIMIT 5
    `);

    const metrics = {
      totalPalenques: parseInt(palenquesResult.rows[0]?.total || '0'),
      totalLeads: parseInt(leadsResult.rows[0]?.total || '0'),
      leadsThisMonth: parseInt(leadsThisMonthResult.rows[0]?.total || '0'),
      leadsLastMonth: parseInt(leadsLastMonthResult.rows[0]?.total || '0'),
      conversionRate: parseFloat(conversionResult.rows[0]?.rate || '0').toFixed(1),
      recentPalenques: recentPalenquesResult.rows,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Error al obtener métricas' },
      { status: 500 }
    );
  }
}
