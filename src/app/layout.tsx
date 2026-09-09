import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

// Trailing slash matters: metadataBase + a relative (no leading "/") image
// path are joined via the WHATWG URL resolution rules, which drop the last
// path segment of the base unless it ends in "/" — without it, "atelier-west"
// gets replaced instead of kept, and the og-image 404s under the repo's
// GitHub Pages basePath.
const siteUrl = "https://wongui.github.io/atelier-west/";
const title = "Atelier West";
const description =
  "A 12-week, cash- and equity-free residency for Physical AI founders.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    images: [{ url: "images/og-image.png", width: 1200, height: 630, alt: title }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["images/og-image.png"],
  },
};

// viewport-fit=cover lets env(safe-area-inset-*) resolve to real values
// on notch/home-indicator devices — the mobile fold-1 hero uses it to keep
// its bottom content clear of Safari's floating bottom bar instead of
// hiding behind it.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${frogSerif.variable} ${bentonSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
