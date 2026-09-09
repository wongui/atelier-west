"use client";

import { useRef } from "react";
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
 * widths, the same breakpoint switch the home page already uses.
 *
 * `hideApply` on SiteNav: this page already has its own larger in-content
 * CTAs (ApplyHero's, Entry Criteria's), so the nav's Apply pill would be a
 * redundant smaller duplicate — MobileSiteNav never had an Apply button
 * to begin with, so nothing to hide there.
 *
 * Key Dates is this page's one dark fold — its ref is passed as
 * `darkSectionRef` so the nav swaps to its on-dark (cream) treatment
 * while scrolled over it, same mechanism as About's ImageTextFold folds.
 *
 * Section order matches the Figma wireframe: hero, Key Dates strip,
 * Entry Criteria & Selection Process, then the shared site Footer.
 */
export default function ApplyPage() {
  const isDesktop = useIsDesktop();
  const keyDatesRef = useRef<HTMLDivElement>(null);

  if (isDesktop === null) return null;

  return (
    <>
      {isDesktop ? (
        <SiteNav hideApply darkSectionRef={keyDatesRef} />
      ) : (
        <MobileSiteNav darkSectionRef={keyDatesRef} />
      )}
      {isDesktop ? <ApplyHero /> : <ApplyHeroMobile />}
      <KeyDates sectionRef={keyDatesRef} />
      <EntryCriteria />
      <Footer />
    </>
  );
}
