/**
 * Dashboard Metrics API (for Palenques)
 * Returns metrics specific to the logged-in palenque
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queryMezcal } from '@/lib/db-mezcal';

export async function GET() {
  try {
    // Get session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const user = session.user as any;
    const palenqueId = user.palenqueId;

    // Admins can access but need palenqueId in query
    // Palenques can only see their own data
    if (user.role === 'palenque' && !palenqueId) {
      return NextResponse.json(
        { error: 'Usuario sin palenque asignado' },
        { status: 403 }
      );
    }

    // Get palenque info
    const palenqueResult = await queryMezcal(
      'SELECT nombre, plan FROM palenques WHERE id = $1',
      [palenqueId]
    );

    if (palenqueResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Palenque no encontrado' },
        { status: 404 }
      );
    }

    const palenque = palenqueResult.rows[0];

    // Get metrics in parallel
    const [
      totalLeadsResult,
      leadsThisMonthResult,
      leadsByStateResult,
      leadsByOriginResult,
      conversionRateResult,
      leadsOverTimeResult,
    ] = await Promise.all([
      // Total leads
      queryMezcal(
        'SELECT COUNT(*) as total FROM leads WHERE palenque_id = $1',
        [palenqueId]
      ),

      // Leads this month
      queryMezcal(
        `SELECT COUNT(*) as total
         FROM leads
         WHERE palenque_id = $1
         AND fecha_captura >= date_trunc('month', CURRENT_DATE)`,
        [palenqueId]
      ),

      // Leads by state (funnel)
      queryMezcal(
        `SELECT
           estado,
           COUNT(*) as count
         FROM leads
         WHERE palenque_id = $1
         GROUP BY estado
         ORDER BY
           CASE estado
             WHEN 'nuevo' THEN 1
             WHEN 'contactado' THEN 2
             WHEN 'respondio' THEN 3
             WHEN 'convertido' THEN 4
             WHEN 'inactivo' THEN 5
             WHEN 'opt_out' THEN 6
           END`,
        [palenqueId]
      ),

      // Leads by origin
      queryMezcal(
        `SELECT
           origen,
           COUNT(*) as count
         FROM leads
         WHERE palenque_id = $1
         GROUP BY origen
         ORDER BY count DESC`,
        [palenqueId]
      ),

      // Conversion rate
      queryMezcal(
        `SELECT
           COUNT(CASE WHEN estado = 'convertido' THEN 1 END)::float / NULLIF(COUNT(*)::float, 0) * 100 as rate
         FROM leads
         WHERE palenque_id = $1`,
        [palenqueId]
      ),

      // Leads over time (last 30 days)
      queryMezcal(
        `SELECT
           DATE(fecha_captura) as fecha,
           COUNT(*) as count,
           COUNT(CASE WHEN estado = 'convertido' THEN 1 END) as convertidos
         FROM leads
         WHERE palenque_id = $1
         AND fecha_captura >= CURRENT_DATE - INTERVAL '30 days'
         GROUP BY DATE(fecha_captura)
         ORDER BY fecha`,
        [palenqueId]
      ),
    ]);

    // Process funnel data
    const funnel = {
      nuevo: 0,
      contactado: 0,
      respondio: 0,
      convertido: 0,
      inactivo: 0,
      opt_out: 0,
    };

    leadsByStateResult.rows.forEach((row: any) => {
      funnel[row.estado as keyof typeof funnel] = parseInt(row.count);
    });

    // Process origin data
    const leadsByOrigin = leadsByOriginResult.rows.map((row: any) => ({
      origen: row.origen,
      count: parseInt(row.count),
    }));

    // Process time series data
    const leadsOverTime = leadsOverTimeResult.rows.map((row: any) => ({
      fecha: row.fecha,
      count: parseInt(row.count),
      convertidos: parseInt(row.convertidos || '0'),
    }));

    const metrics = {
      palenque: palenque.nombre,
      plan: palenque.plan,
      totalLeads: parseInt(totalLeadsResult.rows[0]?.total || '0'),
      leadsThisMonth: parseInt(leadsThisMonthResult.rows[0]?.total || '0'),
      conversionRate: parseFloat(conversionRateResult.rows[0]?.rate || '0').toFixed(1),
      funnel,
      leadsByOrigin,
      leadsOverTime,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Error al obtener métricas' },
      { status: 500 }
    );
  }
}
