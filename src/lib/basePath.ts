// Mirrors the basePath computed in next.config.ts. next/link and next/image
// apply basePath automatically, but raw <img src="/..."> and manually built
// asset URLs (e.g. the ScrollVideo frame sequence) don't — those need this
// helper so they still resolve once the site is served from /<repo-name>/
// on GitHub Pages project pages.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return `${basePath}${path}`;
}
