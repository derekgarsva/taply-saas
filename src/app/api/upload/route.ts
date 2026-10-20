export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    // Maximum file size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen excede el límite de 5MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const supabase = getAdminClient();

    if (supabase) {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${folder}/${Date.now()}-${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from('store-assets')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('store-assets')
          .getPublicUrl(filePath);

        return NextResponse.json({
          success: true,
          url: urlData.publicUrl,
          path: filePath,
          storage: 'supabase',
        });
      }
    }

    // Graceful fallback: Base64 data URL
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      storage: 'inline',
    });
  } catch (error) {
    console.error('Error in /api/upload:', error);
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
  }
}
