'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Maximize2, Minimize2, RotateCcw, Info, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VRTourViewerProps {
  panoramaUrl: string;
  roomName: string;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
}

export function VRTourViewer({ panoramaUrl, roomName, onLoadStart, onLoadEnd }: VRTourViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const textureRef = useRef<ImageBitmap | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Camera state
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const fovRef = useRef(75);
  const isPointerDownRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const lastLonRef = useRef(0);
  const lastLatRef = useRef(0);
  const autoRotateRef = useRef(true);

  const DEG = Math.PI / 180;

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !textureRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const lon = lonRef.current * DEG;
    const lat = Math.max(-85, Math.min(85, latRef.current)) * DEG;
    const fov = fovRef.current * DEG;

    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    const cosLon = Math.cos(lon);
    const sinLon = Math.sin(lon);

    const tex = textureRef.current;
    const texW = tex.width;
    const texH = tex.height;

    // Offscreen canvas for texture
    const offscreen = new OffscreenCanvas(texW, texH);
    const offCtx = offscreen.getContext('2d')!;
    offCtx.drawImage(tex, 0, 0);
    const imgData = offCtx.getImageData(0, 0, texW, texH);
    const pixels = imgData.data;

    const imageData = ctx.createImageData(W, H);
    const data = imageData.data;

    const halfW = W / 2;
    const halfH = H / 2;
    const f = halfH / Math.tan(fov / 2); // focal length

    for (let py = 0; py < H; py++) {
      const dy = (py - halfH) / f;
      for (let px = 0; px < W; px++) {
        const dx = (px - halfW) / f;

        // Ray direction in camera space
        const rx = dx;
        const ry = -dy;
        const rz = 1.0;

        // Rotate by lon and lat
        // First rotate around Y (lon)
        const rx2 = rx * cosLon - rz * sinLon;
        const ry2 = ry;
        const rz2 = rx * sinLon + rz * cosLon;

        // Then rotate around X (lat)
        const rx3 = rx2;
        const ry3 = ry2 * Math.cos(-lat) - rz2 * Math.sin(-lat);
        const rz3 = ry2 * Math.sin(-lat) + rz2 * Math.cos(-lat);

        // Convert to spherical coordinates
        const r = Math.sqrt(rx3 * rx3 + ry3 * ry3 + rz3 * rz3);
        const sphereLon = Math.atan2(rx3, rz3);
        const sphereLat = Math.asin(ry3 / r);

        // Map to texture
        const u = ((sphereLon / Math.PI + 1) / 2) * texW;
        const v = ((0.5 - sphereLat / Math.PI)) * texH;

        const tx = Math.round(u) % texW;
        const ty = Math.min(Math.max(Math.round(v), 0), texH - 1);

        const srcIdx = (ty * texW + (tx < 0 ? tx + texW : tx)) * 4;
        const dstIdx = (py * W + px) * 4;

        data[dstIdx]     = pixels[srcIdx];
        data[dstIdx + 1] = pixels[srcIdx + 1];
        data[dstIdx + 2] = pixels[srcIdx + 2];
        data[dstIdx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [DEG]);

  const animate = useCallback(() => {
    if (autoRotateRef.current && !isPointerDownRef.current) {
      lonRef.current += 0.05;
    }
    drawScene();
    animFrameRef.current = requestAnimationFrame(animate);
  }, [drawScene]);

  // Load panorama image
  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
    onLoadStart?.();

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      createImageBitmap(img).then((bitmap) => {
        textureRef.current = bitmap;
        setIsLoading(false);
        onLoadEnd?.();
      }).catch(() => {
        setLoadError(true);
        setIsLoading(false);
      });
    };

    img.onerror = () => {
      setLoadError(true);
      setIsLoading(false);
      onLoadEnd?.();
    };

    img.src = panoramaUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [panoramaUrl, onLoadStart, onLoadEnd]);

  // Canvas resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isLoading && !loadError) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isLoading, loadError, animate]);

  // Hide hint after 3s
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Pointer / touch controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDownRef.current = true;
      autoRotateRef.current = false;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      lastLonRef.current = lonRef.current;
      lastLatRef.current = latRef.current;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      const dx = (e.clientX - pointerStartRef.current.x) * 0.3;
      const dy = (e.clientY - pointerStartRef.current.y) * 0.3;
      lonRef.current = lastLonRef.current - dx;
      latRef.current = Math.max(-85, Math.min(85, lastLatRef.current + dy));
    };

    const onPointerUp = () => {
      isPointerDownRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      fovRef.current = Math.max(30, Math.min(120, fovRef.current + e.deltaY * 0.05));
    };

    // Touch for mobile
    let lastTouchDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = lastTouchDist - dist;
        fovRef.current = Math.max(30, Math.min(120, fovRef.current + delta * 0.1));
        lastTouchDist = dist;
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleReset = () => {
    lonRef.current = 0;
    latRef.current = 0;
    fovRef.current = 75;
    autoRotateRef.current = true;
  };

  return (
    <div
      ref={containerRef}
      className="vr-container relative w-full h-full bg-slate-950 rounded-xl overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-brand-500/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-white/70 text-sm font-medium">VR-Tour wird geladen...</p>
          <p className="text-white/40 text-xs mt-1">{roomName}</p>
        </div>
      )}

      {/* Error state */}
      {loadError && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-white/70 text-sm font-medium mb-1">VR-Tour nicht verfügbar</p>
          <p className="text-white/40 text-xs">Bitte prüfen Sie Ihre Internetverbindung</p>
        </div>
      )}

      {/* Controls overlay */}
      {!isLoading && !loadError && (
        <>
          {/* Room name */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-lg">
            {roomName}
          </div>

          {/* Control buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={handleFullscreen}
              className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
              title={isFullscreen ? 'Vollbild beenden' : 'Vollbild'}
            >
              {isFullscreen
                ? <Minimize2 className="w-4 h-4" />
                : <Maximize2 className="w-4 h-4" />
              }
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
              title="Ansicht zurücksetzen"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Interaction hint */}
          {showHint && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white/80 text-xs px-3 py-2 rounded-lg">
              <Move className="w-3.5 h-3.5 animate-float" />
              <span>Ziehen zum Umschauen • Scrollen zum Zoomen</span>
            </div>
          )}

          {/* VR badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-brand-600/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            360° VR
          </div>
        </>
      )}
    </div>
  );
}
