import { withBasePath } from "@/lib/basePath";

/**
 * Mobile Fold2 — text stacks above the imagery (desktop is a side-by-side
 * image+text row). Reuses the same pre-composed fold-2.png art as desktop
 * rather than recreating the Figma mobile frame's WebGPU duotone shader
 * pass, matching how desktop already avoided that (see Fold2Intro.tsx).
 */
export function Fold2IntroMobile() {
  return (
    <section id="fold-2-mobile" className="bg-surface-light px-(--spacing-page) py-16">
      <div className="flex flex-col gap-6">
        <h2 className="font-display text-[30px] leading-[1.1] text-text-on-light">
          A fellowship for founders building machines with real specs and
          real instinct.
        </h2>
        <p className="font-body text-body text-text-on-light">
          Atelier West is a 12-week, cash- and equity-free, cohort-based
          residency based in San Francisco Mission Rock for Physical AI
          startups with lab access, expert mentorship, and enterprise
          partners, designed to give your technology a place to prove
          itself and scale.
        </p>
      </div>
      <img
        src={withBasePath("/images/fold-2.png")}
        alt=""
        className="mt-9 w-full rounded-2xl"
      />
    </section>
  );
}
