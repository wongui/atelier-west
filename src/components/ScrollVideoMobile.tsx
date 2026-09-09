"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Divider } from "@/components/Divider";

gsap.registerPlugin(ScrollTrigger);

// Bigger amplitude and a smaller tilt range than desktop's mouse parallax
// (ScrollVideo.tsx) — a phone's tilt range in the hand is much narrower
// than a full mouse sweep across the screen, so matching desktop's pixel
// offset 1:1 read as barely-there; this reaches full offset at a modest
// tilt instead of requiring an exaggerated one. (Tuned down from an
// earlier 30px/12deg pass that read as too much on an actual phone.)
const PARALLAX_MAX_OFFSET = 18;
const TILT_RANGE_DEG = 16;

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
 * canvas sized off window dimensions). This one sizes itself to its own
 * wrapper element instead of the viewport, so it can sit inside a
 * capped-height sticky container rather than covering the whole screen.
 * Parallax is device-tilt driven instead of mouse-driven (no pointer on
 * mobile) — same amplitude/easing as desktop's mouse parallax, just a
 * different input signal. Kept independent so desktop's ScrollVideo never
 * has to change to support mobile's different sizing/input needs.
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
      // Scale up just enough that PARALLAX_MAX_OFFSET of tilt-driven
      // translation in any direction still stays covered (same formula as
      // desktop's mouse parallax) — margin is half the extra size added
      // by the scale, on the tighter dimension.
      const scale = 1 + (PARALLAX_MAX_OFFSET * 2.2) / Math.min(rect.width, rect.height);
      gsap.set(canvas, { scale });
      drawFrame(frameIndexRef.current);
    };
    resize();
    window.addEventListener("resize", resize);

    // Device-tilt parallax — the phone's own accelerometer/gyro standing
    // in for desktop's mouse-position parallax. iOS 13+ gates
    // DeviceOrientationEvent behind an explicit permission prompt that
    // must be triggered by a user gesture (can't be requested on load),
    // so this waits for the visitor's first touch anywhere on the page
    // before asking; other browsers (Android Chrome, etc.) don't require
    // it and just start listening immediately.
    const xTo = gsap.quickTo(canvas, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(canvas, "y", { duration: 0.5, ease: "power3.out" });

    let baseline: { beta: number; gamma: number } | null = null;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      // Calibrate to however the phone happens to be held when tilting
      // starts, rather than assuming it's held perfectly flat/upright —
      // the effect is relative motion from that resting pose.
      if (!baseline) {
        baseline = { beta: e.beta, gamma: e.gamma };
        return;
      }
      const dBeta = gsap.utils.clamp(-TILT_RANGE_DEG, TILT_RANGE_DEG, e.beta - baseline.beta) / TILT_RANGE_DEG;
      const dGamma = gsap.utils.clamp(-TILT_RANGE_DEG, TILT_RANGE_DEG, e.gamma - baseline.gamma) / TILT_RANGE_DEG;
      xTo(-dGamma * PARALLAX_MAX_OFFSET);
      yTo(-dBeta * PARALLAX_MAX_OFFSET);
    };

    let removeMotionListener: (() => void) | undefined;
    const enableTiltParallax = () => {
      window.addEventListener("deviceorientation", handleOrientation);
      removeMotionListener = () => window.removeEventListener("deviceorientation", handleOrientation);
    };

    type DeviceOrientationEventIOS = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    const DOE = window.DeviceOrientationEvent as DeviceOrientationEventIOS | undefined;
    let removeGestureListener: (() => void) | undefined;

    if (typeof DOE?.requestPermission === "function") {
      const requestOnce = () => {
        DOE.requestPermission!()
          .then((state) => {
            if (state === "granted") enableTiltParallax();
          })
          .catch(() => {});
      };
      document.addEventListener("touchend", requestOnce, { once: true });
      removeGestureListener = () => document.removeEventListener("touchend", requestOnce);
    } else if (typeof window.DeviceOrientationEvent !== "undefined") {
      enableTiltParallax();
    }

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
      removeMotionListener?.();
      removeGestureListener?.();
      trigger?.kill();
    };
  }, [frameCount, scrollContainerRef]);

  const percent = frameCount > 0 ? Math.round((loadedCount / frameCount) * 100) : 0;

  return (
    <div ref={wrapperRef} className="absolute inset-0 h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
      {!isReady && (
        // Deliberately `absolute` (scoped to this wrapper's ~65svh video
        // box, see Fold1HeroMobile), not `fixed` to the full viewport: a
        // fixed full-screen dark div here gets sampled by iOS Safari for
        // its bottom toolbar tint, which then sticks black even after the
        // real (lighter) content has loaded in. Confined-to-the-video is
        // the safer tradeoff.
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
