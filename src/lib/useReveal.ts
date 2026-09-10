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

  const revealClassName = `transition-all duration-700 ease-out ${
    isVisible ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-md translate-y-6"
  }`;

  return { ref, isVisible, revealClassName };
}
