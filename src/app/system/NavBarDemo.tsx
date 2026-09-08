"use client";

import { useRef } from "react";
import { NavBar } from "@/components/NavBar";

/**
 * Scrollable demo box so NavBar's transparent -> scrolled transition is a
 * real, testable interaction here, not a static screenshot standing in
 * for it.
 */
export function NavBarDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative h-72 overflow-y-auto rounded-lg bg-surface-dark"
    >
      <NavBar containerRef={containerRef} />
      <div className="px-(--spacing-page) py-8 font-body text-body text-text-on-dark/70">
        <p className="mb-[600px]">
          Scroll this box — the nav starts transparent (over-hero), then
          becomes solid once you pass the threshold.
        </p>
        <p>End of scroll area.</p>
      </div>
    </div>
  );
}
