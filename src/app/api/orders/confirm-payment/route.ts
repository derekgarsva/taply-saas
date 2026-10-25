export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { confirmOrderAndDeductStock } from '@/lib/db';
import { verifyOwnerOrAdmin } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, orderId } = body;

    if (!businessId || !orderId) {
      return NextResponse.json(
        { error: 'businessId y orderId son requeridos' },
        { status: 400 }
      );
    }

    const isAuth = await verifyOwnerOrAdmin(businessId);
    if (!isAuth) {
      return NextResponse.json(
        { error: 'No autorizado para confirmar pagos de este comercio' },
        { status: 401 }
      );
    }

    const result = await confirmOrderAndDeductStock(businessId, orderId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'No se pudo confirmar el pago de la orden' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      status: 'pagado',
      order: result.order,
      message: 'Pago confirmado y stock actualizado exitosamente',
    });
  } catch (error: any) {
    console.error('Error in POST /api/orders/confirm-payment:', error);
    return NextResponse.json(
      { error: 'Error del servidor al confirmar pago' },
      { status: 500 }
    );
  }
}
