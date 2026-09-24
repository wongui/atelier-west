"use client";

import { TextLink } from "@/components/TextLink";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";
import { useReveal } from "@/lib/useReveal";

export function Fold8Belief() {
  const text = useReveal<HTMLDivElement>();

  return (
    <div className="relative min-h-screen bg-surface-accent">
      <img
        src={withBasePath("/images/fold-8-brain-bg.png")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <FoldGrid className="relative h-full min-h-screen py-24 text-text-on-light" gridClassName="items-center">
        <div
          ref={text.ref}
          className={`col-start-6 col-span-3 flex flex-col gap-6 ${text.revealClassName}`}
        >
          <h2 className="font-display text-h2">
            The future of AI is physical
          </h2>
          <div className="flex flex-col gap-4">
            <p className="font-body text-body">
              For years, AI got smarter on a screen, delivering better
              answers, faster and at scale. That mattered.
            </p>
            <p className="font-body text-body">
              The next chapter is intelligence that acts, sensing its
              environment, understanding what&apos;s needed, and taking
              action in the physical world where people live, work, and
              move.
            </p>
            <p className="font-body text-body">
              We believe the biggest opportunities emerge where Physical
              AI meets human need: factories, hospitals, warehouses,
              homes, infrastructure, and everything in between.
            </p>
            <p className="font-body text-body">
              But that belief only means something once it&apos;s made
              real. So we built a place where founders, researchers,
              enterprises, and operators work side by side to build,
              validate, and deploy what comes next.
            </p>
            <p className="font-body text-body">
              It&apos;s also why there&apos;s no equity or cash exchanged.
              Just access to the environments and expertise needed to
              jointly turn promising technology into real-world impact.
            </p>
          </div>
          <TextLink
            href="https://www.frog.co/designmind/design-mind-frogcast-ep-60-co-evolving-with-physical-ai"
            external
          >
            Learn more about our commitment to Physical AI
          </TextLink>
        </div>
      </FoldGrid>
    </div>
  );
}
