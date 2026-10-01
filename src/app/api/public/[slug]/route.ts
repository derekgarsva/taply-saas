import { NextRequest, NextResponse } from 'next/server';
import { getBusinessBySlug, getProductsByBusinessId, getCategoriesByBusinessId } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const business = await getBusinessBySlug(params.slug);
    if (!business) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    const [products, categories] = await Promise.all([
      getProductsByBusinessId(business.id),
      getCategoriesByBusinessId(business.id),
    ]);

    return NextResponse.json({
      business,
      products,
      categories,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
