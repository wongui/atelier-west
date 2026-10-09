import type { Metadata } from "next";

// Internal design-system lab pages — never index.
export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

export default function SystemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
