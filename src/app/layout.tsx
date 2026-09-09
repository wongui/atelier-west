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

// Deliberately no viewport-fit=cover: that opt-in is what let the mobile
// hero's own flat panel color paint into Safari's safe area (via
// env(safe-area-inset-bottom)), which is what showed up as a solid grey
// box sitting over Safari's floating bottom bar. Without it, the page
// just stops short of the safe area like any normal (non-edge-to-edge)
// site, and Safari owns that space with its own chrome instead.
//
// themeColor: without this, iOS Safari paints the safe-area strips behind
// its status bar and floating bottom toolbar with its own default neutral
// grey, which reads as a solid box sitting on top of the page instead of
// blending in — setting it to the page's own resting background lets
// Safari's chrome match the site instead of standing out.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbfae4",
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
