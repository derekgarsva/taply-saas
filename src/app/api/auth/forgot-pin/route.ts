import { NextRequest, NextResponse } from 'next/server';
import { requestPinRecovery } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Por favor ingresa un correo electrónico válido.' },
        { status: 400 }
      );
    }

    const result = await requestPinRecovery(email);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message, retryAfter: result.retryAfter },
        { status: 429 } // Too Many Requests
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      retryAfter: result.retryAfter,
      devToken: result.devToken,
    });
  } catch (error) {
    console.error('Error in /api/auth/forgot-pin:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar la solicitud de recuperación.' },
      { status: 500 }
    );
  }
}
