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
      newTodayResult,
      waitingResponseResult,
      highRatingUnconvertedResult,
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

      // New leads today (not contacted)
      queryMezcal(
        `SELECT COUNT(*) as total
         FROM leads
         WHERE palenque_id = $1
         AND estado = 'nuevo'
         AND DATE(fecha_captura) = CURRENT_DATE`,
        [palenqueId]
      ),

      // Waiting response >48hrs (contacted but no recent interaction)
      queryMezcal(
        `SELECT COUNT(*) as total
         FROM leads
         WHERE palenque_id = $1
         AND estado = 'contactado'
         AND (fecha_ultima_interaccion IS NULL OR fecha_ultima_interaccion < NOW() - INTERVAL '48 hours')`,
        [palenqueId]
      ),

      // High rating (5 stars) not converted
      queryMezcal(
        `SELECT COUNT(*) as total
         FROM leads
         WHERE palenque_id = $1
         AND experiencia_calificacion = 5
         AND estado != 'convertido'`,
        [palenqueId]
      ),
    ]);

    // Get revenue and MoM metrics
    const [
      revenueThisMonthResult,
      revenueLastMonthResult,
      bestHourResult,
      bestDayResult,
    ] = await Promise.all([
      // Revenue this month
      queryMezcal(
        `SELECT COALESCE(SUM(monto), 0) as total
         FROM conversiones
         WHERE palenque_id = $1
         AND fecha_conversion >= date_trunc('month', CURRENT_DATE)
         AND estado IN ('pagado', 'enviado', 'entregado')`,
        [palenqueId]
      ),

      // Revenue last month
      queryMezcal(
        `SELECT COALESCE(SUM(monto), 0) as total
         FROM conversiones
         WHERE palenque_id = $1
         AND fecha_conversion >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
         AND fecha_conversion < date_trunc('month', CURRENT_DATE)
         AND estado IN ('pagado', 'enviado', 'entregado')`,
        [palenqueId]
      ),

      // Best hour for conversions
      queryMezcal(
        `SELECT EXTRACT(HOUR FROM fecha_conversion) as hora, COUNT(*) as total
         FROM conversiones
         WHERE palenque_id = $1
         AND estado IN ('pagado', 'enviado', 'entregado')
         GROUP BY EXTRACT(HOUR FROM fecha_conversion)
         ORDER BY total DESC
         LIMIT 1`,
        [palenqueId]
      ),

      // Best day for conversions
      queryMezcal(
        `SELECT
           CASE EXTRACT(DOW FROM fecha_conversion)
             WHEN 0 THEN 'Domingo'
             WHEN 1 THEN 'Lunes'
             WHEN 2 THEN 'Martes'
             WHEN 3 THEN 'Miércoles'
             WHEN 4 THEN 'Jueves'
             WHEN 5 THEN 'Viernes'
             WHEN 6 THEN 'Sábado'
           END as dia,
           COUNT(*) as total
         FROM conversiones
         WHERE palenque_id = $1
         AND estado IN ('pagado', 'enviado', 'entregado')
         GROUP BY EXTRACT(DOW FROM fecha_conversion)
         ORDER BY total DESC
         LIMIT 1`,
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

    // Calculate MoM change
    const revenueThisMonth = parseFloat(revenueThisMonthResult.rows[0]?.total || '0');
    const revenueLastMonth = parseFloat(revenueLastMonthResult.rows[0]?.total || '0');
    const revenueMoMChange = revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100).toFixed(1)
      : revenueThisMonth > 0 ? '100.0' : '0.0';

    const bestHour = bestHourResult.rows[0]?.hora
      ? `${bestHourResult.rows[0].hora}:00`
      : 'N/A';
    const bestDay = bestDayResult.rows[0]?.dia || 'N/A';

    const metrics = {
      palenque: palenque.nombre,
      plan: palenque.plan,
      totalLeads: parseInt(totalLeadsResult.rows[0]?.total || '0'),
      leadsThisMonth: parseInt(leadsThisMonthResult.rows[0]?.total || '0'),
      conversionRate: parseFloat(conversionRateResult.rows[0]?.rate || '0').toFixed(1),
      funnel,
      leadsByOrigin,
      leadsOverTime,
      // Alerts data
      alerts: {
        newToday: parseInt(newTodayResult.rows[0]?.total || '0'),
        waitingResponse: parseInt(waitingResponseResult.rows[0]?.total || '0'),
        highRatingUnconverted: parseInt(highRatingUnconvertedResult.rows[0]?.total || '0'),
      },
      // Revenue and MoM metrics
      revenue: {
        thisMonth: revenueThisMonth,
        lastMonth: revenueLastMonth,
        momChange: parseFloat(revenueMoMChange),
        bestHour,
        bestDay,
      },
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
