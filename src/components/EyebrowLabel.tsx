import type { ReactNode } from "react";

/**
 * Small section label ("How it works", "Hosted by") — 18px, NOT the
 * 14px uppercase button label style. Body weight only (Book) — the
 * Figma file's Medium weight read too heavy and was dropped project-wide.
 */
export function EyebrowLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-body text-body ${className}`}>
      {children}
    </span>
  );
}
