import { forwardRef, type ReactNode } from "react";

/**
 * The site's 8-column grid — full-bleed to the viewport edge minus
 * --spacing-page margins, 24px gutters, columns stretch (not fixed
 * width) up to --max-width-page (1440px), then hold there while
 * `className` (background, height, position) stays full-bleed on the
 * outer wrapper. Matches the grid guide in the Figma reference frame
 * exactly; see docs/FOUNDATIONS.md §3. Every fold's content should be
 * placed via col-start/col-span on this, not a separate centered max-w
 * container.
 *
 * `className` goes on the outer (full-bleed) wrapper — background,
 * height/min-height, padding, position all belong there. `gridClassName`
 * goes on the inner grid itself — only classes that need an actual
 * grid/flex container to take effect (`items-center`, `content-center`,
 * `content-start`, etc.) belong there, since those are inert on the
 * outer, non-grid wrapper.
 *
 * Forwards its ref to the OUTER wrapper — needed by folds that expose
 * themselves to SiteNav's dark-section watching (see ImageTextFold);
 * that outer element's bounding box is unchanged in height from before
 * this split, only its content's width is now capped.
 */
export const FoldGrid = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string; gridClassName?: string; id?: string }
>(function FoldGrid({ children, className = "", gridClassName = "", id }, ref) {
  return (
    <div ref={ref} id={id} className={`w-full ${className}`}>
      <div
        className={`mx-auto h-full max-w-(--max-width-page) grid grid-cols-8 gap-6 px-(--spacing-page) ${gridClassName}`}
      >
        {children}
      </div>
    </div>
  );
});
