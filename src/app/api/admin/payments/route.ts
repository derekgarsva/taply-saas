export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getPlatformMetrics,
  getPlatformPayments,
  addPlatformPayment,
  deletePlatformPayment,
  resetPlatformMetricsAndPayments,
} from '@/lib/db';

function checkAuth(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get('taply_admin_session');
  return session?.value === 'active';
}

export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const [metrics, payments] = await Promise.all([
      getPlatformMetrics(),
      getPlatformPayments(),
    ]);

    return NextResponse.json({ metrics, payments }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar pagos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      businessId,
      businessName,
      businessSlug,
      plan,
      amount,
      currency = 'USD',
      method,
      reference,
      notes,
      status = 'completado',
    } = body;

    if (!businessName || !amount || !method) {
      return NextResponse.json(
        { error: 'Campos requeridos: businessName, amount, method' },
        { status: 400 }
      );
    }

    const newPayment = await addPlatformPayment({
      businessId: businessId || 'biz_custom',
      businessName,
      businessSlug: businessSlug || businessName.toLowerCase().replace(/\s+/g, '-'),
      plan: plan || 'Plan Inicial ($12)',
      amount: Number(amount),
      currency,
      method,
      reference: reference || 'REF-' + Math.floor(100000 + Math.random() * 900000),
      notes,
      status,
    });

    const metrics = await getPlatformMetrics();

    return NextResponse.json({ success: true, payment: newPayment, metrics });
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar pago' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const resetAll = searchParams.get('all') === 'true' || searchParams.get('action') === 'reset_metrics';

    if (resetAll) {
      await resetPlatformMetricsAndPayments();
      const metrics = await getPlatformMetrics();
      const payments = await getPlatformPayments();
      return NextResponse.json({
        success: true,
        message: 'Métricas de cobros y contadores reiniciados a cero. Los comercios y productos están intactos.',
        metrics,
        payments,
      });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID de pago o parámetro all=true requerido' }, { status: 400 });
    }

    await deletePlatformPayment(id);
    const metrics = await getPlatformMetrics();
    const payments = await getPlatformPayments();

    return NextResponse.json({ success: true, message: 'Pago eliminado exitosamente', metrics, payments });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar pago o resetear métricas' }, { status: 500 });
  }
}
