'use client';

// ============================================================================
// PANTALLA DE IPHONE MINIMALISTA (100% LIMPIA Y AUTOCONTENIDA — SIN MARCOS)
// ============================================================================
//  1. Pantalla de iPhone sin marcos exteriores (curva continua limpia de 48px)
//  2. Barra de estado iOS alineada al píxel (9:41 + Luna + Señal + Wi-Fi + Batería)
//  3. Dynamic Island negra completamente limpia
//  4. Video MP4 en bucle continuo a pantalla completa
//  5. Home Indicator inferior estilo Apple
// ============================================================================

import React, { useRef } from 'react';

export interface IphoneMinimalPlayerProps {
  /** Ruta de tu video por defecto (ej. "/tu-video-app.mp4" en la carpeta public) */
  defaultVideoSrc?: string;
  businessName?: string;
  slug?: string;
  themeColor?: string;
  interactive?: boolean;
}

export default function IphoneMinimalPlayer({
  defaultVideoSrc = '/tu-video-app.mp4',
}: IphoneMinimalPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div className="flex items-center justify-center">
      {/* PANTALLA DE IPHONE MINIMALISTA SIN MARCOS (Curva continua de 48px) */}
      <div
        onClick={togglePlay}
        className="relative w-[320px] sm:w-[336px] h-[670px] sm:h-[712px] rounded-[48px] overflow-hidden bg-[#050506] cursor-pointer select-none
                   shadow-[0_25px_60px_-12px_rgba(0,0,0,0.38),0_10px_24px_-8px_rgba(0,0,0,0.22)]"
        title="Toca para pausar o reproducir el video"
      >
        {/* Barra de Estado iOS + Dynamic Island (Cuadrícula óptica unificada de 12px) */}
        <div className="absolute top-0 inset-x-0 h-[52px] px-6 flex items-center justify-between z-20 text-white pointer-events-none">
          {/* Izquierda: Hora 9:41 + Luna de concentración a la misma altura */}
          <div
            className="flex items-center gap-[4px] w-[72px] h-[12px]"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}
          >
            <span className="text-[15px] font-semibold leading-none tracking-[-0.025em] inline-block translate-y-[0.5px]">
              9:41
            </span>
            <svg className="w-[11.5px] h-[11.5px] text-white shrink-0" fill="currentColor" viewBox="0 0 12 12">
              <path d="M9.65 7.92A4.65 4.65 0 0 1 4.08 2.35c0-.52.09-1.02.25-1.48A5.05 5.05 0 1 0 11.13 7.67c-.46.16-.96.25-1.48.25Z" />
            </svg>
          </div>

          {/* Centro: Dynamic Island limpia (sin puntos ni barras internas) */}
          <div className="w-[96px] h-[27px] bg-black rounded-full shadow-md" />

          {/* Derecha: Señal + Wi-Fi + Batería alineados exactamente de y=1.0 a y=11.0 */}
          <div className="flex items-center justify-end gap-[5px] w-[72px] h-[12px]">
            <svg className="w-[17px] h-[12px] shrink-0" fill="currentColor" viewBox="0 0 17 12">
              <rect x="0.5" y="7.6" width="2.55" height="3.4" rx="1" />
              <rect x="4.8" y="5.5" width="2.55" height="5.5" rx="1" />
              <rect x="9.1" y="3.3" width="2.55" height="7.7" rx="1" />
              <rect x="13.4" y="1.0" width="2.55" height="10.0" rx="1" />
            </svg>
            <svg className="w-[15.5px] h-[12px] shrink-0" fill="currentColor" viewBox="0 0 16 12">
              <path d="M8 11.0a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9Z" />
              <path d="M4.55 7.25a4.9 4.9 0 0 1 6.9 0 .85.85 0 0 0 1.2-1.2 6.6 6.6 0 0 0-9.3 0 .85.85 0 0 0 1.2 1.2Z" />
              <path d="M1.65 4.35a9.0 9.0 0 0 1 12.7 0 .85.85 0 0 0 1.2-1.2 10.7 10.7 0 0 0-15.1 0 .85.85 0 0 0 1.2 1.2Z" />
            </svg>
            <svg className="w-[24.5px] h-[12px] shrink-0" viewBox="0 0 25 12" fill="none">
              <rect x="0.75" y="1.0" width="20.5" height="10.0" rx="3.1" stroke="currentColor" strokeOpacity="0.38" strokeWidth="1" />
              <rect x="2.35" y="2.6" width="17.3" height="6.8" rx="1.7" fill="currentColor" />
              <path d="M22.6 4.25v3.5a1.75 1.75 0 0 0 0-3.5Z" fill="currentColor" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Video MP4 a pantalla completa dentro del iPhone */}
        <video
          ref={videoRef}
          src={defaultVideoSrc}
          poster="/iphone-18-pro-display.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Barra Inferior de Inicio (Home Indicator) */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-20">
          <div className="w-32 h-1 rounded-full bg-white/75" />
        </div>
      </div>
    </div>
  );
}

// Alias export to maintain backward compatibility
export { IphoneMinimalPlayer as IPhoneMockup };
