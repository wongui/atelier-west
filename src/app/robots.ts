import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Open to everyone, including AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
// Google-Extended...) — being cited by AI answers is a goal here. The
// design-system lab pages are internal and kept out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/system" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
