import { TextLink } from "@/components/TextLink";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

export function Fold8Belief() {
  return (
    <div className="relative min-h-screen bg-surface-accent">
      <img
        src={withBasePath("/images/fold-8-brain-bg.png")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <FoldGrid className="relative h-full min-h-screen items-center py-24 text-text-on-light">
        <div className="col-start-6 col-span-3 flex flex-col gap-6">
          <h2 className="font-display text-h2">
            We believe that the future of AI is physical
          </h2>
          <p className="font-body text-body">
            Atelier West is a 12-week, cash- and equity-free, cohort-based
            residency based in San Francisco Mission Rock for Physical AI
            startups with lab access, expert mentorship, and enterprise
            partners, designed to give your technology a place to prove
            itself and scale.
          </p>
          <TextLink href="#">
            Learn more about our commitment to Physical AI
          </TextLink>
        </div>
      </FoldGrid>
    </div>
  );
}
