import { NextRequest, NextResponse } from 'next/server';
import { getProductsByBusinessId, saveProduct, deleteProduct } from '@/lib/data';

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

    const success = await deleteProduct(businessId, productId);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
