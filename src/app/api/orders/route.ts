import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByBusinessId, createOrder, updateOrderStatus } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  if (!businessId) {
    return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
  }

  const orders = await getOrdersByBusinessId(businessId);
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.businessId || !body.items || !body.total) {
      return NextResponse.json({ error: 'Datos incompletos de la orden' }, { status: 400 });
    }

    const order = await createOrder({
      businessId: body.businessId,
      items: body.items,
      total: Number(body.total),
      customerNote: body.customerNote,
      whatsappMessage: body.whatsappMessage,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar orden' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.businessId || !body.orderId || !body.status) {
      return NextResponse.json({ error: 'businessId, orderId y status son requeridos' }, { status: 400 });
    }

    const updated = await updateOrderStatus(body.businessId, body.orderId, body.status);
    if (!updated) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar orden' }, { status: 500 });
  }
}
