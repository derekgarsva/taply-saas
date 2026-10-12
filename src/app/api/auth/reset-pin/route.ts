import { NextRequest, NextResponse } from 'next/server';
import { resetOwnerPin } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, newPin } = body;

    if (!email || !token || !newPin) {
      return NextResponse.json(
        { error: 'Correo, código de seguridad y nuevo PIN son obligatorios.' },
        { status: 400 }
      );
    }

    const result = await resetOwnerPin(email, token, newPin);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Código incorrecto o expirado.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'Tu PIN ha sido actualizado exitosamente.',
    });
  } catch (error) {
    console.error('Error in /api/auth/reset-pin:', error);
    return NextResponse.json(
      { error: 'Error del servidor al restablecer PIN.' },
      { status: 500 }
    );
  }
}
