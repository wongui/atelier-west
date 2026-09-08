import type { NextConfig } from "next";

// GitHub Pages serves project repos at /<repo-name>/, not the domain root.
// Once a custom domain (CNAME) is attached, GH Pages serves from the root
// again, so drop this basePath by deleting the repo variable at that point.
const repoName = "atelier-west";
const usingProjectPagesPath = process.env.GITHUB_ACTIONS === "true" && !process.env.CUSTOM_DOMAIN;

const computedBasePath = usingProjectPagesPath ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: computedBasePath,
  assetPrefix: usingProjectPagesPath ? `/${repoName}/` : "",
  env: {
    // Read by src/lib/basePath.ts for raw asset URLs next/image and
    // next/link can't prefix automatically.
    NEXT_PUBLIC_BASE_PATH: computedBasePath,
  },
};

export default nextConfig;
