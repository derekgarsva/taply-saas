import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllBusinessesWithStats, toggleBusinessStatus, setBusinessActive, updateBusiness } from '@/lib/db';

function checkAuth(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get('taply_admin_session');
  return session?.value === 'active';
}

export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const businesses = await getAllBusinessesWithStats();
    return NextResponse.json({ businesses });
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar negocios' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, active, plan } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID o slug requerido' }, { status: 400 });
    }

    let updated;
    if (plan !== undefined) {
      updated = await updateBusiness(id, { plan });
    } else if (typeof active === 'boolean') {
      updated = await setBusinessActive(id, active);
    } else {
      updated = await toggleBusinessStatus(id);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, business: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar estado' }, { status: 500 });
  }
}
