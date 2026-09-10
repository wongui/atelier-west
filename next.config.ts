import type { NextConfig } from "next";

// GitHub Pages serves project repos at /<repo-name>/, not the domain root.
// Once a custom domain (CNAME) is attached, GH Pages serves from the root
// again, so drop this basePath by deleting the repo variable at that point.
const repoName = "atelier-west";
const usingProjectPagesPath = process.env.GITHUB_ACTIONS === "true" && !process.env.CUSTOM_DOMAIN;

// SITE_VARIANT lets the redesign ("v2") live side by side with the primary
// build under the same Pages site/domain, nested at /v2, so both stay
// reachable until one is picked to be promoted to the root. See
// .github/workflows/deploy-pages.yml, which builds both branches and sets
// this per build. Unset (local dev, or a plain `npm run build`) = primary.
const variantSuffix = process.env.SITE_VARIANT === "v2" ? "/v2" : "";

const computedBasePath = `${usingProjectPagesPath ? `/${repoName}` : ""}${variantSuffix}`;

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: computedBasePath,
  assetPrefix: computedBasePath ? `${computedBasePath}/` : "",
  env: {
    // Read by src/lib/basePath.ts for raw asset URLs next/image and
    // next/link can't prefix automatically.
    NEXT_PUBLIC_BASE_PATH: computedBasePath,
  },
};

export default nextConfig;
