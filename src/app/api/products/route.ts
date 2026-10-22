export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { getProductsByBusinessId, saveProduct, deleteProduct, getBusinessById, getBusinessBySlug } from '@/lib/db';
import { verifyOwnerOrAdmin } from '@/lib/session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  if (!businessId) {
    return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
  }

  const products = await getProductsByBusinessId(businessId);
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.businessId || !body.name || body.price === undefined) {
      return NextResponse.json({ error: 'businessId, nombre y precio son requeridos' }, { status: 400 });
    }

    const isAuth = await verifyOwnerOrAdmin(body.businessId);
    if (!isAuth) {
      return NextResponse.json({ error: 'No autorizado para gestionar productos de este comercio' }, { status: 401 });
    }

    // Enforcement: Check plan product limits on creation (not when editing an existing product)
    const isNewProduct = !body.id;
    if (isNewProduct) {
      const biz = (await getBusinessById(body.businessId)) || (await getBusinessBySlug(body.businessId));
      if (biz) {
        const plan = (biz.plan || 'Plan Inicial').toLowerCase();
        const isUnlimited =
          plan.includes('big') ||
          plan.includes('34') ||
          plan.includes('37') ||
          plan.includes('anual') ||
          plan.includes('ilimitado');

        if (!isUnlimited) {
          const currentProducts = await getProductsByBusinessId(biz.id);
          if (currentProducts.length >= 100) {
            return NextResponse.json(
              {
                error: 'Has alcanzado el límite máximo de 100 productos del Plan Inicial ($12/mes). Para desbloquear productos ilimitados, solicita el plan Big Taply con el fundador.',
                limitReached: true,
                maxAllowed: 100,
                currentCount: currentProducts.length,
              },
              { status: 403 }
            );
          }
        }
      }
    }

    const saved = await saveProduct(body.businessId, body);
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar producto' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const productId = searchParams.get('productId');

    if (!businessId || !productId) {
      return NextResponse.json({ error: 'businessId y productId son requeridos' }, { status: 400 });
    }

    const isAuth = await verifyOwnerOrAdmin(businessId);
    if (!isAuth) {
      return NextResponse.json({ error: 'No autorizado para eliminar productos de este comercio' }, { status: 401 });
    }

    const success = await deleteProduct(businessId, productId);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
