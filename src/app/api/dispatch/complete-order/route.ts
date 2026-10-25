export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { completeOrderDelivery } from '@/lib/db';

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

    const result = await completeOrderDelivery(businessId, orderId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'No se pudo completar la orden' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Orden marcada como entregada',
      orderId,
    });
  } catch (error) {
    console.error('Error in POST /api/dispatch/complete-order:', error);
    return NextResponse.json(
      { error: 'Error del servidor al completar la orden' },
      { status: 500 }
    );
  }
}
