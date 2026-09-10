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
 * layout but not a full screen. v2: nav links, legal line, and the
 * decorative image are bottom-anchored together as one group (grid
 * `items-end`), not split apart via justify-between — the gap above them
 * is just whatever flex-1 leaves over, so it grows/shrinks with viewport
 * height on its own instead of being pinned by an explicit top margin.
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
      // Measured off the actual grid container's padding rather than a
      // hardcoded 2x--spacing-page px value — that hardcoded value went
      // stale (and overflowed the frame) the moment --spacing-page
      // changed for v2's wider margins. clientWidth already reflects the
      // --max-width-page cap at any viewport size, so subtracting the
      // real resolved padding gives the exact available content width.
      const grid = wordmark.parentElement;
      const gridStyles = grid ? getComputedStyle(grid) : null;
      const paddingLeft = gridStyles ? parseFloat(gridStyles.paddingLeft) || 0 : 0;
      const paddingRight = gridStyles ? parseFloat(gridStyles.paddingRight) || 0 : 0;
      const availableWidth = (grid?.clientWidth ?? window.innerWidth) - paddingLeft - paddingRight;
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

      {/* No fixed top margin here — the gap between the wordmark above and
          this block is whatever `flex-1` leaves over, so it grows/shrinks
          with viewport height on its own. FoldGrid's inner grid is
          hardcoded to `h-full`, but that percentage height doesn't
          reliably resolve through this wrapper (measured: it collapses to
          the grid's own content height instead of the wrapper's full
          632px+ flex-grown height) — rather than depend on that, `flex
          flex-col justify-end` on the OUTER wrapper pushes its single
          child (the grid, whatever height it ends up being) flush to the
          wrapper's own bottom edge directly, sidestepping the percentage
          question entirely. `content-end` on the grid itself is kept as a
          belt-and-suspenders in case the percentage height does resolve.
          Each child then gets its own `self-end` so it keeps its natural
          height instead of stretching to fill the row (grid's default
          cross-axis alignment). Only the footer's own bottom padding
          (`py-(--spacing-page)` on the <footer>) sets the bottom margin. */}
      <FoldGrid className="flex-1 flex flex-col justify-end" gridClassName="content-end">
        <div
          ref={nav.ref}
          className={`col-start-1 col-span-3 flex flex-col gap-16 self-end ${nav.revealClassName}`}
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
