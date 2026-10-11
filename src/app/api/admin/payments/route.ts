import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPlatformMetrics, getPlatformPayments, addPlatformPayment } from '@/lib/data';

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

    return NextResponse.json({ metrics, payments });
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
      plan: plan || 'Mensual ($19)',
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
