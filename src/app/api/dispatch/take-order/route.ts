export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { takeOrderDelivery } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, orderId, riderName } = body;

    if (!businessId || !orderId) {
      return NextResponse.json(
        { error: 'businessId y orderId son requeridos' },
        { status: 400 }
      );
    }

    const cleanRider = (riderName || '').trim() || 'Repartidor';

    // Atomic conditional mutation to take order and prevent race conditions / collisions
    const result = await takeOrderDelivery(businessId, orderId, cleanRider);

    if (!result.success) {
      if (result.code === 'ALREADY_TAKEN') {
        return NextResponse.json(
          {
            error: result.error || 'Esta orden ya fue tomada por otro repartidor.',
            code: 'ALREADY_TAKEN',
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: result.error || 'No se pudo tomar la orden' },
        { status: 400 }
      );
    }

    // STRICT PRIVACY: sanitize returned order so prices are never exposed to dispatch riders
    const sanitizedOrder = result.order
      ? {
          id: result.order.id,
          businessId: result.order.businessId,
          status: result.order.status,
          deliveryType: result.order.deliveryType,
          customerName: result.order.customerName,
          customerPhone: result.order.customerPhone,
          deliveryAddress: result.order.deliveryAddress,
          customerNote: result.order.customerNote,
          assignedTo: result.order.assignedTo,
          createdAt: result.order.createdAt,
          items: (result.order.items || []).map((it) => ({
            productId: it.productId,
            name: it.name,
            quantity: it.quantity,
          })),
        }
      : undefined;

    return NextResponse.json({
      success: true,
      message: 'Orden asignada con éxito al repartidor',
      order: sanitizedOrder,
    });
  } catch (error) {
    console.error('Error in POST /api/dispatch/take-order:', error);
    return NextResponse.json(
      { error: 'Error del servidor al asignar la orden' },
      { status: 500 }
    );
  }
}
