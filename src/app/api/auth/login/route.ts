export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyOwnerPin } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, pin } = body;

    if (!identifier || !pin) {
      return NextResponse.json(
        { error: 'Correo/tienda y PIN son requeridos.' },
        { status: 400 }
      );
    }

    const result = await verifyOwnerPin(identifier, pin);

    if (!result.success || !result.business) {
      return NextResponse.json(
        { error: result.error || 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    // Set secure owner session cookie
    const cookieStore = cookies();
    cookieStore.set('taply_owner_session', JSON.stringify({
      businessId: result.business.id,
      slug: result.business.slug,
      authenticatedAt: new Date().toISOString(),
    }), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({
      success: true,
      business: {
        id: result.business.id,
        slug: result.business.slug,
        name: result.business.name,
      },
    });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    return NextResponse.json({ error: 'Error del servidor al iniciar sesión.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const store = searchParams.get('store');
    const cookieStore = cookies();

    const adminSession = cookieStore.get('taply_admin_session');
    if (adminSession?.value === 'active') {
      return NextResponse.json({
        authenticated: true,
        isAdmin: true,
        business: store ? { slug: store } : null,
      });
    }

    const ownerSessionCookie = cookieStore.get('taply_owner_session');
    if (!ownerSessionCookie?.value) {
      return NextResponse.json({ authenticated: false });
    }

    const session = JSON.parse(ownerSessionCookie.value);
    if (!session?.businessId && !session?.slug) {
      return NextResponse.json({ authenticated: false });
    }

    if (store) {
      const match =
        session.slug?.toLowerCase() === store.toLowerCase() ||
        session.businessId?.toLowerCase() === store.toLowerCase();
      return NextResponse.json({
        authenticated: match,
        business: match ? session : null,
        isAdmin: false,
      });
    }

    return NextResponse.json({
      authenticated: true,
      business: session,
      isAdmin: false,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('taply_owner_session');
  return NextResponse.json({ success: true, message: 'Sesión de dueño cerrada' });
}
