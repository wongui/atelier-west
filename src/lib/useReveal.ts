"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal primitive — "blur + rise" (candidate D from
 * /system/reveal-lab): fades in while sharpening from a blur and
 * translating up ~24px. Fires once when the element enters the viewport,
 * then disconnects — real content shouldn't re-hide when scrolling back
 * up, unlike the lab page's repeatable demo version.
 *
 * Usage: spread `reveal.props` onto the element (adds the ref + the
 * transition/state classes), keeping any of the element's own layout
 * classes (grid placement, sizing, etc.) alongside via `className`.
 */
function revealClassNameFor(isVisible: boolean): string {
  return `transition-all duration-700 ease-out ${
    isVisible ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-md translate-y-6"
  }`;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible, revealClassName: revealClassNameFor(isVisible) };
}

/**
 * Same "blur + rise" treatment, but triggered on mount (a double
 * requestAnimationFrame later, so the hidden state actually paints first
 * and the transition has something to animate from) rather than on
 * scroll-into-view — for content that's already on screen when the page
 * loads (the hero) instead of scrolled to later.
 */
export function useRevealOnMount<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setIsVisible(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return { ref, isVisible, revealClassName: revealClassNameFor(isVisible) };
}
