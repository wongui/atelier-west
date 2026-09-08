/**
 * Hairline rule — full-width divider under eyebrows/section labels
 * (Fold3–5, Fold7). Uses `currentColor` so it adapts to on-light/on-dark
 * text context instead of hardcoding a color.
 */
export function Divider({ className = "" }: { className?: string }) {
  return <div role="separator" className={`h-px w-full bg-current opacity-20 ${className}`} />;
}
