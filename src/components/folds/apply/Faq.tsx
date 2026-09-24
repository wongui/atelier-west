"use client";

import { useState } from "react";
import { Divider } from "@/components/Divider";
import { FoldGrid } from "@/components/FoldGrid";
import { useReveal } from "@/lib/useReveal";

const faqs = [
  {
    question: "What is Physical AI?",
    answer:
      "Physical AI refers to artificial intelligence systems that are embodied in or directly interact with the physical world, perceiving the environment through sensors, making context-aware decisions, and taking actions autonomously.",
  },
  {
    question: "What about IP for things built in the labs and/or with mentor help?",
    answer: "Anything built during the residency is owned by the startup.",
  },
  {
    question: "Could I be in a similar program at the same time?",
    answer:
      "Yes, but we ask cohort participants to commit to working out of the lab space for at least 6 of the 12 weeks and to thoughtfully engage with experts and tailored program events and workshops.",
  },
  {
    question: "Do we have to be based in the Bay? Is in-person participation required?",
    answer:
      "Atelier West is an in-person residency program. We welcome teams from anywhere, but participants should plan to spend at least 6 of the 12 weeks on-site. For teams based outside the Bay Area, this typically means traveling at their own expense to get the most from the cohort experience.",
  },
  {
    question: "How often can I meet with mentors? How many can I meet with?",
    answer:
      "Each startup gets dedicated mentor support tailored to your team and what you're building. We'll work with you to match the right mentors, with schedules and time commitments finalized at kickoff.",
  },
  {
    question: "How will I access the office and lab space? Can I come anytime?",
    answer:
      "There will be set days and times where participant companies can work from the space. We will create this schedule together with the cohort. We will have a Lab Manager available to support with access and training.",
  },
  {
    question: "How many companies will be in my cohort?",
    answer:
      "This is an intentionally small, highly curated program. We expect ~5 companies per cohort.",
  },
  {
    question: "What if I am building something highly confidential?",
    answer:
      "Startups are responsible for protecting their own IP. We are happy to discuss any specific concerns if selected.",
  },
];

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
      className={`size-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
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
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-display text-[20px] leading-[1.3] lg:text-[24px]">
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
