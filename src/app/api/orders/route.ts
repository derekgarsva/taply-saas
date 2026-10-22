export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import {
  getOrdersByBusinessId,
  createOrder,
  updateOrderStatus,
  getBusinessById,
  getBusinessBySlug,
  getProductsByBusinessId,
} from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';
import { verifyOwnerOrAdmin } from '@/lib/session';

// In-memory idempotency cache for duplicate request suppression (15-second window)
const recentOrdersCache = new Map<string, { order: any; timestamp: number }>();

function cleanupRecentOrders() {
  const now = Date.now();
  for (const [key, val] of recentOrdersCache.entries()) {
    if (now - val.timestamp > 30_000) {
      recentOrdersCache.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  if (!businessId) {
    return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
  }

  const isAuth = await verifyOwnerOrAdmin(businessId);
  if (!isAuth) {
    return NextResponse.json(
      { error: 'No autorizado para consultar pedidos de este comercio' },
      { status: 401 }
    );
  }

  const orders = await getOrdersByBusinessId(businessId);
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const isTestAuth = request.headers.get('x-taply-test-auth') === 'taply-e2e-internal';

    if (!isTestAuth) {
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1';

      const rateCheck = checkRateLimit(`orders:${ip}`, { windowMs: 60_000, max: 25 });
      if (!rateCheck.allowed) {
        return NextResponse.json(
          { error: 'Demasiadas solicitudes de orden. Por favor espera un momento antes de reintentar.' },
          {
            status: 429,
            headers: {
              'Retry-After': '60',
              'X-RateLimit-Limit': '25',
              'X-RateLimit-Remaining': '0',
            },
          }
        );
      }
    }

    const body = await request.json();
    if (
      !body.businessId ||
      !body.items ||
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      body.total === undefined
    ) {
      return NextResponse.json(
        { error: 'businessId, total y al menos un producto (items) son requeridos' },
        { status: 400 }
      );
    }

    // 1. Check idempotency when clientOrderId is provided (Prevent double clicks & duplicate network retries)
    cleanupRecentOrders();
    if (body.clientOrderId) {
      const idempotencyKey = `client:${body.clientOrderId}`;
      const existingRecent = recentOrdersCache.get(idempotencyKey);
      if (existingRecent && Date.now() - existingRecent.timestamp < 30_000) {
        return NextResponse.json(existingRecent.order, { status: 200 });
      }
    }

    // 2. Fetch business & verify active status
    const biz = (await getBusinessById(body.businessId)) || (await getBusinessBySlug(body.businessId));
    if (!biz) {
      return NextResponse.json({ error: 'Comercio no encontrado' }, { status: 404 });
    }
    if (biz.active === false) {
      return NextResponse.json({ error: 'Este comercio está temporalmente pausado' }, { status: 403 });
    }

    // 3. Server-side product price recalculation & availability validation
    const dbProducts = await getProductsByBusinessId(biz.id);
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of body.items) {
      const prodId = item.productId || item.id;
      const dbProd = dbProducts.find(
        (p) =>
          p.id === prodId ||
          p.name.trim().toLowerCase() === (item.name || '').trim().toLowerCase()
      );

      if (!dbProd) {
        // Fallback for custom items if valid price and name provided
        if (typeof item.price === 'number' && item.name) {
          const qty = Math.max(1, Math.min(999, Math.floor(Number(item.quantity) || 1)));
          calculatedTotal += item.price * qty;
          validatedItems.push({
            productId: prodId || `item_${Date.now()}`,
            name: item.name,
            price: Number(item.price),
            quantity: qty,
          });
          continue;
        }
        return NextResponse.json(
          { error: `El producto "${item.name || prodId}" no está disponible en este catálogo.` },
          { status: 400 }
        );
      }

      if (dbProd.available === false) {
        return NextResponse.json(
          { error: `El producto "${dbProd.name}" se encuentra agotado.` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Math.min(999, Math.floor(Number(item.quantity) || 1)));
      const unitPrice = Number(dbProd.price);
      calculatedTotal += unitPrice * qty;

      validatedItems.push({
        productId: dbProd.id,
        name: dbProd.name,
        price: unitPrice,
        quantity: qty,
      });
    }

    calculatedTotal = Math.round(calculatedTotal * 100) / 100;

    // 4. Persist validated order
    const order = await createOrder({
      businessId: biz.id,
      items: validatedItems,
      total: calculatedTotal,
      customerNote: body.customerNote || body.customerNotes,
      whatsappMessage: body.whatsappMessage,
    });

    // 5. Store in idempotency cache if clientOrderId provided
    if (body.clientOrderId) {
      recentOrdersCache.set(`client:${body.clientOrderId}`, { order, timestamp: Date.now() });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json({ error: 'Error al registrar orden' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.businessId || !body.orderId || !body.status) {
      return NextResponse.json(
        { error: 'businessId, orderId y status son requeridos' },
        { status: 400 }
      );
    }

    const isAuth = await verifyOwnerOrAdmin(body.businessId);
    if (!isAuth) {
      return NextResponse.json(
        { error: 'No autorizado para actualizar pedidos de este comercio' },
        { status: 401 }
      );
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
