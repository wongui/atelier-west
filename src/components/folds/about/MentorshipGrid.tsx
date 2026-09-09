import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

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
 * "Expert Mentorship" — intro copy followed by a 6-up row of mentor
 * photo + name + role. Figma itself only has gray placeholder rectangles
 * for the photos at this stage (no real headshots yet), so `image` is
 * expected to point at the shared placeholder graphic until real photos
 * are dropped in per mentor.
 */
export function MentorshipGrid({ heading, intro, mentors }: MentorshipGridProps) {
  return (
    <div className="bg-surface-accent text-text-on-light py-24">
      <FoldGrid>
        <div className="col-start-1 col-span-5 flex flex-col gap-6 max-w-(--max-width-content)">
          <h2 className="font-display text-h2">{heading}</h2>
          <p className="font-body text-body">{intro}</p>
        </div>
      </FoldGrid>

      <div className="mt-16 grid grid-cols-2 gap-6 px-(--spacing-page) sm:grid-cols-3 lg:grid-cols-6">
        {mentors.map((mentor, i) => (
          <div key={`${mentor.name}-${i}`} className="flex flex-col gap-4">
            <img
              src={withBasePath(mentor.image)}
              alt=""
              className="aspect-[290/321] w-full object-cover"
            />
            <h3 className="font-display text-h3">{mentor.name}</h3>
            <p className="font-body text-body">{mentor.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
