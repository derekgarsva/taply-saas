import { NextRequest, NextResponse } from 'next/server';
import { getBusinessBySlug, getBusinessById, getAllBusinesses, updateBusiness, createBusiness } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  if (slug) {
    const biz = await getBusinessBySlug(slug);
    if (!biz) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(biz);
  }

  if (id) {
    const biz = await getBusinessById(id);
    if (!biz) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(biz);
  }

  // Return all or default
  const list = await getAllBusinesses();
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Nombre y URL (slug) son requeridos' }, { status: 400 });
    }

    const cleanSlug = body.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const existing = await getBusinessBySlug(cleanSlug);
    if (existing) {
      return NextResponse.json({ error: 'Esta dirección web ya está en uso' }, { status: 409 });
    }

    const created = await createBusiness({
      slug: cleanSlug,
      name: body.name.trim(),
      category: body.category || 'RETAIL / TIENDA',
      city: body.city || 'Venezuela',
      desc: body.desc || '',
      bannerImage: body.bannerImage || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      logoImage: body.logoImage || '',
      themeColor: body.themeColor || '#00594C',
      phone: body.phone || '',
      currency: body.currency || 'USD',
      currencySymbol: body.currencySymbol || '$',
      paymentNotes: body.paymentNotes || '• Pago Móvil\n• Zelle\n• Efectivo al retirar',
      links: body.links || [],
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear negocio' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID de negocio es requerido' }, { status: 400 });
    }

    const updated = await updateBusiness(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar negocio' }, { status: 500 });
  }
}
