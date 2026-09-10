"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FoldGrid } from "./FoldGrid";
import { withBasePath } from "@/lib/basePath";
import { useReveal } from "@/lib/useReveal";

const WORDMARK_TEXT = "Atelier West";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Cookie Settings", href: "/cookie-settings" },
];

/**
 * Site footer — wordmark lockup (full-bleed, same treatment as the hero
 * wordmark), About/Apply Now links + legal line at col1, and the real
 * decorative blob asset positioned at col4-8 (5 columns per Figma). See
 * docs/FOUNDATIONS.md, Navigation family.
 *
 * min-h (not a full viewport height) with the nav/copyright/image row
 * as a flex-1 block below the wordmark — per Figma's 797px fold vs. the
 * 973px full-viewport reference, taller than the old content-hugging
 * layout but not a full screen. Nav sits just under the wordmark and
 * copyright is pinned to the bottom via justify-between, independent of
 * viewport height.
 *
 * Letter-spacing is computed (not the fixed --tracking-wordmark token)
 * so the wordmark fills the grid's content width exactly at any
 * viewport size — a fixed value only fit the 1732px Figma reference
 * frame and overflowed narrower/wider viewports, causing horizontal
 * scroll. Same technique as SiteNav's hero-state wordmark.
 */
export function Footer() {
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const nav = useReveal<HTMLDivElement>();

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const measure = measureRef.current;
    if (!wordmark || !measure) return;

    const recompute = () => {
      const availableWidth = window.innerWidth - 48; // 2x --spacing-page (24px)
      const naturalWidth = measure.getBoundingClientRect().width;
      // Divide by (length - 1), not length: letter-spacing adds a trailing
      // gap after the LAST character too, which doesn't count as a visible
      // "edge-to-edge" gap — dividing by the full length left a stray extra
      // gap's worth of blank space past the final "T", breaking the
      // 24px-both-sides symmetry with the left margin.
      const tracking = Math.max(
        0,
        (availableWidth - naturalWidth) / (WORDMARK_TEXT.length - 1)
      );
      wordmark.style.letterSpacing = `${tracking}px`;
    };

    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  return (
    <footer className="flex min-h-[80vh] flex-col overflow-hidden bg-surface-dark text-text-on-dark py-(--spacing-page)">
      <FoldGrid>
        <span
          ref={wordmarkRef}
          className="col-start-1 col-span-8 font-display text-wordmark uppercase whitespace-nowrap"
        >
          {WORDMARK_TEXT}
        </span>
        {/* Hidden 0-tracking clone used only to measure the wordmark's natural width. */}
        <span
          ref={measureRef}
          aria-hidden
          className="fixed top-0 left-[-9999px] font-display text-wordmark uppercase whitespace-nowrap"
          style={{ letterSpacing: 0 }}
        >
          {WORDMARK_TEXT}
        </span>
      </FoldGrid>

      <FoldGrid className="mt-12 flex-1">
        <div
          ref={nav.ref}
          className={`col-start-1 col-span-3 flex h-full flex-col justify-between gap-16 ${nav.revealClassName}`}
        >
          <nav className="flex flex-col gap-2">
            <Link href="/about" className="font-body text-body font-medium w-fit">
              About
            </Link>
            <Link href="/apply" className="font-body text-body font-medium w-fit">
              Apply Now
            </Link>
          </nav>

          <p className="font-body text-ui text-text-on-dark/70">
            © 2026 frog, part of Capgemini Invent{" "}
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="ml-2 hover:text-text-on-dark">
                {link.label}
              </Link>
            ))}
          </p>
        </div>

        <img
          src={withBasePath("/images/AW footer.png")}
          alt=""
          aria-hidden
          className="pointer-events-none col-start-4 col-span-5 hidden self-end md:block"
        />
      </FoldGrid>
    </footer>
  );
}
