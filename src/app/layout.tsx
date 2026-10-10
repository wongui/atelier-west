import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const frogSerif = localFont({
  src: [
    { path: "./fonts/frogSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/frogSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

// Book only, everywhere — the Medium/Bold/ExtraLight cuts read too heavy
// for this design. The 500/700 weight slots stay registered (rather than
// removed) but point at the Book files: any leftover `font-medium` /
// `font-bold` className still resolves to a real @font-face at that
// weight, so it renders as true Book outlines instead of the browser's
// synthetic/faux-bold fallback it'd use if no face existed for that weight.
const bentonSans = localFont({
  src: [
    { path: "./fonts/BentonSansF-Book.ttf", weight: "400", style: "normal" },
    { path: "./fonts/BentonSansF-BookItalic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/BentonSansF-Book.ttf", weight: "500", style: "normal" },
    { path: "./fonts/BentonSansF-Book.ttf", weight: "700", style: "normal" },
    { path: "./fonts/BentonSansF-BookItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

const siteName = "Atelier West";
const title = "Atelier West | 12-Week Equity-Free Physical AI Residency in San Francisco";
const description =
  "A 12-week, equity-free hardware residency for Physical AI and robotics startups at Mission Rock, San Francisco. Prototyping labs, expert mentors, and enterprise access.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${siteName}` },
  description,
  applicationName: siteName,
  keywords: [
    "Physical AI",
    "robotics",
    "startups",
    "autonomous machines",
    "computer vision systems",
    "hardware residency",
    "accelerator",
    "prototyping labs",
    "equity-free residency",
    "Mission Rock",
    "San Francisco",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: "/",
    siteName,
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: siteName }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image.png"],
  },
};

// Entity data for Google and AI answer engines: tells them Atelier West is an
// organization, where it is, and what it runs.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      description,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Mission Rock",
        addressLocality: "San Francisco",
        addressRegion: "CA",
        addressCountry: "US",
      },
      sameAs: ["https://luma.com/atelierwest"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

// viewport-fit=cover lets env(safe-area-inset-*) resolve to real values on
// notch/home-indicator devices — the mobile fold-1 hero uses it to extend
// its own panel color into Safari's safe area at the bottom, so nothing
// gaps there. Without it (tried and reverted), that strip is *uncovered*
// instead and shows the page's default background peeking through as a
// mismatched sliver — worse than the panel color extending under Safari's
// chrome, which is what this was for in the first place.
//
// themeColor: without this, iOS Safari paints the safe-area strips behind
// its status bar and floating bottom toolbar with its own default neutral
// grey, which reads as a solid box sitting on top of the page instead of
// blending in — setting it to the page's own resting background lets
// Safari's chrome match the site instead of standing out.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbfae4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${frogSerif.variable} ${bentonSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
