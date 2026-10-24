'use client';

// ============================================================================
// VERSIÓN EXCLUSIVA MINIMALISTA (100% COMPLETA Y AUTOCONTENIDA — SIN MARCOS)
// ============================================================================
// NO necesitas copiar nada de las otras pestañas. Este archivo ya incluye TODO:
//  1. Pantalla de iPhone sin marcos exteriores (curva continua limpia de 48px)
//  2. Barra de estado iOS alineada al píxel (9:41 + Luna + Señal + Wi-Fi + Batería)
//  3. Dynamic Island negra completamente limpia
//  4. Scrubber elástico estilo Skiper 91 con vista previa de tiempo al pasar el mouse
//  5. Soporte integrado para tu propio archivo .mp4 fijo, subir archivo local o URL
//
// Dependencias (si usas React / Next.js):
//   npm install framer-motion lucide-react
// ============================================================================

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Upload, Link as LinkIcon } from "lucide-react";

export interface IphoneMinimalPlayerProps {
  /** Ruta de tu video por defecto (ej. "/demo-app.mp4" en la carpeta public) */
  defaultVideoSrc?: string;
  /** Muestra u oculta el selector para cargar un archivo MP4 local o URL */
  showVideoLoader?: boolean;
  businessName?: string;
  slug?: string;
  themeColor?: string;
  interactive?: boolean;
}

export default function IphoneMinimalPlayer({
  defaultVideoSrc = "/tu-video-app.mp4",
  showVideoLoader = true,
}: IphoneMinimalPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>(defaultVideoSrc);
  const [urlInput, setUrlInput] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(43);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPct, setHoverPct] = useState<number>(0);
  const [stretchX, setStretchX] = useState<number>(0);

  const formatTime = (sec: number) => {
    const s = Math.max(0, Math.floor(sec || 0));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const handleScrub = (clientX: number) => {
    if (!trackRef.current || !videoRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const rawRatio = (clientX - rect.left) / rect.width;
    const clamped = Math.min(1, Math.max(0, rawRatio));
    const newTime = clamped * (duration || 1);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);

    // Efecto elástico en los extremos (Skiper 91)
    if (rawRatio < 0) setStretchX(Math.max(-18, rawRatio * 45));
    else if (rawRatio > 1) setStretchX(Math.min(18, (rawRatio - 1) * 45));
    else setStretchX(0);
  };

  // Cargar archivo .mp4 / .mov local desde tu computadora
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setVideoSrc(localUrl);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Cargar video desde URL directa
  const handleUrlLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setVideoSrc(urlInput.trim());
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 sm:p-10 rounded-[44px] bg-[#efefe9] dark:bg-[#121216]">
      {/* Opcional: Barra para cargar archivo MP4 local o URL en vivo */}
      {showVideoLoader && (
        <div className="w-full max-w-[336px] flex flex-col gap-2 bg-white/80 dark:bg-zinc-900/90 p-3 rounded-2xl border border-black/5 dark:border-white/10 text-xs shadow-sm">
          <label className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold cursor-pointer hover:opacity-90 transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Subir archivo .MP4 / .MOV local</span>
            <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleFileUpload} className="hidden" />
          </label>
          <form onSubmit={handleUrlLoad} className="flex gap-1.5">
            <div className="relative flex-1">
              <LinkIcon className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://.../mi-video.mp4"
                className="w-full pl-7 pr-2 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none text-[11px]"
              />
            </div>
            <button type="submit" className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 font-semibold text-xs hover:bg-zinc-300 dark:hover:bg-zinc-600 transition">
              Cargar
            </button>
          </form>
        </div>
      )}

      {/* PANTALLA DE IPHONE MINIMALISTA SIN MARCOS (Curva continua de 48px) */}
      <div
        onClick={togglePlay}
        className="relative w-[320px] sm:w-[336px] h-[670px] sm:h-[712px] rounded-[48px] overflow-hidden bg-[#050506] cursor-pointer select-none
                   shadow-[0_25px_60px_-12px_rgba(0,0,0,0.38),0_10px_24px_-8px_rgba(0,0,0,0.22)]"
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
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 43)}
          className="w-full h-full object-cover"
        />

        {/* Barra Inferior de Inicio (Home Indicator) */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-20">
          <div className="w-32 h-1 rounded-full bg-white/75" />
        </div>
      </div>

      {/* SCRUBBER ELÁSTICO ESTILO SKIPER 91 (00:08 ━━━━───── 00:43) */}
      <div className="w-full max-w-[336px] flex items-center gap-3 font-mono text-xs text-zinc-700 dark:text-zinc-300 select-none">
        <button
          onClick={togglePlay}
          className="w-7 h-7 rounded-full bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center hover:opacity-80 transition"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-[1px]" />}
        </button>

        <span className="w-9 text-right tabular-nums">{formatTime(currentTime)}</span>

        <motion.div
          ref={trackRef}
          animate={{ x: stretchX, scaleX: 1 + Math.abs(stretchX) * 0.008 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onPointerDown={(e) => handleScrub(e.clientX)}
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            setHoverPct(pct * 100);
            setHoverTime(pct * duration);
            if (e.buttons === 1) handleScrub(e.clientX);
          }}
          onPointerUp={() => setStretchX(0)}
          onPointerLeave={() => {
            setHoverTime(null);
            setStretchX(0);
          }}
          className="group relative flex-1 py-2.5 cursor-pointer"
        >
          {hoverTime !== null && (
            <div
              style={{ left: `${hoverPct}%` }}
              className="pointer-events-none absolute -top-6 -translate-x-1/2 px-2 py-0.5 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold shadow"
            >
              {formatTime(hoverTime)}
            </div>
          )}
          <div className="w-full h-1.5 group-hover:h-2.5 transition-all bg-zinc-300/90 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%` }}
              className="h-full bg-zinc-700 dark:bg-zinc-200 rounded-full"
            />
          </div>
        </motion.div>

        <span className="w-9 tabular-nums">{formatTime(duration)}</span>

        <button
          onClick={restartVideo}
          title="Reiniciar"
          className="w-7 h-7 rounded-full bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center hover:opacity-80 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// Alias export to maintain backward compatibility
export { IphoneMinimalPlayer as IPhoneMockup };
