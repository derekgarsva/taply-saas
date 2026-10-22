export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { getBusinessBySlug, getProductsByBusinessId, getCategoriesByBusinessId, recordPageView } from '@/lib/db';
import { sanitizePublicBusiness } from '@/lib/session';

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

    return NextResponse.json(
      {
        business: sanitizePublicBusiness(business),
        products,
        categories,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
