"use client";

import { useEffect, useState, type RefObject } from "react";
import Link from "next/link";
import { Button } from "./Button";

const SCROLL_THRESHOLD = 64; // px — placeholder until Phase 2 ties this to "past the hero" instead of a fixed value

interface NavBarProps {
  /** Optional scrollable container to observe instead of the window — used for the /system demo. */
  containerRef?: RefObject<HTMLElement | null>;
}

/**
 * Top nav bar — transparent/on-dark while over the hero, solid/on-light
 * once scrolled. See docs/FOUNDATIONS.md, Navigation family.
 */
export function NavBar({ containerRef }: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const target: HTMLElement | Window = containerRef?.current ?? window;

    function handleScroll() {
      const scrollTop =
        target === window ? window.scrollY : (target as HTMLElement).scrollTop;
      setIsScrolled(scrollTop > SCROLL_THRESHOLD);
    }

    target.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => target.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-(--spacing-page) py-4 transition-colors duration-300 ${
        isScrolled
          ? "bg-surface-light text-text-on-light"
          : "bg-transparent text-text-on-dark"
      }`}
    >
      <Link
        href="/"
        className="font-display text-wordmark-nav tracking-wordmark-nav uppercase"
      >
        Atelier West
      </Link>
      <Link href="/about" className="font-body text-body">
        About
      </Link>
      <Button variant="nav">Apply</Button>
    </nav>
  );
}
