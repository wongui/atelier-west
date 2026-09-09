"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

const WORDMARK_TEXT = "Atelier West";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Cookie Settings", href: "/cookie-settings" },
];

/**
 * Mobile footer — same wordmark lockup and edge-to-edge tracking technique
 * as desktop's Footer, but the desktop's nav+copyright/image side-by-side
 * row becomes a single stacked column per Figma's mobile frame: wordmark,
 * then About/Apply links, then the legal line, then the real "AW footer"
 * artwork full-bleed at the bottom (replacing desktop's col4-8 blob crop,
 * which is hidden below md).
 */
export function FooterMobile() {
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const measure = measureRef.current;
    if (!wordmark || !measure) return;

    const recompute = () => {
      // Read the live --spacing-page value (mobile overrides it to 16px
      // below the 1024px breakpoint — see globals.css) rather than
      // hardcoding a pixel figure, so this stays correct if that token
      // ever changes.
      const spacingPage = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--spacing-page")
      ) * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const availableWidth = window.innerWidth - spacingPage * 2;
      const naturalWidth = measure.getBoundingClientRect().width;
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
    <footer className="flex min-h-[90vh] flex-col overflow-hidden bg-surface-dark text-text-on-dark pt-(--spacing-page) pb-(--spacing-page)">
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

      <FoldGrid className="mt-16 flex flex-1 flex-col justify-between">
        <nav className="flex flex-col gap-3 col-start-1 col-span-8">
          <Link href="/about" className="font-body text-body font-medium w-fit">
            About
          </Link>
          <Link href="/apply" className="font-body text-body font-medium w-fit">
            Apply Now
          </Link>
        </nav>

        <p className="font-body text-ui text-text-on-dark/70 col-start-1 col-span-8">
          © 2026 frog, part of Capgemini Invent{" "}
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="ml-2 hover:text-text-on-dark">
              {link.label}
            </Link>
          ))}
        </p>
      </FoldGrid>

      <img
        src={withBasePath("/images/footer-aw.png")}
        alt=""
        aria-hidden
        className="pointer-events-none mt-12 w-full px-(--spacing-page)"
      />
    </footer>
  );
}
