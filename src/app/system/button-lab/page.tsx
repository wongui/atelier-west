"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import gsap from "gsap";

const baseButton =
  "inline-flex items-center justify-center px-6 py-3 font-body text-ui uppercase tracking-wide " +
  "bg-accent-cta text-text-on-dark select-none cursor-pointer";

function Card({ letter, title, description, children }: { letter: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border border-black/10 rounded-lg p-8 items-center">
      <div className="flex items-center justify-center h-24">{children}</div>
      <div className="text-center">
        <div className="font-mono text-xs text-text-on-light/50 mb-1">{letter}</div>
        <div className="font-body text-sm mb-1">{title}</div>
        <p className="font-body text-xs text-text-on-light/70 max-w-52">{description}</p>
      </div>
    </div>
  );
}

/** A — Magnetic pull: button eases toward the cursor within its bounds. */
function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  function ensureQuick() {
    if (!ref.current) return;
    quickX.current ??= gsap.quickTo(ref.current, "x", { duration: 0.4, ease: "power3" });
    quickY.current ??= gsap.quickTo(ref.current, "y", { duration: 0.4, ease: "power3" });
  }

  function onMouseMove(e: MouseEvent<HTMLButtonElement>) {
    ensureQuick();
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    quickX.current?.(relX * 0.35);
    quickY.current?.(relY * 0.35);
  }

  function onMouseLeave() {
    ensureQuick();
    quickX.current?.(0);
    quickY.current?.(0);
  }

  return (
    <button
      ref={ref}
      className={`${baseButton} rounded-(--radius-pill)`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      Apply now
    </button>
  );
}

/** B — Fill sweep: a circle scales up from behind the label to swap the fill color. */
function SweepButton() {
  return (
    <button className={`${baseButton} rounded-(--radius-pill) relative overflow-hidden group`}>
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cta-alt scale-0 group-hover:scale-[12] transition-transform duration-500 ease-out"
      />
      <span className="relative z-10">Apply now</span>
    </button>
  );
}

/** C — Label slide: current label slides up and out, a duplicate slides in from below. */
function SlideButton() {
  return (
    <button className={`${baseButton} rounded-(--radius-pill) relative overflow-hidden h-[46px] group`}>
      <span className="relative block h-[1em] overflow-hidden">
        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-[150%]">
          Apply now
        </span>
        <span
          aria-hidden
          className="absolute inset-0 translate-y-[150%] transition-transform duration-300 ease-out group-hover:translate-y-0"
        >
          Apply now
        </span>
      </span>
    </button>
  );
}

/** D — Blob morph: pill radius morphs into an asymmetric organic blob on hover. */
function MorphButton() {
  return (
    <button
      className={`${baseButton} rounded-(--radius-pill) transition-[border-radius,transform] duration-500 ease-out hover:scale-105`}
      style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderRadius = "71% 29% 33% 67% / 47% 41% 59% 53%";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderRadius = "var(--radius-pill)";
      }}
    >
      Apply now
    </button>
  );
}

/** E — Icon reveal: an arrow slides in from the right, label shifts to make room. */
function IconRevealButton() {
  return (
    <button className={`${baseButton} rounded-(--radius-pill) gap-0 group`}>
      <span className="transition-transform duration-300 ease-out group-hover:-translate-x-1">
        Apply now
      </span>
      <span className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out overflow-hidden">
        <svg
          viewBox="0 0 14 14"
          className="size-3.5 ml-0 group-hover:ml-2 transition-[margin] duration-300 ease-out opacity-0 group-hover:opacity-100 min-w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 10.5L10.5 3.5" />
          <path d="M4.5 3.5H10.5V9.5" />
        </svg>
      </span>
    </button>
  );
}

/** F — Elastic lift: scales up with an elastic ease and a soft shadow. */
function ElasticButton() {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      className={`${baseButton} rounded-(--radius-pill)`}
      onMouseEnter={() => {
        if (!ref.current) return;
        gsap.to(ref.current, {
          scale: 1.12,
          boxShadow: "0 12px 24px -8px rgba(0,0,0,0.35)",
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
      }}
      onMouseLeave={() => {
        if (!ref.current) return;
        gsap.to(ref.current, {
          scale: 1,
          boxShadow: "0 0px 0px rgba(0,0,0,0)",
          duration: 0.5,
          ease: "power2.out",
        });
      }}
    >
      Apply now
    </button>
  );
}

export default function ButtonLabPage() {
  return (
    <div className="mx-(--spacing-page) max-w-5xl md:mx-auto py-16">
      <h1 className="font-display text-h2 mb-2">Button hover — candidates</h1>
      <p className="font-body text-body text-text-on-light/70 mb-12 max-w-(--max-width-content)">
        Hover each one. Tell me the letter (or a mix — e.g. &quot;D but with
        E&apos;s icon&quot;) and I&apos;ll wire it into the real Button component.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card letter="A" title="Magnetic pull" description="Button eases toward the cursor, snaps back on leave.">
          <MagneticButton />
        </Card>
        <Card letter="B" title="Fill sweep" description="A circle scales up from center to swap the fill color.">
          <SweepButton />
        </Card>
        <Card letter="C" title="Label slide" description="Current label slides up and out; a duplicate slides in from below.">
          <SlideButton />
        </Card>
        <Card letter="D" title="Blob morph" description="Pill radius morphs into an asymmetric organic blob — ties to the brand's blob motif.">
          <MorphButton />
        </Card>
        <Card letter="E" title="Icon reveal" description="An arrow slides in from the right, label shifts to make room.">
          <IconRevealButton />
        </Card>
        <Card letter="F" title="Elastic lift" description="Scales up with an elastic/bouncy ease and a soft shadow lift.">
          <ElasticButton />
        </Card>
      </div>
    </div>
  );
}
