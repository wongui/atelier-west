import type { Metadata } from "next";
import { faqs } from "@/data/apply";

const pageTitle = "Apply: Inaugural Physical AI Cohort, Oct 2026 – Jan 2027";
const pageDescription =
  "Apply to Atelier West's inaugural cohort. Applications close October 21, 2026. Entry criteria, key dates, selection process, and FAQs for Physical AI founders: no equity, no cash.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/apply" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/apply",
    siteName: "Atelier West",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Atelier West" }],
    locale: "en_US",
    type: "website",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
