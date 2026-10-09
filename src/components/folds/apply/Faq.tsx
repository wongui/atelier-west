"use client";

import { useState } from "react";
import { Divider } from "@/components/Divider";
import { FoldGrid } from "@/components/FoldGrid";
import { useReveal } from "@/lib/useReveal";
import { faqs } from "@/data/apply";

/**
 * Chevron, rotated 180° when open — same authoring approach as TextLink's
 * ArrowIcon (thin stroke, currentColor, no icon library) rather than a
 * plus/minus glyph, since a single rotating chevron is the more familiar
 * accordion affordance.
 */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 14"
      className={`size-4 shrink-0 transition-transform duration-300 ${
        open
          ? "rotate-180 motion-safe:group-hover:-translate-y-0.5"
          : "motion-safe:group-hover:translate-y-0.5"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 5L7 9.5L11.5 5" />
    </svg>
  );
}

/**
 * One row: question button + answer, the answer only mounted while
 * open — not merely visually collapsed while closed. A height/opacity
 * trick still leaves the real answer text sitting in the DOM by
 * default, just clipped or invisible; unmounting it is the only way to
 * guarantee nothing of it shows before a question is opened.
 */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const reveal = useReveal<HTMLDivElement>();
  const answerId = `faq-answer-${question.length}-${question.slice(0, 12)}`;

  return (
    <div ref={reveal.ref} className={reveal.revealClassName}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={answerId}
        className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-display text-[20px] leading-[1.3] transition-transform duration-300 motion-safe:group-hover:translate-x-1 lg:text-[24px]">
          {question}
        </span>
        <ChevronIcon open={open} />
      </button>
      {/* Only in the DOM at all while open — no answer text, padding, or
          height should exist by default, and unmounting it entirely is
          the only way to guarantee that (a collapsed-height trick still
          leaves the real content sitting there, just visually clipped). */}
      {open && (
        <p id={answerId} className="font-body text-body pb-6 pr-10">
          {answer}
        </p>
      )}
      <Divider />
    </div>
  );
}

/**
 * Apply page — FAQ, just above the shared Footer. One component (not a
 * desktop/mobile split) with breakpoint classes only, same call as
 * KeyDates/EntryCriteria above it: content and interaction are identical
 * at both sizes, only the question's type size changes.
 */
export function Faq() {
  const heading = useReveal<HTMLDivElement>();

  return (
    <FoldGrid className="bg-surface-light py-24 text-text-on-light">
      {/* Full-width rule marking the boundary with Entry Criteria above —
          that fold and this one share the same bg-surface-light, so
          without something here the two just run together. */}
      <Divider className="col-start-1 col-span-8 opacity-100" />
      <div
        ref={heading.ref}
        className={`col-start-1 col-span-8 mt-16 flex flex-col gap-8 lg:col-start-3 lg:col-span-4 ${heading.revealClassName}`}
      >
        <h2 className="font-display text-[30px] leading-[1.1] lg:text-h2">FAQ&apos;s</h2>
        <div className="flex flex-col">
          <Divider className="opacity-100" />
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </FoldGrid>
  );
}
