export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { getDispatchOrders } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || searchParams.get('slug');

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId o slug es requerido' },
        { status: 400 }
      );
    }

    const result = await getDispatchOrders(businessId);
    if (!result) {
      return NextResponse.json(
        { error: 'Comercio no encontrado' },
        { status: 404 }
      );
    }

    // STRICT PRIVACY: Returns ONLY orders with status in ('pagado', 'en_camino')
    // No prices, no totals, no revenues, no financial settings.
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/dispatch/orders:', error);
    return NextResponse.json(
      { error: 'Error al consultar órdenes de despacho' },
      { status: 500 }
    );
  }
}
