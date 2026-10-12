import { NextRequest, NextResponse } from 'next/server';
import { getBusinessBySlug, getProductsByBusinessId, getCategoriesByBusinessId, recordPageView } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const business = await getBusinessBySlug(params.slug);
    if (!business) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    // Fire & forget page view tracking
    recordPageView(business.id).catch(() => {});

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
