"use client";

import { useEffect, useState } from "react";

/**
 * Returns null until the first client-side check runs (avoids a
 * server/client mismatch — matchMedia doesn't exist during static export),
 * then true/false for the lifetime of the session. Callers should treat
 * `null` as "not yet known" and defer rendering either layout until it
 * resolves, rather than guessing.
 */
export function useIsDesktop(breakpointPx = 1024): boolean | null {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpointPx]);

  return isDesktop;
}
