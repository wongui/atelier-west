"use client";

import { SiteNav } from "@/components/SiteNav";
import { MobileSiteNav } from "@/components/MobileSiteNav";
import { Footer } from "@/components/Footer";
import { ApplyHero } from "@/components/folds/apply/ApplyHero";
import { ApplyHeroMobile } from "@/components/folds/apply/ApplyHeroMobile";
import { KeyDates } from "@/components/folds/apply/KeyDates";
import { EntryCriteria } from "@/components/folds/apply/EntryCriteria";
import { useIsDesktop } from "@/lib/useIsDesktop";

/**
 * Apply page — no hero-morph on the nav (same as About: `<SiteNav />` with
 * no `heroRef` renders directly in its compact resting state), but unlike
 * About it DOES swap to `MobileSiteNav` below 1024px — SiteNav's 8-column
 * grid (About at col4, Apply pill at col8) overlaps the wordmark at phone
 * widths, the same breakpoint switch the home page already uses. Section
 * order matches the Figma wireframe: hero, Key Dates strip, Entry
 * Criteria & Selection Process, then the shared site Footer.
 */
export default function ApplyPage() {
  const isDesktop = useIsDesktop();

  if (isDesktop === null) return null;

  return (
    <>
      {isDesktop ? <SiteNav /> : <MobileSiteNav />}
      {isDesktop ? <ApplyHero /> : <ApplyHeroMobile />}
      <KeyDates />
      <EntryCriteria />
      <Footer />
    </>
  );
}
