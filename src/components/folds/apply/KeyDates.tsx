import { Divider } from "@/components/Divider";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { FoldGrid } from "@/components/FoldGrid";

const dates = [
  { date: "9/14/26", label: "Applications open" },
  { date: "10/11/26", label: "Applications close" },
  { date: "10/01 - 10/15", label: "Cohort selection" },
  { date: "10/26", label: "Cohort begins" },
];

/**
 * Apply Fold2 — Key Dates strip. Divider + eyebrow label above a row of
 * date/label pairs, same coupling as Fold7Partners' divider→label groups.
 * Stacked single column below `lg` (23px, per the Figma mobile frame —
 * the desktop 36px display size reads too heavy at phone width), 4-up
 * grid at `lg` and above — kept as one component with breakpoint classes
 * (not a split sibling) since the content and grouping are identical,
 * only the reflow changes, matching the About page's grid components.
 */
export function KeyDates() {
  return (
    <FoldGrid className="bg-surface-dark py-16 text-text-on-dark">
      <div className="col-start-1 col-span-8 flex flex-col gap-6">
        <Divider />
        <EyebrowLabel>Key Dates</EyebrowLabel>
      </div>
      <div className="col-start-1 col-span-8 mt-10 flex flex-col gap-6 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
        {dates.map((d) => (
          <div key={d.label} className="flex flex-col">
            <span className="font-display text-[23px] leading-[1.4] lg:text-h3 lg:leading-none">
              {d.date}
            </span>
            <span className="font-display text-[23px] leading-[1.4] lg:text-h3 lg:leading-none">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </FoldGrid>
  );
}
