import type { Metadata } from "next";

const pageTitle = "About the Program: Labs, Mentors & Enterprise Access";
const pageDescription =
  "How Atelier West works: a free, 12-week Physical AI residency at Mission Rock, San Francisco, with six labs, expert mentors from frog, Synapse and Capgemini, partner benefits from AWS and NVIDIA Inception, and a Demo Day for enterprises and investors.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/about" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/about",
    siteName: "Atelier West",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Atelier West" }],
    locale: "en_US",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
