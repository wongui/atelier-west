"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Divider } from "@/components/Divider";

gsap.registerPlugin(ScrollTrigger);

interface ScrollVideoMobileProps {
  framesPath: string;
  frameCount: number;
  frameExtension?: string;
  framePadding?: number;
  className?: string;
  /** Element whose top-to-bottom span defines the scrub range. */
  scrollContainerRef: RefObject<HTMLElement | null>;
}

function frameSrc(framesPath: string, index: number, framePadding: number, frameExtension: string) {
  const num = String(index + 1).padStart(framePadding, "0");
  return `${framesPath}/frame-${num}.${frameExtension}`;
}

/**
 * Mobile's own scroll-scrubbed frame canvas — a separate component from
 * ScrollVideo (desktop's version is a `fixed inset-0` full-viewport
 * canvas with mouse parallax, sized off window dimensions). This one
 * sizes itself to its own wrapper element instead of the viewport, so it
 * can sit inside a 65vh sticky container rather than covering the whole
 * screen, and drops the mouse parallax (no pointer on mobile). Kept
 * independent so desktop's ScrollVideo never has to change to support
 * mobile's different sizing needs.
 */
export function ScrollVideoMobile({
  framesPath,
  frameCount,
  frameExtension = "jpg",
  framePadding = 4,
  className = "",
  scrollContainerRef,
}: ScrollVideoMobileProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth: number;
    let drawHeight: number;
    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgRatio;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgRatio;
    }

    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;

    const images: HTMLImageElement[] = new Array(frameCount);
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = frameSrc(framesPath, i, framePadding, frameExtension);
      img.onload = () => {
        if (cancelled) return;
        loaded += 1;
        setLoadedCount(loaded);
        if (i === 0) drawFrame(0);
        if (loaded === frameCount) setIsReady(true);
      };
      img.onerror = () => {
        if (cancelled) return;
        loaded += 1;
        setLoadedCount(loaded);
        if (loaded === frameCount) setIsReady(true);
      };
      images[i] = img;
    }
    framesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, [framesPath, frameCount, framePadding, frameExtension]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawFrame(frameIndexRef.current);
    };
    resize();
    window.addEventListener("resize", resize);

    const container = scrollContainerRef.current;
    const trigger = container
      ? ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const index = Math.min(frameCount - 1, Math.round(self.progress * (frameCount - 1)));
            frameIndexRef.current = index;
            drawFrame(index);
          },
        })
      : null;

    return () => {
      window.removeEventListener("resize", resize);
      trigger?.kill();
    };
  }, [frameCount, scrollContainerRef]);

  const percent = frameCount > 0 ? Math.round((loadedCount / frameCount) * 100) : 0;

  return (
    <div ref={wrapperRef} className="absolute inset-0 h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
      {!isReady && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-surface-dark px-(--spacing-page) text-text-on-dark">
          <p className="font-display text-h3 tabular-nums">{percent}%</p>
          <div className="relative w-full max-w-[200px]">
            <Divider />
            <div
              className="absolute left-0 top-0 h-px bg-progress-fill transition-[width] duration-150"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
