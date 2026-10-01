import { NextRequest, NextResponse } from 'next/server';
import { getCategoriesByBusinessId, addCategory, deleteCategory } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  if (!businessId) {
    return NextResponse.json({ error: 'businessId es requerido' }, { status: 400 });
  }

  const categories = await getCategoriesByBusinessId(businessId);
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.businessId || !body.name) {
      return NextResponse.json({ error: 'businessId y nombre son requeridos' }, { status: 400 });
    }

    const created = await addCategory(body.businessId, body.name.trim());
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al agregar categoría' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const categoryId = searchParams.get('categoryId');

    if (!businessId || !categoryId) {
      return NextResponse.json({ error: 'businessId y categoryId son requeridos' }, { status: 400 });
    }

    const success = await deleteCategory(businessId, categoryId);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 });
  }
}
