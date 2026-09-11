"use client";

import { ButtonXL } from "@/components/ButtonXL";
import { FoldGrid } from "@/components/FoldGrid";
import { useReveal } from "@/lib/useReveal";

const criteria = [
  "You're building in Physical AI, defined as artificial intelligence systems that are embodied in or directly interact with the physical world, perceiving their environment through sensors, making context-aware decisions, and taking actions autonomously. This could include robotics, autonomous machines, computer vision systems, agent-first or edge AI devices.",
  "You have a legal entity and at least two full-time team members with complementary technical and commercial skills.",
  "You've raised $5M+ or have at least 9 months of runway.",
  "You have a clear, named problem you're solving.",
  "You have tangible traction: a working prototype, paid pilot, letter of intent, strategic partnership, recognized accelerator or award, or similar proof point.",
  "You're committed to partnering with Capgemini on joint case studies, reference architectures, pilot projects, and/or thought leadership.",
];

/**
 * Apply Fold3 — Entry Criteria & Selection Process. Centered 4-of-8-column
 * text block (matches the Figma frame's 827px column, which maps exactly
 * onto FoldGrid's col3-6 at the 1732px reference width). The CTA here
 * spans the full content column instead of hugging its label, unlike the
 * hero's — per Figma, this section's button is a different footprint from
 * the hero's, not just a bigger version of the same button.
 */
export function EntryCriteria() {
  const text = useReveal<HTMLDivElement>();

  return (
    <FoldGrid className="bg-surface-light py-24 text-text-on-light">
      <div
        ref={text.ref}
        className={`col-start-1 col-span-8 flex flex-col items-start gap-8 lg:col-start-3 lg:col-span-4 ${text.revealClassName}`}
      >
        <h2 className="font-display text-[30px] leading-[1.1] lg:text-h2">
          Entry Criteria &amp; Selection Process
        </h2>
        <div className="flex flex-col gap-4">
          <p className="font-body text-body">
            Applicants must meet the following criteria to be considered:
          </p>
          <ul className="flex flex-col gap-4 pl-6 font-body text-body">
            {criteria.map((item) => (
              <li key={item} className="list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <ButtonXL className="w-full">Apply Now</ButtonXL>
      </div>
    </FoldGrid>
  );
}
