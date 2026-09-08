import type { RefObject } from "react";
import { Divider } from "./Divider";

interface StepProgressProps {
  step?: number;
  totalSteps?: number;
  className?: string;
  /** Set directly (bypassing React state) for continuous scroll-driven fills — see ProgressionSection. */
  fillRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Divider track + a filled progress segment — the "How it works" marker
 * under Fold3–5. Fill width is driven continuously off scroll position
 * via `fillRef` (direct DOM write, matching the ScrollVideo/SiteNav
 * pattern — avoids a React re-render on every scroll tick) rather than
 * a flat step/totalSteps fraction.
 */
export function StepProgress({ step, totalSteps = 3, className = "", fillRef }: StepProgressProps) {
  const initialPercent =
    step != null ? Math.min(100, Math.max(0, (step / totalSteps) * 100)) : 0;

  return (
    <div className={`relative ${className}`}>
      <Divider />
      <div
        ref={fillRef}
        className="absolute left-0 top-0 h-px bg-progress-fill"
        style={{ width: `${initialPercent}%` }}
      />
    </div>
  );
}
