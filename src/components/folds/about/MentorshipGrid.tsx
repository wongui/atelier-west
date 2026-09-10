"use client";

import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";
import { useReveal } from "@/lib/useReveal";

interface Mentor {
  name: string;
  role: string;
  image: string;
}

interface MentorshipGridProps {
  heading: string;
  intro: string;
  mentors: Mentor[];
}

/**
 * "Expert Mentorship" — intro copy followed by a 5-up grid (2 rows of 5)
 * of mentor photo + name + role. Each photo renders at its own natural
 * aspect ratio (no forced box, no object-cover crop) rather than the
 * fixed 290:321 box this briefly had — that box didn't match the real
 * headshots' native ratio and was trimming them.
 *
 * Cream (surface-light), not coral — coral's hover-sweep on the nav/CTA
 * buttons is itself coral, so a coral section background made the button
 * disappear on hover while scrolled over it.
 */
function MentorCard({ mentor }: { mentor: Mentor }) {
  const photo = useReveal<HTMLImageElement>();
  const text = useReveal<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-4">
      <img
        ref={photo.ref}
        src={withBasePath(mentor.image)}
        alt=""
        className={`w-full h-auto ${photo.revealClassName}`}
        style={{ transitionDelay: "100ms" }}
      />
      <div ref={text.ref} className={`flex flex-col gap-1 ${text.revealClassName}`}>
        <h3 className="font-display text-h3">{mentor.name}</h3>
        <p className="font-body text-body">{mentor.role}</p>
      </div>
    </div>
  );
}

export function MentorshipGrid({ heading, intro, mentors }: MentorshipGridProps) {
  const introText = useReveal<HTMLDivElement>();

  return (
    <div className="bg-surface-light text-text-on-light py-24">
      <FoldGrid>
        <div
          ref={introText.ref}
          className={`col-start-1 col-span-8 sm:col-span-5 flex flex-col gap-6 max-w-(--max-width-content) ${introText.revealClassName}`}
        >
          <h2 className="font-display text-h2">{heading}</h2>
          <p className="font-body text-body">{intro}</p>
        </div>
      </FoldGrid>

      <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-16 px-(--spacing-page) sm:grid-cols-3 lg:grid-cols-5">
        {mentors.map((mentor, i) => (
          <MentorCard key={`${mentor.name}-${i}`} mentor={mentor} />
        ))}
      </div>
    </div>
  );
}
