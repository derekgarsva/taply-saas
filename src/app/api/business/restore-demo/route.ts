export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { restoreDemoStore } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, id } = body;
    const target = slug || id;

    if (!target) {
      return NextResponse.json({ error: 'Slug o ID requerido' }, { status: 400 });
    }

    const success = await restoreDemoStore(target);
    return NextResponse.json({
      success,
      message: 'Catálogo de demostración restaurado a sus valores y productos originales.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al restaurar demo' }, { status: 500 });
  }
}
