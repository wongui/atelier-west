"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARALLAX_MAX_OFFSET = 10;

interface ScrollVideoProps {
  framesPath: string;
  frameCount: number;
  frameExtension?: string;
  framePadding?: number;
  className?: string;
  /** Element whose top-to-bottom span defines the scrub range. Defaults to the whole page. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
}

function frameSrc(
  framesPath: string,
  index: number,
  framePadding: number,
  frameExtension: string,
) {
  const num = String(index + 1).padStart(framePadding, "0");
  return `${framesPath}/frame-${num}.${frameExtension}`;
}

export function ScrollVideo({
  framesPath,
  frameCount,
  frameExtension = "jpg",
  framePadding = 4,
  className = "",
  scrollContainerRef,
}: ScrollVideoProps) {
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
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      // Scale up just enough that PARALLAX_MAX_OFFSET of translation in any
      // direction still stays covered — margin is half the extra size added
      // by the scale, on the tighter (usually vertical) dimension.
      const scale = 1 + (PARALLAX_MAX_OFFSET * 2.2) / Math.min(window.innerWidth, window.innerHeight);
      gsap.set(canvas, { scale });
      drawFrame(frameIndexRef.current);
    };
    resize();
    window.addEventListener("resize", resize);

    const xTo = gsap.quickTo(canvas, "x", { duration: 1.2, ease: "power3.out" });
    const yTo = gsap.quickTo(canvas, "y", { duration: 1.2, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      xTo(-nx * PARALLAX_MAX_OFFSET);
      yTo(-ny * PARALLAX_MAX_OFFSET);
    };
    window.addEventListener("mousemove", handleMouseMove);

    const container = scrollContainerRef?.current;

    const trigger = ScrollTrigger.create({
      ...(container
        ? { trigger: container, start: "top top", end: "bottom top" }
        : { start: 0, end: () => ScrollTrigger.maxScroll(window) }),
      scrub: true,
      onUpdate: (self) => {
        const index = Math.min(
          frameCount - 1,
          Math.round(self.progress * (frameCount - 1)),
        );
        frameIndexRef.current = index;
        drawFrame(index);
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      trigger.kill();
    };
  }, [frameCount, scrollContainerRef]);

  const percent = frameCount > 0 ? Math.round((loadedCount / frameCount) * 100) : 0;

  return (
    <>
      {/* Unscaled clipping box — the canvas inside is deliberately scaled
          beyond 100vw/100vh to cover its mouse-parallax overscan; clipping
          it here (rather than on html/body) avoids the classic gotcha
          where overflow on the document root breaks position:sticky for
          every descendant (Folds 3-5's pinned progression). */}
      <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden">
        <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
      </div>
      {!isReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <p className="font-body text-body text-white">Loading… {percent}%</p>
        </div>
      )}
    </>
  );
}
